import React, { useState, useEffect } from "react";
import '../styles/Reports.css';

function Reports() {
  // === Filtry ===
  const [year, setYear] = useState(new Date().getFullYear());
  const [wasteType, setWasteType] = useState("");
  const [contractor, setContractor] = useState("");

  const years = [2023, 2024, 2025];
  const wasteTypes = ["Papier", "Plastik", "Szkło"];
  const contractors = ["Firma X", "Firma Y"];

  // === Dane ===
  const [chartData, setChartData] = useState([]);
  const [pickupsData, setPickupsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [avgPriceData, setAvgPriceData] = useState([]);
  const [topWasteData, setTopWasteData] = useState([]);
  const [topContractorsData, setTopContractorsData] = useState([]);

  useEffect(() => {
    // Symulacja ładowania z API
    // TODO: Zastąp `fetchXYZ` swoim zapytaniem do backendu

    fetchChartData();
    fetchPickupsData();
    fetchRevenueData();
    fetchAvgPriceData();
    fetchTopWasteData();
    fetchTopContractorsData();
  }, [year, wasteType, contractor]);

  const fetchChartData = () => {
    // Przykład - tutaj podłączasz do swojego backendu
    setChartData([
      { month: "Styczeń", Papier: 12, Plastik: 8, Szkło: 5 },
      { month: "Luty", Papier: 10, Plastik: 7, Szkło: 4 },
    ]);
  };

  const fetchPickupsData = () => {
    setPickupsData([
      { waste: "Papier", month: "Styczeń", count: 12 },
      { waste: "Plastik", month: "Styczeń", count: 8 },
    ]);
  };

  const fetchRevenueData = () => {
    setRevenueData([
      { waste: "Papier", revenue: 15000, share: "35%" },
      { waste: "Plastik", revenue: 12000, share: "28%" },
    ]);
  };

  const fetchAvgPriceData = () => {
    setAvgPriceData([
      { waste: "Papier", month: "Styczeń", price: 0.85 },
      { waste: "Plastik", month: "Styczeń", price: 0.95 },
    ]);
  };

  const fetchTopWasteData = () => {
    setTopWasteData([
      { waste: "Plastik", mass: 12000, courses: 52, contractor: "Firma X" },
      { waste: "Papier", mass: 9000, courses: 45, contractor: "Firma Y" },
    ]);
  };

  const fetchTopContractorsData = () => {
    setTopContractorsData([
      { contractor: "Firma X", pickups: 152 },
      { contractor: "Firma Y", pickups: 132 },
    ]);
  };

  return (
    <div className="reports-container">
      {/* === Filtry === */}
      <div className="filters">
        <div className="filter">
          <h1>CONCEPT TO SIE ZMIENI PRAWDOPODOBNIE</h1>
          <label>Rok:</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Typ odpadu:</label>
          <select value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
            <option value="">Wszystkie</option>
            {wasteTypes.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Kontrahent:</label>
          <select value={contractor} onChange={(e) => setContractor(e.target.value)}>
            <option value="">Wszyscy</option>
            {contractors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* === Wykres === */}
      <div className="card">
        <h2>Masa odpadów w roku</h2>
        {/* Zastąp placeholder swoim wykresem (np. Chart.js, Recharts) */}
        <div className="chart-placeholder">
          {chartData.map((row, idx) => (
            <div key={idx}>{row.month}: Papier {row.Papier} | Plastik {row.Plastik} | Szkło {row.Szkło}</div>
          ))}
        </div>
      </div>

      {/* === Liczba odbiorów w kartach === */}
      <div className="card">
        <h2>Liczba odbiorów w roku</h2>
        {wasteTypes.map((waste) => (
          <div key={waste} className="sub-card">
            <h3>{waste}</h3>
            <table>
              <thead>
                <tr>
                  <th>Miesiąc</th>
                  <th>Liczba odbiorów</th>
                </tr>
              </thead>
              <tbody>
                {pickupsData
                  .filter((p) => p.waste === waste)
                  .map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.month}</td>
                      <td>{p.count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* === Przychody === */}
      <div className="card">
        <h2>Przychody</h2>
        <table>
          <thead>
            <tr>
              <th>Typ odpadu</th>
              <th>Przychód (PLN)</th>
              <th>Udział %</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((r, idx) => (
              <tr key={idx}>
                <td>{r.waste}</td>
                <td>{r.revenue} PLN</td>
                <td>{r.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Średnia cena za kg === */}
      <div className="card">
        <h2>Średnia cena za kg (miesięczna)</h2>
        {wasteTypes.map((waste) => (
          <div key={waste} className="sub-card">
            <h3>{waste}</h3>
            <table>
              <thead>
                <tr>
                  <th>Miesiąc</th>
                  <th>Średnia cena (PLN)</th>
                </tr>
              </thead>
              <tbody>
                {avgPriceData
                  .filter((a) => a.waste === waste)
                  .map((a, idx) => (
                    <tr key={idx}>
                      <td>{a.month}</td>
                      <td>{a.price} PLN</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* === TOP 3 odpady === */}
      <div className="card">
        <h2>TOP 3 najczęściej wywożone odpady</h2>
        <table>
          <thead>
            <tr>
              <th>Typ odpadu</th>
              <th>Masa (kg)</th>
              <th>Liczba kursów</th>
              <th>Najwięcej dla kontrahenta</th>
            </tr>
          </thead>
          <tbody>
            {topWasteData.map((t, idx) => (
              <tr key={idx}>
                <td>{t.waste}</td>
                <td>{t.mass} kg</td>
                <td>{t.courses}</td>
                <td>{t.contractor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === TOP 3 kontrahenci === */}
      <div className="card">
        <h2>TOP 3 najczęściej odwiedzane firmy</h2>
        <table>
          <thead>
            <tr>
              <th>Kontrahent</th>
              <th>Liczba odbiorów</th>
            </tr>
          </thead>
          <tbody>
            {topContractorsData.map((c, idx) => (
              <tr key={idx}>
                <td>{c.contractor}</td>
                <td>{c.pickups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
