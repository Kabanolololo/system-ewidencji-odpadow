import React, { useState } from "react";
import "../styles/AuditLog.css";

const sampleLogs = [
  {
    id: 1,
    user_id: 2,
    table_name: "users",
    record_id: 15,
    operation: "update",
    old_data: { name: "Jan", email: "jan@example.com" },
    new_data: { name: "Jan Nowak", email: "jan.nowak@example.com" },
    created_at: "2025-07-30T14:23:21.666Z"
  },
  {
    id: 2,
    user_id: 1,
    table_name: "vehicles",
    record_id: 8,
    operation: "delete",
    old_data: { plate: "ABC123" },
    new_data: {},
    created_at: "2025-07-30T15:00:00.000Z"
  }
];

function AuditLog() {
  const [logs] = useState(sampleLogs);

  return (
    <div className="audit-log-container">
      <h1 className="audit-log-title">Dziennik zdarzeń</h1>

      {/* --- Filtry --- */}
      <div className="audit-log-filters">
        <select className="audit-log-select">
          <option value="">Tabela</option>
          <option value="users">Users</option>
          <option value="vehicles">Vehicles</option>
          <option value="drivers">Drivers</option>
        </select>

        <select className="audit-log-select">
          <option value="">Operacja</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>

        <select className="audit-log-select">
          <option value="created_at">Sortuj po dacie</option>
          <option value="table_name">Tabela</option>
          <option value="operation">Operacja</option>
        </select>

        <select className="audit-log-select">
          <option value="asc">Rosnąco</option>
          <option value="desc">Malejąco</option>
        </select>
      </div>

      {/* --- Lista zdarzeń --- */}
      <div className="audit-log-list">
        {logs.map((log) => (
          <details key={log.id} className="audit-log-entry">
            <summary className="audit-log-summary" data-operation={log.operation}>
              [{log.operation.toUpperCase()}] {log.table_name} | ID: {log.record_id} | User: {log.user_id} |{" "}
              {new Date(log.created_at).toLocaleString()}
            </summary>
            <div className="audit-log-details">
              <h4>Stare dane:</h4>
              <pre>{JSON.stringify(log.old_data, null, 2)}</pre>

              <h4>Nowe dane:</h4>
              <pre>{JSON.stringify(log.new_data, null, 2)}</pre>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default AuditLog;
