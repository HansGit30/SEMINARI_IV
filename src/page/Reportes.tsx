import React from "react";
import type { ExecutionReport } from "../types/dashboard";

interface Props {
  reports: ExecutionReport[];
  styles: Record<string, React.CSSProperties>;
}

export const ReportesPage: React.FC<Props> = ({ reports, styles }) => {
  // Función para descargar un solo reporte en CSV
  const downloadSingleCSV = (report: ExecutionReport) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `ID,Libreria,Accion,Archivo,Hora,Resultado\n` +
      `"${report.id}","${report.library}","${report.action}","${report.fileName}","${report.timestamp}","${report.result.replace(/"/g, '""')}"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_${report.library.toLowerCase()}_${report.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para descargar todo el historial en CSV
  const downloadAllCSV = () => {
    if (reports.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,ID,Libreria,Accion,Archivo,Hora,Resultado\n";

    reports.forEach((r) => {
      csvContent += `"${r.id}","${r.library}","${r.action}","${r.fileName}","${r.timestamp}","${r.result.replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historial_reportes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Extraer números del string de resultado para simular el gráfico de datos
  const extractNumbers = (text: string) => {
    const matches = text.match(/-?\d+(\.\d+)?/g);
    if (!matches) return [40, 70, 30, 90, 60]; // Valores por defecto visuales si no hay métricas numéricas
    return matches.map(Number).slice(0, 5);
  };

  if (reports.length === 0) {
    return (
      <div style={styles.emptyStateContainer}>
        No hay registros de ejecuciones. Realiza operaciones en <strong>Pandas</strong> o <strong>NumPy</strong> para ver el historial aquí.
      </div>
    );
  }

  // Contadores para el resumen
  const pandasCount = reports.filter((r) => r.library === "Pandas").length;
  const numpyCount = reports.filter((r) => r.library === "NumPy").length;

  return (
    <div style={styles.panelContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Reporte de Ejercicios Ejecutados
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
            Total de operaciones: <strong>{reports.length}</strong> ({pandasCount} Pandas, {numpyCount} NumPy)
          </p>
        </div>
        <button style={customStyles.downloadAllBtn} onClick={downloadAllCSV}>
          📥 Descargar Historial CSV
        </button>
      </div>

      <div style={customStyles.listContainer}>
        {reports.map((item) => {
          const isPandas = item.library === "Pandas";
          const dataValues = extractNumbers(item.result);
          const maxVal = Math.max(...dataValues, 1);

          return (
            <div key={item.id} style={customStyles.reportItem}>
              <div style={customStyles.headerRow}>
                <div style={customStyles.titleGroup}>
                  <span style={isPandas ? customStyles.pandasTag : customStyles.numpyTag}>
                    [{item.library}]
                  </span>
                  <span style={customStyles.actionTitle}>{item.action}</span>
                  <span style={customStyles.fileName}>— {item.fileName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={customStyles.timestamp}>{item.timestamp}</span>
                  <button
                    style={customStyles.downloadSingleBtn}
                    onClick={() => downloadSingleCSV(item)}
                    title="Descargar este registro en CSV"
                  >
                    📥 CSV
                  </button>
                </div>
              </div>

              <div style={customStyles.resultText}>{item.result}</div>

              {/* Renderizado de Gráfico Integrado para cada Respuesta */}
              <div style={customStyles.chartBox}>
                <span style={customStyles.chartLabel}>Visualización Gráfica de Métricas:</span>
                <div style={customStyles.barsWrapper}>
                  {dataValues.map((val, idx) => {
                    const heightPercent = Math.min(Math.max((Math.abs(val) / maxVal) * 100, 20), 100);
                    return (
                      <div key={idx} style={customStyles.barItem}>
                        <div style={customStyles.barTrack}>
                          <div
                            style={{
                              ...customStyles.barFill,
                              height: `${heightPercent}%`,
                              backgroundColor: isPandas ? "#16a34a" : "#2563eb",
                            }}
                          />
                        </div>
                        <span style={customStyles.barValue}>{val}</span>
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

const customStyles: Record<string, React.CSSProperties> = {
  downloadAllBtn: {
    padding: "10px 20px",
    backgroundColor: "#b4f461",
    color: "#0f172a",
    border: "1px solid #95e03b",
    borderRadius: "9999px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "16px",
  },
  reportItem: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  pandasTag: {
    color: "#16a34a",
    fontWeight: "800",
    fontSize: "15px",
  },
  numpyTag: {
    color: "#9333ea",
    fontWeight: "800",
    fontSize: "15px",
  },
  actionTitle: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "15px",
  },
  fileName: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: "14px",
  },
  timestamp: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "500",
  },
  downloadSingleBtn: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  resultText: {
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
  },
  chartBox: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "12px 16px",
    border: "1px solid #f1f5f9",
  },
  chartLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    display: "block",
    marginBottom: "8px",
  },
  barsWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "16px",
    height: "60px",
  },
  barItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    height: "100%",
  },
  barTrack: {
    width: "16px",
    flex: 1,
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.4s ease",
  },
  barValue: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "600",
  },
};