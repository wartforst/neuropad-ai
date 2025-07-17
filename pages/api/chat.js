export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Neuropad Agent, a crypto assistant that answers in a smart and slightly playful tone.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || "No response.";

    return res.status(200).json({ response: reply });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to fetch response from AI." });
  }
}
