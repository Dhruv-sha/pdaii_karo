import Tesseract from "tesseract.js";

export async function extractTextFromFile(fileUrl) {
  const res = await fetch(fileUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  const nodeBuffer = Buffer.from(buffer);

  // Detect type
  if (fileUrl.toLowerCase().split("?")[0].endsWith(".pdf")) {
    const pdf = require("pdf-parse");
    const data = await pdf(nodeBuffer);
    return data.text;
  }

  // Image OCR
  const {
    data: { text },
  } = await Tesseract.recognize(nodeBuffer, "eng");

  return text;
}