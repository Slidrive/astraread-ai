import Tesseract from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
}

export async function runOcrOnFile(
  file: File,
  lang: string,
  onProgress?: (p: number) => void
): Promise<OcrResult> {
  const { data } = await Tesseract.recognize(file, lang, {
    logger: m => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        onProgress?.(m.progress);
      }
    }
  });

  const text = (data.text || '').trim();
  const confidence = typeof data.confidence === 'number' ? data.confidence : 0;

  return { text, confidence };
}
