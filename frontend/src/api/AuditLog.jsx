import { customFetch, BASE_URL } from "../api/fetchWrapper";

// Wyswietlenie logow audytu z backendu
export async function fetchAuditLogs({ table_name, operation, sort_by, sort_order, token }) {
  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();

  if (table_name) params.append("table_name", table_name);
  if (operation) params.append("operation", operation);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);

  const url = `${BASE_URL}/log/?${params.toString()}`;

  const response = await customFetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  console.log("Pobrano liste audytową")
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
