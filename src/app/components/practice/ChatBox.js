"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useProject } from "@/context/ProjectContext";

const STORAGE_KEY = "padaikaro_chat_history";

function loadHistory(projectId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return all[projectId] || [
      { role: "assistant", content: "👋 Hi! Ask me anything about your uploaded syllabus or past papers — I'll answer from your study material." },
    ];
  } catch {
    return [];
  }
}

function saveHistory(projectId, messages) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    all[projectId] = messages;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

export default function ChatBox() {
  const { projectId } = useProject();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Load chat history when projectId changes
  useEffect(() => {
    if (!projectId) return;
    setMessages(loadHistory(projectId));
  }, [projectId]);

  // Save chat history whenever messages update
  useEffect(() => {
    if (!projectId || messages.length === 0) return;
    saveHistory(projectId, messages);
  }, [messages, projectId]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const ask = async () => {
    if (!query.trim() || status === "loading") return;
    if (!projectId) {
      alert("Please select a project from the dropdown at the top.");
      return;
    }
    const prompt = query.trim();
    setQuery("");
    setStatus("loading");
    setMessages(prev => [...prev, { role: "user", content: prompt }]);

    try {
      const res = await fetch("/api/practice/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, query: prompt }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.answer || data.error || "No response" },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `❌ ${err.message || "Chat failed"}` },
      ]);
    } finally {
      setStatus("idle");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  const clearHistory = () => {
    const initial = [{ role: "assistant", content: "👋 Hi! Ask me anything about your uploaded syllabus or past papers — I'll answer from your study material." }];
    setMessages(initial);
    if (projectId) saveHistory(projectId, initial);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" style={{ minHeight: "70vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-teal-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Tutor</h3>
            <p className="text-xs text-slate-400">
              {projectId ? `Project: ${projectId}` : "No project selected"}
            </p>
          </div>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs text-slate-400 hover:text-red-500 transition flex items-center gap-1"
          title="Clear chat history"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {!projectId && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            ⚠️ Please select a project from the dropdown in the header to start chatting.
          </div>
        )}

        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="h-7 w-7 rounded-full bg-teal-100 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                  <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? "bg-slate-900 text-white rounded-tr-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-sm"
                }`}
              >
                {isUser ? (
                  message.content
                ) : (
                  <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:my-2 prose-code:bg-slate-200 prose-code:px-1 prose-code:rounded">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {status === "loading" && (
          <div className="flex justify-start">
            <div className="h-7 w-7 rounded-full bg-teal-100 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
              <div className="h-3 w-3 rounded-full bg-teal-400 animate-pulse" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-end gap-3">
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={projectId ? "Ask about weak topics, key definitions, or exam patterns… (Enter to send)" : "Select a project first…"}
            disabled={!projectId}
            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={ask}
            disabled={status === "loading" || !query.trim() || !projectId}
            className="flex items-center justify-center h-11 w-11 rounded-2xl bg-teal-600 text-white transition hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">Shift + Enter for a new line · Chat history saved per project</p>
      </div>
    </div>
  );
}