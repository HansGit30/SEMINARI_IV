export interface ExecutionReport {
  id: string;
  library: "Pandas" | "NumPy";
  action: string;
  timestamp: string;
  result: string;
  fileName: string;
}

export interface LoadedCSV {
  id: string;
  fileName: string;
  headers: string[];
  rows: string[][];
  lastOutput: string | null;
}