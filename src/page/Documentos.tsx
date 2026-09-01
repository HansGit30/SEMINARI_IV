import React, { useEffect, useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";
import { deleteDocumentBlob, getDocumentBlob, saveDocumentBlob } from "../utils/storage";

export interface DocumentoItem {
  id: string;
  name: string;
  category: "PDF" | "PPT" | "CSV" | "OTRO";
  date: string;
  size: string;
  url: string;
  storage: "vercel" | "indexeddb";
  contentType?: string;
}

const DOCS_KEY = "dataflow_documents_metadata_v2";

function readDocs(): DocumentoItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(DOCS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function detectCategory(fileName: string): DocumentoItem["category"] {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF";
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "PPT";
  if (lower.endsWith(".csv")) return "CSV";
  return "OTRO";
}

function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Documentos(): React.ReactElement {
  const [filter, setFilter] = useState<"All" | "PDF" | "PPT" | "CSV">("All");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [docs, setDocs] = useState<DocumentoItem[]>(() => readDocs());

  useEffect(() => {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs.map((doc) => ({ ...doc, url: doc.storage === "indexeddb" ? "" : doc.url }))));
  }, [docs]);

  useEffect(() => {
    let active = true;
    const objectUrls: string[] = [];

    const hydrateLocalDocuments = async () => {
      const metadata = readDocs();
      const hydrated = await Promise.all(
        metadata.map(async (doc) => {
          if (doc.storage !== "indexeddb") return doc;
          try {
            const blob = await getDocumentBlob(doc.id);
            if (!blob) return doc;
            const url = URL.createObjectURL(blob);
            objectUrls.push(url);
            return { ...doc, url };
          } catch {
            return doc;
          }
        })
      );
      if (active) setDocs(hydrated);
    };

    void hydrateLocalDocuments();
    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    const id = crypto.randomUUID();

    try {
      let url = "";
      let storage: DocumentoItem["storage"] = "indexeddb";

      try {
        const result = await upload(`${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        url = result.url;
        storage = "vercel";
      } catch (remoteError) {
        console.info("Vercel Blob no disponible; se usará almacenamiento local persistente.", remoteError);
        await saveDocumentBlob(id, file);
        url = URL.createObjectURL(file);
      }

      const nuevoDocumento: DocumentoItem = {
        id,
        name: file.name,
        category: detectCategory(file.name),
        date: new Date().toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        size: humanFileSize(file.size),
        url,
        storage,
        contentType: file.type,
      };

      setDocs((prev) => [nuevoDocumento, ...prev]);
    } catch (uploadError) {
      console.error(uploadError);
      setError("No se pudo almacenar el archivo. Verifica el espacio disponible e inténtalo nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (doc: DocumentoItem) => {
    try {
      if (doc.storage === "indexeddb") {
        await deleteDocumentBlob(doc.id);
        if (doc.url.startsWith("blob:")) URL.revokeObjectURL(doc.url);
      } else if (doc.url) {
        await fetch("/api/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: doc.url }),
        });
      }
    } catch (deleteError) {
      console.warn("No se pudo eliminar el archivo físico; se quitará del listado local.", deleteError);
    }
    setDocs((prev) => prev.filter((item) => item.id !== doc.id));
  };

  const filteredDocs = useMemo(
    () => (filter === "All" ? docs : docs.filter((d) => d.category === filter)),
    [docs, filter]
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Projects & Documents</h1>
          <p style={styles.subtitle}>Los archivos permanecen almacenados después de recargar la página.</p>
        </div>
        <label style={{ ...styles.uploadBtn, opacity: uploading ? 0.65 : 1 }}>
          {uploading ? "Subiendo..." : "⚡ Subir Archivo"}
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.ppt,.pptx,.csv,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
            hidden
            disabled={uploading}
          />
        </label>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.tabsContainer}>
        {(["All", "PDF", "PPT", "CSV"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{ ...styles.tabBtn, ...(filter === tab ? styles.activeTabBtn : {}) }}
          >
            {tab === "All" && "⚡ "}
            {tab === "PDF" && "📄 "}
            {tab === "PPT" && "📊 "}
            {tab === "CSV" && "📈 "}
            {tab === "All" ? "Todos" : tab}
          </button>
        ))}
      </div>

      {filteredDocs.length === 0 ? (
        <div style={styles.emptyState}>Aún no hay documentos en esta categoría.</div>
      ) : (
        <div style={styles.grid}>
          {filteredDocs.map((doc) => (
            <div key={doc.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>▲</div>
                <div>
                  <div style={styles.authorName}>DataFlow</div>
                  <div style={styles.docDate}>{doc.date}</div>
                </div>
                <span style={styles.badge}>{doc.category}</span>
                <button onClick={() => void handleDeleteDoc(doc)} style={styles.deleteBtn} title="Eliminar documento">🗑️</button>
              </div>

              <div style={styles.previewContainer}>
                {doc.category === "PDF" && doc.url ? (
                  <iframe src={doc.url} style={styles.iframePreview} title={doc.name} />
                ) : (
                  <div style={styles.placeholderPreview}>
                    <span style={{ fontSize: "40px" }}>{doc.category === "PDF" ? "📄" : doc.category === "PPT" ? "📊" : doc.category === "CSV" ? "📈" : "📁"}</span>
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "8px", textAlign: "center" }}>{doc.name}</p>
                  </div>
                )}
              </div>

              <h3 style={styles.cardTitle}>{doc.name}</h3>
              <div style={styles.tagsRow}>
                <span style={styles.tag}>Recurso</span>
                <span style={styles.tag}>{doc.category}</span>
                <span style={styles.tag}>{doc.size}</span>
                <span style={styles.tag}>{doc.storage === "vercel" ? "Nube" : "Local persistente"}</span>
              </div>

              <div style={styles.actionsRow}>
                {doc.url ? (
                  <>
                    <a href={doc.url} target="_blank" rel="noreferrer" style={styles.viewBtn}>👁️ Visualizar</a>
                    <a href={doc.url} download={doc.name} style={styles.downloadBtn}>⬇️ Descargar</a>
                  </>
                ) : (
                  <span style={styles.unavailable}>Archivo no disponible en este navegador.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "32px", backgroundColor: "#f4f4f5", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "20px" },
  title: { fontSize: "28px", fontWeight: 700, color: "#18181b", margin: 0 },
  subtitle: { margin: "6px 0 0", color: "#71717a", fontSize: "13px" },
  uploadBtn: { backgroundColor: "#000000", color: "#ffffff", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
  errorBox: { marginBottom: "18px", padding: "12px 16px", borderRadius: "12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "13px" },
  tabsContainer: { display: "flex", gap: "6px", backgroundColor: "#e4e4e7", padding: "4px", borderRadius: "14px", width: "fit-content", marginBottom: "24px" },
  tabBtn: { border: "none", background: "none", padding: "8px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#71717a" },
  activeTabBtn: { backgroundColor: "#ffffff", color: "#000000", fontWeight: 600, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  emptyState: { background: "#fff", border: "1px dashed #d4d4d8", borderRadius: "20px", padding: "60px 24px", textAlign: "center", color: "#71717a" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" },
  card: { backgroundColor: "#ffffff", borderRadius: "24px", padding: "20px", border: "1px solid #e4e4e7", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "36px", height: "36px", backgroundColor: "#000000", color: "#ffffff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" },
  authorName: { fontWeight: 700, fontSize: "14px", color: "#18181b" },
  docDate: { fontSize: "12px", color: "#a1a1aa" },
  badge: { marginLeft: "auto", backgroundColor: "#dcfce7", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 },
  deleteBtn: { border: "none", background: "none", cursor: "pointer", fontSize: "14px", padding: "4px", borderRadius: "6px", marginLeft: "4px" },
  previewContainer: { height: "190px", width: "100%", borderRadius: "16px", overflow: "hidden", backgroundColor: "#fafafa", border: "1px solid #f4f4f5" },
  iframePreview: { width: "100%", height: "100%", border: "none" },
  placeholderPreview: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px" },
  cardTitle: { fontSize: "16px", fontWeight: 700, color: "#18181b", margin: "4px 0", overflowWrap: "anywhere" },
  tagsRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tag: { border: "1px solid #e4e4e7", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: "#71717a", backgroundColor: "#ffffff" },
  actionsRow: { display: "flex", gap: "10px", marginTop: "8px" },
  viewBtn: { flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", border: "1px solid #e4e4e7", textDecoration: "none", color: "#18181b", fontSize: "13px", fontWeight: 600 },
  downloadBtn: { flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", backgroundColor: "#000000", textDecoration: "none", color: "#ffffff", fontSize: "13px", fontWeight: 600 },
  unavailable: { color: "#a1a1aa", fontSize: "12px" },
};
