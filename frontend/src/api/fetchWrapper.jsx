// Wrapper dla fetch API który obsługuje błędy
export async function customFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorMsg = `Błąd HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMsg = errorData.detail;
        }
      } catch {
      }
      throw new Error(errorMsg);
    }
    
    return response;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Błąd połączenia z API. Sprawdź połączenie z internetem, dostępność serwera lub odswież stronę.');
    }
    throw error;
  }
}

// Przydatne funkcje pomocnicze
export function createFormBody(data) {
  const formBody = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    formBody.append(key, value);
  });
  return formBody;
}

// Podstawowe ustawienia dla żądań
export const BASE_URL = 'http://192.168.0.33:8000';
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
