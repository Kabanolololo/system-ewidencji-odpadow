import React, { useState, useEffect } from "react";
import YearSelector from "./Reports/YearSelector";
import MonthRangeSelector from "./Reports/MonthRangeSelector";
import ChartSection from "./Reports/ChartSection";
import DataTable from "./Reports/DataTable";
import { fetchReportYears, fetchWasteMassByMonth, fetchPickupCountsByMonth, fetchAverageRevenueByMonth, fetchRevenueByMonth, fetchTotalRevenueByMonth } 
from "../../../api/Reports";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../styles/Reports.css";

const months = [
  { key: "01", label: "Styczeń" },
  { key: "02", label: "Luty" },
  { key: "03", label: "Marzec" },
  { key: "04", label: "Kwiecień" },
  { key: "05", label: "Maj" },
  { key: "06", label: "Czerwiec" },
  { key: "07", label: "Lipiec" },
  { key: "08", label: "Sierpień" },
  { key: "09", label: "Wrzesień" },
  { key: "10", label: "Październik" },
  { key: "11", label: "Listopad" },
  { key: "12", label: "Grudzień" },
];

function getMonthRange(year, monthFrom, monthTo) {
  const months = [];
  for (let m = monthFrom; m <= monthTo; m++) {
    const mm = m.toString().padStart(2, "0");
    months.push(`${year}-${mm}`);
  }
  return months;
}

function getMonthLabel(monthsArr, key) {
  const found = monthsArr.find((m) => m.key === key);
  return found ? found.label : key;
}

export default function Reports() {
  const [years, setYears] = useState([]);
  const [globalYear, setGlobalYear] = useState(2025);
  const [startMonth, setStartMonth] = useState("01");
  const [endMonth, setEndMonth] = useState("12");
  const [chartsYear, setChartsYear] = useState(2025);

  // Dane masy odpadów z API
  const [wasteMassApiData, setWasteMassApiData] = useState([]);
  const [loadingWasteMass, setLoadingWasteMass] = useState(false);
  const [errorWasteMass, setErrorWasteMass] = useState(null);

  // Dane liczby odbiorów z API
  const [pickupCountsApiData, setPickupCountsApiData] = useState([]);
  const [loadingPickupCounts, setLoadingPickupCounts] = useState(false);
  const [errorPickupCounts, setErrorPickupCounts] = useState(null);

  // Dane sredni zarobek z API
  const [loadingAvgRevenue, setLoadingAvgRevenue] = useState(false);
  const [errorAvgRevenue, setErrorAvgRevenue] = useState(null);
  const [avgRevenueApiData, setAvgRevenueApiData] = useState([]);

  // Dane przychod wedlug miesiaca z API
  const [revenueData, setRevenueData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [errorRevenue, setErrorRevenue] = useState(null);

  // Dane calkowity przychod z API
  const [totalRevenueData, setTotalRevenueData] = useState([]);
  const [loadingTotalRevenue, setLoadingTotalRevenue] = useState(false);
  const [errorTotalRevenue, setErrorTotalRevenue] = useState(null);

  // Pobierz lata raportów
  useEffect(() => {
    async function loadYears() {
      try {
        const data = await fetchReportYears();
        const filteredYears = data.years.filter((y) => y >= 2000 && y <= 2100);
        setYears(filteredYears);
        if (!filteredYears.includes(globalYear)) setGlobalYear(filteredYears[0]);
        if (!filteredYears.includes(chartsYear)) setChartsYear(filteredYears[0]);
      } catch (err) {
        console.error("Błąd podczas pobierania lat:", err.message);
      }
    }
    loadYears();
  }, []);
  
  // ---------------------------------------------
  // TABELE
  // ---------------------------------------------

  // Pobierz masę odpadów z API po zmianie filtrów
  useEffect(() => {
    async function loadWasteMass() {
      setLoadingWasteMass(true);
      setErrorWasteMass(null);

      const year = globalYear;
      const month_from = parseInt(startMonth, 10);
      const month_to = parseInt(endMonth, 10);

      const params = { year };
      if (month_from !== 1) params.month_from = month_from;
      if (month_to !== 12) params.month_to = month_to;

      console.log("Fetch params:", params);

      try {
        const data = await fetchWasteMassByMonth(params);
        setWasteMassApiData(data);
      } catch (error) {
        setErrorWasteMass(error.message);
        setWasteMassApiData([]);
      } finally {
        setLoadingWasteMass(false);
      }
    }
    if (globalYear && startMonth && endMonth) {
      loadWasteMass();
    }
  }, [globalYear, startMonth, endMonth]);

  // Dynamiczne nagłówki do tabeli masy odpadów
  const allRevenueWasteTypes  = Array.from(
    new Set(wasteMassApiData.flatMap((item) => Object.keys(item.waste_masses)))
  );

  // Wiersze dla tabeli masy odpadów z API
  const wasteMassRows = wasteMassApiData.map((item) => {
    const mm = item.month.split("-")[1];
    const label = `${item.month} (${getMonthLabel(months, mm)})`;
    return [
      label,
      ...allRevenueWasteTypes .map((type) => (item.waste_masses[type] !== undefined ? item.waste_masses[type] : "-")),
    ];
  });

  // Pobierz liczbe odebran z API
  useEffect(() => {
    async function loadPickupCounts() {
      setLoadingPickupCounts(true);
      setErrorPickupCounts(null);

      const year = globalYear;
      const month_from = parseInt(startMonth, 10);
      const month_to = parseInt(endMonth, 10);

      const params = { year };
      if (month_from !== 1) params.month_from = month_from;
      if (month_to !== 12) params.month_to = month_to;

      try {
        const data = await fetchPickupCountsByMonth(params);
        setPickupCountsApiData(data);
      } catch (error) {
        setErrorPickupCounts(error.message);
        setPickupCountsApiData([]);
      } finally {
        setLoadingPickupCounts(false);
      }
    }

    if (globalYear && startMonth && endMonth) {
      loadPickupCounts();
    }
  }, [globalYear, startMonth, endMonth]);

  // Unikalne miesiące
  const uniquePickupMonths = Array.from(new Set(pickupCountsApiData.map(item => item.month))).sort();

  // Unikalne typy odpadów (nagłówki kolumn)
  const allPickupWasteNames = Array.from(new Set(pickupCountsApiData.map(item => item.waste_name))).sort();

  // Budowa wierszy do tabeli odbiorów
  const pickupCountRowsApi = uniquePickupMonths.map(month => {
    // filtruj elementy z danego miesiąca
    const itemsInMonth = pickupCountsApiData.filter(item => item.month === month);

    // mapa waste_name -> pickups_count
    const pickupsMap = {};
    itemsInMonth.forEach(item => {
      pickupsMap[item.waste_name] = item.pickups_count;
    });

    // etykieta miesiąca
    const mm = month.split("-")[1];
    const label = `${month} (${getMonthLabel(months, mm)})`;

    return [
      label,
      ...allPickupWasteNames.map(waste => pickupsMap[waste] !== undefined ? pickupsMap[waste] : "-")
    ];
  });

  // Pobierz średnie przychody z API
  useEffect(() => {
    async function loadAverageRevenue() {
      setLoadingAvgRevenue(true);
      setErrorAvgRevenue(null);

      const year = globalYear;
      const month_from = parseInt(startMonth, 10);
      const month_to = parseInt(endMonth, 10);

      const params = { year };
      if (month_from !== 1) params.month_from = month_from;
      if (month_to !== 12) params.month_to = month_to;

      try {
        const data = await fetchAverageRevenueByMonth(params);
        setAvgRevenueApiData(data);
      } catch (error) {
        setErrorAvgRevenue(error.message);
        setAvgRevenueApiData([]);
      } finally {
        setLoadingAvgRevenue(false);
      }
    }

    if (globalYear && startMonth && endMonth) {
      loadAverageRevenue();
    }
  }, [globalYear, startMonth, endMonth]);

  // Budowa wierszy do tabeli srednie zarobki
  const monthRange = getMonthRange(globalYear, parseInt(startMonth), parseInt(endMonth));

  // Unikalne typy odpadów (nagłówki)
  const allAvgRevenueWasteTypes = Array.from(
    new Set(avgRevenueApiData.map(item => item.waste_name))
  ).sort();

  // Budowa wierszy
  const avgRevenueRows = monthRange.map(month => {
    const mm = month.split("-")[1];
    const label = `${month} (${getMonthLabel(months, mm)})`;

    const row = allAvgRevenueWasteTypes.map(type => {
      const match = avgRevenueApiData.find(item => item.month === month && item.waste_name === type);
      return match ? match.average_revenue.toFixed(2) : "-";
    });

    return [label, ...row];
  });

  // Pobierz przychod wedlug miesiaca z api
  useEffect(() => {
    async function loadRevenue() {
      setLoadingRevenue(true);
      setErrorRevenue(null);

      const year = globalYear;
      const month_from = parseInt(startMonth, 10);
      const month_to = parseInt(endMonth, 10);

      const params = { year };
      if (month_from !== 1) params.month_from = month_from;
      if (month_to !== 12) params.month_to = month_to;

      try {
        const data = await fetchRevenueByMonth(params);
        setRevenueData(data);
      } catch (error) {
        setErrorRevenue(error.message);
        setRevenueData([]);
      } finally {
        setLoadingRevenue(false);
      }
    }

    if (globalYear && startMonth && endMonth) {
      loadRevenue();
    }
  }, [globalYear, startMonth, endMonth]);

  // Unikalne miesiące i typy odpadów
  const uniqueMonths = Array.from(new Set(revenueData.map(item => item.month))).sort();
  const allWasteTypes = Array.from(new Set(revenueData.map(item => item.waste_name))).sort();

  // Budowa wierszy tabeli
  const revenueRows = uniqueMonths.map(month => {
    const items = revenueData.filter(item => item.month === month);
    const revenueMap = {};
    items.forEach(item => {
      revenueMap[item.waste_name] = item.total_revenue;
    });

    const mm = month.split("-")[1];
    const label = `${month} (${getMonthLabel(months, mm)})`;

    return [
      label,
      ...allWasteTypes.map(waste => revenueMap[waste] !== undefined ? revenueMap[waste] : "-")
    ];
  });

  // Suma końcowa
  const revenueSums = {};
  revenueData.forEach(item => {
    revenueSums[item.waste_name] = (revenueSums[item.waste_name] || 0) + item.total_revenue;
  });

  const summaryRow = [
    "Suma",
    ...allWasteTypes.map(waste => revenueSums[waste] || 0)
  ];

  // Finalna tabela
  const revenueTableRows = [...revenueRows, summaryRow];

  useEffect(() => {
    async function loadTotalRevenue() {
      setLoadingTotalRevenue(true);
      setErrorTotalRevenue(null);

      const year = globalYear;
      const month_from = parseInt(startMonth, 10);
      const month_to = parseInt(endMonth, 10);

      const params = { year };
      if (month_from !== 1) params.month_from = month_from;
      if (month_to !== 12) params.month_to = month_to;

      try {
        const data = await fetchTotalRevenueByMonth(params);
        setTotalRevenueData(data);
      } catch (error) {
        setErrorTotalRevenue(error.message);
        setTotalRevenueData([]);
      } finally {
        setLoadingTotalRevenue(false);
      }
    }

    if (globalYear && startMonth && endMonth) {
      loadTotalRevenue();
    }
  }, [globalYear, startMonth, endMonth]);

  // Budowa wierszy tabeli całkowitych przychodów
  const totalRevenueRows = totalRevenueData.map(item => {
    const mm = item.month.split("-")[1];
    const label = `${item.month} (${getMonthLabel(months, mm)})`;
    return [label, item.total_revenue.toFixed(2)];
  });

  // Suma całkowitych przychodów za wybrany zakres
  const totalYearRevenue = totalRevenueData.reduce((sum, item) => sum + item.total_revenue, 0);

  const totalRevenueTableRows = [
    ...totalRevenueRows,
    ["Suma", totalYearRevenue.toFixed(2)],
  ];

  // ---------------------------------------------
  // WYKRESY
  // ---------------------------------------------
  
  // wykres masa odpadow
  const wasteMassChartData = wasteMassApiData.map(item => {
    const totalMass = Object.values(item.waste_masses).reduce((sum, val) => sum + val, 0);
    const monthNumber = parseInt(item.month.split("-")[1], 10); // np. 4
    const fullMonthLabel = `${item.month} (${getMonthLabel(months, item.month.split("-")[1])})`;

    return {
      month: item.month,
      label: monthNumber.toString(), 
      fullLabel: fullMonthLabel,     
      totalMass,
    };
  });

  function WasteMassChart({ data }) {
    return (
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip 
          formatter={(value, name, props) => [`${value}`, "Masa odpadów (kg)"]} 
          labelFormatter={(label) => {
            const item = data.find(d => d.label === label);
            return item ? item.fullLabel : label;
          }}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="totalMass" stroke="#8884d8" name="Masa odpadów" />
      </LineChart>
    );
  }

  function TotalRevenueChart({ data }) {
    // Przygotuj dane do wykresu
    const chartData = data.map(item => {
      const monthNumber = parseInt(item.month.split("-")[1], 10);
      const fullMonthLabel = `${item.month} (${getMonthLabel(months, item.month.split("-")[1])})`;

      return {
        month: item.month,
        label: monthNumber.toString(),
        fullLabel: fullMonthLabel,
        totalRevenue: item.total_revenue,
      };
    });

    return (
      <LineChart width={600} height={300} data={chartData}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`${value.toFixed(2)}`, "Przychód (zł)"]}
          labelFormatter={(label) => {
            const item = chartData.find(d => d.label === label);
            return item ? item.fullLabel : label;
          }}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="totalRevenue" stroke="#ff7300" name="Całkowity przychód" />
      </LineChart>
    );
  }

  // wykres liczba odbiorow
  const pickupCountsChartData = uniquePickupMonths.map(month => {
    const totalPickups = pickupCountsApiData
      .filter(item => item.month === month)
      .reduce((sum, item) => sum + item.pickups_count, 0);

    const monthNumber = parseInt(month.split("-")[1], 10);
    const fullMonthLabel = `${month} (${getMonthLabel(months, month.split("-")[1])})`;

    return {
      month,
      label: monthNumber.toString(),
      fullLabel: fullMonthLabel,
      totalPickups,
    };
  });

  function PickupCountsChart({ data }) {
    return (
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) => [`${value}`, "Liczba odbiorów"]}
          labelFormatter={(label) => {
            const item = data.find(d => d.label === label);
            return item ? item.fullLabel : label;
          }}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="totalPickups" stroke="#82ca9d" name="Liczba odbiorów" />
      </LineChart>
    );
  }

  return (
    <div className="reports-container">
      <section className="card">
        <h2>Filtry dostępne dla całej zakładki</h2>
          <YearSelector label="Rok:" value={globalYear} years={years} onChange={setGlobalYear} />
          <MonthRangeSelector
            months={months}
            startMonth={startMonth}
            endMonth={endMonth}
            onStartChange={setStartMonth}
            onEndChange={setEndMonth}
          />
      </section>

      {years.length === 0 ? (
        <p>Wczytywanie zakładki...</p>
      ) : (
        <>
          {/* Tabela masy odpadów*/}
          {loadingWasteMass && <p>Ładowanie danych masy odpadów...</p>}
          {errorWasteMass && <p className="error">{errorWasteMass}</p>}
          {!loadingWasteMass && !errorWasteMass && wasteMassRows.length > 0 && (
            <DataTable
              title="Tabela masy odpadów (kg)" year={globalYear}
              headers={["Miesiąc", ...allWasteTypes.map((type) => `${type}`)]}
              dataRows={wasteMassRows}
            />
          )}

         <ChartSection title="Wykres masy odpadów" year={globalYear}>
          <WasteMassChart data={wasteMassChartData} />
        </ChartSection>

          {/* Tabela liczby odbiorów*/}
          {loadingPickupCounts && <p>Ładowanie danych liczby odbiorów...</p>}
          {errorPickupCounts && <p className="error">{errorPickupCounts}</p>}
          {!loadingPickupCounts && !errorPickupCounts && pickupCountRowsApi.length > 0 && (
            <DataTable
              title="Tabela liczby odbiorów"
              headers={["Miesiąc", ...allPickupWasteNames]}
              dataRows={pickupCountRowsApi}
            />
          )}

        <ChartSection title="Wykres liczby odbiorów" year={globalYear}>
          <PickupCountsChart data={pickupCountsChartData} />
        </ChartSection>

          {/* Tabela średnich przychodów*/}
          {loadingAvgRevenue && <p>Ładowanie danych średnich przychodów...</p>}
          {errorAvgRevenue && <p className="error">{errorAvgRevenue}</p>}
          {!loadingAvgRevenue && !errorAvgRevenue && avgRevenueRows.length > 0 && (
            <DataTable
              title="Tabela średnich przychodów (zł)"
              headers={["Miesiąc", ...allAvgRevenueWasteTypes.map(type => `${type} `)]}
              dataRows={avgRevenueRows}
            />
          )}

          {/* Tabela przychodów*/}
          {loadingRevenue && <p>Ładowanie danych przychodów...</p>}
          {errorRevenue && <p className="error">{errorRevenue}</p>}
          {!loadingRevenue && !errorRevenue && revenueTableRows.length > 0 && (
            <DataTable
              title="Tabela przychodów (zł)"
              headers={["Miesiąc", ...allWasteTypes.map(type => `${type} (zł)`)]}
              dataRows={revenueTableRows}
            />
          )}

          {/* Tabela całkowitych przychodów */}
          {loadingTotalRevenue && <p>Ładowanie danych całkowitych przychodów...</p>}
          {errorTotalRevenue && <p className="error">{errorTotalRevenue}</p>}
          {!loadingTotalRevenue && !errorTotalRevenue && totalRevenueTableRows.length > 0 && (
            <DataTable
              title="Tabela całkowitych przychodów"
              headers={["Miesiąc", "Przychód (zł)"]}
              dataRows={totalRevenueTableRows}
            />
          )}

          <ChartSection title="Wykres całkowitych przychodów" year={globalYear}>
            <TotalRevenueChart data={totalRevenueData} />
          </ChartSection>
        </>
      )}
    </div>
  );
}
