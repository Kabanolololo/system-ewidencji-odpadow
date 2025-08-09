import { customFetch, createFormBody, BASE_URL, DEFAULT_HEADERS } from './fetchWrapper';

// Obsługa logowania się
export async function loginUser(username, password) {
  const formBody = createFormBody({
    username,
    password
  });

  // Endpoint do logowania
  try {
    const response = await customFetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: formBody.toString(),
    });

    if (!response.ok) {
      // Jeśli odpowiedź nie jest OK, pokazujemy błąd
      let errorMsg = `Błąd HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMsg = errorData.detail;
        }
      } catch {
        // Nie udało się sparsować JSONa - zostawiamy ogólny komunikat
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log("Pomyślnie zalogowano się")
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
