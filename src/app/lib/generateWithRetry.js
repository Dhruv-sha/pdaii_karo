import { generateIRFromText } from "./generateIR";
import { cleanJSON } from "./cleanJSON";
import { validateIR } from "./validateIR";

export async function generateWithRetry(text, docType, retries = 2) {
  let lastError = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const raw = await generateIRFromText(text, docType);
      const cleaned = cleanJSON(raw);
      const parsed = JSON.parse(cleaned);

      if (validateIR(parsed, docType)) {
        return parsed;
      }
      lastError = new Error("IR validation failed");
    } catch (err) {
      lastError = err;
      if (i === retries) throw err;
    }
  }

  throw lastError || new Error("Failed to generate valid IR");
}