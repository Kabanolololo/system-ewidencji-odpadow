export async function loginUser(username, password) {
  const formBody = new URLSearchParams();
  formBody.append("username", username);
  formBody.append("password", password);

  // Endpoint do logowania
  try {
    const response = await fetch("http://192.168.0.33:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
