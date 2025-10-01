const { OpenAI } = require("openai");

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HUGGINGFACE_API_KEY, // Make sure your .env uses this variable name
});

async function getAIResponse(userMessage) {
  const chatCompletion = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "You are Stelar, a friendly, supportive conversational AI designed to help users with their wellbeing and mental health. Respond in a warm, natural, and human-like way. Avoid sounding robotic or overly formal.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  return chatCompletion.choices[0].message.content;
}

// Add this handler for Express
async function chatHandler(req, res) {
  const userMessage = req.body.message;
  console.log("Received message:", userMessage); // Debug log

  if (!userMessage) {
    return res.status(400).json({ reply: "No message provided." });
  }

  try {
    const aiReply = await getAIResponse(userMessage);
    const safeReply =
      aiReply && aiReply.trim() !== ""
        ? aiReply
        : "Sorry, I didn't catch that. Could you rephrase?";
    res.json({ reply: safeReply });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
}

module.exports = { getAIResponse, chatHandler };
