import React, { useState, useRef } from "react";
import * as speechCommands from "@tensorflow-models/speech-commands";

const MODEL_URL = `${window.location.origin}/my-audio-model/`;

interface Prediction {
  className: string;
  probability: number;
}

const COLORS = ["#fb923c", "#f43f5e", "#a855f7", "#38bdf8", "#34d399"];

export const Audio: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [topPrediction, setTopPrediction] = useState<Prediction | null>(null);

  const recognizerRef = useRef<ReturnType<typeof speechCommands.create> | null>(null);

  const startListening = async () => {
    try {
      setLoading(true);

      const recognizer = speechCommands.create(
        "BROWSER_FFT",
        undefined,
        MODEL_URL + "model.json",
        MODEL_URL + "metadata.json"
      );

      await recognizer.ensureModelLoaded();
      recognizerRef.current = recognizer;

      const classLabels = recognizer.wordLabels();

      const initialPredictions: Prediction[] = classLabels.map((label: string) => ({
        className: label === "Teeclado" ? "Teclado" : label,
        probability: 0,
      }));
      setPredictions(initialPredictions);

      setLoading(false);
      setIsListening(true);

      const listenFn = recognizer.listen as unknown as (
        callback: (result: { scores: Float32Array | number[] }) => void,
        options: object
      ) => Promise<void>;

      await listenFn.call(
        recognizer,
        (result) => {
          const scores = result.scores;
          const updatedPredictions: Prediction[] = classLabels.map((label: string, idx: number) => ({
            className: label === "Teeclado" ? "Teclado" : label,
            probability: Number(scores[idx]),
          }));

          const sorted = [...updatedPredictions].sort((a, b) => b.probability - a.probability);

          setPredictions(updatedPredictions);
          setTopPrediction(sorted[0]);
        },
        {
          includeSpectrogram: true,
          probabilityThreshold: 0.10, // Umbral optimizado para ver las cantidades inmediatamente
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.50,
        }
      );
    } catch (err) {
      console.error("Error al iniciar el modelo de audio:", err);
      alert("No se pudo acceder al micrófono o cargar el modelo de audio.");
      setLoading(false);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    if (recognizerRef.current) {
      await recognizerRef.current.stopListening();
      recognizerRef.current = null;
    }
    setIsListening(false);
    setTopPrediction(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.heroHeader}>
        <div style={styles.badgeTop}>
          <span style={{ color: "#b4f461" }}>⚡</span> INTELIGENCIA ARTIFICIAL
        </div>
        <h1 style={styles.heroTitle}>
          Clasificación de Audio <br />
          <span style={styles.titleHighlight}>En Tiempo Real</span>
          <span style={styles.iconBox}>🎙️</span>
          <span style={styles.titleGray}>Escucha Activa</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Activa el micrófono para analizar sonidos ambientales o comandos de voz mediante tu modelo de Teachable Machine.
        </p>
      </header>

      <div style={styles.actionContainer}>
        {!isListening ? (
          <button style={styles.webcamBtn} onClick={startListening} disabled={loading}>
            <span style={{ fontSize: "28px" }}>🎙️</span>
            <span style={{ fontWeight: "600", fontSize: "16px" }}>
              {loading ? "Cargando Modelo..." : "Iniciar Micrófono"}
            </span>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Empieza a reconocer sonidos</span>
          </button>
        ) : (
          <button style={styles.stopBtn} onClick={stopListening}>
            <span style={{ fontSize: "28px" }}>🛑</span>
            <span style={{ fontWeight: "600", fontSize: "16px" }}>Detener Micrófono</span>
            <span style={{ fontSize: "13px", color: "#f87171" }}>Escuchando activamente...</span>
          </button>
        )}
      </div>

      {isListening && (
        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <div style={styles.audioActiveIndicator}>
              <span style={styles.pulseDot} />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#b4f461" }}>
                Modelo Escuchando...
              </span>
              {topPrediction && (
                <div style={styles.topBadge}>
                  <span>{topPrediction.className}</span>
                  <strong>{(topPrediction.probability * 100).toFixed(0)}%</strong>
                </div>
              )}
            </div>

            <div style={styles.cardBody}>
              <h4 style={styles.cardTitle}>Probabilidades de Audio</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {predictions.map((p, idx) => {
                  const percentage = (p.probability * 100).toFixed(1);
                  const barColor = COLORS[idx % COLORS.length];
                  return (
                    <div key={idx}>
                      <div style={styles.predMeta}>
                        <span style={{ color: barColor, fontWeight: 500 }}>{p.className}</span>
                        <strong style={{ color: p.probability > 0.3 ? "#b4f461" : "#94a3b8" }}>
                          {percentage}%
                        </strong>
                      </div>
                      <div style={styles.progressBarBg}>
                        <div
                          style={{
                            ...styles.progressBarFill,
                            width: `${percentage}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
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
  titleHighlight: { color: "#ffffff" },
  titleGray: { color: "#64748b" },
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
    justifyContent: "center",
    maxWidth: "400px",
    margin: "0 auto 40px auto",
  },
  webcamBtn: {
    width: "100%",
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
  stopBtn: {
    width: "100%",
    backgroundColor: "#2a1619",
    border: "1px solid #442429",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    color: "#f87171",
    cursor: "pointer",
  },
  gridContainer: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "500px",
    margin: "0 auto",
  },
  card: {
    width: "100%",
    backgroundColor: "#161e2e",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid #243044",
    display: "flex",
    flexDirection: "column",
  },
  audioActiveIndicator: {
    padding: "20px",
    backgroundColor: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "relative",
    borderBottom: "1px solid #243044",
  },
  pulseDot: {
    width: "12px",
    height: "12px",
    backgroundColor: "#b4f461",
    borderRadius: "50%",
    boxShadow: "0 0 8px #b4f461",
  },
  topBadge: {
    marginLeft: "auto",
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
    height: "8px",
    backgroundColor: "#243044",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.1s ease-in-out",
  },
};

export default Audio;