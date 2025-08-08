export async function fetchAuditLogs({ table_name, operation, sort_by, sort_order, token }) {
  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  if (table_name) params.append("table_name", table_name);
  if (operation) params.append("operation", operation);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `http://192.168.0.33:8000/log/?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Błąd podczas pobierania logów");
  }

  return response.json();
}

// Funkcja pomocnicza do wywołania fetchAuditLogs z localStorage
export async function fetchAuditLogsWithStoredToken(params) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Brak tokena w localStorage. Zaloguj się ponownie.");
  }
  return fetchAuditLogs({ ...params, token });
}
