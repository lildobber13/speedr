import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

type PromiseWithResolvers = <T>() => {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

const PromiseCompat = Promise as PromiseConstructor & {
  withResolvers?: PromiseWithResolvers;
};

const hasNativePromiseWithResolvers = typeof PromiseCompat.withResolvers === 'function';

if (!hasNativePromiseWithResolvers) {
  PromiseCompat.withResolvers = function withResolvers<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return { promise, resolve, reject };
  };
}

// Use Vite-resolved local worker instead of CDN for production/mobile reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function shouldRetryWithoutWorker(error: unknown): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  return (
    message.includes('withresolvers') ||
    message.includes('undefined is not a function') ||
    message.includes('undefined is not a non-null object') ||
    message.includes("can't convert undefined to object")
  );
}

async function readPdfText(documentInit: Record<string, unknown>): Promise<string> {
  const pdf = await pdfjsLib.getDocument(documentInit as any).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
    pages.push(text);
  }

  return pages.join(' ');
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const forceCompatMode = !hasNativePromiseWithResolvers;

  if (forceCompatMode) {
    const arrayBuffer = await file.arrayBuffer();
    return readPdfText({ data: arrayBuffer, disableWorker: true });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    return await readPdfText({ data: arrayBuffer });
  } catch (error) {
    if (shouldRetryWithoutWorker(error)) {
      // Re-read the file since the original buffer may be detached after worker transfer
      const freshBuffer = await file.arrayBuffer();
      return readPdfText({ data: freshBuffer, disableWorker: true });
    }
    throw error;
  }
}

export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
    return extractTextFromDocx(file);
  } else if (name.endsWith('.txt')) {
    return file.text();
  }
  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
}

export function tokenizeText(text: string): string[] {
  return text
    .replace(/\s*[''\']\s*/g, "'") // normalize smart quotes & remove spaces around apostrophes
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(word => word.length > 0);
}

/**
 * Calculate the pivot index (Optimal Recognition Point) for a word.
 * This is roughly 1/3 into the word, which minimizes eye movement.
 */
export function getPivotIndex(word: string): number {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 3) return 1;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  return 3;
}

