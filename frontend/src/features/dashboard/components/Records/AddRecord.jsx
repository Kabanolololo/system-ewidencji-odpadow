import React, { useState } from "react";
import { fetchAllContractorsWithStoredToken } from "../../../../api/Contractors";
import { fetchAllVehiclesWithStoredToken } from "../../../../api/Vehicles";
import { fetchAllDriversWithStoredToken } from "../../../../api/Drivers";
import {fetchAllDestinationsWithStoredToken } from "../../../../api/Destinations";
import { fetchAllWastesWithStoredToken } from "../../../../api/Waste";
import { createNewWasteRecord } from "../../../../api/Records"
import '../../styles/AddRecord.css';

function AddRecord({ onAddRecord, onCancel }) {
  const [newRecord, setNewRecord] = useState({
    contractorId: '',
    contractor: '',
    destinationId: '',
    country: '',
    city: '',
    street: '',
    vehicleId: '',
    vehicle: '',
    driverId: '',
    driver: '',
    wasteTypeId: '',
    wasteType: '',
    mass: '',
    pricePerKg: '',
    date: '',
    notes: ''
  });

  // Selecty z podpowiedziami
  const [contractorOptions, setContractorOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [streetOptions, setStreetOptions] = useState([]);
  
  const [wasteTypeOptions, setWasteTypeOptions] = useState([]);

  // --- Kontrahent ---
  const handleContractorSearch = async (value) => {
    setNewRecord(prev => ({ ...prev, contractor: value, contractorId: '' }));
    if (value.length < 3) {
      setContractorOptions([]);
      return;
    }
    try {
      const result = await fetchAllContractorsWithStoredToken({ nip: value });
      setContractorOptions(result);
    } catch (error) {
      console.error("Błąd podczas pobierania kontrahentów:", error);
      setContractorOptions([]);
    }
  };

  // --- Pojazd ---
  const handleVehicleSearch = async (value) => {
    setNewRecord(prev => ({ ...prev, vehicle: value, vehicleId: '' }));
    if (value.length < 2) {
      setVehicleOptions([]);
      return;
    }
    try {
      const result = await fetchAllVehiclesWithStoredToken({ registration_number: value });
      setVehicleOptions(result);
    } catch (error) {
      console.error("Błąd podczas pobierania pojazdów:", error);
      setVehicleOptions([]);
    }
  };

  // --- Kierowca ---
  const handleDriverSearch = async (value) => {
    setNewRecord(prev => ({ ...prev, driver: value, driverId: '' }));
    if (value.length < 2) {
      setDriverOptions([]);
      return;
    }
    try {
      const result = await fetchAllDriversWithStoredToken({ name: value });
      setDriverOptions(result);
    } catch (error) {
      console.error("Błąd podczas pobierania kierowców:", error);
      setDriverOptions([]);
    }
  };

  // --- Destynacja - Kraj ---
  const handleCountrySearch = async (value) => {
    setNewRecord(prev => ({
      ...prev,
      country: value,
      city: '',
      street: '',
      destinationId: ''
    }));
    setCityOptions([]);
    setStreetOptions([]);
    if (value.length < 2) {
      setCountryOptions([]);
      return;
    }
    try {
      const result = await fetchAllDestinationsWithStoredToken({ country: value });
      const uniqueCountries = [...new Set(result.map(d => d.country))].map(c => ({ country: c }));
      setCountryOptions(uniqueCountries);
    } catch (error) {
      console.error("Błąd podczas pobierania krajów:", error);
      setCountryOptions([]);
    }
  };

  // --- Destynacja - Miasto ---
  const handleCitySearch = async (value) => {
    setNewRecord(prev => ({
      ...prev,
      city: value,
      street: '',
      destinationId: ''
    }));
    setStreetOptions([]);
    if (value.length < 2 || !newRecord.country) {
      setCityOptions([]);
      return;
    }
    try {
      const result = await fetchAllDestinationsWithStoredToken({ country: newRecord.country, city: value });
      const uniqueCities = [...new Set(result.map(d => d.city))].map(c => ({ city: c }));
      setCityOptions(uniqueCities);
    } catch (error) {
      console.error("Błąd podczas pobierania miast:", error);
      setCityOptions([]);
    }
  };

  // --- Destynacja - Ulica ---
  const handleStreetSearch = async (value) => {
    setNewRecord(prev => ({
      ...prev,
      street: value,
      destinationId: ''
    }));
    if (value.length < 2 || !newRecord.country || !newRecord.city) {
      setStreetOptions([]);
      return;
    }
    try {
      const result = await fetchAllDestinationsWithStoredToken({
        country: newRecord.country,
        city: newRecord.city,
        address: value
      });
      setStreetOptions(result);
    } catch (error) {
      console.error("Błąd podczas pobierania ulic:", error);
      setStreetOptions([]);
    }
  };

  // --- Typ odpadu ---
  const handleWasteTypeSearch = async (value) => {
    setNewRecord(prev => ({ ...prev, wasteType: value, wasteTypeId: '' }));
    if (value.length < 2) {
      setWasteTypeOptions([]);
      return;
    }
    try {
      const result = await fetchAllWastesWithStoredToken({ code: value });
      setWasteTypeOptions(result);
    } catch (error) {
      console.error("Błąd podczas pobierania typów odpadów:", error);
      setWasteTypeOptions([]);
    }
  };

  // Wysłanie formualarza
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id");

    if (
      !newRecord.contractorId ||
      !newRecord.vehicleId ||
      !newRecord.driverId ||
      !newRecord.destinationId ||
      !newRecord.wasteTypeId
    ) {
      console.log("Brakuje wymaganych pól");
      return;
    }

    try {
      const createdRecord = await createNewWasteRecord({
        contractor_id: newRecord.contractorId,
        user_id: userId,
        waste_id: newRecord.wasteTypeId,
        vehicle_id: newRecord.vehicleId,
        driver_id: newRecord.driverId,
        destination_id: newRecord.destinationId,
        transfer_date: newRecord.date,
        mass_kg: parseFloat(newRecord.mass),
        price_per_kg: parseFloat(newRecord.pricePerKg),
        notes: newRecord.notes,
      });

      console.log("Rekord został dodany do backendu:", createdRecord);

      onAddRecord(createdRecord); 

      setNewRecord({
        contractorId: '',
        contractor: '',
        destinationId: '',
        country: '',
        city: '',
        street: '',
        vehicleId: '',
        vehicle: '',
        driverId: '',
        driver: '',
        wasteTypeId: '',
        wasteType: '',
        mass: '',
        pricePerKg: '',
        date: '',
        notes: ''
      });

      // Wyczyść listy podpowiedzi
      setContractorOptions([]);
      setVehicleOptions([]);
      setDriverOptions([]);
      setCountryOptions([]);
      setCityOptions([]);
      setStreetOptions([]);
      setWasteTypeOptions([]);

    } catch (error) {
      console.error("Błąd podczas dodawania rekordu:", error.message);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">

        {/* Kontrahent */}
        <label>
          Kontrahent (NIP):
          <input
            type="text"
            value={newRecord.contractor}
            onChange={e => handleContractorSearch(e.target.value)}
            placeholder="Wpisz NIP kontrahenta"
            autoComplete="off"
            required
          />
          {contractorOptions.length > 0 && (
            <ul className="suggestions-list">
              {contractorOptions.map(c => (
                <li
                  key={c.id}
                  onClick={() => {
                    setNewRecord(prev => ({
                      ...prev,
                      contractor: c.nip,
                      contractorId: c.id
                    }));
                    setContractorOptions([]);
                  }}
                >
                  {c.name} ({c.nip})
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Pojazd */}
        <label>
          Pojazd (rejestracja):
          <input
            type="text"
            value={newRecord.vehicle}
            onChange={e => handleVehicleSearch(e.target.value)}
            placeholder="Wpisz numer rejestracyjny"
            autoComplete="off"
            required
          />
          {vehicleOptions.length > 0 && (
            <ul className="suggestions-list">
              {vehicleOptions.map(v => (
                <li
                  key={v.id}
                  onClick={() => {
                    setNewRecord(prev => ({
                      ...prev,
                      vehicle: v.registration_number,
                      vehicleId: v.id
                    }));
                    setVehicleOptions([]);
                  }}
                >
                  {v.registration_number}
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Kierowca */}
        <label>
          Kierowca:
          <input
            type="text"
            value={newRecord.driver}
            onChange={e => handleDriverSearch(e.target.value)}
            placeholder="Wpisz imię lub nazwisko"
            autoComplete="off"
            required
          />
          {driverOptions.length > 0 && (
            <ul className="suggestions-list">
              {driverOptions.map(d => (
                <li
                  key={d.id}
                  onClick={() => {
                    setNewRecord(prev => ({
                      ...prev,
                      driver: `${d.name} ${d.surname}`,
                      driverId: d.id
                    }));
                    setDriverOptions([]);
                  }}
                >
                  {d.name} {d.surname}
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Destynacja - Kraj */}
        <label>
          Kraj:
          <input
            type="text"
            value={newRecord.country}
            onChange={e => handleCountrySearch(e.target.value)}
            placeholder="Wpisz kraj"
            autoComplete="off"
            required
          />
          {countryOptions.length > 0 && (
            <ul className="suggestions-list">
              {countryOptions.map((c, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setNewRecord(prev => ({
                      ...prev,
                      country: c.country,
                      city: '',
                      street: '',
                      destinationId: ''
                    }));
                    setCountryOptions([]);
                    setCityOptions([]);
                    setStreetOptions([]);
                  }}
                >
                  {c.country}
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Destynacja - Miasto */}
        <label>
          Miasto:
          <input
            type="text"
            value={newRecord.city}
            onChange={e => handleCitySearch(e.target.value)}
            placeholder="Wpisz miasto"
            autoComplete="off"
            required
            disabled={!newRecord.country}
          />
          {cityOptions.length > 0 && (
            <ul className="suggestions-list">
              {cityOptions.map((c, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setNewRecord(prev => ({
                      ...prev,
                      city: c.city,
                      street: '',
                      destinationId: ''
                    }));
                    setCityOptions([]);
                    setStreetOptions([]);
                  }}
                >
                  {c.city}
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Destynacja - Ulica */}
        <label>
          Ulica:
          <input
            type="text"
            value={newRecord.street}
            onChange={e => handleStreetSearch(e.target.value)}
            placeholder="Wpisz ulicę"
            autoComplete="off"
            required
            disabled={!newRecord.city}
          />
          {streetOptions.length > 0 && (
            <ul className="suggestions-list">
              {streetOptions.map(s => (
                <li
                  key={s.id}
                  onClick={() => {
                    setNewRecord(prev => ({
                      ...prev,
                      street: s.address,  // ustawiamy ulice z pola address
                      destinationId: s.id
                    }));
                    setStreetOptions([]);
                  }}
                >
                  {s.address} {/* wyświetlamy tylko ulicę */}
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Typ odpadu */}
        <label>
          Kod odpadu:
          <input
            type="text"
            value={newRecord.wasteType}
            onChange={e => handleWasteTypeSearch(e.target.value)}
            placeholder="Wpisz kod odpadu"
            autoComplete="off"
            required
          />
          {wasteTypeOptions.length > 0 && (
            <ul className="suggestions-list">
              {wasteTypeOptions.map(w => (
                <li
                  key={w.id}
                  onClick={() => {
                    setNewRecord(prev => ({
                      ...prev,
                      wasteType: w.code,
                      wasteTypeId: w.id
                    }));
                    setWasteTypeOptions([]);
                  }}
                >
                  {w.code} - {w.name}
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Masa */}
        <label>
          Masa (kg):
          <input
            type="number"
            placeholder="Wpisz masę"
            value={newRecord.mass}
            onChange={e => setNewRecord(prev => ({ ...prev, mass: e.target.value }))}
            min="0"
            step="any"
            required
          />
        </label>

        {/* Cena za kg */}
        <label>
          Cena za kg:
          <input
            placeholder="Wpisz cenę"
            type="number"
            value={newRecord.pricePerKg}
            onChange={e => setNewRecord(prev => ({ ...prev, pricePerKg: e.target.value }))}
            min="0"
            step="any"
            required
          />
        </label>

        {/* Data */}
        <label>
          Data:
          <input
            type="date"
            value={newRecord.date}
            onChange={e => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </label>

        {/* Notatki */}
        <label>
          Notatki:
          <textarea
            value={newRecord.notes}
            onChange={e => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Opcjonalne notatki"
          />
        </label>

        {/* Przycisk dodawania */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">Dodaj rekord</button>
          <button type="button" onClick={onCancel} className="btn-outline">Anuluj</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecord;
