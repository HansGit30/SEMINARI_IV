import React, { useState } from "react";

export interface DocumentoItem {
  id: string;
  name: string;
  category: "PDF" | "PPT" | "CSV" | "OTRO";
  date: string;
  size: string;
  url: string;
}

export default function Documentos(): React.ReactElement {
  const [filter, setFilter] = useState<"All" | "PDF" | "PPT" | "CSV">("All");
  const [uploading, setUploading] = useState<boolean>(false);

  // Estado inicial vacío
  const [docs, setDocs] = useState<DocumentoItem[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileUrl = URL.createObjectURL(file);

    let category: "PDF" | "PPT" | "CSV" | "OTRO" = "OTRO";
    const fileNameLower = file.name.toLowerCase();
    if (fileNameLower.endsWith(".pdf")) category = "PDF";
    else if (fileNameLower.endsWith(".ppt") || fileNameLower.endsWith(".pptx")) category = "PPT";
    else if (fileNameLower.endsWith(".csv")) category = "CSV";

    const nuevoDocumento: DocumentoItem = {
      id: Date.now().toString(),
      name: file.name,
      category,
      date: new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: fileUrl,
    };

    setDocs((prevDocs) => [nuevoDocumento, ...prevDocs]);
    setUploading(false);

    // Resetear el input para permitir subir el mismo archivo si se elimina y vuelve a elegir
    e.target.value = "";
  };

  const handleDeleteDoc = (id: string, url: string) => {
    // Liberar memoria si es una URL local
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
    setDocs((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
  };

  const filteredDocs = filter === "All" ? docs : docs.filter((d) => d.category === filter);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Projects & Documents</h1>
        <label style={styles.uploadBtn}>
          {uploading ? "Subiendo..." : "⚡ Subir Archivo"}
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.ppt,.pptx,.csv"
            hidden
            disabled={uploading}
          />
        </label>
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div style={styles.tabsContainer}>
        {(["All", "PDF", "PPT", "CSV"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...styles.tabBtn,
              ...(filter === tab ? styles.activeTabBtn : {}),
            }}
          >
            {tab === "All" && "⚡ "}
            {tab === "PDF" && "📄 "}
            {tab === "PPT" && "📊 "}
            {tab === "CSV" && "📈 "}
            {tab === "All" ? "Active" : tab}
          </button>
        ))}
      </div>

      {/* GRILLA CON TARJETAS */}
      <div style={styles.grid}>
        {filteredDocs.map((doc) => (
          <div key={doc.id} style={styles.card}>
            {/* Header de la Tarjeta */}
            <div style={styles.cardHeader}>
              <div style={styles.avatar}>▲</div>
              <div>
                <div style={styles.authorName}>HansGit30</div>
                <div style={styles.docDate}>{doc.date}</div>
              </div>
              <span style={styles.badge}>{doc.category}</span>
              <button
                onClick={() => handleDeleteDoc(doc.id, doc.url)}
                style={styles.deleteBtn}
                title="Eliminar documento"
              >
                🗑️
              </button>
            </div>

            {/* Vista Previa del Documento */}
            <div style={styles.previewContainer}>
              {doc.category === "PDF" && (doc.url.startsWith("blob:") || doc.url.includes("blob.vercel-storage.com")) ? (
                <iframe src={doc.url} style={styles.iframePreview} title={doc.name} />
              ) : (
                <div style={styles.placeholderPreview}>
                  <span style={{ fontSize: "40px" }}>
                    {doc.category === "PDF" ? "📄" : doc.category === "PPT" ? "📊" : "📈"}
                  </span>
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "8px", textAlign: "center" }}>
                    {doc.name}
                  </p>
                </div>
              )}
            </div>

            {/* Título de la tarjeta */}
            <h3 style={styles.cardTitle}>{doc.name}</h3>

            {/* Etiquetas */}
            <div style={styles.tagsRow}>
              <span style={styles.tag}>Recurso</span>
              <span style={styles.tag}>{doc.category}</span>
              <span style={styles.tag}>{doc.size}</span>
            </div>

            {/* Acciones */}
            <div style={styles.actionsRow}>
              <a href={doc.url} target="_blank" rel="noreferrer" style={styles.viewBtn}>
                👁️ Visualizar
              </a>
              <a href={doc.url} download={doc.name} target="_blank" rel="noreferrer" style={styles.downloadBtn}>
                ⬇️ Descargar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "32px", backgroundColor: "#f4f4f5", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "28px", fontWeight: 700, color: "#18181b" },
  uploadBtn: { backgroundColor: "#000000", color: "#ffffff", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
  tabsContainer: { display: "flex", gap: "6px", backgroundColor: "#e4e4e7", padding: "4px", borderRadius: "14px", width: "fit-content", marginBottom: "24px" },
  tabBtn: { border: "none", background: "none", padding: "8px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#71717a" },
  activeTabBtn: { backgroundColor: "#ffffff", color: "#000000", fontWeight: 600, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
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
  cardTitle: { fontSize: "16px", fontWeight: 700, color: "#18181b", margin: "4px 0" },
  tagsRow: { display: "flex", gap: "8px" },
  tag: { border: "1px solid #e4e4e7", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: "#71717a", backgroundColor: "#ffffff" },
  actionsRow: { display: "flex", gap: "10px", marginTop: "8px" },
  viewBtn: { flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", border: "1px solid #e4e4e7", textDecoration: "none", color: "#18181b", fontSize: "13px", fontWeight: 600 },
  downloadBtn: { flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", backgroundColor: "#000000", textDecoration: "none", color: "#ffffff", fontSize: "13px", fontWeight: 600 },
};