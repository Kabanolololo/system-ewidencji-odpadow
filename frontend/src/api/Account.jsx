import { customFetch, BASE_URL } from "../api/fetchWrapper";

// Obsługa pobierania użytkownika z backendem
export async function fetchUserByIdWithStoredToken(userId) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `${BASE_URL}/users/${userId}`;

  const response = await customFetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
  });
  console.log("Pomyślnie pobrano informacje o aktualnym użytkowniku")
  return response.json();
}

// Obsługa aktualizacji użytkownika z backendem
export async function updateUserByIdWithStoredToken(userId, userData) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = `http://192.168.0.33:8000/users/${userId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Błąd podczas aktualizacji użytkownika");
  }
  console.log("Pomyślnie zakutualizowano użytkownika o id", userId)
  return response.json();
}
