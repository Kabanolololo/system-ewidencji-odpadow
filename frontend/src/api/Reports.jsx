// Pobieranie wszystkich lat
export async function fetchReportYears() {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const url = "http://192.168.0.33:8000/reports/years";

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania lat raportów`);
  }

  console.log("Pobrano listę lat raportów");
  return response.json();
}

// Pobieranie masy odpadów według miesiąca
export async function fetchWasteMassByMonth({ year, month_from, month_to }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (month_from) params.append("month_from", month_from);
  if (month_to) params.append("month_to", month_to);

  const url = `http://192.168.0.33:8000/reports/waste-mass?${params.toString()}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania masy odpadów`);
  }

  console.log("Pobrano masę odpadów według miesiąca");
  return response.json();
}

// Pobieranie liczby odbiorów odpadów
export async function fetchPickupCountsByMonth({ year, month_from, month_to }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (month_from) params.append("month_from", month_from);
  if (month_to) params.append("month_to", month_to);

  const url = `http://192.168.0.33:8000/reports/pickup-counts?${params.toString()}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania liczby odbiorów`);
  }

  console.log("Pobrano liczbę odbiorów odpadów");
  return response.json();
}

// Pobieranie średnich przychodów
export async function fetchAverageRevenueByMonth({ year, month_from, month_to }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (month_from) params.append("month_from", month_from);
  if (month_to) params.append("month_to", month_to);

  const url = `http://192.168.0.33:8000/reports/average-revenue?${params.toString()}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania średnich przychodów`);
  }

  console.log("Pobrano średnie przychody");
  return response.json();
}

// Pobieranie przychodów według miesiąca
export async function fetchRevenueByMonth({ year, month_from, month_to }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (month_from) params.append("month_from", month_from);
  if (month_to) params.append("month_to", month_to);

  const url = `http://192.168.0.33:8000/reports/revenue-by-month?${params.toString()}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania przychodów`);
  }

  console.log("Pobrano przychody według miesiąca");
  return response.json();
}

// Pobieranie całkowitych przychodów
export async function fetchTotalRevenueByMonth({ year, month_from, month_to }) {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (!token) {
    throw new Error("Brak tokena. Zaloguj się ponownie.");
  }

  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (month_from) params.append("month_from", month_from);
  if (month_to) params.append("month_to", month_to);

  const url = `http://192.168.0.33:8000/reports/total-revenue-by-month?${params.toString()}`;

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
    throw new Error(errorData.detail || `Błąd ${response.status} podczas pobierania całkowitych przychodów`);
  }

  console.log("Pobrano całkowite przychody według miesiąca");
  return response.json();
}