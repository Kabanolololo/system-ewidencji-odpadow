import { customFetch, BASE_URL } from "../api/fetchWrapper";

// Pobieranie wszystkich kierowców
export async function fetchAllDriversWithStoredToken({ name, surname, sort_by, sort_order } = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  if (name) params.append("name", name);
  if (surname) params.append("surname", surname);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `${BASE_URL}/driver/?${params.toString()}`;

  const response = await customFetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
  });

  console.log('Pobrano listę kierowców');
  return response.json();
}

// Tworzenie nowego kierowcy
export async function createNewDriver({ name, surname }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const response = await customFetch(`${BASE_URL}/driver/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ name, surname }),
  });

  console.log('Dodano nowego kierowcę:', name, surname);
  return response.json();
}

// Obsługa aktualizacji istniejącego kierowcy z backendem
export async function updateDriverById(driver_id, { name, surname }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/driver/${driver_id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ name, surname }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas edycji kierowcy`);
  }
  console.log('Edycja kierowcy o id:', driver_id);
  return response.json();
}

// Obsługa usuwania kierowcy z backendem
export async function deleteDriverById(driver_id) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/driver/${driver_id}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas usuwania kierowcy`);
  }
  console.log('Usuwam kierowcę o id:', driver_id);
  return response.json();
}