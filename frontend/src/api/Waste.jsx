// Obsługa pobierania wszystkich odpadów z backendu
export async function fetchAllWastesWithStoredToken({ code, sort_by, sort_order } = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  if (code) params.append("code", code);
  if (sort_by) params.append("sort_by", sort_by);  // tylko "code"
  if (sort_order) params.append("sort_order", sort_order);  // "asc" lub "desc"

  const url = `http://127.0.0.1:8000/waste/?${params.toString()}`;

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
    } catch (_) {}
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania listy odpadów`);
  }

  console.log("Pobrano listę odpadów");
  return response.json();
}

// Obsługa tworzenia nowego odpadu z backendem
export async function createNewWaste({ code, name, notes }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const response = await fetch("http://127.0.0.1:8000/waste/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ code, name, notes }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas tworzenia odpadu`);
  }

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

  const url = `http://127.0.0.1:8000/waste/${waste_id}`;

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

  const url = `http://127.0.0.1:8000/waste/${waste_id}`;

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
