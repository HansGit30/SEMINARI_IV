import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Trash2, 
  FileType, 
  Presentation, 
  Table, 
  Sparkles,
  X 
} from "lucide-react";
import { supabase } from "../lib/supabase";

export interface DocumentoItem {
  id: string;
  name: string;
  category: "PDF" | "PPT" | "CSV" | "OTRO";
  date: string;
  size: string;
  url: string;
}

const humanFileSize = (sizeInBytes: number): string => {
  if (!sizeInBytes) return "0 B";
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (sizeInBytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};

const detectCategory = (fileName: string): "PDF" | "PPT" | "CSV" | "OTRO" => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (["ppt", "pptx"].includes(ext || "")) return "PPT";
  if (["csv", "xls", "xlsx"].includes(ext || "")) return "CSV";
  return "OTRO";
};

export const Documentos: React.FC = () => {
  const [docs, setDocs] = useState<DocumentoItem[]>([]);
  const [filter, setFilter] = useState<string>("Todos");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchDocs = async () => {
    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando documentos:", error);
      return;
    }

    if (data) {
      const formattedDocs: DocumentoItem[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        date: new Date(item.created_at).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        size: item.size,
        url: item.url,
      }));
      setDocs(formattedDocs);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const cleanName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_");

      const filePath = `files/${Date.now()}_${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from("documentos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("documentos")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("documentos").insert([
        {
          name: file.name,
          category: detectCategory(file.name),
          size: humanFileSize(file.size),
          url: urlData.publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      await fetchDocs();
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("documentos").delete().eq("id", id);
    if (!error) {
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  const filteredDocs = filter === "Todos" 
    ? docs 
    : docs.filter((doc) => doc.category === filter);

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: 0, tracking: "-0.025em" }}>
            Projects &amp; Documents
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px", margin: 0 }}>
            Gestión centralizada de archivos con Supabase.
          </p>
        </div>

        <label style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "8px", 
          backgroundColor: "#000000", 
          color: "#ffffff", 
          fontWeight: "500", 
          padding: "10px 20px", 
          borderRadius: "12px", 
          cursor: uploading ? "not-allowed" : "pointer", 
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          opacity: uploading ? 0.7 : 1
        }}>
          <Upload style={{ width: "16px", height: "16px", color: "#f59e0b" }} />
          <span>{uploading ? "Subiendo..." : "Subir Archivo"}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* Categorías / Filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
        {[
          { label: "Todos", icon: Sparkles },
          { label: "PDF", icon: FileType },
          { label: "PPT", icon: Presentation },
          { label: "CSV", icon: Table },
        ].map(({ label, icon: Icon }) => {
          const isActive = filter === label;
          return (
            <button
              key={label}
              onClick={() => setFilter(label)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: isActive ? "600" : "500",
                backgroundColor: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#000000" : "#6b7280",
                border: isActive ? "1px solid #e5e7eb" : "1px solid transparent",
                boxShadow: isActive ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
                cursor: "pointer"
              }}
            >
              <Icon style={{ width: "16px", height: "16px", color: isActive ? "#f59e0b" : "#9ca3af" }} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Lista / Grid de Tarjetas */}
      {filteredDocs.length === 0 ? (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "48px", 
          border: "2px dashed #e5e7eb", 
          borderRadius: "24px", 
          backgroundColor: "#f9fafb", 
          color: "#9ca3af", 
          textAlign: "center" 
        }}>
          <FileText style={{ width: "40px", height: "40px", marginBottom: "12px" }} />
          <p style={{ fontSize: "14px", margin: 0 }}>Aún no hay documentos en esta categoría.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "16px" 
        }}>
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "130px"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#fffbe3", borderRadius: "12px", color: "#d97706" }}>
                  <FileText style={{ width: "24px", height: "24px" }} />
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    onClick={() => setPreviewUrl(doc.url)}
                    style={{ padding: "8px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", borderRadius: "8px" }}
                    title="Visualizar"
                  >
                    <Eye style={{ width: "16px", height: "16px" }} />
                  </button>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{ padding: "8px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", borderRadius: "8px", display: "inline-flex" }}
                    title="Descargar"
                  >
                    <Download style={{ width: "16px", height: "16px" }} />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    style={{ padding: "8px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", borderRadius: "8px" }}
                    title="Eliminar"
                  >
                    <Trash2 style={{ width: "16px", height: "16px" }} />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <h3 style={{ 
                  fontSize: "15px", 
                  fontWeight: "600", 
                  color: "#111827", 
                  margin: 0, 
                  whiteSpace: "nowrap", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis" 
                }} title={doc.name}>
                  {doc.name}
                </h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
                  <span>{doc.date}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span style={{ backgroundColor: "#f3f4f6", color: "#4b5563", fontWeight: "500", padding: "2px 8px", borderRadius: "6px" }}>
                    {doc.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Previsualización */}
      {previewUrl && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "900px",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: 0, fontWeight: "600", color: "#111827" }}>Vista previa</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                style={{ padding: "4px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", borderRadius: "8px" }}
              >
                <X style={{ width: "20px", height: "20px" }} />
              </button>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
              <iframe
                src={previewUrl}
                title="Vista previa del documento"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentos;