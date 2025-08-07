import React, { useState, useEffect, useMemo } from "react";
import EditRecordModal from "./EditRecordModal";
import "../../styles/RecordTable.css";
import { fetchAllWasteRecordsWithStoredToken, deleteWasteRecordById } from "../../../../api/Records";

export default function RecordTable() {

  // Stan dla rekordow 
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({
    contractor_nip: "",
    user_username: "",
    waste_code: "",
    vehicle_registration_number: "",
    driver_full_name: "",
    transfer_date_from: "",
    transfer_date_to: "",
    mass_kg_min: "",
    mass_kg_max: "",
    price_per_kg_min: "",
    price_per_kg_max: "",
    total_price_min: "",
    total_price_max: "",
  });

  // stany do filtorwania i sortowania oraz errorow
  const [sortBy, setSortBy] = useState("transfer_date");
  const [sortDir, setSortDir] = useState("desc");
  const [error, setError] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null); 

  // Ładowanie rekordow przy pierwszym renderowaniu i przy zmianie wyszukiwania lub sortowania
  const fetchData = async () => {
    try {
      setError(null);

      const { transfer_date_from, transfer_date_to } = prepareDateRange(filters);

      const cleanedFilters = Object.fromEntries(
        Object.entries({
          ...filters,
          transfer_date_from,
          transfer_date_to,
          sort_by: sortBy,
          sort_order: sortDir,
        }).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      const data = await fetchAllWasteRecordsWithStoredToken(cleanedFilters);
      setRecords(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Brak danych w systemie.");
      setRecords([]);
    }
  };

  const prepareDateRange = (filters) => {
    const { transfer_date_from, transfer_date_to } = filters;

    if (
      transfer_date_from &&
      transfer_date_to &&
      new Date(transfer_date_from) > new Date(transfer_date_to)
    ) {
      return {
        transfer_date_from: transfer_date_to,
        transfer_date_to: transfer_date_from,
      };
    }

    return { transfer_date_from, transfer_date_to };
  };

  useEffect(() => {
    fetchData();
  }, [filters, sortBy, sortDir]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };
  
  // Filtorowanie danych
  const filteredSortedRecords = useMemo(() => {
    let filtered = records.filter((r) => {
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
      <span style={{ fontSize: "10px", color: "#4CAF50" }}>
        {sortDir === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  // Funkcja dla edycji danych przekaazujaca dla komponentu editrecordmodal
  const handleEdit = (record) => {
    console.log("Edytowany rekord ID:", record.id);
    setEditingRecord({
      id: record.id,
      contractor_nip: "",
      user_username: "",
      waste_code: "",
      vehicle_registration_number: "",
      driver_full_name: "",
      destination_return_destination: "",
      transfer_date: "",
      mass_kg: "",
      price_per_kg: "",
      total_price: "",
      notes: "",
    });
  };

  // Funkcja do usuwania rekordu
  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten rekord?")) {
      try {
        await deleteWasteRecordById(id);
        console.log("Usunięto rekord o ID:", id);
        fetchData();
      } catch (error) {
        console.error("Błąd podczas usuwania rekordu:", error);
        alert("Nie udało się usunąć rekordu: " + error.message);
      }
    }
  };

  // Funkcja do zamykania panelu edycji
  const handleCloseModal = () => {
    setEditingRecord(null);
    fetchData();
  };

  return (
    <div className="record-table-wrapper">

      {/* Filtry ZAWSZE widoczne */}
      <div className="filters">
        {/* Pola filtrów */}
        <div className="filter-item">
          <label>Kontrahent NIP</label>
          <input
            type="text"
            name="contractor_nip"
            value={filters.contractor_nip}
            onChange={handleInputChange}
            placeholder="NIP kontrahenta"
          />
        </div>
        <div className="filter-item">
          <label>Użytkownik</label>
          <input
            type="text"
            name="user_username"
            value={filters.user_username}
            onChange={handleInputChange}
            placeholder="Użytkownik"
          />
        </div>
        <div className="filter-item">
          <label>Typ odpadu (kod)</label>
          <input
            type="text"
            name="waste_code"
            value={filters.waste_code}
            onChange={handleInputChange}
            placeholder="Kod odpadu"
          />
        </div>
        <div className="filter-item">
          <label>Nr rejestracyjny pojazdu</label>
          <input
            type="text"
            name="vehicle_registration_number"
            value={filters.vehicle_registration_number}
            onChange={handleInputChange}
            placeholder="Nr rejestracyjny"
          />
        </div>
        <div className="filter-item">
          <label>Kierowca (pełna nazwa)</label>
          <input
            type="text"
            name="driver_full_name"
            value={filters.driver_full_name}
            onChange={handleInputChange}
            placeholder="Kierowca"
          />
        </div>

        {/* Zakresy */}
        <div className="filter-item">
          <label>Data od</label>
          <input
            type="date"
            name="transfer_date_from"
            value={filters.transfer_date_from}
            onChange={handleInputChange}
          />
        </div>
        <div className="filter-item">
          <label>Data do</label>
          <input
            type="date"
            name="transfer_date_to"
            value={filters.transfer_date_to}
            onChange={handleInputChange}
          />
        </div>
        <div className="filter-item">
          <label>Masa min (kg)</label>
          <input
            type="number"
            name="mass_kg_min"
            value={filters.mass_kg_min}
            onChange={handleInputChange}
            placeholder="Min"
          />
        </div>
        <div className="filter-item">
          <label>Masa max (kg)</label>
          <input
            type="number"
            name="mass_kg_max"
            value={filters.mass_kg_max}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            placeholder="Max"
          />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Tabela tylko jeśli nie ma błędu i są dane */}
      {!error && filteredSortedRecords.length > 0 && (
        <table className="record-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("contractor_nip")}
                style={{ cursor: "pointer" }}
              >
                Kontrahent NIP {renderSortIcon("contractor_nip")}
              </th>
              <th
                onClick={() => handleSort("user_username")}
                style={{ cursor: "pointer" }}
              >
                Użytkownik {renderSortIcon("user_username")}
              </th>
              <th
                onClick={() => handleSort("waste_code")}
                style={{ cursor: "pointer" }}
              >
                Typ odpadu (kod) {renderSortIcon("waste_code")}
              </th>
              <th
                onClick={() => handleSort("vehicle_registration_number")}
                style={{ cursor: "pointer" }}
              >
                Nr rejestracyjny pojazdu {renderSortIcon("vehicle_registration_number")}
              </th>
              <th
                onClick={() => handleSort("driver_full_name")}
                style={{ cursor: "pointer" }}
              >
                Kierowca {renderSortIcon("driver_full_name")}
              </th>
              <th>Destynacja</th>
              <th
                onClick={() => handleSort("transfer_date")}
                style={{ cursor: "pointer" }}
              >
                Data transferu {renderSortIcon("transfer_date")}
              </th>
              <th
                onClick={() => handleSort("mass_kg")}
                style={{ cursor: "pointer" }}
              >
                Masa (kg) {renderSortIcon("mass_kg")}
              </th>
              <th
                onClick={() => handleSort("price_per_kg")}
                style={{ cursor: "pointer" }}
              >
                Cena/kg (PLN) {renderSortIcon("price_per_kg")}
              </th>
              <th
                onClick={() => handleSort("total_price")}
                style={{ cursor: "pointer" }}
              >
                Cena łączna (PLN) {renderSortIcon("total_price")}
              </th>
              <th>Notatki</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredSortedRecords.map((record) => (
              <tr key={record.id} className="record-row">
                <td>{record.contractor?.nip || "-"}</td>
                <td>{record.user?.username || "-"}</td>
                <td>{record.waste?.code || "-"}</td>
                <td>{record.vehicle?.registration_number || "-"}</td>
                <td>{record.driver?.full_name || "-"}</td>
                <td>{record.destination?.return_destination || "-"}</td>
                <td>{record.transfer_date}</td>
                <td>{record.mass_kg}</td>
                <td>{record.price_per_kg.toFixed(2)}</td>
                <td>{record.total_price.toFixed(2)}</td>
                <td>{record.notes || "-"}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(record)}
                  >
                    Edytuj
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(record.id)}
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Jeśli nie ma błędu i brak wyników — nie pokazujemy nic */}
      {editingRecord && (
      <EditRecordModal
        record={editingRecord}
        onCancel={handleCloseModal} 
        onSave={(updatedRecord) => {
          console.log("Zapisuję rekord:", updatedRecord);
          setEditingRecord(null);
          fetchData();
        }}
      />
    )}
    </div>
  );
}