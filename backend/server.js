const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");

const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post(
  "/analyze",
  upload.single("image"),
  async (req, res) => {
    try {
      const imageBuffer = fs.readFileSync(
        req.file.path
      );

      const base64Image =
        imageBuffer.toString("base64");

      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",

          contents: [
            {
              inlineData: {
                mimeType:
                  req.file.mimetype,
                data: base64Image,
              },
            },

            {
              text: `
You are a senior UI/UX reviewer.

Analyze this website screenshot.

Return ONLY JSON.

{
  "score":"8/10",
  "observation":"short observation",
  "suggestions":[
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ]
}
`,
            },
          ],
        });

      let text = response.text;

      console.log(text);

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = {
          score: "N/A",
          observation: text,
          suggestions: [],
        };
      }

      fs.unlinkSync(req.file.path);

      res.json(parsed);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});