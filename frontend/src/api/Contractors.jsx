import { customFetch, BASE_URL } from "../api/fetchWrapper";

// Pobieranie wszystkich kontrahentów z tokenem z localStorage
export async function fetchAllContractorsWithStoredToken({ nip, regon, name, sort_by, sort_order } = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  if (nip) params.append("nip", nip);
  if (regon) params.append("regon", regon);
  if (name) params.append("name", name);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `${BASE_URL}/contractors/?${params.toString()}`;

  const response = await customFetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
  });

  console.log('Pobrano listę kontrahentów');
  return response.json();
}

// Tworzenie nowego kontrahenta online
export async function createContractorOnline({ nip }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const response = await customFetch(`${BASE_URL}/contractors/create/online`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ nip }),
  });

  const data = await response.json();
  console.log('Dodano nowego kontrahenta online:', data);
  return data;
}

// Tworzenie nowego kontrahenta offline
export async function createContractorOffline({ nip, regon, name, address }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const response = await customFetch(`${BASE_URL}/contractors/create/offline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ nip, regon, name, address }),
  });

  return response.json();
}

// Aktualizacja kontrahenta z backendem
export async function updateContractorById(contractor_id, { nip, regon, name, address }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/contractors/${contractor_id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ nip, regon, name, address }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas edycji kontrahenta`);
  }

  console.log('Edycja kontrahenta o id:', contractor_id);
  return response.json();
}

// Obsługa usuwania kontrahenta z backendem
export async function deleteContractorById(contractor_id) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/contractors/${contractor_id}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas usuwania kontrahenta`);
  }

  console.log('Usuwam kontrahenta o id:', contractor_id);
  return response.json();
}