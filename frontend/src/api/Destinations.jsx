// Obsługa pobierania wszystkich miejsc docelowych z backendu
export async function fetchAllDestinationsWithStoredToken({
  country,
  voivodeship,
  city,
  postal_code,
  address,
  sort_by,
  sort_order,
} = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  if (country) params.append("country", country);
  if (voivodeship) params.append("voivodeship", voivodeship);
  if (city) params.append("city", city);
  if (postal_code) params.append("postal_code", postal_code);
  if (address) params.append("address", address);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `http://192.168.0.33:8000/destination/?${params.toString()}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania listy kierowców`);
  }

  return await response.json();
}

// Obsługa tworzenia nowej destynacji z backendem
export async function createNewDestination({ country, voivodeship, city, postal_code, address }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const response = await fetch("http://192.168.0.33:8000/destination/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ country, voivodeship, city, postal_code, address }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas tworzenia destynacji`);
  }

  console.log('Dodano nową destynację:', country, city, address);
  return response.json();
}

// Obsługa aktualizacji destynacji z backendem
export async function updateDestinationById(destination_id, { country, voivodeship, city, postal_code, address }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/destination/${destination_id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ country, voivodeship, city, postal_code, address }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status} podczas edycji destynacji`);
  }

  console.log('Edycja destynacji o id:', destination_id);
  return response.json();
}

// Obsługa usuwania destynacji z backendem
export async function deleteDestinationById(destination_id) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/destination/${destination_id}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas usuwania destynacji`);
  }
  console.log('Usuwam destynację o id:', destination_id);
  return response.json();
}
