import React, { useState, useRef, useEffect } from "react";
import * as tmPose from "@teachablemachine/pose";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/THOqcJHid/";

interface Prediction {
  className: string;
  probability: number;
}

interface HistoryItem {
  id: string;
  imageSrc: string;
  predictions: Prediction[];
}

export const Postura: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // Referencias para el modo cámara en vivo con Teachable Machine
  const webcamCanvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<tmPose.CustomPoseModel | null>(null);
  const webcamRef = useRef<tmPose.Webcam | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Cargar el modelo al iniciar el componente
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tmPose.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );
        modelRef.current = model;
      } catch (err) {
        console.error("Error al cargar el modelo:", err);
      }
    };
    loadModel();

    return () => {
      stopLiveCamera();
    };
  }, []);

  // Procesar imagen estática (Subir archivo)
  const processImageSrc = async (src: string) => {
    if (!modelRef.current) return;
    setLoading(true);
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.src = src;

    imgElement.onload = async () => {
      try {
        const { pose, posenetOutput } = await modelRef.current!.estimatePose(imgElement);
        const results = await modelRef.current!.predict(posenetOutput);

        const width = imgElement.naturalWidth || 640;
        const height = imgElement.naturalHeight || 480;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(imgElement, 0, 0, width, height);
          if (pose && pose.keypoints) {
            const minPartConfidence = 0.2;
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx, 4, "#3b82f6");
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx, 6, "#3b82f6", "#ffffff");
          }
        }

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
        console.error("Error al analizar la imagen:", err);
      } finally {
        setLoading(false);
      }
    };
  };

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

  // --- MODO CÁMARA EN VIVO (Basado en el código de tu compañera) ---
  const startLiveCamera = async () => {
    if (!modelRef.current) {
      alert("El modelo aún se está cargando. Espera un momento.");
      return;
    }

    try {
      setIsCameraActive(true);
      const size = 300;
      const flip = true;
      const webcam = new tmPose.Webcam(size, size, flip);
      await webcam.setup();
      await webcam.play();
      webcamRef.current = webcam;

      if (webcamCanvasRef.current) {
        webcamCanvasRef.current.width = size;
        webcamCanvasRef.current.height = size;
      }

      // Bucle de animación en tiempo real
      const loop = async () => {
        webcam.update();
        await predictWebcam();
        animationFrameId.current = window.requestAnimationFrame(loop);
      };

      window.requestAnimationFrame(loop);
    } catch (err) {
      console.error("Error al iniciar la webcam:", err);
      alert("No se pudo acceder a la cámara.");
      setIsCameraActive(false);
    }
  };

  const predictWebcam = async () => {
    if (!modelRef.current || !webcamRef.current) return;

    try {
      const { pose, posenetOutput } = await modelRef.current.estimatePose(webcamRef.current.canvas);
      const results = await modelRef.current.predict(posenetOutput);
      setPredictions(results);

      if (webcamCanvasRef.current) {
        const ctx = webcamCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.drawImage(webcamRef.current.canvas, 0, 0);
          if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
          }
        }
      }
    } catch (err) {
      console.error("Error en la predicción en vivo:", err);
    }
  };

  const stopLiveCamera = () => {
    if (animationFrameId.current) {
      window.cancelAnimationFrame(animationFrameId.current);
    }
    if (webcamRef.current) {
      webcamRef.current.stop();
      webcamRef.current = null;
    }
    setIsCameraActive(false);
    setPredictions([]);
  };

  return (
    <div style={styles.container}>
      <header style={styles.heroHeader}>
        <div style={styles.badgeTop}>
          <span style={{ color: "#b4f461" }}>⚡</span> INTELIGENCIA ARTIFICIAL
        </div>
        <h1 style={styles.heroTitle}>
          Análisis de <span style={styles.titleHighlight}>Postura y Movimiento</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Sube una foto o inicia la cámara en vivo para evaluar tu postura mediante visión por computadora.
        </p>
      </header>

      {/* Visor de Cámara en Vivo */}
      {isCameraActive && (
        <div style={styles.cameraBox}>
          <h3>Monitoreo de Movimiento en Vivo</h3>
          <div style={styles.canvasContainer}>
            <canvas ref={webcamCanvasRef} />
          </div>

          <div style={{ width: "100%", marginBottom: "16px" }}>
            <div style={styles.salidaTitle}>Resultados en tiempo real</div>
            {predictions.map((p, idx) => {
              const percentage = Math.round(p.probability * 100);
              return (
                <div key={idx} style={styles.predMetaRow}>
                  <span>{p.className}</span>
                  <strong style={{ color: percentage > 50 ? "#b4f461" : "#94a3b8" }}>
                    {percentage}%
                  </strong>
                </div>
              );
            })}
          </div>

          <button style={styles.closeCamBtn} onClick={stopLiveCamera}>
            ✖️ Apagar Cámara
          </button>
        </div>
      )}

      {/* Botones de Acción */}
      {!isCameraActive && (
        <div style={styles.actionContainer}>
          <div style={styles.uploadCard}>
            <label htmlFor="file-upload" style={styles.uploadLabel}>
              <span style={{ fontSize: "32px" }}>📁</span>
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                {loading ? "Procesando esqueleto..." : "Subir foto de postura"}
              </span>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>JPG, PNG, WEBP</span>
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

          <button style={styles.webcamBtn} onClick={startLiveCamera}>
            <span style={{ fontSize: "28px" }}>📹</span>
            <span style={{ fontWeight: "600", fontSize: "16px" }}>Iniciar Cámara en Vivo</span>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Detección de movimiento continua</span>
          </button>
        </div>
      )}

      {/* Historial de fotos subidas */}
      <div style={styles.gridContainer}>
        {history.map((item) => {
          const topPrediction = [...item.predictions].sort((a, b) => b.probability - a.probability)[0];

          return (
            <div key={item.id} style={styles.card}>
              <div style={styles.imageContainer}>
                <img src={item.imageSrc} alt="Analizada" style={styles.cardImage} />
                {topPrediction && (
                  <div style={styles.topBadge}>
                    <span>{topPrediction.className}</span>
                    <strong>{(topPrediction.probability * 100).toFixed(0)}%</strong>
                  </div>
                )}
              </div>
              <div style={styles.cardBody}>
                <h4 style={styles.cardTitle}>Resultado Estático</h4>
                {item.predictions.map((p, idx) => {
                  const percentage = (p.probability * 100).toFixed(1);
                  return (
                    <div key={idx} style={{ marginBottom: "8px" }}>
                      <div style={styles.predMeta}>
                        <span>{p.className}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div style={styles.progressBarBg}>
                        <div style={{ ...styles.progressBarFill, width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
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
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#94a3b8",
    marginBottom: "16px",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "12px",
  },
  titleHighlight: {
    color: "#b4f461",
  },
  heroSubtitle: {
    fontSize: "15px",
    color: "#94a3b8",
  },
  actionContainer: {
    display: "flex",
    gap: "16px",
    maxWidth: "800px",
    margin: "0 auto 40px auto",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  uploadCard: {
    flex: 1,
    minWidth: "260px",
    backgroundColor: "#161e2e",
    border: "2px dashed #243044",
    borderRadius: "20px",
    padding: "24px",
    textAlign: "center",
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    color: "#e2e8f0",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    color: "#475569",
    fontWeight: "bold",
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
    gap: "6px",
    color: "#e2e8f0",
    cursor: "pointer",
  },
  cameraBox: {
    maxWidth: "420px",
    margin: "0 auto 40px auto",
    backgroundColor: "#161e2e",
    borderRadius: "24px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #243044",
  },
  canvasContainer: {
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "#000",
    marginBottom: "20px",
  },
  salidaTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: "12px",
    textTransform: "uppercase",
  },
  predMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "8px",
  },
  closeCamBtn: {
    backgroundColor: "#f43f5e",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "9999px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
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
  topBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "rgba(11, 15, 25, 0.8)",
    padding: "6px 14px",
    borderRadius: "9999px",
    fontSize: "13px",
    display: "flex",
    gap: "8px",
    color: "#fff",
  },
  cardBody: {
    padding: "20px",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "14px",
    color: "#94a3b8",
  },
  predMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
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
    backgroundColor: "#b4f461",
    borderRadius: "9999px",
  },
};

export default Postura;