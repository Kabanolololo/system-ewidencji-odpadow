import React, { useState, useMemo } from "react";
import EditRecordModal from "./EditRecordModal";
import "../styles/RecordTable.css";

function RecordTable() {
  // Tu masz listę rekordów w stanie, jeden przykładowy rekord
  const [records, setRecords] = useState([
    {
      id: 1,
      contractor_id: 1,
      user_id: 2,
      waste_id: 3,
      vehicle_id: 4,
      driver_id: 5,
      destination_id: 6,
      transfer_date: "2025-07-31",
      mass_kg: 1200,
      price_per_kg: 2.5,
      total_price: 3000,
      notes: "Przykładowy rekord",
    },
  ]);

  const [filters, setFilters] = useState({
    contractor_id: "",
    user_id: "",
    waste_id: "",
    vehicle_id: "",
    driver_id: "",
    destination_id: "",
    transfer_date_from: "",
    transfer_date_to: "",
    mass_kg_min: "",
    mass_kg_max: "",
    price_per_kg_min: "",
    price_per_kg_max: "",
    total_price_min: "",
    total_price_max: "",
  });

  const [sortBy, setSortBy] = useState("transfer_date");
  const [sortDir, setSortDir] = useState("asc");

  const [editingRecord, setEditingRecord] = useState(null);

  // Obsługa zmian filtra
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Obsługa sortowania
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  // Filtracja i sortowanie
  const filteredSortedRecords = useMemo(() => {
    let filtered = records.filter((r) => {
      const idsToCheck = [
        "contractor_id",
        "user_id",
        "waste_id",
        "vehicle_id",
        "driver_id",
        "destination_id",
      ];
      for (const idField of idsToCheck) {
        if (filters[idField] !== "") {
          if (Number(r[idField]) !== Number(filters[idField])) return false;
        }
      }

      if (filters.transfer_date_from) {
        if (r.transfer_date < filters.transfer_date_from) return false;
      }
      if (filters.transfer_date_to) {
        if (r.transfer_date > filters.transfer_date_to) return false;
      }

      if (filters.mass_kg_min !== "") {
        if (r.mass_kg < Number(filters.mass_kg_min)) return false;
      }
      if (filters.mass_kg_max !== "") {
        if (r.mass_kg > Number(filters.mass_kg_max)) return false;
      }

      if (filters.price_per_kg_min !== "") {
        if (r.price_per_kg < Number(filters.price_per_kg_min)) return false;
      }
      if (filters.price_per_kg_max !== "") {
        if (r.price_per_kg > Number(filters.price_per_kg_max)) return false;
      }

      if (filters.total_price_min !== "") {
        if (r.total_price < Number(filters.total_price_min)) return false;
      }
      if (filters.total_price_max !== "") {
        if (r.total_price > Number(filters.total_price_max)) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "transfer_date") {
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      }

      valA = Number(valA);
      valB = Number(valB);

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [records, filters, sortBy, sortDir]);

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortDir === "asc" ? "▲" : "▼";
  };

  // Obsługa edycji
  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  // Usuwanie rekordu
  const handleDelete = (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten rekord?")) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  // Zapis po edycji
  const handleSaveEdit = (updatedRecord) => {
    setRecords(records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));
    setEditingRecord(null);
  };

  // Anulowanie edycji
  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  return (
    <div className="record-table-wrapper">

      <div className="filters">
        <div className="filter-item">
          <label>Kontrahent ID</label>
          <input
            type="number"
            name="contractor_id"
            value={filters.contractor_id}
            onChange={handleFilterChange}
            placeholder="Kontrahent ID"
          />
        </div>
        <div className="filter-item">
          <label>Użytkownik ID</label>
          <input
            type="number"
            name="user_id"
            value={filters.user_id}
            onChange={handleFilterChange}
            placeholder="Użytkownik ID"
          />
        </div>
        <div className="filter-item">
          <label>Typ odpadu ID</label>
          <input
            type="number"
            name="waste_id"
            value={filters.waste_id}
            onChange={handleFilterChange}
            placeholder="Typ odpadu ID"
          />
        </div>
        <div className="filter-item">
          <label>Pojazd ID</label>
          <input
            type="number"
            name="vehicle_id"
            value={filters.vehicle_id}
            onChange={handleFilterChange}
            placeholder="Pojazd ID"
          />
        </div>
        <div className="filter-item">
          <label>Kierowca ID</label>
          <input
            type="number"
            name="driver_id"
            value={filters.driver_id}
            onChange={handleFilterChange}
            placeholder="Kierowca ID"
          />
        </div>
        <div className="filter-item">
          <label>Destynacja ID</label>
          <input
            type="number"
            name="destination_id"
            value={filters.destination_id}
            onChange={handleFilterChange}
            placeholder="Destynacja ID"
          />
        </div>

        <div className="filter-item">
          <label>Data od</label>
          <input
            type="date"
            name="transfer_date_from"
            value={filters.transfer_date_from}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-item">
          <label>Data do</label>
          <input
            type="date"
            name="transfer_date_to"
            value={filters.transfer_date_to}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-item">
          <label>Masa min (kg)</label>
          <input
            type="number"
            name="mass_kg_min"
            value={filters.mass_kg_min}
            onChange={handleFilterChange}
            placeholder="Min"
          />
        </div>
        <div className="filter-item">
          <label>Masa max (kg)</label>
          <input
            type="number"
            name="mass_kg_max"
            value={filters.mass_kg_max}
            onChange={handleFilterChange}
            placeholder="Max"
          />
        </div>

        <div className="filter-item">
          <label>Cena/kg min (PLN)</label>
          <input
            type="number"
            step="0.01"
            name="price_per_kg_min"
            value={filters.price_per_kg_min}
            onChange={handleFilterChange}
            placeholder="Min"
          />
        </div>
        <div className="filter-item">
          <label>Cena/kg max (PLN)</label>
          <input
            type="number"
            step="0.01"
            name="price_per_kg_max"
            value={filters.price_per_kg_max}
            onChange={handleFilterChange}
            placeholder="Max"
          />
        </div>

        <div className="filter-item">
          <label>Cena łączna min (PLN)</label>
          <input
            type="number"
            step="0.01"
            name="total_price_min"
            value={filters.total_price_min}
            onChange={handleFilterChange}
            placeholder="Min"
          />
        </div>
        <div className="filter-item">
          <label>Cena łączna max (PLN)</label>
          <input
            type="number"
            step="0.01"
            name="total_price_max"
            value={filters.total_price_max}
            onChange={handleFilterChange}
            placeholder="Max"
          />
        </div>
      </div>


      <table className="record-table">
        <thead>
          <tr>
            {[
              { label: "ID", field: "id" },
              { label: "Kontrahent ID", field: "contractor_id" },
              { label: "Użytkownik ID", field: "user_id" },
              { label: "Typ odpadu ID", field: "waste_id" },
              { label: "Pojazd ID", field: "vehicle_id" },
              { label: "Kierowca ID", field: "driver_id" },
              { label: "Destynacja ID", field: "destination_id" },
              { label: "Data przekazania", field: "transfer_date" },
              { label: "Masa (kg)", field: "mass_kg" },
              { label: "Cena za kg (PLN)", field: "price_per_kg" },
              { label: "Łączna cena (PLN)", field: "total_price" },
            ].map(({ label, field }) => (
              <th
                key={field}
                onClick={() => handleSortChange(field)}
                className={sortBy === field ? "sorted" : ""}
              >
                {label} <span style={{ fontSize: "0.7rem", marginLeft: "4px" }}>{renderSortIcon(field)}</span>
              </th>
            ))}
            <th>Notatki</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredSortedRecords.length === 0 ? (
            <tr>
              <td colSpan="13" style={{ textAlign: "center" }}>
                Brak danych do wyświetlenia.
              </td>
            </tr>
          ) : (
            filteredSortedRecords.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.contractor_id}</td>
                <td>{r.user_id}</td>
                <td>{r.waste_id}</td>
                <td>{r.vehicle_id}</td>
                <td>{r.driver_id}</td>
                <td>{r.destination_id}</td>
                <td>{r.transfer_date}</td>
                <td>{r.mass_kg}</td>
                <td>{r.price_per_kg.toFixed(2)}</td>
                <td>{r.total_price.toFixed(2)}</td>
                <td>{r.notes}</td>
                <td>
                  <button onClick={() => handleEdit(r)} className='edit-button'>Edytuj</button>
                  <button onClick={() => handleDelete(r.id)} className='delete-button'>X</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}

export default RecordTable;
