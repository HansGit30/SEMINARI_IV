import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LoadedCSV, ExecutionReport } from "../types/dashboard";
import { Panda } from "../page/Panda";
import { Numpy } from "../page/Numpy";
import { Reportes } from "../page/Reportes";
import { appStorage } from "../utils/storage";

function Dashboard(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  // Detecta la pestaña activa según la URL actual
  const getActiveTab = () => {
    if (location.pathname.includes("/numpy")) return "numpy";
    if (location.pathname.includes("/reportes")) return "reporte";
    return "pandas"; // Default
  };

  const activeTab = getActiveTab();

  const [csvFiles, setCsvFiles] = useState<LoadedCSV[]>(() => appStorage.getCsvFiles());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [reports, setReports] = useState<ExecutionReport[]>(() => appStorage.getReports());

  useEffect(() => {
    appStorage.setCsvFiles(csvFiles);
  }, [csvFiles]);

  useEffect(() => {
    appStorage.setReports(reports);
  }, [reports]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: string) => {
    const targetPath =
      tab === "pandas"
        ? "/dashboard/pandas"
        : tab === "numpy"
        ? "/dashboard/numpy"
        : "/dashboard/reportes";
    navigate(targetPath);
    setCsvFiles((prev) => prev.map((f) => ({ ...f, lastOutput: null })));
  };

  const parseCSVText = (rawText: string) => {
    const text = rawText.replace(/^\uFEFF/, "");
    const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
    const delimiter = firstLine.split(";").length > firstLine.split(",").length ? ";" : ",";
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      if (char === '"') {
        if (insideQuotes && nextChar === '"') { currentCell += '"'; i++; }
        else insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        currentRow.push(currentCell.trim()); currentCell = "";
      } else if ((char === "\r" || char === "\n") && !insideQuotes) {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell !== "")) rows.push(currentRow);
        currentRow = []; currentCell = "";
      } else currentCell += char;
    }
    if (currentCell !== "" || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell !== "")) rows.push(currentRow);
    }
    return rows;
  };

  const processCSVFile = (file: File) => {
    if (!file) return;
    const isCsv = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";
    if (!isCsv) {
      window.alert("Solo se permiten archivos CSV.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result ?? "");
      const parsedMatrix = parseCSVText(text);
      if (parsedMatrix.length < 1 || parsedMatrix[0].length < 1) {
        window.alert("No se pudo leer el CSV o está vacío.");
        return;
      }
      const width = parsedMatrix[0].length;
      const normalizedRows = parsedMatrix.slice(1).map((row) =>
        Array.from({ length: width }, (_, i) => row[i] ?? "")
      );
      const newFileEntry: LoadedCSV = {
        id: crypto.randomUUID(),
        fileName: file.name,
        headers: parsedMatrix[0].map((header, index) => header || `columna_${index + 1}`),
        rows: normalizedRows,
        lastOutput: null,
      };
      setCsvFiles((prev) => [newFileEntry, ...prev]);
    };
    reader.onerror = () => window.alert("No se pudo leer el archivo CSV.");
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processCSVFile(files[0]);
    e.target.value = "";
  };

  const addReport = (
    library: "Pandas" | "NumPy",
    action: string,
    result: string,
    fileName: string
  ) => {
    const newReport: ExecutionReport = {
      id: crypto.randomUUID(),
      library,
      action,
      timestamp: new Date().toLocaleTimeString(),
      result,
      fileName,
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const removeFile = (id: string) => {
    setCsvFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div style={styles.mainContent}>
      {/* Pestañas superiores que se iluminan según la URL */}
      <div style={styles.subHeader}>
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === "pandas" ? "#b4f461" : "transparent",
              color: activeTab === "pandas" ? "#0f172a" : "#64748b",
            }}
            onClick={() => handleTabChange("pandas")}
          >
            Librería Pandas
          </button>
          <button
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === "numpy" ? "#b4f461" : "transparent",
              color: activeTab === "numpy" ? "#0f172a" : "#64748b",
            }}
            onClick={() => handleTabChange("numpy")}
          >
            Librería NumPy
          </button>
          <button
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === "reporte" ? "#b4f461" : "transparent",
              color: activeTab === "reporte" ? "#0f172a" : "#64748b",
            }}
            onClick={() => handleTabChange("reporte")}
          >
            Reportes
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {(activeTab === "pandas" || activeTab === "numpy") && (
        <div style={styles.topBarContainer}>
          <button style={styles.addCsvBtn} onClick={() => fileInputRef.current?.click()}>
            + Nuevo archivo CSV
          </button>
          <div
            style={{
              ...styles.dropZone,
              backgroundColor: isDragging ? "#f1f5f9" : "#ffffff",
              borderColor: isDragging ? "#9333ea" : "#cbd5e1",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files[0]) processCSVFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={styles.dropZoneText}>Arrastre o seleccione un nuevo archivo CSV aquí</span>
          </div>
        </div>
      )}

      {/* Renderizado condicional basado en la URL */}
      {activeTab === "pandas" && (
        <Panda
          csvFiles={csvFiles}
          setCsvFiles={setCsvFiles}
          addReport={addReport}
          removeFile={removeFile}
          styles={styles}
        />
      )}
      {activeTab === "numpy" && (
        <Numpy
          csvFiles={csvFiles}
          setCsvFiles={setCsvFiles}
          addReport={addReport}
          removeFile={removeFile}
          styles={styles}
        />
      )}
      {activeTab === "reporte" && <Reportes reports={reports} styles={styles} />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  mainContent: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#fcfcfd",
    color: "#0f172a",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  subHeader: {
    display: "flex",
    alignItems: "center",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    backgroundColor: "#ffffff",
    padding: "6px",
    borderRadius: "9999px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  },
  tabBtn: {
    padding: "10px 24px",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    borderRadius: "9999px",
    transition: "all 0.2s ease",
  },
  topBarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    justifyContent: "space-between",
  },
  addCsvBtn: {
    padding: "12px 24px",
    backgroundColor: "#b4f461",
    color: "#0f172a",
    border: "1px solid #95e03b",
    borderRadius: "9999px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  dropZone: {
    flex: 1,
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "14px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  dropZoneText: {
    color: "#64748b",
    fontWeight: 500,
    fontSize: "14px",
  },
  emptyStateContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "60px",
    textAlign: "center",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  panelContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  fileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileBadge: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    color: "#0f172a",
    padding: "6px 16px",
    borderRadius: "9999px",
    fontSize: "13px",
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fca5a5",
    color: "#ef4444",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tableWrapper: {
    maxHeight: "340px",
    overflow: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#f8fafc",
    color: "#334155",
    padding: "14px 18px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "12px 18px",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
    whiteSpace: "nowrap",
  },
  actionRow: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  actionBtn: {
    padding: "12px 28px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "9999px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  outputBox: {
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    fontFamily: "monospace",
    fontSize: "13px",
  },
};

export default Dashboard;