// Obsługa pobierania wszystkich rekordów odpadów z backendem
export async function fetchAllWasteRecordsWithStoredToken(filters = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  const {
    contractor_nip,
    user_username,
    waste_code,
    vehicle_registration_number,
    driver_full_name,
    destination_name,
    transfer_date_from,
    transfer_date_to,
    mass_kg_min,
    mass_kg_max,
    price_per_kg_min,
    price_per_kg_max,
    total_price_min,
    total_price_max,
    sort_by,
    sort_order,
  } = filters;

  if (contractor_nip) params.append("contractor_nip", contractor_nip);
  if (user_username) params.append("user_username", user_username);
  if (waste_code) params.append("waste_code", waste_code);
  if (vehicle_registration_number) params.append("vehicle_registration_number", vehicle_registration_number);
  if (driver_full_name) params.append("driver_full_name", driver_full_name);
  if (destination_name) params.append("destination_name", destination_name);
  if (transfer_date_from) params.append("transfer_date_from", transfer_date_from);
  if (transfer_date_to) params.append("transfer_date_to", transfer_date_to);
  if (mass_kg_min) params.append("mass_kg_min", mass_kg_min);
  if (mass_kg_max) params.append("mass_kg_max", mass_kg_max);
  if (price_per_kg_min) params.append("price_per_kg_min", price_per_kg_min);
  if (price_per_kg_max) params.append("price_per_kg_max", price_per_kg_max);
  if (total_price_min) params.append("total_price_min", total_price_min);
  if (total_price_max) params.append("total_price_max", total_price_max);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `http://192.168.0.33:8000/records/?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (_) {
      // fallback
    }
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania rekordów odpadów`);
  }

  console.log("Pobrano rekordy odpadów");
  return response.json();
}

// Obsługa tworzenia nowego rekordu odpadu z backendem
export async function createNewWasteRecord({
  contractor_id,
  user_id,
  waste_id,
  vehicle_id,
  driver_id,
  destination_id,
  transfer_date,
  mass_kg,
  price_per_kg,
  notes
}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const response = await fetch("http://127.0.0.1:8000/records/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({
      contractor_id,
      user_id,
      waste_id,
      vehicle_id,
      driver_id,
      destination_id,
      transfer_date,
      mass_kg,
      price_per_kg,
      notes
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas tworzenia rekordu waste`);
  }

  console.log("Dodano nowy rekord waste:", {
    contractor_id,
    user_id,
    waste_id,
    vehicle_id,
    driver_id,
    destination_id,
    transfer_date,
    mass_kg,
    price_per_kg,
    notes
  });

  return response.json();
}

// Obsługa aktualizacji rekordu
export async function updateWasteRecordById(waste_record_id, updateData) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/records/${waste_record_id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Błąd z backendu:", errorData);
    throw new Error(errorData.detail || `Błąd ${response.status} podczas edycji rekordu odpadu`);
  }

  console.log('Zaktualizowano rekord odpadu o ID:', waste_record_id);
  return response.json();
}

// Obsługa usuwania rekordu odpadów z backendem
export async function deleteWasteRecordById(waste_record_id) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/records/${waste_record_id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (_) {}
    throw new Error(errorData.detail || `Błąd ${response.status} podczas usuwania rekordu odpadów`);
  }

  console.log('Usuwam rekord odpadów o id:', waste_record_id);
  return response.json();
}