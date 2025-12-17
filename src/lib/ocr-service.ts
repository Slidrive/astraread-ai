import * as Tesseract from "tesseract.js";
import type { RecognizeResult } from "tesseract.js";

  confidence: number;
    x0: number;
    x1: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
 

export async function runOcr
  lang: string 
): Promise<OcrResult>
    logger: msg => 
        onProgress(msg.p
 

}
export async functi
  lang: string = "eng",
  onProgress?: (progress: number) => void
): Promise<OcrResult> {
  const result = await Tesseract.recognize(filePath, lang, {
    logger: msg => {
      if (msg.status === "recognizing text" && onProgress) {
        onProgress(msg.progress);
      }
    },


export async function runOcrOnFile(
 

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

    for (const w of pageData.words)
        text:
        bbox: {
          y0: w.bbox.y0,
          y1: w.bbox.y1
      });
  }
  const avgConfidence =
      ? words.reduce((sum, w) => 

    te
    w


 

}

























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
