import type { ExecutionReport, LoadedCSV } from "../types/dashboard";

const CSV_KEY = "dataflow_csv_files_v1";
const REPORTS_KEY = "dataflow_reports_v1";

function readArray<T>(key: string): T[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export const appStorage = {
  getCsvFiles: (): LoadedCSV[] => readArray<LoadedCSV>(CSV_KEY),
  setCsvFiles: (files: LoadedCSV[]): void => {
    try { localStorage.setItem(CSV_KEY, JSON.stringify(files)); }
    catch (error) { console.warn("No se pudo persistir todos los CSV en localStorage.", error); }
  },
  getReports: (): ExecutionReport[] => readArray<ExecutionReport>(REPORTS_KEY),
  setReports: (reports: ExecutionReport[]): void => {
    try { localStorage.setItem(REPORTS_KEY, JSON.stringify(reports)); }
    catch (error) { console.warn("No se pudo persistir el historial de reportes.", error); }
  },
};

const DB_NAME = "dataflow_documents";
const DB_VERSION = 1;
const STORE_NAME = "files";

export interface StoredDocumentBlob {
  id: string;
  blob: Blob;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("No se pudo abrir IndexedDB"));
  });
}

export async function saveDocumentBlob(id: string, blob: Blob): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ id, blob } satisfies StoredDocumentBlob);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("No se pudo guardar el documento"));
  });
  db.close();
}

export async function getDocumentBlob(id: string): Promise<Blob | null> {
  const db = await openDb();
  const result = await new Promise<StoredDocumentBlob | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result as StoredDocumentBlob | undefined);
    request.onerror = () => reject(request.error ?? new Error("No se pudo leer el documento"));
  });
  db.close();
  return result?.blob ?? null;
}

export async function deleteDocumentBlob(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("No se pudo eliminar el documento"));
  });
  db.close();
}
