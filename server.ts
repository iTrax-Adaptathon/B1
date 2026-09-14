import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

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
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    await fs.unlink(file.path); // clean up

    // Provide AI summary
    const prompt = `Summarize this resume for candidate screening. Identify key skills, experience level, and a short overall profile:\n\n${resumeText.substring(0, 10000)}`;
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    res.json({
      summary: aiResponse.text,
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
      model: "gemini-2.5-flash",
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
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const port = 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
