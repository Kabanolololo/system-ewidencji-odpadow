import React from "react";

export default function MonthRangeSelector({ months, startMonth, endMonth, onStartChange, onEndChange }) {
  return (
    <div className="filter-row">
      <label>Zakres miesięcy:</label>
      <select value={startMonth} onChange={e => onStartChange(e.target.value)}>
        {months.map(m => (
          <option key={m.key} value={m.key}>{m.label}</option>
        ))}
      </select>

      <select value={endMonth} onChange={e => onEndChange(e.target.value)}>
        {months.map(m => (
          <option key={m.key} value={m.key}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}
