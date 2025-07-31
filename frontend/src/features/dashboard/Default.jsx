import './styles/Default.css';

function Default() {
  return (
    <div className="default-container">
      <h1>System Ewidencji Odpadów</h1>
      <p>Witaj w panelu zarządzania! Poniżej znajdziesz krótki opis funkcjonalności systemu:</p>

      <div className="default-section">
        <h2>🛠️ Panel Administratora</h2>
        <p>Zarządzaj całym systemem, funckja dostępna tylko dla administratorów</p>
      </div>

      <div className="default-section">
        <h2>👷 Kierowcy</h2>
        <p>Dodawaj i aktualizuj dane kierowców odpowiedzialnych za przewóz odpadów.</p>
      </div>

      <div className="default-section">
        <h2>🚚 Pojazdy</h2>
        <p>Zarządzaj flotą pojazdów: dodawaj, aktualizuj i usuwaj pojazdy wykorzystywane do transportu odpadów.</p>
      </div>

      <div className="default-section">
        <h2>🏭 Destynacje</h2>
        <p>Twórz i edytuj miejsca docelowe przewozu odpadów, takie jak składowiska lub punkty przetwarzania.</p>
      </div>

      <div className="default-section">
        <h2>🤝 Kontrahenci</h2>
        <p>Dodawaj kontrahentów online (NIP) lub offline, edytuj ich dane i zarządzaj współpracą.</p>
      </div>

      <div className="default-section">
        <h2>♻️ Odpady</h2>
        <p>Twórz i ewidencjonuj rodzaje odpadów wraz z ich rekordami i szczegółami.</p>
      </div>

      <div className="default-section">
        <h2>📄 Ewidencja</h2>
        <p>Twórz, edytuj i usuwaj szczegółowe zapisy związane z obiegiem odpadów w firmie.</p>
      </div>

      <div className="default-section">
        <h2>🗂️ Raporty</h2>
        <p>Przeglądaj historię działań w systemie, aby zapewnić pełną transparentność operacji.</p>
      </div>

      <div className="default-section">
        <h2>👤 Edycja konta</h2>
        <p>Zarządzaj swoim kontem.</p>
      </div>

    </div>
  );
}

export default Default;
