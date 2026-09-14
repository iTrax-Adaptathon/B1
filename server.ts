import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { evaluateResumeToJobs, evaluateJobToResumes } from "./src/services/geminiMatcher";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/** Support both pdf-parse v1 (callable export) and v2 (PDFParse class). */
async function extractPdfText(dataBuffer: Buffer): Promise<string> {
  if (typeof pdfParse === "function") {
    const result = await pdfParse(dataBuffer);
    return result?.text || "";
  }

  if (pdfParse?.PDFParse) {
    const parser = new pdfParse.PDFParse({ data: dataBuffer });
    try {
      const result = await parser.getText();
      return result?.text || "";
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported pdf-parse export");
}

function createFallbackResumeSummary(resumeText: string): string {
  const normalized = resumeText.replace(/\s+/g, " ").trim();
  if (!normalized) return "No readable text was found in this PDF.";
  const preview = normalized.length > 420 ? `${normalized.slice(0, 420)}…` : normalized;
  return `Resume parsed successfully. Key profile text: ${preview}`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// In a real app we would use Firebase Admin here, 
// but for the AI tasks we'll just expose endpoints.
// Real-time task DB will be directly via client-side Firebase.

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = await fs.readFile(file.path);
    const resumeText = await extractPdfText(dataBuffer);

    await fs.unlink(file.path).catch(() => undefined); // clean up

    // AI summary is optional: parsing must still work without a configured API key.
    let summary = createFallbackResumeSummary(resumeText);
    if (process.env.GEMINI_API_KEY && resumeText.trim()) {
      try {
        const prompt = `Summarize this resume for candidate screening. Identify key skills, experience level, and a short overall profile:\n\n${resumeText.substring(0, 10000)}`;
        const aiResponse = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });
        summary = aiResponse.text?.trim() || summary;
      } catch (summaryError) {
        console.warn("Resume summary unavailable; using local fallback:", summaryError);
      }
    }

    res.json({
      summary,
      rawText: resumeText,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

app.post("/api/rank-applicant", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `You are an expert HR AI assistant. Compare this applicant's resume with the job description.
    
Job Description:
${jobDescription}

Applicant Resume:
${resumeText.substring(0, 10000)}

Please analyze and provide a JSON response with the following format exactly, no markdown tags:
{
  "compatibilityPercentage": 85,
  "keyMatches": ["skill 1", "skill 2"],
  "skillsGaps": ["gap 1", "gap 2"],
  "explanation": "Brief explanation of the ranking"
}
`;
    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = aiResponse.text || "{}";
    const cleanResult = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanResult);
    res.json(result);
  } catch (error) {
    console.error("Ranking error:", error);
    res.status(500).json({ error: "Failed to rank applicant" });
  }
});

// Demo endpoint for fetching job descriptions (Remotive API)
app.get("/api/jobs", async (req, res) => {
  try {
    const query = req.query.q || "frontend";
    const response = await fetch(`https://remotive.com/api/remote-jobs?search=${query}&limit=10`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Jobs error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Feature 1: Candidate Resume Upload -> Ranked Job Matches (Batched Gemini Prompt)
app.post("/api/match/resume-to-jobs", upload.single("resume"), async (req, res) => {
  try {
    let resumeText = req.body?.resumeText || "";

    // If PDF uploaded via multipart
    if (req.file) {
      const dataBuffer = await fs.readFile(req.file.path);
      resumeText = await extractPdfText(dataBuffer);
      await fs.unlink(req.file.path).catch(() => undefined); // clean up
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Please provide resume text or upload a PDF resume." });
    }

    let jobs = undefined;
    if (req.body?.jobs) {
      try {
        jobs = typeof req.body.jobs === "string" ? JSON.parse(req.body.jobs) : req.body.jobs;
      } catch {
        // use default
      }
    }

    const result = await evaluateResumeToJobs(ai, { resumeText, jobs });
    res.json(result);
  } catch (error) {
    console.error("Semantic matching error (resume-to-jobs):", error);
    res.status(500).json({ error: "Failed to evaluate semantic job matches. Please try again." });
  }
});

// Feature 2: Employer Candidate Ranking (Job-to-Resumes batched reverse scoring)
app.post("/api/match/job-to-resumes", async (req, res) => {
  try {
    const { jobId, job, resumes } = req.body;
    if (!jobId && !job) {
      return res.status(400).json({ error: "jobId or job object is required" });
    }

    const result = await evaluateJobToResumes(ai, { jobId: jobId || job?.id, job, resumes });
    res.json(result);
  } catch (error) {
    console.error("Semantic matching error (job-to-resumes):", error);
    res.status(500).json({ error: "Failed to rank candidates for this job. Please try again." });
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(__dirname));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });
  }

  const port = 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
