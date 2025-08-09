import { customFetch, BASE_URL } from "../api/fetchWrapper";

// Pobieranie wszystkich pojazdów
export async function fetchAllVehiclesWithStoredToken({ registration_number, sort_by, sort_order } = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

  const params = new URLSearchParams();
  if (registration_number) params.append("registration_number", registration_number);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `${BASE_URL}/vehicle/?${params.toString()}`;

  const response = await customFetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
  });

  console.log("Pobrano listę pojazdów");
  return response.json();
}

// Tworzenie nowego pojazdu
export async function createNewVehicle({ registration_number, brand, model }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

  const url = `${BASE_URL}/vehicle/`;

  const response = await customFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ registration_number, brand, model }),
  });

  console.log("Dodano nowy pojazd:", registration_number, brand, model);
  return response.json();
}

// Obsługa aktualizacji istniejącego pojazdu z backendem
export async function updateVehicleById(vehicle_id, { registration_number, brand, model }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/vehicle/${vehicle_id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ registration_number, brand, model }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas edycji pojazdu`);
  }

  console.log('Edycja pojazdu o id:', vehicle_id);
  return response.json();
}

// Obsługa usuwania pojazdu z backendu
export async function deleteVehicleById(vehicle_id) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/vehicle/${vehicle_id}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas usuwania pojazdu`);
  }
  console.log('Usuwam pojazd o id:', vehicle_id);
  return response.json();
}