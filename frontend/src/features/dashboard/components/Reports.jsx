import React, { useState } from "react";
import '../styles/Reports.css';

function Reports() {
  const years = [2023, 2024, 2025];
  const months = [
    { value: "01", label: "Styczeń" },
    { value: "02", label: "Luty" },
    { value: "03", label: "Marzec" },
    { value: "04", label: "Kwiecień" },
    { value: "05", label: "Maj" },
    { value: "06", label: "Czerwiec" },
    { value: "07", label: "Lipiec" },
    { value: "08", label: "Sierpień" },
    { value: "09", label: "Wrzesień" },
    { value: "10", label: "Październik" },
    { value: "11", label: "Listopad" },
    { value: "12", label: "Grudzień" },
  ];

  // Globalny rok i zakres miesięcy (dla wszystkich tabel)
  const [globalYear, setGlobalYear] = useState(2025);
  const [startMonth, setStartMonth] = useState("01");
  const [endMonth, setEndMonth] = useState("12");

  // Oddzielny stan roku dla wykresów
  const [chartsYear, setChartsYear] = useState(2025);

  const getMonthLabel = (val) => months.find(m => m.value === val)?.label || val;

  // Generowanie zakresu miesięcy dla tabel
  const generateMonthRange = (year, startM, endM) => {
    const start = parseInt(startM);
    const end = parseInt(endM);
    let result = [];
    for (let m = start; m <= end; m++) {
      const mm = m < 10 ? `0${m}` : `${m}`;
      result.push(`${year}-${mm}`);
    }
    return result;
  };

  // Przykładowe dane (statyczne)
  const sampleData = {
    "01": { Papier: 1000, Plastik: 800, Szkło: 600 },
    "02": { Papier: 1100, Plastik: 820, Szkło: 620 },
    "03": { Papier: 1050, Plastik: 810, Szkło: 630 },
    // ... itd.
  };

  return (
    <div className="reports-container">

      {/* Wybór roku dla wykresów (oddzielny) */}
      <div className="filter-row">
        <label>Rok dla wykresów:</label>
        <select value={chartsYear} onChange={e => setChartsYear(Number(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Wykresy */}
      <section className="card">
        <h2>Wykres masy odpadów (rok {chartsYear})</h2>
        <div className="chart-placeholder">[Wykres masy odpadów]</div>
      </section>
      <section className="card">
        <h2>Wykres liczby odbiorów (rok {chartsYear})</h2>
        <div className="chart-placeholder">[Wykres liczby odbiorów]</div>
      </section>

      {/* Globalne filtry dla tabel */}
      <section className="card">
        <h2>Filtry dla tabel</h2>
        <div className="filter-row">
          <label>Rok:</label>
          <select value={globalYear} onChange={e => setGlobalYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <label>Zakres miesięcy:</label>
          <select value={startMonth} onChange={e => setStartMonth(e.target.value)}>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          -
          <select value={endMonth} onChange={e => setEndMonth(e.target.value)}>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </section>

      {/* Tabela masy odpadów - korzysta z globalYear, startMonth, endMonth */}
      <section className="card">
        <h2>Tabela masy odpadów</h2>
        <table>
          <thead>
            <tr>
              <th>Miesiąc</th>
              <th>Papier (kg)</th>
              <th>Plastik (kg)</th>
              <th>Szkło (kg)</th>
            </tr>
          </thead>
          <tbody>
            {generateMonthRange(globalYear, startMonth, endMonth).map(month => {
              const mm = month.split("-")[1];
              return (
                <tr key={month}>
                  <td>{month} ({getMonthLabel(mm)})</td>
                  <td>{sampleData[mm]?.Papier ?? "-"}</td>
                  <td>{sampleData[mm]?.Plastik ?? "-"}</td>
                  <td>{sampleData[mm]?.Szkło ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Tabela liczby odbiorów - analogicznie */}
      <section className="card">
        <h2>Tabela liczby odbiorów</h2>
        <table>
          <thead>
            <tr>
              <th>Miesiąc</th>
              <th>Papier</th>
              <th>Plastik</th>
              <th>Szkło</th>
            </tr>
          </thead>
          <tbody>
            {generateMonthRange(globalYear, startMonth, endMonth).map(month => {
              const mm = month.split("-")[1];
              return (
                <tr key={month}>
                  <td>{month} ({getMonthLabel(mm)})</td>
                  <td>{sampleData[mm]?.Papier ? Math.floor(sampleData[mm].Papier / 100) : "-"}</td>
                  <td>{sampleData[mm]?.Plastik ? Math.floor(sampleData[mm].Plastik / 100) : "-"}</td>
                  <td>{sampleData[mm]?.Szkło ? Math.floor(sampleData[mm].Szkło / 100) : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Tabela średniej ceny za kg */}
      <section className="card">
        <h2>Średnia cena za kg</h2>
        <table>
          <thead>
            <tr>
              <th>Miesiąc</th>
              <th>Papier (PLN)</th>
              <th>Plastik (PLN)</th>
              <th>Szkło (PLN)</th>
            </tr>
          </thead>
          <tbody>
            {generateMonthRange(globalYear, startMonth, endMonth).map(month => {
              const mm = month.split("-")[1];
              // Przykładowe ceny
              const price = sampleData[mm] ? {
                Papier: 0.8,
                Plastik: 0.9,
                Szkło: 0.85,
              } : null;

              return (
                <tr key={month}>
                  <td>{month} ({getMonthLabel(mm)})</td>
                  <td>{price ? price.Papier.toFixed(2) : "-"}</td>
                  <td>{price ? price.Plastik.toFixed(2) : "-"}</td>
                  <td>{price ? price.Szkło.toFixed(2) : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Przychody z danego odpadu i ogólny (wspólny filtr z tabelami) */}
      <section className="card">
        <h2>Przychody z danego odpadu</h2>
        <table>
          <thead>
            <tr>
              <th>Miesiąc</th>
              <th>Papier (PLN)</th>
              <th>Plastik (PLN)</th>
              <th>Szkło (PLN)</th>
            </tr>
          </thead>
          <tbody>
            {generateMonthRange(globalYear, startMonth, endMonth).map(month => {
              const mm = month.split("-")[1];
              const data = sampleData[mm];
              const papierIncome = data ? data.Papier * 0.8 : 0;
              const plastikIncome = data ? data.Plastik * 0.9 : 0;
              const szkloIncome = data ? data.Szkło * 0.85 : 0;

              return (
                <tr key={month}>
                  <td>{month} ({getMonthLabel(mm)})</td>
                  <td>{papierIncome ? papierIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td>
                  <td>{plastikIncome ? plastikIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td>
                  <td>{szkloIncome ? szkloIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <br />
        <h2>Przychody ogólne (PLN)</h2>
        <table>
          <thead>
            <tr>
              <th>Miesiąc</th>
              <th>Przychód (PLN)</th>
            </tr>
          </thead>
          <tbody>
            {generateMonthRange(globalYear, startMonth, endMonth).map(month => {
              const mm = month.split("-")[1];
              const data = sampleData[mm];
              const income = data
                ? data.Papier * 0.8 + data.Plastik * 0.9 + data.Szkło * 0.85
                : 0;

              return (
                <tr key={month}>
                  <td>{month} ({getMonthLabel(mm)})</td>
                  <td>{income ? income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

    </div>
  );
}

export default Reports;
