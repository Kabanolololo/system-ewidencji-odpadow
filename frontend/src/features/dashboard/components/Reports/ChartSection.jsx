import React from "react";

export default function ChartSection({ title, year, children }) {
  return (
    <section className="card">
      <h2>{title} (rok {year})</h2>
      <div className="chart-placeholder">{children}</div>
    </section>
  );
}
