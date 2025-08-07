import React from "react";

export default function YearSelector({ label, value, years, onChange }) {
  return (
    <div className="filter-row">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(Number(e.target.value))}>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
