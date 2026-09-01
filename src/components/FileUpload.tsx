import React, { useState } from "react";

interface UploadedFile {
  publicId: string;
  url: string;
  format: string;
  resourceType: string;
  originalName: string;
}

export const FileUpload: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileData, setFileData] = useState<UploadedFile | null>(null);

  // Datos de tu cuenta Cloudinary
  const CLOUD_NAME = "ynvjq21s"; 
  const UPLOAD_PRESET = "tu_upload_preset_aqui"; // Reemplaza por tu Unsigned Preset

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    setLoading(true);

    try {
      // Usa /auto/upload para detectar automáticamente PDF, CSV, PPTX, DOCX, ZIP, etc.
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar el archivo a Cloudinary");
      }

      const data = await response.json();

      setFileData({
        publicId: data.public_id,
        url: data.secure_url,
        format: data.format || selectedFile.name.split('.').pop() || "archivo",
        resourceType: data.resource_type,
        originalName: selectedFile.name,
      });
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("Hubo un fallo al subir el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.uploadLabel}>
        {loading ? "Cargando archivo..." : "📁 Seleccionar Archivo (PDF, CSV, PPTX, etc.)"}
        <input
          type="file"
          // Formatos permitidos: Documentos, Hojas de cálculo, Presentaciones e Imágenes
          accept=".pdf,.csv,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={loading}
          style={{ display: "none" }}
        />
      </label>

      {fileData && (
        <div style={styles.resultContainer}>
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>
            ✅ Archivo cargado con éxito
          </p>

          <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#334155" }}>
            <strong>Nombre:</strong> {fileData.originalName}
          </p>

          {/* Si es imagen muestra la vista previa, de lo contrario muestra un enlace de descarga */}
          {fileData.resourceType === "image" ? (
            <img src={fileData.url} alt="Vista previa" style={styles.previewImage} />
          ) : (
            <a
              href={fileData.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.downloadBtn}
            >
              📥 Descargar / Abrir {fileData.format.toUpperCase()}
            </a>
          )}

          <div style={{ marginTop: "12px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>URL generada:</span>
            <input type="text" readOnly value={fileData.url} style={styles.inputUrl} />
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    maxWidth: "500px",
  },
  uploadLabel: {
    display: "inline-block",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  resultContainer: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "220px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  downloadBtn: {
    display: "inline-block",
    marginTop: "6px",
    padding: "8px 14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
  inputUrl: {
    width: "100%",
    padding: "8px",
    marginTop: "4px",
    fontSize: "12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#334155",
  },
};