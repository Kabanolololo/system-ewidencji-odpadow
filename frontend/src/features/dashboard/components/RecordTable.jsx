import React, { useState, useMemo } from "react";
import EditRecordModal from "./EditRecordModal";
import "../styles/RecordTable.css";

function RecordTable() {
  // Przykładowe rekordy z nowymi polami tekstowymi
  const [records, setRecords] = useState([
    {
      id: 1,
      contractor_nip: "1234567890",
      user_username: "jan_kowalski",
      waste_code: "WST001",
      vehicle_registration_number: "XYZ1234",
      driver_full_name: "Adam Nowak",
      destination_name: "Zakład Utylizacji",
      transfer_date: "2025-07-31",
      mass_kg: 1200,
      price_per_kg: 2.5,
      total_price: 3000,
      notes: "Przykładowy rekord",
    },
  ]);

  const [filters, setFilters] = useState({
    contractor_nip: "",
    user_username: "",
    waste_code: "",
    vehicle_registration_number: "",
    driver_full_name: "",
    destination_name: "",
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
      // Filtry tekstowe - sprawdzanie, czy zawiera fragment (case insensitive)
      if (filters.contractor_nip && !r.contractor_nip.toLowerCase().includes(filters.contractor_nip.toLowerCase())) return false;
      if (filters.user_username && !r.user_username.toLowerCase().includes(filters.user_username.toLowerCase())) return false;
      if (filters.waste_code && !r.waste_code.toLowerCase().includes(filters.waste_code.toLowerCase())) return false;
      if (filters.vehicle_registration_number && !r.vehicle_registration_number.toLowerCase().includes(filters.vehicle_registration_number.toLowerCase())) return false;
      if (filters.driver_full_name && !r.driver_full_name.toLowerCase().includes(filters.driver_full_name.toLowerCase())) return false;
      if (filters.destination_name && !r.destination_name.toLowerCase().includes(filters.destination_name.toLowerCase())) return false;

      // Filtry zakresowe
      if (filters.transfer_date_from && r.transfer_date < filters.transfer_date_from) return false;
      if (filters.transfer_date_to && r.transfer_date > filters.transfer_date_to) return false;

      if (filters.mass_kg_min && r.mass_kg < Number(filters.mass_kg_min)) return false;
      if (filters.mass_kg_max && r.mass_kg > Number(filters.mass_kg_max)) return false;

      if (filters.price_per_kg_min && r.price_per_kg < Number(filters.price_per_kg_min)) return false;
      if (filters.price_per_kg_max && r.price_per_kg > Number(filters.price_per_kg_max)) return false;

      if (filters.total_price_min && r.total_price < Number(filters.total_price_min)) return false;
      if (filters.total_price_max && r.total_price > Number(filters.total_price_max)) return false;

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
  return (
    <span style={{ fontSize: "10px", color: "#4CAF50"}}>
      {sortDir === "asc" ? "▲" : "▼"}
    </span>
  );
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
        {/* Filtry tekstowe */}
        <div className="filter-item">
          <label>Kontrahent NIP</label>
          <input
            type="text"
            name="contractor_nip"
            value={filters.contractor_nip}
            onChange={handleFilterChange}
            placeholder="Kontrahent NIP"
          />
        </div>
        <div className="filter-item">
          <label>Użytkownik</label>
          <input
            type="text"
            name="user_username"
            value={filters.user_username}
            onChange={handleFilterChange}
            placeholder="Nazwa użytkownika"
          />
        </div>
        <div className="filter-item">
          <label>Typ odpadu (kod)</label>
          <input
            type="text"
            name="waste_code"
            value={filters.waste_code}
            onChange={handleFilterChange}
            placeholder="Kod odpadu"
          />
        </div>
        <div className="filter-item">
          <label>Numer rejestracyjny pojazdu</label>
          <input
            type="text"
            name="vehicle_registration_number"
            value={filters.vehicle_registration_number}
            onChange={handleFilterChange}
            placeholder="Numer rejestracyjny"
          />
        </div>
        <div className="filter-item">
          <label>Kierowca (pełna nazwa)</label>
          <input
            type="text"
            name="driver_full_name"
            value={filters.driver_full_name}
            onChange={handleFilterChange}
            placeholder="Imię i nazwisko kierowcy"
          />
        </div>
        <div className="filter-item">
          <label>Destynacja</label>
          <input
            type="text"
            name="destination_name"
            value={filters.destination_name}
            onChange={handleFilterChange}
            placeholder="Nazwa destynacji"
          />
        </div>

        {/* Filtry zakresowe */}
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
              { label: "Kontrahent NIP", field: "contractor_nip" },
              { label: "Użytkownik", field: "user_username" },
              { label: "Typ odpadu (kod)", field: "waste_code" },
              { label: "Nr rejestracyjny pojazdu", field: "vehicle_registration_number" },
              { label: "Kierowca", field: "driver_full_name" },
              { label: "Destynacja", field: "destination_name" },
              { label: "Data transferu", field: "transfer_date" },
              { label: "Masa (kg)", field: "mass_kg" },
              { label: "Cena/kg (PLN)", field: "price_per_kg" },
              { label: "Cena łączna (PLN)", field: "total_price" },
              { label: "Notatki", field: "notes" },
              { label: "Akcje", field: null }
            ].map(({ label, field }) => (
              <th
                key={label}
                
                onClick={field ? () => handleSortChange(field) : undefined}
                style={{ cursor: field ? "pointer" : "default" }}
              >
                {label} {field && renderSortIcon(field)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredSortedRecords.length === 0 ? (
            <tr>
              <td colSpan="14" style={{ textAlign: "center" }}>
                Brak rekordów do wyświetlenia
              </td>
            </tr>
          ) : (
            filteredSortedRecords.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.contractor_nip}</td>
                <td>{r.user_username}</td>
                <td>{r.waste_code}</td>
                <td>{r.vehicle_registration_number}</td>
                <td>{r.driver_full_name}</td>
                <td>{r.destination_name}</td>
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
