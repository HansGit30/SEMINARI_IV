import React, { useState, useRef } from "react";
import * as tmPose from "@teachablemachine/pose";

// Enlace actualizado de tu modelo de Teachable Machine
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/THOqcJHid/";

interface HistoryItem {
  id: string;
  imageSrc: string;
  predictions: { className: string; probability: number }[];
}

export const Postura: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Procesar imagen con el modelo @teachablemachine/pose y dibujar el esqueleto
  const processImageSrc = async (src: string) => {
    setLoading(true);
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.src = src;

    imgElement.onload = async () => {
      try {
        // 1. Cargar el modelo de postura con los archivos oficiales
        const model = await tmPose.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );

        // 2. Estimar la pose
        const { pose, posenetOutput } = await model.estimatePose(imgElement);

        // 3. Realizar la predicción usando posenetOutput
        const results = await model.predict(posenetOutput);

        // 4. Configurar dimensiones del canvas utilizando el elemento persistente o uno nuevo bien dimensionado
        const width = imgElement.naturalWidth || 640;
        const height = imgElement.naturalHeight || 480;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Dibujar la imagen base en el canvas
          ctx.drawImage(imgElement, 0, 0, width, height);

          // 5. Dibujar esqueleto y puntos clave si se detecta una pose
          if (pose && pose.keypoints) {
            const minPartConfidence = 0.2; // Umbral de confianza para detección rápida
            
            // Dibujar líneas del esqueleto (ancho: 4, color: azul brillante)
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx, 4, "#3b82f6");
            
            // Dibujar puntos clave (radio: 6, color interno: azul, borde: blanco)
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx, 6, "#3b82f6", "#ffffff");
          }
        }

        // Obtener la imagen final resultante con el esqueleto pintado
        const processedImageSrc = canvas.toDataURL("image/png");

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            imageSrc: processedImageSrc,
            predictions: results,
          },
          ...prev,
        ]);
      } catch (err) {
        console.error("Error al analizar la postura con el modelo:", err);
      } finally {
        setLoading(false);
      }
    };
  };

  // Subir imagen local
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      processImageSrc(src);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Encender cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.error("Error al reproducir video:", e));
        }
      }, 100);
    } catch (err) {
      alert("No se pudo acceder a la cámara web.");
      console.error(err);
    }
  };

  // Capturar foto desde la cámara pintando también el esqueleto en tiempo real si se desea
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const imageSrc = canvas.toDataURL("image/png");
      
      // Detenemos la cámara y procesamos la foto capturada
      stopCamera();
      processImageSrc(imageSrc);
    }
  };

  // Apagar cámara
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div style={styles.container}>
      {/* Encabezado Hero */}
      <header style={styles.heroHeader}>
        <div style={styles.badgeTop}>
          <span style={{ color: "#b4f461" }}>⚡</span> INTELIGENCIA ARTIFICIAL
        </div>
        <h1 style={styles.heroTitle}>
          Análisis de <br />
          <span style={styles.titleHighlight}>Postura Corporal</span>
          <span style={styles.iconBox}>🧍</span>
          <span style={styles.titleGray}>Empieza Aquí</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Sube una foto o activa tu cámara para evaluar tu postura en tiempo real mediante visión por computadora y esqueleto interactivo.
        </p>
      </header>

      {/* Visor de Cámara */}
      {isCameraActive && (
        <div style={styles.cameraBox}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={styles.videoPreview} 
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          
          <div style={styles.cameraControls}>
            <button style={styles.captureBtn} onClick={capturePhoto} disabled={loading}>
              📸 {loading ? "Analizando..." : "Tomar Foto"}
            </button>
            <button style={styles.closeCamBtn} onClick={stopCamera}>
              ✖️ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Selección: Cargar Imagen / Cámara */}
      {!isCameraActive && (
        <div style={styles.actionContainer}>
          <div style={styles.uploadCard}>
            <label htmlFor="file-upload" style={styles.uploadLabel}>
              <span style={{ fontSize: "32px" }}>📁</span>
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                {loading ? "Procesando esqueleto..." : "Haz clic para subir foto de postura"}
              </span>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>Formatos: JPG, PNG, WEBP</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              style={{ display: "none" }}
            />
          </div>

          <div style={styles.divider}>O</div>

          <button style={styles.webcamBtn} onClick={startCamera} disabled={loading}>
            <span style={{ fontSize: "28px" }}>📹</span>
            <span style={{ fontWeight: "600", fontSize: "16px" }}>Usar Cámara Web</span>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Captura en tiempo real</span>
          </button>
        </div>
      )}

      {/* Historial de Resultados con Puntos Clave Pintados */}
      <div style={styles.gridContainer}>
        {history.map((item) => {
          const topPrediction = [...item.predictions].sort((a, b) => b.probability - a.probability)[0];

          return (
            <div key={item.id} style={styles.card}>
              <div style={styles.imageContainer}>
                <img src={item.imageSrc} alt="Analizada con Esqueleto" style={styles.cardImage} />
                <div style={styles.imageOverlay} />
                {topPrediction && (
                  <div style={styles.topBadge}>
                    <span>{topPrediction.className}</span>
                    <strong>{(topPrediction.probability * 100).toFixed(0)}%</strong>
                  </div>
                )}
              </div>

              <div style={styles.cardBody}>
                <h4 style={styles.cardTitle}>Resultados de Postura</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {item.predictions.map((p, idx) => {
                    const percentage = (p.probability * 100).toFixed(1);
                    return (
                      <div key={idx}>
                        <div style={styles.predMeta}>
                          <span>{p.className}</span>
                          <strong style={{ color: p.probability > 0.5 ? "#b4f461" : "#94a3b8" }}>
                            {percentage}%
                          </strong>
                        </div>
                        <div style={styles.progressBarBg}>
                          <div
                            style={{
                              ...styles.progressBarFill,
                              width: `${percentage}%`,
                              backgroundColor: p.probability > 0.5 ? "#b4f461" : "#3b82f6",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "40px 24px",
    minHeight: "100vh",
    backgroundColor: "#0b0f19",
    color: "#f8fafc",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  heroHeader: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "800px",
    margin: "0 auto 40px auto",
  },
  badgeTop: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#94a3b8",
    marginBottom: "16px",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    lineHeight: "1.15",
    letterSpacing: "-1px",
    margin: "0 0 16px 0",
    color: "#ffffff",
  },
  titleHighlight: {
    color: "#ffffff",
  },
  titleGray: {
    color: "#64748b",
  },
  iconBox: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b4f461",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    margin: "0 12px",
    verticalAlign: "middle",
    fontSize: "20px",
  },
  heroSubtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: "1.6",
    maxWidth: "580px",
    margin: "0 auto",
  },
  actionContainer: {
    display: "flex",
    gap: "16px",
    maxWidth: "800px",
    margin: "0 auto 40px auto",
    alignItems: "stretch",
    flexWrap: "wrap",
  },
  uploadCard: {
    flex: 1,
    minWidth: "260px",
    backgroundColor: "#161e2e",
    border: "2px dashed #243044",
    borderRadius: "20px",
    padding: "24px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    color: "#e2e8f0",
    width: "100%",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    color: "#475569",
    fontWeight: "bold",
    fontSize: "14px",
  },
  webcamBtn: {
    flex: 1,
    minWidth: "260px",
    backgroundColor: "#161e2e",
    border: "1px solid #243044",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    color: "#e2e8f0",
    cursor: "pointer",
  },
  cameraBox: {
    maxWidth: "500px",
    margin: "0 auto 40px auto",
    backgroundColor: "#161e2e",
    borderRadius: "20px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    border: "1px solid #243044",
  },
  videoPreview: {
    width: "100%",
    maxHeight: "400px",
    borderRadius: "12px",
    backgroundColor: "#000",
    objectFit: "cover",
  },
  cameraControls: {
    display: "flex",
    gap: "12px",
  },
  captureBtn: {
    backgroundColor: "#b4f461",
    color: "#0f172a",
    border: "none",
    padding: "10px 20px",
    borderRadius: "9999px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  closeCamBtn: {
    backgroundColor: "#334155",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "9999px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#161e2e",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid #243044",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "220px",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(22, 30, 46, 1) 0%, rgba(22, 30, 46, 0) 60%)",
  },
  topBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "rgba(11, 15, 25, 0.8)",
    backdropFilter: "blur(8px)",
    padding: "6px 14px",
    borderRadius: "9999px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "13px",
    display: "flex",
    gap: "8px",
    color: "#fff",
  },
  cardBody: {
    padding: "20px",
    marginTop: "-16px",
    position: "relative",
    zIndex: "1",
  },
  cardTitle: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: "600",
  },
  predMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    marginBottom: "4px",
  },
  progressBarBg: {
    height: "6px",
    backgroundColor: "#243044",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.4s ease-in-out",
  },
};

export default Postura;