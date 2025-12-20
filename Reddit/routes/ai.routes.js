const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

// Initialize Gemini (Use your env variable in production!)
const genAI = new GoogleGenerativeAI("AIzaSyBFHRn29-WinSZhjrK5ErYpvgrOmG1a4sA");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

router.post("/analyze", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) return res.status(400).json({ error: "Post title is required" });

    const prompt = `
      You are a sophisticated debate partner in a Reddit community.
      Analyze the user's post content below.
      
      Your goal is to provide a "Devil's Advocate" perspective to spark discussion.
      
      1. **The Steelman:** Briefly acknowledge the strongest part of their point (1 sentence).
      2. **The Counter-Point:** Offer a respectful but challenging counter-argument, alternative perspective, or a "what if" scenario that they missed.
      3. **The Question:** End with a thought-provoking question to the OP.

      Keep the tone conversational and "Reddity" (informal but smart).
      Max length: 100 words.

      <title>${title}</title>
      <content>${content || "No text content"}</content>
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ result: text });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "The Hivemind is currently offline." });
  }
});

module.exports = router;