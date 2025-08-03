import React, { useState, useEffect } from "react";
import "../styles/AuditLog.css";
import { fetchAuditLogsWithStoredToken } from "../../../api/AuditLog";

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stany filtrów
  const [tableName, setTableName] = useState("");
  const [operation, setOperation] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Funkcja do ładowania logów
  async function loadLogs() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLogsWithStoredToken({
        table_name: tableName || undefined,
        operation: operation || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setLogs(data);
    } catch (err) {
      setError(err.message || "Błąd podczas pobierania logów");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  // Załaduj logi przy pierwszym renderze i przy zmianie filtrów
  useEffect(() => {
    loadLogs();
  }, [tableName, operation, sortBy, sortOrder]);

  return (
    <div className="audit-log-container">
      <h1 className="audit-log-title">Dziennik zdarzeń</h1>

      {/* --- Filtry --- */}
      <div className="audit-log-filters">
        <label className="audit-log-label">
          Tabela:
          <select
            className="audit-log-select"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="wastes">Wastes</option>
            <option value="waste_records">Waste Records</option>
            <option value="vehicles">Vehicles</option>
            <option value="users">Users</option>
            <option value="drivers">Drivers</option>
            <option value="destinations">Destinations</option>
            <option value="contractors">Contractors</option>
          </select>
        </label>

        <label className="audit-log-label">
          Operacja:
          <select
            className="audit-log-select"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </label>

        <label className="audit-log-label">
          Sortuj według:
          <select
            className="audit-log-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Data</option>
            <option value="table_name">Tabela</option>
            <option value="operation">Operacja</option>
          </select>
        </label>

        <label className="audit-log-label">
          Kolejność:
          <select
            className="audit-log-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Rosnąco</option>
            <option value="desc">Malejąco</option>
          </select>
        </label>
      </div>

      {/* --- Status ładowania lub błąd --- */}
      {loading && <p className="loading">Wczytywanie dziennika zdarzeń...</p>}
      {error && <p className="error">{error}</p>}

      {/* --- Lista zdarzeń lub komunikat o braku logów --- */}
      {!loading && !error && (
        logs && logs.length > 0 ? (
          <div className="audit-log-list">
            {logs.map((log) => (
              <details key={log.id} className="audit-log-entry">
                <summary className="audit-log-summary" data-operation={log.operation}>
                  [{log.operation.toUpperCase()}] {log.table_name} | ID: {log.record_id} | User:{" "}
                  {log.user?.username || "Unknown"} | {new Date(log.created_at).toLocaleString()}
                </summary>
                <div className="audit-log-details">
                  <h4>Stare dane:</h4>
                  <pre>{log.old_data ? JSON.stringify(log.old_data, null, 2) : "Brak danych"}</pre>

                  <h4>Nowe dane:</h4>
                  <pre>{log.new_data ? JSON.stringify(log.new_data, null, 2) : "Brak danych"}</pre>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p>Brak logów spełniających kryteria.</p>
        )
      )}
    </div>
  );
}

export default AuditLog;
