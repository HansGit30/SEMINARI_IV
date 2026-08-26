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
  const [livePredictions, setLivePredictions] = useState<Prediction[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const modelRef = useRef<tmPose.CustomPoseNet | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cargar modelo de Teachable Machine
  useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await tmPose.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );
      } catch (err) {
        console.error("Error cargando el modelo Pose:", err);
      }
    };
    loadModel();

    return () => stopCamera();
  }, []);

  // Bucle de renderizado continuo en tiempo real
  const loop = async () => {
    if (
      videoRef.current &&
      canvasRef.current &&
      modelRef.current &&
      videoRef.current.readyState === 4
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Ajustar dimensiones del Canvas al tamaño real de entrada del Video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      if (ctx) {
        // 1. Detección de la pose mediante PoseNet / Teachable Machine
        const { pose, posenetOutput } = await modelRef.current.estimatePose(video);
        const predictions = await modelRef.current.predict(posenetOutput);

        setLivePredictions(predictions);

        // 2. Limpiar Canvas y proyectar la imagen actual de la cámara
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 3. Renderizar superposición de Puntos Clave y Esqueleto
        if (pose && pose.keypoints) {
          const minPartConfidence = 0.2; // Umbral de confianza flexible

          // Dibujar líneas del esqueleto
          tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx, 4, "#00ffcc");

          // Dibujar puntos clave (nodos rojos como en tu ejemplo)
          tmPose.drawKeypoints(
            pose.keypoints,
            minPartConfidence,
            ctx,
            6,
            "#ff0055", // Color interno del nodo
            "#ffffff"  // Borde exterior
          );
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(loop);
  };

  // Activar Cámara
  const startCamera = async () => {
    try {
      setLoading(true);
      if (!modelRef.current) {
        modelRef.current = await tmPose.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    } catch (err) {
      alert("No se pudo iniciar la cámara web.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Capturar frame actual para el historial
  const capturePhoto = () => {
    if (!canvasRef.current || livePredictions.length === 0) return;

    const snapshotSrc = canvasRef.current.toDataURL("image/png");

    setHistory((prev) => [
      {
        id: Date.now().toString(),
        imageSrc: snapshotSrc,
        predictions: [...livePredictions],
      },
      ...prev,
    ]);

    stopCamera();
  };

  // Apagar Cámara
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsCameraActive(false);
    setLivePredictions([]);
  };

  // Subir imagen local
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      processStaticImage(src);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Procesar imagen estática
  const processStaticImage = async (src: string) => {
    setLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = async () => {
      try {
        if (!modelRef.current) {
          modelRef.current = await tmPose.load(
            MODEL_URL + "model.json",
            MODEL_URL + "metadata.json"
          );
        }

        const { pose, posenetOutput } = await modelRef.current.estimatePose(img);
        const results = await modelRef.current.predict(posenetOutput);

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 480;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          if (pose && pose.keypoints) {
            tmPose.drawSkeleton(pose.keypoints, 0.2, ctx, 4, "#00ffcc");
            tmPose.drawKeypoints(pose.keypoints, 0.2, ctx, 6, "#ff0055", "#ffffff");
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
          Análisis de <span style={{ color: "#00ffcc" }}>Postura Corporal</span> 🧍
        </h1>
        <p style={styles.heroSubtitle}>
          Detección de articulaciones y puntos clave en tiempo real con visión artificial.
        </p>
      </header>

      {/* Visor con Canvas Superpuesto */}
      {isCameraActive && (
        <div style={styles.cameraBox}>
          <div style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: "12px" }}>
            {/* Ocultar la etiqueta de video cruda */}
            <video ref={videoRef} style={{ display: "none" }} playsInline muted />
            {/* El canvas se encarga de renderizar la cámara + los puntos */}
            <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />
          </div>

          <div style={styles.liveMetrics}>
            <h4 style={{ margin: "0 0 8px 0", color: "#94a3b8" }}>Predicción en vivo:</h4>
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
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={styles.cameraControls}>
            <button style={styles.captureBtn} onClick={capturePhoto}>
              📸 Capturar Resultado
            </button>
            <button style={styles.closeCamBtn} onClick={stopCamera}>
              ✖️ Apagar Cámara
            </button>
          </div>
        </div>
      )}

      {/* Panel de Controles */}
      {!isCameraActive && (
        <div style={styles.actionContainer}>
          <div style={styles.uploadCard}>
            <label htmlFor="file-upload" style={styles.uploadLabel}>
              <span style={{ fontSize: "32px" }}>📁</span>
              <span style={{ fontWeight: "600" }}>
                {loading ? "Procesando..." : "Subir foto para analizar"}
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

          <button style={styles.webcamBtn} onClick={startCamera} disabled={loading}>
            <span style={{ fontSize: "28px" }}>📹</span>
            <span style={{ fontWeight: "600" }}>Abrir Cámara Web</span>
          </button>
        </div>
      )}

      {/* Galería de Resultados */}
      <div style={styles.gridContainer}>
        {history.map((item) => (
          <div key={item.id} style={styles.card}>
            <img src={item.imageSrc} alt="Result" style={styles.cardImage} />
            <div style={styles.cardBody}>
              <h4 style={styles.cardTitle}>Resultado Guardado</h4>
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
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "30px 20px",
    minHeight: "100vh",
    backgroundColor: "#0b0f19",
    color: "#f8fafc",
    fontFamily: "system-ui, sans-serif",
  },
  heroHeader: { textAlign: "center", marginBottom: "30px" },
  badgeTop: { fontSize: "12px", color: "#94a3b8", fontWeight: "700" },
  heroTitle: { fontSize: "36px", margin: "10px 0" },
  heroSubtitle: { color: "#94a3b8", fontSize: "14px" },
  actionContainer: {
    display: "flex",
    gap: "16px",
    maxWidth: "600px",
    margin: "0 auto 30px auto",
  },
  uploadCard: {
    flex: 1,
    backgroundColor: "#161e2e",
    border: "2px dashed #243044",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
  },
  uploadLabel: { cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" },
  webcamBtn: {
    flex: 1,
    backgroundColor: "#161e2e",
    border: "1px solid #243044",
    borderRadius: "16px",
    padding: "20px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  cameraBox: {
    maxWidth: "540px",
    margin: "0 auto 30px auto",
    backgroundColor: "#161e2e",
    borderRadius: "20px",
    padding: "16px",
    border: "1px solid #243044",
  },
  liveMetrics: { marginTop: "12px", backgroundColor: "#0b0f19", padding: "12px", borderRadius: "10px" },
  predMeta: { display: "flex", justifyContent: "space-between", fontSize: "13px" },
  progressBarBg: { height: "6px", backgroundColor: "#243044", borderRadius: "4px", marginTop: "4px" },
  progressBarFill: { height: "100%", backgroundColor: "#00ffcc", borderRadius: "4px" },
  cameraControls: { display: "flex", gap: "10px", marginTop: "12px" },
  captureBtn: { flex: 1, padding: "10px", backgroundColor: "#00ffcc", color: "#000", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  closeCamBtn: { flex: 1, padding: "10px", backgroundColor: "#334155", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#161e2e", borderRadius: "16px", overflow: "hidden", border: "1px solid #243044" },
  cardImage: { width: "100%", height: "200px", objectFit: "cover" },
  cardBody: { padding: "14px" },
  cardTitle: { margin: "0 0 10px 0", fontSize: "14px", color: "#94a3b8" },
};

export default Postura;