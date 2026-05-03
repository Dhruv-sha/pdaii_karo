"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useProject } from "@/context/ProjectContext";

export default function QuizBox() {
  const { projectId } = useProject();
  const [quiz, setQuiz] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});

  const loadQuiz = async () => {
    setStatus("loading");
    setError("");
    setQuiz(null);
    setSelected({});

    try {
      const res = await fetch("/api/practice/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Quiz failed");
      }

      let parsedQuiz = data.quiz;
      if (typeof parsedQuiz === "string") {
        try {
          parsedQuiz = JSON.parse(parsedQuiz);
        } catch {
          parsedQuiz = [{ question: parsedQuiz, options: [], answer: "" }];
        }
      }

      setQuiz(parsedQuiz);
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Quiz failed");
      setStatus("idle");
    }
  };

  const pickOption = (questionIndex, optionIndex) => {
    setSelected(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Quick Quiz</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {projectId ? `From project: ${projectId}` : "Select a project from the header"}
          </p>
        </div>
        <button
          onClick={loadQuiz}
          disabled={status === "loading" || !projectId}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {status === "loading" ? "Generating..." : "Generate Quiz"}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
      ) : null}

      {!projectId && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          ⚠️ Please select a project from the dropdown in the header to generate a quiz.
        </div>
      )}

      {Array.isArray(quiz) ? (
        <div className="space-y-5">
          {quiz.map((item, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-800">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold mr-2">{index + 1}</span>
                {item.question}
              </p>
              <div className="mt-4 grid gap-2">
                {(item.options || []).map((opt, optionIndex) => {
                  const isSelected = selected[index] === optionIndex;
                  const isCorrect = revealed[index] && opt === item.answer;
                  const isWrong = revealed[index] && isSelected && opt !== item.answer;
                  return (
                    <button
                      key={optionIndex}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition font-medium ${
                        isCorrect
                          ? "border-teal-500 bg-teal-50 text-teal-800"
                          : isWrong
                          ? "border-red-400 bg-red-50 text-red-700"
                          : isSelected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"
                      }`}
                      onClick={() => {
                        pickOption(index, optionIndex);
                        setRevealed(prev => ({ ...prev, [index]: false }));
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setRevealed(prev => ({ ...prev, [index]: !prev[index] }))}
                className="mt-3 text-xs text-teal-600 hover:text-teal-800 font-medium transition"
              >
                {revealed[index] ? "Hide answer ↑" : "Reveal answer ↓"}
              </button>
              {revealed[index] && (
                <p className="mt-1 text-xs text-slate-500">
                  ✅ Correct answer: <span className="font-semibold text-teal-700">{item.answer}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
          <svg className="mx-auto mb-3 h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Click "Generate Quiz" to get 5 questions based on your study material.
        </div>
      )}
    </Card>
  );
}
