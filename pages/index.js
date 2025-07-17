import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([...newMessages, { sender: "bot", text: data.response }]);
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: "❌ Error fetching response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold mt-6">Neuropad Agent v1</h1>
      <div className="w-full max-w-xl mt-8 bg-gray-800 rounded-lg p-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={\`text-sm \${msg.sender === "user" ? "text-green-400" : "text-blue-400"}\`}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="w-full max-w-xl mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600"
          placeholder="Ask something about crypto..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading} className="bg-blue-600 px-4 py-2 rounded text-white">
          {loading ? "..." : "Send"}
        </button>
      </div>
    </main>
  );
}
