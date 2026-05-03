# Padai Karo - AI-Powered Exam Preparation

Padai Karo is an intelligent study assistant that helps students focus on what actually matters. By analyzing your syllabus and past question papers, it figures out which topics appear most frequently and generates a personalized study plan to maximize your exam score.

## 🎥 Video Demo : https://drive.google.com/file/d/1buJ5Z2hdHlh-mNzXrwew3HlWzEjwy_Wh/view?usp=drive_link


## ✨ Features

- **Smart Insights:** Upload your syllabus and past papers, and the AI will tell you exactly which topics are high-priority.
- **Coverage Analysis:** Automatically tracks which syllabus topics are covered in past exams, highlighting weak or missing areas.
- **Personalized Study Planner:** Generates a day-by-day study schedule based on topic importance and the time you have available.
- **AI Tutor Chat:** Ask questions directly from your uploaded materials and get instant, accurate answers.
- **Quick Quizzes:** Generate custom multiple-choice quizzes from your study material to test your knowledge.

## 🚀 How to Run Locally

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   # MongoDB Database
   MONGO_URI="your_mongodb_connection_string"

   # Cloudinary (For uploading PDFs/Images)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"

   # Groq (For AI text generation)
   GROQ_API_KEY="your_groq_api_key"

   # Jina AI (For text embeddings)
   JINA_API_KEY="your_jina_api_key"
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
