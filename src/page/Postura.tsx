import React, { useState, useRef, useEffect } from "react";
import * as tmPose from "@teachablemachine/pose";

const MODEL_URL = "/my-model-postura/";

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
  const [livePredictions, setLivePredictions] = useState<Prediction[]>([]);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<tmPose.Webcam | null>(null);
  const modelRef = useRef<tmPose.CustomPoseNet | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await tmPose.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );
      } catch (err) {
        console.error("Error al cargar modelo:", err);
      }
    };
    loadModel();

    return () => {
      stopCamera();
    };
  }, []);

  // Bucle identico a tu script de HTML vanilla
  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update(); // Actualiza cuadro de la cámara
      await predict();
      animationFrameRef.current = requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    if (!webcamRef.current || !modelRef.current || !ctxRef.current) return;

    const { pose, posenetOutput } = await modelRef.current.estimatePose(
      webcamRef.current.canvas
    );
    const prediction = await modelRef.current.predict(posenetOutput);

    setLivePredictions(prediction);

    // Dibuja la camara en el Canvas
    ctxRef.current.drawImage(webcamRef.current.canvas, 0, 0);

    // Superpone el esqueleto y los nodos rojos
    if (pose) {
      const minConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minConfidence, ctxRef.current);
      tmPose.drawSkeleton(pose.keypoints, minConfidence, ctxRef.current);
    }
  };

  const startCamera = async () => {
    try {
      setLoading(true);
      if (!modelRef.current) {
        modelRef.current = await tmPose.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );
      }

      const size = 400;
      const flip = true;
      const webcam = new tmPose.Webcam(size, size, flip);
      await webcam.setup();
      await webcam.play();
      webcamRef.current = webcam;

      setIsCameraActive(true);

      // Inyectar el canvas nativo de Teachable Machine al DOM manteniéndolo responsivo
      setTimeout(() => {
        if (canvasContainerRef.current && webcam.canvas) {
          canvasContainerRef.current.innerHTML = "";
          webcam.canvas.style.width = "100%";
          webcam.canvas.style.height = "auto";
          webcam.canvas.style.borderRadius = "12px";
          canvasContainerRef.current.appendChild(webcam.canvas);
          ctxRef.current = webcam.canvas.getContext("2d");

          animationFrameRef.current = requestAnimationFrame(loop);
        }
      }, 50);
    } catch (err) {
      alert("No se pudo iniciar la cámara.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!webcamRef.current || livePredictions.length === 0) return;

    const snapshot = webcamRef.current.canvas.toDataURL("image/png");

    setHistory((prev) => [
      {
        id: Date.now().toString(),
        imageSrc: snapshot,
        predictions: [...livePredictions],
      },
      ...prev,
    ]);

    stopCamera();
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (webcamRef.current) {
      webcamRef.current.stop();
      webcamRef.current = null;
    }

    setIsCameraActive(false);
    setLivePredictions([]);
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

  const processImageSrc = async (src: string) => {
    setLoading(true);
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.src = src;

    imgElement.onload = async () => {
      try {
        if (!modelRef.current) {
          modelRef.current = await tmPose.load(
            MODEL_URL + "model.json",
            MODEL_URL + "metadata.json"
          );
        }

        const { pose, posenetOutput } = await modelRef.current.estimatePose(imgElement);
        const results = await modelRef.current.predict(posenetOutput);

        const width = imgElement.naturalWidth || 640;
        const height = imgElement.naturalHeight || 480;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(imgElement, 0, 0, width, height);
          if (pose) {
            tmPose.drawKeypoints(pose.keypoints, 0.5, ctx);
            tmPose.drawSkeleton(pose.keypoints, 0.5, ctx);
          }
        }

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            imageSrc: canvas.toDataURL("image/png"),
            predictions: results,
          },
          ...prev,
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div style={styles.container}>
      <header style={styles.heroHeader}>
        <div style={styles.badgeTop}>⚡ INTELIGENCIA ARTIFICIAL</div>
        <h1 style={styles.heroTitle}>
          Análisis de <span style={{ color: "#ffffff" }}>Postura Corporal</span> 🧍
        </h1>
        <p style={styles.heroSubtitle}>
          Detección en tiempo real utilizando el Canvas de Teachable Machine.
        </p>
      </header>

      {/* Visor con el Canvas interactivo renderizado */}
      {isCameraActive && (
        <div style={styles.cameraBox}>
          <div ref={canvasContainerRef} style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }} />

          <div style={{ width: "100%", backgroundColor: "#0b0f19", padding: "12px", borderRadius: "12px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#94a3b8" }}>Detección en tiempo real:</h4>
            {livePredictions.map((p, i) => (
              <div key={i} style={{ marginBottom: "6px" }}>
                <div style={styles.predMeta}>
                  <span>{p.className}</span>
                  <strong>{(p.probability * 100).toFixed(0)}%</strong>
                </div>
                <div style={styles.progressBarBg}>
                  <div
                    style={{
                      ...styles.progressBarFill,
                      width: `${(p.probability * 100).toFixed(0)}%`,
                      backgroundColor: p.probability > 0.5 ? "#b4f461" : "#3b82f6",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={styles.cameraControls}>
            <button style={styles.captureBtn} onClick={capturePhoto}>
              📸 Tomar Foto
            </button>
            <button style={styles.closeCamBtn} onClick={stopCamera}>
              ✖️ Cancelar
            </button>
          </div>
        </div>
      )}

      {!isCameraActive && (
        <div style={styles.actionContainer}>
          <div style={styles.uploadCard}>
            <label htmlFor="file-upload" style={styles.uploadLabel}>
              <span style={{ fontSize: "32px" }}>📁</span>
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                {loading ? "Procesando..." : "Subir foto de postura"}
              </span>
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
          </button>
        </div>
      )}

      {/* Historial */}
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
                <h4 style={styles.cardTitle}>Resultados Guardados</h4>
                {item.predictions.map((p, idx) => (
                  <div key={idx} style={{ marginBottom: "6px" }}>
                    <div style={styles.predMeta}>
                      <span>{p.className}</span>
                      <strong>{(p.probability * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                ))}
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
  heroHeader: { textAlign: "center", marginBottom: "40px", maxWidth: "800px", margin: "0 auto 40px auto" },
  badgeTop: { fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "16px" },
  heroTitle: { fontSize: "42px", fontWeight: "800", color: "#ffffff", margin: "0 0 16px 0" },
  heroSubtitle: { fontSize: "15px", color: "#94a3b8", maxWidth: "580px", margin: "0 auto" },
  actionContainer: { display: "flex", gap: "16px", maxWidth: "800px", margin: "0 auto 40px auto", flexWrap: "wrap" },
  uploadCard: { flex: 1, minWidth: "260px", backgroundColor: "#161e2e", border: "2px dashed #243044", borderRadius: "20px", padding: "24px", textAlign: "center" },
  uploadLabel: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer", color: "#e2e8f0" },
  divider: { display: "flex", alignItems: "center", color: "#475569", fontWeight: "bold" },
  webcamBtn: { flex: 1, minWidth: "260px", backgroundColor: "#161e2e", border: "1px solid #243044", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "#e2e8f0", cursor: "pointer" },
  cameraBox: { maxWidth: "520px", margin: "0 auto 40px auto", backgroundColor: "#161e2e", borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", border: "1px solid #243044" },
  cameraControls: { display: "flex", gap: "12px" },
  captureBtn: { backgroundColor: "#b4f461", color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "9999px", fontWeight: "bold", cursor: "pointer" },
  closeCamBtn: { backgroundColor: "#334155", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "9999px", fontWeight: "bold", cursor: "pointer" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" },
  card: { backgroundColor: "#161e2e", borderRadius: "24px", overflow: "hidden", border: "1px solid #243044", display: "flex", flexDirection: "column" },
  imageContainer: { position: "relative", width: "100%", height: "220px" },
  cardImage: { width: "100%", height: "100%", objectFit: "cover" },
  topBadge: { position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(11, 15, 25, 0.8)", padding: "6px 14px", borderRadius: "9999px", fontSize: "13px", display: "flex", gap: "8px", color: "#fff" },
  cardBody: { padding: "20px" },
  cardTitle: { margin: "0 0 16px 0", fontSize: "14px", color: "#94a3b8", fontWeight: "600" },
  predMeta: { display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" },
  progressBarBg: { height: "6px", backgroundColor: "#243044", borderRadius: "9999px", overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: "9999px", transition: "width 0.2s ease-in-out" },
};

export default Postura;