import { useState } from "react";
import { askAI } from "../services/aiApi";

function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I can help you understand user feedback, recurring issues, trends, and historical patterns.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userText = message.trim();

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      // Call Sathwika's real AI + Hindsight backend
      const result = await askAI(userText);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.answer || "No answer was returned.",
          memories: result.memories_used || [],
        },
      ]);
} catch (error) {
  console.error("AI request failed:", error);

  const backendError = error?.response?.data?.detail;

  let errorMessage =
    "Sorry, I couldn't connect to the AI service. Please make sure the backend is running.";

  if (
    backendError?.includes("quota") ||
    backendError?.includes("rate limit")
  ) {
    errorMessage =
      "Gemini AI quota reached. Hindsight memory is working, but AI generation is temporarily unavailable. Please try again later.";
  }

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      text: errorMessage,
    },
  ]);
} finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const askSuggestedQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="ai-chat-page">

      <div className="dashboard-header">
        <h1>AI Feedback Assistant</h1>

        <p>
          Ask questions about user feedback and historical patterns.
        </p>
      </div>

      <div className="chat-container">

        {/* Hindsight status */}
        <div className="chat-memory-status">
          <span>●</span>
          Hindsight Memory Active
        </div>

        {/* Messages */}
        <div className="messages-container">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? "message user-message"
                  : "message assistant-message"
              }
            >
              <div className="message-role">
                {msg.role === "user" ? "You" : "AI Assistant"}
              </div>

              <div className="message-text">
                {msg.text}
              </div>

              {/* Show recalled memories */}
              {msg.role === "assistant" &&
                msg.memories &&
                msg.memories.length > 0 && (
                  <div className="recalled-memory">

                    <div className="memory-title">
                      🧠 Hindsight recalled {msg.memories.length} memories
                    </div>

                    {msg.memories.slice(0, 3).map((memory, memoryIndex) => (
                      <div
                        className="memory-item"
                        key={memoryIndex}
                      >
                        <span>{memory.type}</span>

                        <p>{memory.text}</p>
                      </div>
                    ))}

                  </div>
                )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="message assistant-message">
              <div className="message-role">
                AI Assistant
              </div>

              <div className="message-text">
                🧠 Recalling historical feedback and generating an answer...
              </div>
            </div>
          )}

        </div>

        {/* Suggested questions */}
        <div className="suggested-questions">

          <button
            onClick={() =>
              askSuggestedQuestion(
                "What complaints have appeared repeatedly?"
              )
            }
          >
            Repeated complaints
          </button>

          <button
            onClick={() =>
              askSuggestedQuestion(
                "What are the main negative feedback themes?"
              )
            }
          >
            Negative themes
          </button>

          <button
            onClick={() =>
              askSuggestedQuestion(
                "What feedback has increased recently?"
              )
            }
          >
            Recent trends
          </button>

        </div>

        {/* Input */}
        <div className="chat-input-area">

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about user feedback..."
            rows="2"
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AIChat;