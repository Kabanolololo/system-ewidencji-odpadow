import React, { useState } from "react";
import "../styles/AddRecord.css";
import "../styles/EditRecordModal.css";

function EditRecordModal({
  record,
  contractors,
  vehicles,
  drivers,
  destinations,
  wasteTypes,
  onSave,
  onCancel
}) {
  const [formData, setFormData] = useState({ ...record });

  const [suggestions, setSuggestions] = useState({
    contractor: [],
    vehicle: [],
    driver: [],
    destination: [],
    wasteType: []
  });

  const handleInputWithSuggestions = (field, value, list) => {
    setFormData({ ...formData, [field]: value });
    if (value.trim() === "") {
      setSuggestions({ ...suggestions, [field]: [] });
      return;
    }
    const filtered = list.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions({ ...suggestions, [field]: filtered });
  };

  const handleSelectSuggestion = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setSuggestions({ ...suggestions, [field]: [] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onCancel}>
          ×
        </button>
        <h2>Edytuj Ewidencję</h2>

        <label>
          Kontrahent:
          <input
            type="text"
            name="contractor"
            placeholder="Wprowadź kontrahenta"
            value={formData.contractor || ""}
            onChange={(e) =>
              handleInputWithSuggestions("contractor", e.target.value, contractors)
            }
            autoComplete="off"
          />
          {suggestions.contractor.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.contractor.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectSuggestion("contractor", s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Pojazd:
          <input
            type="text"
            name="vehicle"
            placeholder="Wprowadź pojazd"
            value={formData.vehicle || ""}
            onChange={(e) =>
              handleInputWithSuggestions("vehicle", e.target.value, vehicles)
            }
            autoComplete="off"
          />
          {suggestions.vehicle.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.vehicle.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectSuggestion("vehicle", s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Kierowca:
          <input
            type="text"
            name="driver"
            placeholder="Wprowadź kierowcę"
            value={formData.driver || ""}
            onChange={(e) =>
              handleInputWithSuggestions("driver", e.target.value, drivers)
            }
            autoComplete="off"
          />
          {suggestions.driver.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.driver.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectSuggestion("driver", s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Destynacja:
          <input
            type="text"
            name="destination"
            placeholder="Wprowadź destynację"
            value={formData.destination || ""}
            onChange={(e) =>
              handleInputWithSuggestions("destination", e.target.value, destinations)
            }
            autoComplete="off"
          />
          {suggestions.destination.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.destination.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectSuggestion("destination", s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Typ odpadu:
          <input
            type="text"
            name="wasteType"
            placeholder="Wprowadź typ odpadu"
            value={formData.wasteType || ""}
            onChange={(e) =>
              handleInputWithSuggestions("wasteType", e.target.value, wasteTypes)
            }
            autoComplete="off"
          />
          {suggestions.wasteType.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.wasteType.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectSuggestion("wasteType", s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Masa (kg):
          <input
            type="number"
            name="mass"
            placeholder="Wprowadź masę"
            min="0"
            value={formData.mass || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Cena za kg (PLN):
          <input
            type="number"
            name="pricePerKg"
            min="0"
            placeholder="Wprowadź cenę za kg"
            step="0.01"
            value={formData.pricePerKg || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Data przekazania:
          <input
            type="date"
            placeholder="Wybierz datę"
            name="date"
            value={formData.date || ""}
            onChange={handleChange}
          />
        </label>

        <div className="buttons">
          <button onClick={handleSave}>Zapisz</button>
          <button onClick={onCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}

export default EditRecordModal;
