import React from "react";
import type { LoadedCSV } from "../types/dashboard";

interface NumpyOutputData {
  type: "stats" | "array";
  statsData?: {
    colName: string;
    mean: string;
    std: string;
    min: string;
    max: string;
    var: string;
    totalElements: number;
  };
  arrayData?: {
    shape: string;
    dimensions: number;
    dtype: string;
    matrixPreview: string[][];
  };
}

interface Props {
  csvFiles: LoadedCSV[];
  setCsvFiles: React.Dispatch<React.SetStateAction<LoadedCSV[]>>;
  addReport: (library: "Pandas" | "NumPy", action: string, result: string, fileName: string) => void;
  removeFile: (id: string) => void;
  styles: Record<string, React.CSSProperties>;
}

export const Numpy: React.FC<Props> = ({ csvFiles, setCsvFiles, addReport, removeFile, styles }) => {
  const updateFileOutput = (fileId: string, output: string) => {
    setCsvFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, lastOutput: output } : f)));
  };

  // Función 1: Operaciones estadísticas matriciales (np.mean, np.std, np.var, etc.)
  const runNumpyStats = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    // Localizar primera columna numérica adecuada
    let colIdx = target.headers.findIndex((_, i) => !isNaN(Number(target.rows[0]?.[i])) && target.rows[0]?.[i] !== "");
    if (colIdx === -1) colIdx = 0;

    const colName = target.headers[colIdx] || "Columna 1";
    const values = target.rows.map((r) => Number(r[colIdx])).filter((v) => !isNaN(v));

    if (values.length === 0) return;

    const meanVal = values.reduce((a, b) => a + b, 0) / values.length;
    const varianceVal = values.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / values.length;
    const stdVal = Math.sqrt(varianceVal);

    const payload: NumpyOutputData = {
      type: "stats",
      statsData: {
        colName,
        mean: meanVal.toFixed(2),
        std: stdVal.toFixed(2),
        min: Math.min(...values).toString(),
        max: Math.max(...values).toString(),
        var: varianceVal.toFixed(2),
        totalElements: values.length,
      },
    };

    const strOutput = JSON.stringify(payload);
    updateFileOutput(fileId, strOutput);
    addReport("NumPy", "Cálculo Estadístico (np.mean / np.std)", `Columna: ${colName}, Media: ${meanVal.toFixed(2)}`, target.fileName);
  };

  // Función 2: Conversión y análisis estructural (np.array / ndarray.shape)
  const runNumpyArray = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    const previewMatrix = target.rows.slice(0, 5);

    const payload: NumpyOutputData = {
      type: "array",
      arrayData: {
        shape: `(${target.rows.length}, ${target.headers.length})`,
        dimensions: 2,
        dtype: "float64 / object",
        matrixPreview: previewMatrix,
      },
    };

    const strOutput = JSON.stringify(payload);
    updateFileOutput(fileId, strOutput);
    addReport("NumPy", "Conversión a Matriz (np.array)", `Shape: (${target.rows.length}, ${target.headers.length})`, target.fileName);
  };

  const renderOutput = (rawOutput: string) => {
    try {
      const data: NumpyOutputData = JSON.parse(rawOutput);

      if (data.type === "stats" && data.statsData) {
        const { colName, mean, std, min, max, var: variance, totalElements } = data.statsData;
        return (
          <div style={customStyles.outputContainer}>
            <h4 style={customStyles.outputTitle}>⚡ Análisis Vectorial — numpy.mean() / numpy.std()</h4>
            <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px" }}>
              Variable evaluada: <strong>{colName}</strong> ({totalElements} valores procesados)
            </p>
            <div style={customStyles.gridCards}>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Media (np.mean)</span>
                <strong style={{ ...customStyles.cardValue, color: "#2563eb" }}>{mean}</strong>
              </div>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Desv. Estándar (np.std)</span>
                <strong style={{ ...customStyles.cardValue, color: "#9333ea" }}>{std}</strong>
              </div>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Varianza (np.var)</span>
                <strong style={customStyles.cardValue}>{variance}</strong>
              </div>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Rango (Min / Max)</span>
                <strong style={customStyles.cardValue}>{min} — {max}</strong>
              </div>
            </div>
          </div>
        );
      }

      if (data.type === "array" && data.arrayData) {
        const { shape, dimensions, dtype, matrixPreview } = data.arrayData;
        return (
          <div style={customStyles.outputContainer}>
            <h4 style={customStyles.outputTitle}>📐 Matriz n-dimensional — numpy.ndarray</h4>
            <div style={{ ...customStyles.gridCards, marginBottom: "16px" }}>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Dimensión (ndarray.shape)</span>
                <strong style={customStyles.cardValue}>{shape}</strong>
              </div>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Ejes (ndarray.ndim)</span>
                <strong style={customStyles.cardValue}>{dimensions}D</strong>
              </div>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Tipo de Dato (dtype)</span>
                <span style={customStyles.badgeNum}>{dtype}</span>
              </div>
            </div>

            <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>
              Vista previa de la Matriz NumPy:
            </span>
            <div style={customStyles.matrixBox}>
              <pre style={{ margin: 0, fontFamily: "monospace", color: "#0f172a", fontSize: "13px" }}>
                array([{"\n"}
                {matrixPreview.map((row) => `  [${row.slice(0, 5).join(", ")}...]`).join(",\n")}
                {"\n"}])
              </pre>
            </div>
          </div>
        );
      }
    } catch {
      return <pre style={{ margin: 0 }}>{rawOutput}</pre>;
    }
  };

  if (csvFiles.length === 0) {
    return (
      <div style={styles.emptyStateContainer}>
        No hay archivos cargados. Haz clic en <strong>"+ Nuevo archivo CSV"</strong> o arrastra un archivo.
      </div>
    );
  }

  return (
    <>
      {csvFiles.map((file) => (
        <div key={file.id} style={styles.panelContainer}>
          <div style={styles.fileHeader}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Librería NumPy</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={styles.fileBadge}>📄 {file.fileName}</span>
              <button style={styles.deleteBtn} onClick={() => removeFile(file.id)} title="Eliminar">✕</button>
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>{file.headers.map((h, i) => <th key={i} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {file.rows.slice(0, 5).map((row, rIdx) => (
                  <tr key={rIdx}>
                    {file.headers.map((_, cIdx) => (
                      <td key={cIdx} style={styles.td}>{row[cIdx] ?? ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.actionRow}>
            <button style={styles.actionBtn} onClick={() => runNumpyStats(file.id)}>
              Calcular Estadísticas (np.mean / np.std)
            </button>
            <button style={styles.actionBtn} onClick={() => runNumpyArray(file.id)}>
              Convertir a Matriz (np.array)
            </button>
          </div>

          {file.lastOutput && renderOutput(file.lastOutput)}
        </div>
      ))}
    </>
  );
};

const customStyles: Record<string, React.CSSProperties> = {
  outputContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #e2e8f0",
  },
  outputTitle: {
    margin: "0 0 16px 0",
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
  },
  gridCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: "16px",
    color: "#0f172a",
    fontWeight: "700",
  },
  badgeNum: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "600",
    width: "fit-content",
  },
  matrixBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "16px",
    overflowX: "auto",
  },
};