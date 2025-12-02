import Tesseract, { type RecognizeResult } from "tesseract.js";

export interface OcrWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface OcrResult {
  text: string;
  confidence: number;
  words: OcrWord[];
  raw?: RecognizeResult;
}

export async function runOcrOnImageFile(
  filePath: string,
  lang: string = "eng",
  onProgress?: (progress: number) => void
): Promise<OcrResult> {
  const result = await Tesseract.recognize(filePath, lang, {
    logger: msg => {
      if (msg.status === "recognizing text" && onProgress) {
        onProgress(msg.progress);
      }
    },
  });

  return normalizeOcrResult(result);
}

export async function runOcrOnImageBuffer(
  input: ArrayBuffer | Uint8Array,
  lang: string = "eng",
  onProgress?: (progress: number) => void
): Promise<OcrResult> {
  const blob = bufferToBlob(input);
  const result = await Tesseract.recognize(blob, lang, {
    logger: msg => {
      if (msg.status === "recognizing text" && onProgress) {
        onProgress(msg.progress);
      }
    },
  });

  return normalizeOcrResult(result);
}

export async function runOcrOnFile(
  file: File,
  lang: string = "eng",
  onProgress?: (progress: number) => void
): Promise<OcrResult> {
  const result = await Tesseract.recognize(file, lang, {
    logger: msg => {
      if (msg.status === "recognizing text" && onProgress) {
        onProgress(msg.progress);
      }
    },
  });

  return normalizeOcrResult(result);
}

function normalizeOcrResult(result: RecognizeResult): OcrResult {
  const fullText = (result.data.text || "").trim();

  const words: OcrWord[] = [];
  
  const pageData = result.data as any;
  if (pageData.words && Array.isArray(pageData.words)) {
    for (const w of pageData.words) {
      words.push({
        text: w.text,
        confidence: w.confidence,
        bbox: {
          x0: w.bbox.x0,
          y0: w.bbox.y0,
          x1: w.bbox.x1,
          y1: w.bbox.y1,
        },
      });
    }
  }

  const avgConfidence =
    words.length > 0
      ? words.reduce((sum, w) => sum + w.confidence, 0) / words.length
      : result.data.confidence ?? 0;

  return {
    text: fullText,
    confidence: avgConfidence,
    words,
    raw: result,
  };
}

function bufferToBlob(
  input: ArrayBuffer | Uint8Array,
  type: string = "image/png"
): Blob {
  return new Blob([input as any], { type });
}
