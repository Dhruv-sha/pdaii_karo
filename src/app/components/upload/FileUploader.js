"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";

const progressClasses = [
  "w-0",
  "w-[10%]",
  "w-[20%]",
  "w-[30%]",
  "w-[40%]",
  "w-[50%]",
  "w-[60%]",
  "w-[70%]",
  "w-[80%]",
  "w-[90%]",
  "w-full",
];

export default function FileUploader({ defaultProjectId = "demo" }) {
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [docType, setDocType] = useState("question_paper");
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (status !== "uploading") return;

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 12, 96));
    }, 200);

    return () => clearInterval(interval);
  }, [status]);

  const pickFile = () => {
    inputRef.current?.click();
  };

  const handleFiles = files => {
    const nextFile = files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    setStatus("ready");
    setMessage("");
  };

  const handleDrop = event => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!file && !fileUrl) {
      setStatus("error");
      setMessage("Add a file or paste a hosted URL.");
      return;
    }

    setStatus("uploading");
    setProgress(10);
    setMessage("");

    let finalUrl = fileUrl;

    if (!finalUrl && file) {
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ai_prep_upload");
        
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`, 
          {
            method: "POST",
            body: formData,
          }
        );
        
        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadData.error?.message || "Failed to upload file to Cloudinary");
        }
        
        finalUrl = uploadData.secure_url;
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Failed to upload file");
        return;
      }
    }

    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: finalUrl,
          docType,
          projectId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Processing failed");
      }

      setProgress(100);
      setStatus("success");
      setMessage(`Saved as ${data.insertedId}`);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Processing failed");
    }
  };

  const progressIndex = Math.min(
    progressClasses.length - 1,
    Math.floor(progress / 10)
  );
  const progressClass = progressClasses[progressIndex];

  return (
    <Card className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">
          Project ID
          <input
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-300 focus:outline-none"
            placeholder="demo"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Document type
          <select
            value={docType}
            onChange={e => setDocType(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-300 focus:outline-none"
          >
            <option value="question_paper">Question paper</option>
            <option value="syllabus">Syllabus</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          File URL (optional)
          <input
            value={fileUrl}
            onChange={e => setFileUrl(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-300 focus:outline-none"
            placeholder="https://..."
          />
        </label>
      </div>

      <div
        onDragOver={event => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          isDragging
            ? "border-slate-400 bg-slate-50"
            : "border-slate-200 bg-slate-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={event => handleFiles(event.target.files)}
        />
        <div className="text-sm font-semibold text-slate-700">
          Drag & drop your file here
        </div>
        <p className="text-xs text-slate-500">
          PDF or image files work best for OCR.
        </p>
        <button
          type="button"
          onClick={pickFile}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white"
        >
          Browse files
        </button>
        {file ? (
          <span className="text-xs text-slate-500">Selected: {file.name}</span>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleUpload}
            disabled={status === "uploading"}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {status === "uploading" ? "Processing..." : "Upload & process"}
          </button>
          <span className="text-xs text-slate-500">
            {status === "ready" ? "Ready to upload" : ""}
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-slate-100">
          <div
            className={`h-1.5 rounded-full bg-slate-900 transition-all ${progressClass}`}
          />
        </div>

        {message ? (
          <p
            className={`text-sm ${
              status === "error" ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </Card>
  );
}