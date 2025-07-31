import React, { useState } from "react";
import '../styles/AddRecord.css';

function AddRecord({
  contractors,
  vehicles,
  drivers,
  destinations,
  wasteTypes,
  onAddRecord,
  onCancel
}) {
  const [newRecord, setNewRecord] = useState({
    contractor: '',
    destination: '',
    vehicle: '',
    driver: '',
    wasteType: '',
    mass: '',
    pricePerKg: '',
    date: ''
  });

  const [suggestions, setSuggestions] = useState({
    contractor: [],
    vehicle: [],
    driver: [],
    destination: [],
    wasteType: []
  });

  const handleInputWithSuggestions = (field, value, list) => {
    setNewRecord({ ...newRecord, [field]: value });
    if (value.trim() === '') {
      setSuggestions({ ...suggestions, [field]: [] });
      return;
    }
    const filtered = list.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions({ ...suggestions, [field]: filtered });
  };

  const handleSelectSuggestion = (field, value) => {
    setNewRecord({ ...newRecord, [field]: value });
    setSuggestions({ ...suggestions, [field]: [] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecord(newRecord);
    setNewRecord({
      contractor: '',
      destination: '',
      vehicle: '',
      driver: '',
      wasteType: '',
      mass: '',
      pricePerKg: '',
      date: ''
    });
    setSuggestions({
      contractor: [],
      vehicle: [],
      driver: [],
      destination: [],
      wasteType: []
    });
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Kontrahent:
          <input
            type="text"
            value={newRecord.contractor}
            onChange={e => handleInputWithSuggestions('contractor', e.target.value, contractors)}
            placeholder="Wpisz lub wybierz kontrahenta"
            autoComplete="off"
            required
          />
          {suggestions.contractor.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.contractor.map((s, i) => (
                <li key={i} onClick={() => handleSelectSuggestion('contractor', s)}>{s}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Pojazd:
          <input
            type="text"
            value={newRecord.vehicle}
            onChange={e => handleInputWithSuggestions('vehicle', e.target.value, vehicles)}
            placeholder="Wpisz lub wybierz pojazd"
            autoComplete="off"
            required
          />
          {suggestions.vehicle.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.vehicle.map((s, i) => (
                <li key={i} onClick={() => handleSelectSuggestion('vehicle', s)}>{s}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Kierowca:
          <input
            type="text"
            value={newRecord.driver}
            onChange={e => handleInputWithSuggestions('driver', e.target.value, drivers)}
            placeholder="Wpisz lub wybierz kierowcę"
            autoComplete="off"
            required
          />
          {suggestions.driver.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.driver.map((s, i) => (
                <li key={i} onClick={() => handleSelectSuggestion('driver', s)}>{s}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Destynacja:
          <input
            type="text"
            value={newRecord.destination}
            onChange={e => handleInputWithSuggestions('destination', e.target.value, destinations)}
            placeholder="Wpisz lub wybierz destynację"
            autoComplete="off"
            required
          />
          {suggestions.destination.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.destination.map((s, i) => (
                <li key={i} onClick={() => handleSelectSuggestion('destination', s)}>{s}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Typ odpadu:
          <input
            type="text"
            value={newRecord.wasteType}
            onChange={e => handleInputWithSuggestions('wasteType', e.target.value, wasteTypes)}
            placeholder="Wpisz lub wybierz typ odpadu"
            autoComplete="off"
            required
          />
          {suggestions.wasteType.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.wasteType.map((s, i) => (
                <li key={i} onClick={() => handleSelectSuggestion('wasteType', s)}>{s}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Masa (kg):
          <input
            type="number"
            min="0"
            value={newRecord.mass}
            onChange={e => setNewRecord({ ...newRecord, mass: e.target.value })}
            required
          />
        </label>

        <label>
          Cena za kg (PLN):
          <input
            type="number"
            step="0.01"
            min="0"
            value={newRecord.pricePerKg}
            onChange={e => setNewRecord({ ...newRecord, pricePerKg: e.target.value })}
            required
          />
        </label>

        <label>
          Data przekazania:
          <input
            type="date"
            value={newRecord.date}
            onChange={e => setNewRecord({ ...newRecord, date: e.target.value })}
            required
          />
        </label>

        <div className="form-actions">
          <button type="button" className="btn-primary">Dodaj</button>
          <button type="button" className="btn-outline" onClick={onCancel}>Anuluj</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecord;