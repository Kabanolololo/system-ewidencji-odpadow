import { customFetch, BASE_URL } from "../api/fetchWrapper";

// Pobieranie wszystkich odpadów
export async function fetchAllWastesWithStoredToken({ code, sort_by, sort_order } = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

  const params = new URLSearchParams();
  if (code) params.append("code", code);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `${BASE_URL}/waste/?${params.toString()}`;

  const response = await customFetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
  });

  console.log("Pobrano listę odpadów");
  return response.json();
}

// Tworzenie nowego odpadu
export async function createNewWaste({ code, name, notes }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

  const url = `${BASE_URL}/waste/`;

  const response = await customFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ code, name, notes }),
  });

  console.log("Dodano nowy odpad:", code, name);
  return response.json();
}

// Obsługa aktualizacji odpadu z backendem
export async function updateWasteById(waste_id, { code, name, notes }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/waste/${waste_id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ code, name, notes }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas edycji odpadu`);
  }

  console.log("Zaktualizowano odpad o id:", waste_id);
  return response.json();
}

// Obsługa usuwania odpadu z backendem
export async function deleteWasteById(waste_id) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/waste/${waste_id}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas usuwania odpadu`);
  }

  console.log("Usunięto odpad o id:", waste_id);
  return response.json();
}
