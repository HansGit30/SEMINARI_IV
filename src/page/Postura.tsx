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

  const [, setClassLabels] = useState<string[]>([]);



  const webcamRef = useRef<InstanceType<typeof tmPose.Webcam> | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const modelRef = useRef<tmPose.CustomPoseNet | null>(null);

  const animationFrameRef = useRef<number | null>(null);



  useEffect(() => {

    let isMounted = true;



    const loadModel = async () => {

      try {

        const modelURL = MODEL_URL + "model.json";

        const metadataURL = MODEL_URL + "metadata.json";



        const loadedModel = await tmPose.load(modelURL, metadataURL);

        if (isMounted) {

          modelRef.current = loadedModel;

          setClassLabels(loadedModel.getClassLabels());

        }

      } catch (err) {

        console.error("Error al cargar el modelo:", err);

      }

    };



    loadModel();



    return () => {

      isMounted = false;

      if (animationFrameRef.current) {

        cancelAnimationFrame(animationFrameRef.current);

      }

      if (webcamRef.current) {

        try {

          webcamRef.current.stop();

        } catch (e) {

          console.error(e);

        }

      }

    };

  }, []);



  const drawPose = (pose: Record<string, unknown> | null, ctx: CanvasRenderingContext2D, webcamCanvas: HTMLCanvasElement) => {

    if (webcamCanvas && ctx) {

      ctx.drawImage(webcamCanvas, 0, 0);

      if (pose && Array.isArray(pose.keypoints)) {

        const minPartConfidence = 0.5;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        const kp = pose.keypoints as any;

        tmPose.drawKeypoints(kp, minPartConfidence, ctx);

        tmPose.drawSkeleton(kp, minPartConfidence, ctx);

      }

    }

  };



  const predict = async () => {

    if (!webcamRef.current || !modelRef.current || !canvasRef.current) return;



    try {

      webcamRef.current.update();

      const canvas = canvasRef.current;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;



      const { pose, posenetOutput } = await modelRef.current.estimatePose(webcamRef.current.canvas);

      const prediction = await modelRef.current.predict(posenetOutput);



      const formattedPredictions: Prediction[] = prediction.map((p: Prediction) => ({

        className: p.className,

        probability: p.probability,

      }));



      setLivePredictions(formattedPredictions);

      drawPose(pose as unknown as Record<string, unknown>, ctx, webcamRef.current.canvas);



      animationFrameRef.current = requestAnimationFrame(predict);

    } catch (err) {

      console.error("Error en la predicción en vivo:", err);

    }

  };



  const startCamera = async () => {

    try {

      setLoading(true);



      if (!modelRef.current) {

        const loadedModel = await tmPose.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");

        modelRef.current = loadedModel;

        setClassLabels(loadedModel.getClassLabels());

      }



      const size = 320;

      const flip = true;

      const webcam = new tmPose.Webcam(size, size, flip);

      await webcam.setup();

      await webcam.play();

      webcamRef.current = webcam;



      const canvas = canvasRef.current;

      if (canvas) {

        canvas.width = size;

        canvas.height = size;

      }



      setIsCameraActive(true);

      setLoading(false);



      animationFrameRef.current = requestAnimationFrame(predict);

    } catch (err) {

      alert("Error al iniciar la cámara. Verifica los permisos del navegador.");

      console.error(err);

      setIsCameraActive(false);

      setLoading(false);

    }

  };



  const capturePhoto = () => {

    if (!canvasRef.current || livePredictions.length === 0) return;



    const snapshot = canvasRef.current.toDataURL("image/png");



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

      try {

        webcamRef.current.stop();

      } catch (e) {

        console.error(e);

      }

      webcamRef.current = null;

    }



    setIsCameraActive(false);

    setLivePredictions([]);

  };



  const processImageSrc = async (src: string) => {

    setLoading(true);

    const imgElement = new Image();

    imgElement.crossOrigin = "anonymous";

    imgElement.src = src;



    imgElement.onload = async () => {

      try {

        if (!modelRef.current) {

          modelRef.current = await tmPose.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");

        }



        const { pose, posenetOutput } = await modelRef.current.estimatePose(imgElement);

        const results = await modelRef.current.predict(posenetOutput);



        const size = 320;

        const canvas = document.createElement("canvas");

        canvas.width = size;

        canvas.height = size;

        const ctx = canvas.getContext("2d");



        if (ctx) {

          ctx.drawImage(imgElement, 0, 0, size, size);

          const typedPose = pose as unknown as { keypoints?: unknown };

          if (typedPose && Array.isArray(typedPose.keypoints)) {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any

            const kp = typedPose.keypoints as any;

            tmPose.drawKeypoints(kp, 0.5, ctx);

            tmPose.drawSkeleton(kp, 0.5, ctx);

          }

        }



        const formattedResults: Prediction[] = results.map((r: Prediction) => ({

          className: r.className,

          probability: r.probability,

        }));



        setHistory((prev) => [

          {

            id: Date.now().toString(),

            imageSrc: canvas.toDataURL("image/png"),

            predictions: formattedResults,

          },

          ...prev,

        ]);

      } catch (err) {

        console.error("Error al analizar la imagen:", err);

        alert("No se pudo procesar la imagen seleccionada.");

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

      if (src) {

        processImageSrc(src);

      }

      e.target.value = "";

    };

    reader.readAsDataURL(file);

  };



  const colors = ["#fb923c", "#f43f5e", "#a855f7", "#38bdf8", "#34d399"];



  return (

    <div style={styles.container}>

      <header style={styles.heroHeader}>

        <div style={styles.badgeTop}>⚡ INTELIGENCIA ARTIFICIAL</div>

        <h1 style={styles.heroTitle}>

          Análisis de <span style={{ color: "#b4f461" }}>Postura Corporal</span> 🧍

        </h1>

        <p style={styles.heroSubtitle}>

          Sube una foto o inicia la cámara para evaluar tu postura con una vista más amplia.

        </p>

      </header>



      {isCameraActive && (

        <div style={styles.cameraBox}>

          <div style={styles.videoWrapper}>

            <canvas ref={canvasRef} style={styles.canvasStyle} />

          </div>



          <div style={{ width: "100%", backgroundColor: "#0b0f19", padding: "14px", borderRadius: "12px" }}>

            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#94a3b8", textTransform: "uppercase" }}>Salida:</h4>

            {livePredictions.map((p, i) => {

              const percentage = Math.round(p.probability * 100);

              const color = colors[i % colors.length];

              return (

                <div key={i} style={styles.predictionRow}>

                  <div style={{ ...styles.labelName, color }}>{p.className}</div>

                  <div style={styles.progressBarContainer}>

                    <div

                      style={{

                        ...styles.progressBar,

                        width: `${percentage}%`,

                        backgroundColor: color,

                      }}

                    >

                      {percentage > 15 ? `${percentage}%` : ""}

                    </div>

                  </div>

                </div>

              );

            })}

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



          <button style={styles.webcamBtn} onClick={startCamera}>

            <span style={{ fontSize: "28px" }}>📹</span>

            <span style={{ fontWeight: "600", fontSize: "16px" }}>Iniciar Cámara</span>

            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Modelo de Postura</span>

          </button>

        </div>

      )}



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

                {item.predictions.map((p, idx) => {

                  const percentage = Math.round(p.probability * 100);

                  const color = colors[idx % colors.length];

                  return (

                    <div key={idx} style={{ marginBottom: "10px" }}>

                      <div style={styles.predMeta}>

                        <span style={{ color }}>{p.className}</span>

                        <strong>{percentage}%</strong>

                      </div>

                      <div style={styles.progressBarBg}>

                        <div style={{ ...styles.progressBarFill, width: `${percentage}%`, backgroundColor: color }} />

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

    backgroundColor: "#0f172a",

    backgroundImage: "radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 75%)",

    color: "#f8fafc",

    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  },

  heroHeader: { textAlign: "center", marginBottom: "40px", maxWidth: "800px", margin: "0 auto 40px auto" },

  badgeTop: { fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px" },

  heroTitle: { fontSize: "42px", fontWeight: "800", color: "#ffffff", margin: "0 0 16px 0" },

  heroSubtitle: { fontSize: "15px", color: "#94a3b8", maxWidth: "580px", margin: "0 auto" },

  actionContainer: { display: "flex", gap: "16px", maxWidth: "800px", margin: "0 auto 40px auto", flexWrap: "wrap", justifyContent: "center" },

  uploadCard: { flex: 1, minWidth: "260px", backgroundColor: "rgba(30, 41, 59, 0.75)", border: "2px dashed rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "24px", textAlign: "center", backdropFilter: "blur(16px)" },

  uploadLabel: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer", color: "#e2e8f0" },

  divider: { display: "flex", alignItems: "center", color: "#475569", fontWeight: "bold" },

  webcamBtn: { flex: 1, minWidth: "260px", backgroundColor: "rgba(30, 41, 59, 0.75)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "#e2e8f0", cursor: "pointer", backdropFilter: "blur(16px)" },

  cameraBox: { maxWidth: "460px", margin: "0 auto 40px auto", backgroundColor: "rgba(30, 41, 59, 0.75)", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)", backdropFilter: "blur(16px)", boxSizing: "border-box" },

  videoWrapper: { width: "320px", height: "320px", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.1)", background: "#000", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", boxSizing: "border-box" },

  canvasStyle: { display: "block", width: "260px", height: "260px", objectFit: "cover", borderRadius: "12px", transform: "scale(0.85)", transformOrigin: "center" },

  cameraControls: { display: "flex", gap: "12px", width: "100%", justifyContent: "center" },

  captureBtn: { background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", color: "white", border: "none", padding: "12px 20px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%" },

  closeCamBtn: { backgroundColor: "#334155", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%" },

  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", maxWidth: "900px", margin: "0 auto" },

  card: { backgroundColor: "rgba(30, 41, 59, 0.75)", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", flexDirection: "column", backdropFilter: "blur(16px)" },

  imageContainer: { position: "relative", width: "100%", height: "220px" },

  cardImage: { width: "100%", height: "100%", objectFit: "cover" },

  topBadge: { position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(11, 15, 25, 0.8)", padding: "6px 14px", borderRadius: "9999px", fontSize: "13px", display: "flex", gap: "8px", color: "#fff" },

  cardBody: { padding: "20px" },

  cardTitle: { margin: "0 0 16px 0", fontSize: "14px", color: "#94a3b8", fontWeight: "600" },

  predMeta: { display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" },

  progressBarBg: { height: "8px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "9999px", overflow: "hidden" },

  progressBarFill: { height: "100%", borderRadius: "9999px", transition: "width 0.1s ease-in-out" },

  predictionRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", width: "100%" },

  labelName: { width: "38%", fontWeight: 500, fontSize: "0.9rem", wordBreak: "break-word" },

  progressBarContainer: { width: "58%", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", overflow: "hidden", height: "24px", position: "relative" },

  progressBar: { height: "100%", width: "0%", transition: "width 0.1s ease-in-out", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "8px", boxSizing: "border-box", fontSize: "0.75rem", color: "white", fontWeight: 600 },

};



export default Postura;