import React, { useState, useRef } from "react";

interface ExecutionReport {
  id: string;
  library: "Pandas" | "NumPy";
  action: string;
  timestamp: string;
  result: string;
  fileName: string;
}

interface LoadedCSV {
  id: string;
  fileName: string;
  headers: string[];
  rows: string[][];
  lastOutput: string | null;
}

function Dashboard(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>("pandas");
  const [csvFiles, setCsvFiles] = useState<LoadedCSV[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reports, setReports] = useState<ExecutionReport[]>([]);

  // Limpiar salida al cambiar de pestaña
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCsvFiles((prev) => prev.map((f) => ({ ...f, lastOutput: null })));
  };

  // Parseo manual robusto para CSV
  const parseCSVText = (text: string) => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }

    if (currentCell !== "" || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell !== "")) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  const processCSVFile = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsedMatrix = parseCSVText(text);
        if (parsedMatrix.length > 0) {
          const headers = parsedMatrix[0];
          const rows = parsedMatrix.slice(1);
          
          const newFileEntry: LoadedCSV = {
            id: Math.random().toString(36).substring(2, 9),
            fileName: file.name,
            headers,
            rows,
            lastOutput: null,
          };

          // Agrega el nuevo archivo a la lista sin sobrescribir los anteriores
          setCsvFiles((prev) => [newFileEntry, ...prev]);
        }
      }
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processCSVFile(files[0]);
    }
    // Limpia el input para permitir volver a cargar el mismo archivo si fuese necesario
    e.target.value = "";
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processCSVFile(files[0]);
    }
  };

  const removeFile = (id: string) => {
    setCsvFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // --- Operaciones Pandas ---
  const runPandasDescribe = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    const numRows = target.rows.length;
    const numCols = target.headers.length;
    const output = `DataFrame Shape: (${numRows}, ${numCols})\nColumnas: ${target.headers.join(", ")}`;

    updateFileOutput(fileId, output);
    addReport("Pandas", "Resumen del DataFrame (.describe)", output, target.fileName);
  };

  const runPandasHead = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    const preview = target.rows.slice(0, 5).map((r) => r.join(" | ")).join("\n");
    const output = `Primeros 5 registros (.head):\n${preview}`;

    updateFileOutput(fileId, output);
    addReport("Pandas", "Vista previa de datos (.head)", output, target.fileName);
  };

  // --- Operaciones NumPy ---
  const runNumpyStats = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    let colIdx = -1;
    for (let i = 0; i < target.headers.length; i++) {
      if (!isNaN(Number(target.rows[0]?.[i])) && target.rows[0]?.[i] !== "") {
        colIdx = i;
        break;
      }
    }

    if (colIdx === -1) {
      const msg = "No se encontraron columnas numéricas válidas para calcular en NumPy.";
      updateFileOutput(fileId, msg);
      return;
    }

    const values = target.rows.map((r) => Number(r[colIdx])).filter((val) => !isNaN(val));
    const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const output = `Análisis NumPy para '${target.headers[colIdx]}':\n- Promedio (np.mean): ${mean}\n- Máximo (np.max): ${max}\n- Mínimo (np.min): ${min}`;
    updateFileOutput(fileId, output);
    addReport("NumPy", "Cálculos Estadísticos (mean/max/min)", output, target.fileName);
  };

  const runNumpyArray = (fileId: string) => {
    const target = csvFiles.find((f) => f.id === fileId);
    if (!target) return;

    const totalElements = target.rows.length * target.headers.length;
    const output = `Array NumPy cargado.\nDimensiones: [${target.rows.length}, ${target.headers.length}]\nTotal elementos: ${totalElements}`;

    updateFileOutput(fileId, output);
    addReport("NumPy", "Estructura de Array (ndarray)", output, target.fileName);
  };

  const updateFileOutput = (fileId: string, output: string) => {
    setCsvFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, lastOutput: output } : f))
    );
  };

  const addReport = (library: "Pandas" | "NumPy", action: string, result: string, fileName: string) => {
    const newReport: ExecutionReport = {
      id: Math.random().toString(36).substring(2, 9),
      library,
      action,
      timestamp: new Date().toLocaleTimeString(),
      result,
      fileName,
    };
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <div style={styles.dashboardLayout}>
      {/* Sidebar / Menú Lateral */}
      <aside style={styles.sidebar}>
        <div style={styles.brand} onClick={() => handleTabChange("home")}>
          <span style={styles.brandIcon}>🐍</span>
          <span style={styles.brandName}>DASHBOARD</span>
        </div>

        <nav style={styles.sideNav}>
          <button
            style={{ ...styles.navBtn, ...(activeTab === "pandas" ? styles.navBtnActive : {}) }}
            onClick={() => handleTabChange("pandas")}
          >
            Librería Pandas
          </button>

          <button
            style={{ ...styles.navBtn, ...(activeTab === "numpy" ? styles.navBtnActive : {}) }}
            onClick={() => handleTabChange("numpy")}
          >
            Librería NumPy
          </button>

          <button
            style={{ ...styles.navBtn, ...(activeTab === "reporte" ? styles.navBtnActive : {}) }}
            onClick={() => handleTabChange("reporte")}
          >
            Reportes
          </button>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main style={styles.mainContent}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {(activeTab === "pandas" || activeTab === "numpy") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            {/* Cabecera con botón de Nuevo Archivo y Zona Drag&Drop */}
            <div style={styles.topBarContainer}>
              <button style={styles.addCsvBtn} onClick={() => fileInputRef.current?.click()}>
                + Nuevo archivo CSV
              </button>

              <div
                style={{
                  ...styles.dropZone,
                  backgroundColor: isDragging ? "#e0f2fe" : "#ffffff",
                  borderColor: isDragging ? "#0284c7" : "#38bdf8",
                }}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span style={styles.dropZoneText}>Arrastre o seleccione un nuevo archivo CSV aquí</span>
              </div>
            </div>

            {/* Listado de archivos cargados (estilo bloques apilados) */}
            {csvFiles.length === 0 ? (
              <div style={styles.emptyStateContainer}>
                No hay archivos cargados. Haz clic en <strong>"+ Nuevo archivo CSV"</strong> o arrastra un archivo.
              </div>
            ) : (
              csvFiles.map((file) => (
                <div key={file.id} style={styles.panelContainer}>
                  <div style={styles.fileHeader}>
                    <h2>{activeTab === "pandas" ? "Librería Pandas" : "Librería NumPy"}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={styles.fileBadge}>📄 {file.fileName}</span>
                      <button style={styles.deleteBtn} onClick={() => removeFile(file.id)} title="Eliminar este archivo">
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Tabla de Datos */}
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          {file.headers.map((h, i) => (
                            <th key={i} style={styles.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {file.rows.slice(0, 10).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {file.headers.map((_, cIdx) => (
                              <td key={cIdx} style={styles.td}>
                                {row[cIdx] !== undefined ? row[cIdx] : ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Botones de Operaciones Específicos por Archivo */}
                  {activeTab === "pandas" && (
                    <div style={styles.actionRow}>
                      <button style={styles.actionBtn} onClick={() => runPandasDescribe(file.id)}>
                        Ejecutar Resumen (.describe)
                      </button>
                      <button style={styles.actionBtn} onClick={() => runPandasHead(file.id)}>
                        Ejecutar Vista Previa (.head)
                      </button>
                    </div>
                  )}

                  {activeTab === "numpy" && (
                    <div style={styles.actionRow}>
                      <button style={styles.actionBtn} onClick={() => runNumpyStats(file.id)}>
                        Calcular Estadísticas (NumPy)
                      </button>
                      <button style={styles.actionBtn} onClick={() => runNumpyArray(file.id)}>
                        Convertir a Array (NumPy)
                      </button>
                    </div>
                  )}

                  {/* Salida de Resultados de este Archivo */}
                  {file.lastOutput && (
                    <div style={styles.outputBox}>
                      <strong>Resultado ({file.fileName}):</strong>
                      <pre style={{ margin: "5px 0 0 0" }}>{file.lastOutput}</pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Vista de Reportes */}
        {activeTab === "reporte" && (
          <div style={styles.panelContainer}>
            <h2>Reporte de Ejercicios Ejecutados</h2>
            {reports.length === 0 ? (
              <p style={{ color: "#64748b" }}>Sin ejecuciones registradas.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {reports.map((rep) => (
                  <div key={rep.id} style={styles.reportCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: rep.library === "Pandas" ? "#047857" : "#6d28d9", fontSize: "15px" }}>
                        [{rep.library}] {rep.action} — <span style={{ color: "#0284c7" }}>{rep.fileName}</span>
                      </strong>
                      <small style={{ color: "#64748b" }}>{rep.timestamp}</small>
                    </div>
                    <pre style={styles.reportResult}>{rep.result}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Estilos 
const styles: { [key: string]: React.CSSProperties } = {
  dashboardLayout: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0d0b1a",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#16103a",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    borderRight: "1px solid rgba(168, 85, 247, 0.2)",
  },
  brand: {
    padding: "24px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    borderBottom: "1px solid rgba(168, 85, 247, 0.15)",
  },
  brandIcon: { fontSize: "24px" },
  brandName: { color: "#ffffff", letterSpacing: "1px" },
  sideNav: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "15px", padding: "0 10px" },
  navBtn: {
    padding: "14px 16px",
    textAlign: "left",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 500,
    borderRadius: "10px",
    transition: "all 0.2s ease",
  },
  navBtnActive: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    color: "#c084fc",
    fontWeight: "bold",
    borderLeft: "4px solid #9333ea",
  },
  mainContent: { flex: 1, padding: "30px", backgroundColor: "#0b0817" },
  topBarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    justifyContent: "space-between",
  },
  addCsvBtn: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
    border: "none",
    color: "#ffffff",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(147, 51, 234, 0.3)",
    whiteSpace: "nowrap",
  },
  dropZone: {
    flex: 1,
    border: "2px dashed rgba(168, 85, 247, 0.4)",
    borderRadius: "10px",
    padding: "12px 20px",
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
    backgroundColor: "#16103a",
    transition: "all 0.2s ease",
  },
  dropZoneText: { color: "#c084fc", fontWeight: 500, fontSize: "14px" },
  emptyStateContainer: {
    backgroundColor: "#16103a",
    borderRadius: "16px",
    padding: "60px",
    textAlign: "center",
    color: "#94a3b8",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  panelContainer: {
    backgroundColor: "#16103a",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid rgba(168, 85, 247, 0.25)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileBadge: {
    backgroundColor: "#110d2b",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    color: "#38bdf8",
    padding: "6px 14px",
    borderRadius: "8px",
    fontWeight: 500,
    fontSize: "13px",
  },
  deleteBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#f87171",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tableWrapper: {
    maxHeight: "300px",
    overflowX: "auto",
    overflowY: "auto",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    borderRadius: "10px",
    backgroundColor: "#110d2b",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#1e1b4b",
    color: "#c084fc",
    padding: "12px 14px",
    fontWeight: "bold",
    borderBottom: "1px solid rgba(168, 85, 247, 0.3)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(168, 85, 247, 0.1)",
    color: "#f8fafc",
    whiteSpace: "nowrap",
  },
  actionRow: { display: "flex", gap: "15px", justifyContent: "center" },
  actionBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(147, 51, 234, 0.3)",
  },
  outputBox: {
    backgroundColor: "#110d2b",
    color: "#38bdf8",
    padding: "15px",
    borderRadius: "10px",
    fontFamily: "monospace",
    border: "1px solid rgba(56, 189, 248, 0.2)",
  },
  reportCard: { 
    border: "1px solid rgba(168, 85, 247, 0.2)", 
    padding: "16px", 
    borderRadius: "10px", 
    backgroundColor: "#110d2b" 
  },
  reportResult: {
    backgroundColor: "#0b0817",
    color: "#38bdf8",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
    margin: 0,
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    fontSize: "13px",
    border: "1px solid rgba(168, 85, 247, 0.15)",
  },
};

export default Dashboard;