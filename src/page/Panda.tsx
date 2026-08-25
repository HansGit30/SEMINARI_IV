import React from "react";
import type { LoadedCSV } from "../types/dashboard";

interface OutputData {
  type: "describe" | "info";
  describeData?: {
    filas: number;
    columnas: number;
    columnaNumerica: string | null;
    promedio: string;
    min: string;
    max: string;
    conteoValidos: number;
  };
  infoData?: {
    totalFilas: number;
    totalColumnas: number;
    columnas: { nombre: string; tipo: string; nulos: number }[];
  };
}

interface Props {
  csvFiles: LoadedCSV[];
  setCsvFiles: React.Dispatch<React.SetStateAction<LoadedCSV[]>>;
  addReport: (library: "Pandas" | "NumPy", action: string, result: string, fileName: string) => void;
  removeFile: (id: string) => void;
  styles: Record<string, React.CSSProperties>;
}

export const Panda: React.FC<Props> = ({ csvFiles, setCsvFiles, addReport, removeFile, styles }) => {
  const updateFileOutput = (fileId: string, output: string) => {
    setCsvFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, lastOutput: output } : f)));
  };

  // Función 1: .describe() - Resumen estadístico intuitivo
  const runPandasDescribe = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    // Buscar primera columna numérica
    let colIdx = target.headers.findIndex((_, i) => !isNaN(Number(target.rows[0]?.[i])) && target.rows[0]?.[i] !== "");
    let stats = { promedio: "N/A", min: "N/A", max: "N/A", conteo: 0, colName: null as string | null };

    if (colIdx !== -1) {
      const values = target.rows.map((r) => Number(r[colIdx])).filter((v) => !isNaN(v));
      if (values.length > 0) {
        stats.colName = target.headers[colIdx];
        stats.promedio = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
        stats.min = Math.min(...values).toString();
        stats.max = Math.max(...values).toString();
        stats.conteo = values.length;
      }
    }

    const payload: OutputData = {
      type: "describe",
      describeData: {
        filas: target.rows.length,
        columnas: target.headers.length,
        columnaNumerica: stats.colName,
        promedio: stats.promedio,
        min: stats.min,
        max: stats.max,
        conteoValidos: stats.conteo,
      },
    };

    const strOutput = JSON.stringify(payload);
    updateFileOutput(fileId, strOutput);
    addReport("Pandas", "Resumen Estadístico (.describe)", `Filas: ${target.rows.length}, Cols: ${target.headers.length}`, target.fileName);
  };

  // Función 2: .info() - Inspección de estructura y tipos de datos
  const runPandasInfo = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    const colsInfo = target.headers.map((h, idx) => {
      const sample = target.rows[0]?.[idx] ?? "";
      const isNum = !isNaN(Number(sample)) && sample !== "";
      const nulos = target.rows.filter((r) => !r[idx] || r[idx].trim() === "").length;
      return {
        nombre: h,
        tipo: isNum ? "float64 / int64" : "object (string)",
        nulos,
      };
    });

    const payload: OutputData = {
      type: "info",
      infoData: {
        totalFilas: target.rows.length,
        totalColumnas: target.headers.length,
        columnas: colsInfo,
      },
    };

    const strOutput = JSON.stringify(payload);
    updateFileOutput(fileId, strOutput);
    addReport("Pandas", "Estructura del DataFrame (.info)", `${target.headers.length} columnas analizadas`, target.fileName);
  };

  const renderOutput = (rawOutput: string) => {
    try {
      const data: OutputData = JSON.parse(rawOutput);

      if (data.type === "describe" && data.describeData) {
        const { filas, columnas, columnaNumerica, promedio, min, max, conteoValidos } = data.describeData;
        return (
          <div style={customStyles.outputContainer}>
            <h4 style={customStyles.outputTitle}>📊 Resumen Estadístico — pandas.DataFrame.describe()</h4>
            <div style={customStyles.gridCards}>
              <div style={customStyles.card}>
                <span style={customStyles.cardLabel}>Dimensiones</span>
                <strong style={customStyles.cardValue}>{filas} filas × {columnas} cols</strong>
              </div>
              {columnaNumerica && (
                <>
                  <div style={customStyles.card}>
                    <span style={customStyles.cardLabel}>Columna Analizada</span>
                    <strong style={customStyles.cardValue}>{columnaNumerica}</strong>
                  </div>
                  <div style={customStyles.card}>
                    <span style={customStyles.cardLabel}>Promedio (Mean)</span>
                    <strong style={{ ...customStyles.cardValue, color: "#16a34a" }}>{promedio}</strong>
                  </div>
                  <div style={customStyles.card}>
                    <span style={customStyles.cardLabel}>Rango (Min / Max)</span>
                    <strong style={customStyles.cardValue}>{min} — {max}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }

      if (data.type === "info" && data.infoData) {
        const { totalFilas, totalColumnas, columnas } = data.infoData;
        return (
          <div style={customStyles.outputContainer}>
            <h4 style={customStyles.outputTitle}>ℹ️ Información del DataFrame — pandas.DataFrame.info()</h4>
            <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px" }}>
              Total de registros: <strong>{totalFilas}</strong> | Total de columnas: <strong>{totalColumnas}</strong>
            </p>
            <div style={{ ...styles.tableWrapper, maxHeight: "220px" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Columna</th>
                    <th style={styles.th}>Valores No Nulos</th>
                    <th style={styles.th}>Tipo de Dato (Dtype)</th>
                  </tr>
                </thead>
                <tbody>
                  {columnas.map((col, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{idx + 1}</td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>{col.nombre}</td>
                      <td style={styles.td}>{totalFilas - col.nulos} non-null</td>
                      <td style={styles.td}>
                        <span style={col.tipo.includes("float") ? customStyles.badgeNum : customStyles.badgeText}>
                          {col.tipo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Librería Pandas</h2>
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
            <button style={styles.actionBtn} onClick={() => runPandasDescribe(file.id)}>
              Ejecutar Resumen (.describe)
            </button>
            <button style={styles.actionBtn} onClick={() => runPandasInfo(file.id)}>
              Inspeccionar Estructura (.info)
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
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "2px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "600",
  },
  badgeText: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "2px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "600",
  },
};