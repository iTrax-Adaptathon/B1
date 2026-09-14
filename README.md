# TalentConnect 🚀

TalentConnect is a modern, full-stack job board platform designed to seamlessly connect employers with job seekers. It features a dual-sided marketplace tailored for both hiring managers and candidates, enriched with an AI-powered resume screening pipeline.

## 🌟 Key Features

### 🏢 For Employers
* **Dedicated Dashboard**: A centralized hub to manage your hiring pipeline.
* **Job Postings**: Easily create comprehensive job listings including title, location, detailed description, and specific requirements.
* **AI Resume Screening**: Leverage the power of the Google Gemini API to automatically parse, screen, and score candidate resumes against your live job descriptions, helping you find the perfect match instantly.

### 👤 For Candidates (Job Seekers)
* **Job Board**: A clean, intuitive interface to browse all open positions.
* **Detailed View**: Click into any role to see the full "About the Role" and "Requirements" breakdown.
* **One-Click Apply**: Submit your application smoothly with interactive state tracking that remembers which roles you've applied for.

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (Icons)
* **Backend**: Node.js, Express (custom server entry point `server.ts`)
* **Artificial Intelligence**: Google Gemini API (`@google/genai`)
* **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/talentconnect.git
   cd talentconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will boot up the Express server and Vite frontend middleware locally.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is licensed under the [MIT License](LICENSE).
