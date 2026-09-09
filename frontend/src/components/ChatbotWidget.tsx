import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useChat, type ChatMessage } from "../store/ChatContext";

// ── Typing indicator (three animated dots) ──────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-end gap-1 px-3 py-2 bg-white border border-gray-200 rounded-2xl rounded-bl-sm w-fit max-w-[80%] shadow-sm">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
      />
    ))}
  </div>
);

// ── Single message bubble ────────────────────────────────────────────────────
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
          S
        </div>
      )}
      <div
        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-[75%] shadow-sm whitespace-pre-wrap break-words ${
          isUser
            ? "bg-orange-500 text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

// ── Main widget ──────────────────────────────────────────────────────────────
const ChatbotWidget = () => {
  const { isOpen, messages, isLoading, toggleOpen, closeChat, sendMessage } =
    useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue("");
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* ── Chat Panel ──────────────────────────────────────────────────── */}
      <div
        aria-label="Chat panel"
        className={`fixed bottom-[88px] right-5 z-[9999] w-[360px] rounded-2xl shadow-2xl bg-gray-50 border border-gray-200 flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ height: "500px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-orange-500 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">
                ShopEase Support
              </p>
              <p className="text-orange-100 text-xs mt-0.5">
                We typically reply instantly
              </p>
            </div>
          </div>
          <button
            onClick={closeChat}
            aria-label="Close chat"
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth">
          {isEmpty && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                💬
              </div>
              <p className="text-gray-800 font-semibold text-sm">
                Hi there! 👋
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Have a question about an order or product? Ask us anything — we're here to help.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                S
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-end gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <textarea
              ref={inputRef}
              id="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 max-h-24 leading-5"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-gray-400 text-[10px] mt-1.5">
            Press <kbd className="font-mono bg-gray-200 px-0.5 rounded text-gray-500">Enter</kbd> to send · <kbd className="font-mono bg-gray-200 px-0.5 rounded text-gray-500">Shift+Enter</kbd> for newline
          </p>
        </div>
      </div>

      {/* ── Floating toggle button ───────────────────────────────────────── */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {/* Chat icon when closed, X when open */}
        <span
          className={`absolute transition-all duration-200 ${
            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
        <span
          className={`absolute transition-all duration-200 ${
            isOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223 3.998 3.998 0 002-1.02l-.001-.002z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        {/* Unread badge — show when chat is closed and there are messages */}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
};

export default ChatbotWidget;
