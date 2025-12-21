import Tesseract, { type RecognizeResult } from "tesseract.js";

  confidence: number;
    x0: number;
    x1: number;
  };

  text: string;
  words: OcrWor
}
expo
 

    logger: msg => {
        onProgr
    },
  words: OcrWord[];
  raw?: RecognizeResult;


export async function runOcrOnFile(
  filePath: string | File,
  lang: string = "eng",
  onProgress?: (progress: number) => void
      if (msg.status ==
  const result = await Tesseract.recognize(filePath, lang, {
    logger: msg => {
      if (msg.status === "recognizing text" && onProgress) {
        onProgress(msg.progress);

    },
  con

  if (pageData.words) {
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

function normalizeOcrResult(result: RecognizeResult): OcrResult {
    words,
  const pageData = result.data;

  const words: OcrWord[] = [];
  if (pageData.words) {
    for (const w of pageData.words) {
      words.push({
        text: w.text,
        confidence: w.confidence,
        bbox: {
          x0: w.bbox.x0,
          y0: w.bbox.y0,

          y1: w.bbox.y1,
        },
      });
    }
  }

  const avgConfidence =

      ? words.reduce((sum, w) => sum + w.confidence, 0) / words.length
      : pageData.confidence ?? 0;


    text: fullText,
    confidence: avgConfidence,
    words,

  };


function bufferToBlob(
  input: ArrayBuffer | Uint8Array,

): Blob {
  if (input instanceof ArrayBuffer) {
    return new Blob([input], { type });

  return new Blob([input as Uint8Array<ArrayBuffer>], { type });

