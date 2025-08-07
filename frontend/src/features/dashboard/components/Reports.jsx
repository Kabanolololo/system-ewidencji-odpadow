import React, { useState } from "react";
import '../styles/Reports.css';

import YearSelector from "./Reports/YearSelector";
import MonthRangeSelector from "./Reports/MonthRangeSelector";
import ChartSection from "./Reports/ChartSection";
import DataTable from "./Reports/DataTable";

import { generateMonthRange, getMonthLabel } from "./Reports/utils";

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

// Przykładowe dane (statyczne)
const sampleData = {
  "01": { Papier: 1000, Plastik: 800, Szkło: 600 },
  "02": { Papier: 1100, Plastik: 820, Szkło: 620 },
  "03": { Papier: 1050, Plastik: 810, Szkło: 630 },
  // można dodać resztę miesięcy
};

export default function Reports() {
  const [globalYear, setGlobalYear] = useState(2025);
  const [startMonth, setStartMonth] = useState("01");
  const [endMonth, setEndMonth] = useState("12");
  const [chartsYear, setChartsYear] = useState(2025);

  const monthRange = generateMonthRange(globalYear, startMonth, endMonth);

  // Przygotowanie danych do tabel

  // Tabela masy odpadów
  const wasteMassRows = monthRange.map(month => {
    const mm = month.split("-")[1];
    return [
      `${month} (${getMonthLabel(months, mm)})`,
      sampleData[mm]?.Papier ?? "-",
      sampleData[mm]?.Plastik ?? "-",
      sampleData[mm]?.Szkło ?? "-",
    ];
  });

  // Tabela liczby odbiorów (przyjmijmy, że liczba odbiorów to masa / 100)
  const pickupCountRows = monthRange.map(month => {
    const mm = month.split("-")[1];
    return [
      `${month} (${getMonthLabel(months, mm)})`,
      sampleData[mm]?.Papier ? Math.floor(sampleData[mm].Papier / 100) : "-",
      sampleData[mm]?.Plastik ? Math.floor(sampleData[mm].Plastik / 100) : "-",
      sampleData[mm]?.Szkło ? Math.floor(sampleData[mm].Szkło / 100) : "-",
    ];
  });

  // Średnia cena za kg (przyjmujemy stałe ceny)
  const pricePerKg = { Papier: 0.8, Plastik: 0.9, Szkło: 0.85 };
  const avgPriceRows = monthRange.map(month => {
    const mm = month.split("-")[1];
    const hasData = !!sampleData[mm];
    return [
      `${month} (${getMonthLabel(months, mm)})`,
      hasData ? pricePerKg.Papier.toFixed(2) : "-",
      hasData ? pricePerKg.Plastik.toFixed(2) : "-",
      hasData ? pricePerKg.Szkło.toFixed(2) : "-",
    ];
  });

  // Przychody z danego odpadu
  const incomeRows = monthRange.map(month => {
    const mm = month.split("-")[1];
    const data = sampleData[mm];
    const papierIncome = data ? data.Papier * pricePerKg.Papier : 0;
    const plastikIncome = data ? data.Plastik * pricePerKg.Plastik : 0;
    const szkloIncome = data ? data.Szkło * pricePerKg.Szkło : 0;
    return [
      `${month} (${getMonthLabel(months, mm)})`,
      papierIncome ? papierIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-",
      plastikIncome ? plastikIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-",
      szkloIncome ? szkloIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-",
    ];
  });

  // Przychody ogólne (suma)
  const totalIncomeRows = monthRange.map(month => {
    const mm = month.split("-")[1];
    const data = sampleData[mm];
    const income = data
      ? data.Papier * pricePerKg.Papier + data.Plastik * pricePerKg.Plastik + data.Szkło * pricePerKg.Szkło
      : 0;
    return [
      `${month} (${getMonthLabel(months, mm)})`,
      income ? income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-",
    ];
  });

  return (
    <div className="reports-container">

      <YearSelector label="Rok dla wykresów:" value={chartsYear} years={years} onChange={setChartsYear} />

      <ChartSection title="Wykres masy odpadów" year={chartsYear}>
        [Wykres masy odpadów]
      </ChartSection>

      <ChartSection title="Wykres liczby odbiorów" year={chartsYear}>
        [Wykres liczby odbiorów]
      </ChartSection>

      <section className="card">
        <h2>Filtry dla tabel</h2>
        <YearSelector label="Rok:" value={globalYear} years={years} onChange={setGlobalYear} />
        <MonthRangeSelector
          months={months}
          startMonth={startMonth}
          endMonth={endMonth}
          onStartChange={setStartMonth}
          onEndChange={setEndMonth}
        />
      </section>

      <DataTable
        title="Tabela masy odpadów"
        headers={["Miesiąc", "Papier (kg)", "Plastik (kg)", "Szkło (kg)"]}
        dataRows={wasteMassRows}
      />

      <DataTable
        title="Tabela liczby odbiorów"
        headers={["Miesiąc", "Papier", "Plastik", "Szkło"]}
        dataRows={pickupCountRows}
      />

      <DataTable
        title="Średnia cena za kg"
        headers={["Miesiąc", "Papier (PLN)", "Plastik (PLN)", "Szkło (PLN)"]}
        dataRows={avgPriceRows}
      />

      <DataTable
        title="Przychody z danego odpadu"
        headers={["Miesiąc", "Papier (PLN)", "Plastik (PLN)", "Szkło (PLN)"]}
        dataRows={incomeRows}
      />

      <DataTable
        title="Przychody ogólne (PLN)"
        headers={["Miesiąc", "Przychód (PLN)"]}
        dataRows={totalIncomeRows}
      />
    </div>
  );
}
