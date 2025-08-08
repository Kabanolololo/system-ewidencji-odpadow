// Obsługa pobierania wszystkich użytkowników z backendem
export async function fetchAllUsersWithStoredToken({ name, surname, role, sort_by, sort_order } = {}) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  if (name) params.append("name", name);
  if (surname) params.append("surname", surname);
  if (role) params.append("role", role);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `http://192.168.0.33:8000/users/?${params.toString()}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania listy użytkowników`);
  }
  console.log('Pobrano listę użytkowników');
  return response.json();
}

// Obsługa tworzenia nowego użytkownika z backendem
export async function createNewUser({ name, surname, password_hash, role }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/users/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
    body: JSON.stringify({ name, surname, password_hash, role }),
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (_) {}
    throw new Error(errorData.detail || `Błąd ${response.status} podczas tworzenia użytkownika`);
  }
  console.log('Dodano nowego użytkownika:', name, surname, role);
  return response.json();
}

// Obsługa aktualizacji użytkownika z backendem
export async function updateUserById(user_id, { name, surname, password_hash, role }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/users/admin/${user_id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
    body: JSON.stringify({ name, surname, password_hash, role }),
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (_) {}
    throw new Error(errorData.detail || `Błąd ${response.status} podczas aktualizacji użytkownika`);
  }
  console.log('Zaktualizowano użytkownika o id:', user_id);
  return response.json();
}

// Obsługa usuwania użytkownika z backendu
export async function deleteUserById(user_id) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/users/${user_id}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas usuwania użytkownika`);
  }
  console.log('Usunięto użytkownika o id:', user_id);
  return response.json();
}
