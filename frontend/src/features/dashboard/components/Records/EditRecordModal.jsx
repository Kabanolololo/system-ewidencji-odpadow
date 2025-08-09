import React, { useState } from "react";
import { fetchAllContractorsWithStoredToken } from "../../../../api/Contractors"; 
import { fetchAllVehiclesWithStoredToken } from "../../../../api/Vehicles";
import { fetchAllDriversWithStoredToken } from "../../../../api/Drivers";
import { fetchAllDestinationsWithStoredToken } from "../../../../api/Destinations";
import { fetchAllWastesWithStoredToken } from "../../../../api/Waste";
import { updateWasteRecordById } from "../../../../api/Records";
import "../../styles/AddRecord.css";
import "../../styles/EditRecordModal.css";

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
  const [formData, setFormData] = useState({
    id: record.id,  
    contractor_id: record.contractor_id || null,
    user_id: localStorage.getItem("user_id")|| null,
    waste_id: record.waste_id || null,
    vehicle_id: record.vehicle_id || null,
    driver_id: record.driver_id || null, 
    destination_id: record.destination_id || null,
    transfer_date: record.transfer_date || "",
    mass_kg: record.mass_kg || "",
    price_per_kg: record.price_per_kg || "",
    total_price: record.total_price || 0,
    notes: record.notes || "",
  });
  const [destinationResults, setDestinationResults] = useState([]);
  const [nipSuggestions, setNipSuggestions] = useState([]);
  const [vehicleSuggestions, setVehicleSuggestions] = useState([]);
  const [driverSuggestions, setDriverSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState({
    country: [],
    city: [],
    address: [],
  });
  const [wasteSuggestions, setWasteSuggestions] = useState([]);

  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  
  const handleNipInput = async (value) => {
    setFormData((prev) => ({
      ...prev,
      contractorNip: value,
    }));

    if (value.trim().length < 3) {
      setNipSuggestions([]);
      return;
    }

    try {
      const contractors = await fetchAllContractorsWithStoredToken({ nip: value });
      setNipSuggestions(contractors);
    } catch (error) {
      console.error("Błąd pobierania kontrahentów:", error);
      setNipSuggestions([]);
    }
  };

  const handleVehicleInput = async (value) => {
    setFormData((prev) => ({
      ...prev,
      vehicleRegistrationNumber: value,
    }));

    if (value.trim().length < 2) {
      setVehicleSuggestions([]);
      return;
    }

    try {
      const vehicles = await fetchAllVehiclesWithStoredToken({ registration_number: value });
      setVehicleSuggestions(vehicles);
    } catch (error) {
      console.error("Błąd pobierania pojazdów:", error);
      setVehicleSuggestions([]);
    }
  };

  const handleDriverInput = async (value) => {
    setFormData((prev) => ({
      ...prev,
      driverFullName: value,
    }));

    if (value.trim().length < 2) {
      setDriverSuggestions([]);
      return;
    }

    const [name, ...surnameParts] = value.trim().split(" ");
    const surname = surnameParts.join(" ");

    try {
      const drivers = await fetchAllDriversWithStoredToken({
        name,
        surname
      });
      setDriverSuggestions(drivers);
    } catch (error) {
      console.error("Błąd pobierania kierowców:", error);
      setDriverSuggestions([]);
    }
  };

  const handleCountryInput = async (value) => {
    setFormData((prev) => ({ ...prev, destinationCountry: value, destinationCity: "", destinationAddress: "" }));
    if (value.trim().length < 2) {
      setDestinationSuggestions((prev) => ({ ...prev, country: [] }));
      return;
    }

    try {
      const result = await fetchAllDestinationsWithStoredToken({ country: value });
      const uniqueCountries = [...new Set(result.map(d => d.country))];
      setDestinationSuggestions((prev) => ({ ...prev, country: uniqueCountries }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCityInput = async (value) => {
    setFormData((prev) => ({ ...prev, destinationCity: value, destinationAddress: "" }));
    if (value.trim().length < 2 || !formData.destinationCountry) {
      setDestinationSuggestions((prev) => ({ ...prev, city: [] }));
      return;
    }

    try {
      const result = await fetchAllDestinationsWithStoredToken({ country: formData.destinationCountry, city: value });
      const uniqueCities = [...new Set(result.map(d => d.city))];
      setDestinationSuggestions((prev) => ({ ...prev, city: uniqueCities }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddressInput = async (value) => {
    setFormData((prev) => ({ ...prev, destinationAddress: value }));
    if (value.trim().length < 2 || !formData.destinationCountry || !formData.destinationCity) {
      setDestinationSuggestions((prev) => ({ ...prev, address: [] }));
      setDestinationResults([]);
      return;
    }

    try {
      const result = await fetchAllDestinationsWithStoredToken({
        country: formData.destinationCountry,
        city: formData.destinationCity,
        address: value,
      });
      const uniqueAddresses = [...new Set(result.map(d => d.address))];
      setDestinationSuggestions((prev) => ({ ...prev, address: uniqueAddresses }));
      setDestinationResults(result);
    } catch (err) {
      console.error(err);
      setDestinationResults([]);
    }
  };

  const handleWasteInput = async (value) => {
    setFormData((prev) => ({
      ...prev,
      wasteCode: value,
    }));

    if (value.trim().length < 3) {
      setWasteSuggestions([]);
      return;
    }

    try {
      const result = await fetchAllWastesWithStoredToken({ code: value });
      setWasteSuggestions(result);
    } catch (error) {
      console.error("Błąd pobierania odpadów:", error);
      setWasteSuggestions([]);
    }
  };

  const handleNipSelect = (contractor) => {
    setFormData((prev) => ({
      ...prev,
      contractor_id: contractor.id,
      contractorNip: contractor.nip,
    }));
    setNipSuggestions([]);
  };

  const handleVehicleSelect = (vehicle) => {
    setFormData((prev) => ({
      ...prev,
      vehicle_id: vehicle.id,
      vehicleRegistrationNumber: vehicle.registration_number,
    }));
    setVehicleSuggestions([]);
  };

  const handleDriverSelect = (driver) => {
    setFormData((prev) => ({
      ...prev,
      driver_id: driver.id,
      driverFullName: `${driver.name} ${driver.surname}`,
    }));
    setDriverSuggestions([]);
  };

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({
      ...prev,
      destinationCountry: country,
      destinationCity: "",
      destinationAddress: "",
      destination_id: null,
    }));
    setDestinationSuggestions({ country: [], city: [], address: [] });
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({
      ...prev,
      destinationCity: city,
      destinationAddress: "",
      destination_id: null,
    }));
    setDestinationSuggestions({ ...destinationSuggestions, city: [], address: [] });
  };

  const handleAddressSelect = (address) => {
    setFormData((prev) => {
      // Znajdź wybrany obiekt w destinationResults:
      const selectedDestination = destinationResults.find(d => d.address === address 
        && d.city === prev.destinationCity 
        && d.country === prev.destinationCountry);

      return {
        ...prev,
        destinationAddress: address,
        destination_id: selectedDestination ? selectedDestination.id : null,
      };
    });
    setDestinationSuggestions((prev) => ({ ...prev, address: [] }));
  };



  const handleWasteSelect = (waste) => {
    setFormData((prev) => ({
      ...prev,
      waste_id: waste.id,
      wasteCode: waste.code,
    }));
    setWasteSuggestions([]);
  };


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
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };


  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    const payload = {
      ...formData,
      mass_kg: formData.mass_kg === "" ? null : Number(formData.mass_kg),
      price_per_kg: formData.price_per_kg === "" ? null : Number(formData.price_per_kg),
      transfer_date: formData.transfer_date === "" ? null : formData.transfer_date,
    };

    try {
      const updatedRecord = await updateWasteRecordById(payload.id, payload);
      onSave(updatedRecord);
    } catch (error) {
      console.error("Błąd podczas zapisywania rekordu:", error);
      setSaveError("Wystąpił błąd podczas zapisywania rekordu. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onCancel}>
          ×
        </button>
        <h2>Edytuj Ewidencję</h2>

        <label>
          NIP kontrahenta:
          <input
            type="text"
            name="contractorNip"
            placeholder="Wpisz NIP kontrahenta"
            value={formData.contractorNip || ""}
            onChange={(e) => handleNipInput(e.target.value)}
            autoComplete="off"
          />
          {nipSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {nipSuggestions.map((contractor, i) => (
                <li key={i} onClick={() => handleNipSelect(contractor)}>
                  {contractor.nip}
                </li>
              ))}
            </ul>
          )}
        </label>

       <label>
          Numer rejestracyjny pojazdu:
          <input
            type="text"
            name="vehicleRegistrationNumber"
            placeholder="Wprowadź nr rejestracyjny"
            value={formData.vehicleRegistrationNumber || ""}
            onChange={(e) => handleVehicleInput(e.target.value)}
            autoComplete="off"
          />
          {vehicleSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {vehicleSuggestions.map((vehicle, i) => (
                <li key={i} onClick={() => handleVehicleSelect(vehicle)}>
                  {vehicle.registration_number}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Kierowca (imię i nazwisko):
          <input
            type="text"
            name="driverFullName"
            placeholder="Wpisz imię i nazwisko"
            value={formData.driverFullName || ""}
            onChange={(e) => handleDriverInput(e.target.value)}
            autoComplete="off"
          />
          {driverSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {driverSuggestions.map((driver, i) => (
                <li key={i} onClick={() => handleDriverSelect(driver)}>
                  {driver.name} {driver.surname}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Kraj:
          <input
            type="text"
            name="destinationCountry"
            placeholder="Wprowadź kraj"
            value={formData.destinationCountry || ""}
            onChange={(e) => handleCountryInput(e.target.value)}
            autoComplete="off"
          />
          {destinationSuggestions.country.length > 0 && (
            <ul className="suggestions-list">
              {destinationSuggestions.country.map((item, i) => (
                <li key={i} onClick={() => handleCountrySelect(item)}>{item}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Miasto:
          <input
            type="text"
            name="destinationCity"
            placeholder="Wprowadź miasto"
            value={formData.destinationCity || ""}
            onChange={(e) => handleCityInput(e.target.value)}
            autoComplete="off"
          />
          {destinationSuggestions.city.length > 0 && (
            <ul className="suggestions-list">
              {destinationSuggestions.city.map((item, i) => (
                <li key={i} onClick={() => handleCitySelect(item)}>{item}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Ulica:
          <input
            type="text"
            name="destinationAddress"
            placeholder="Wprowadź ulicę"
            value={formData.destinationAddress || ""}
            onChange={(e) => handleAddressInput(e.target.value)}
            autoComplete="off"
          />
          {destinationSuggestions.address.length > 0 && (
            <ul className="suggestions-list">
              {destinationSuggestions.address.map((item, i) => (
                <li key={i} onClick={() => handleAddressSelect(item)}>{item}</li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Kod odpadu:
          <input
            type="text"
            name="wasteCode"
            placeholder="Wprowadź kod odpadu"
            value={formData.wasteCode || ""}
            onChange={(e) => handleWasteInput(e.target.value)}
            autoComplete="off"
          />
          {wasteSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {wasteSuggestions.map((waste, i) => (
                <li key={i} onClick={() => handleWasteSelect(waste)}>
                  {waste.code}
                </li>
              ))}
            </ul>
          )}
        </label>


        <label>
          Masa (kg):
          <input
            type="number"
            name="mass_kg"
            placeholder="Wprowadź masę"
            min="0"
            value={formData.mass_kg}
            onChange={handleChange}
          />
        </label>

        <label>
          Cena za kg (PLN):
          <input
            type="number"
            name="price_per_kg"
            min="0"
            placeholder="Wprowadź cenę za kg"
            step="0.01"
            value={formData.price_per_kg}
            onChange={handleChange}
          />
        </label>

        <label>
          Data przekazania:
          <input
            type="date"
            placeholder="Wybierz datę"
            name="transfer_date"
            value={formData.transfer_date}
            onChange={handleChange}
          />
        </label>

        {saveError && <p className="error">{saveError}</p>}
        {saving && <p className="loading">Zapisywanie zmian...</p>}

        <div className="buttons">
          <button onClick={handleSave}>Zapisz</button>
          <button onClick={onCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}

export default EditRecordModal;