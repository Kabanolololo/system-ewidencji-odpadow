import { useState } from 'react';
import './styles/Contractors.css';

function Contractors() {
  const [contractors, setContractors] = useState([
    {
      id: 1,
      nip: '1234567890',
      regon: '123456789',
      name: 'Example Company Sp. z o.o.',
      address: 'ul. Przykładowa 1, 00-000 Warszawa',
    },
  ]);

  const [newContractor, setNewContractor] = useState({
    nip: '',
    regon: '',
    name: '',
    address: '',
  });

  const [isOnline, setIsOnline] = useState(false);

  const [search, setSearch] = useState({
    nip: '',
    regon: '',
    name: '',
    address: '',
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editingContractor, setEditingContractor] = useState(null);

  const handleAddContractor = (e) => {
    e.preventDefault();
    const newId = contractors.length ? Math.max(...contractors.map(c => c.id)) + 1 : 1;
    setContractors([...contractors, { id: newId, ...newContractor }]);
    setNewContractor({ nip: '', regon: '', name: '', address: '' });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedContractors = [...contractors].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aKey = (a[sortConfig.key] || '').toLowerCase();
    const bKey = (b[sortConfig.key] || '').toLowerCase();
    if (aKey < bKey) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aKey > bKey) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredContractors = sortedContractors.filter(c =>
    c.nip.toLowerCase().includes(search.nip.toLowerCase()) &&
    c.regon.toLowerCase().includes(search.regon.toLowerCase()) &&
    c.name.toLowerCase().includes(search.name.toLowerCase()) &&
    c.address.toLowerCase().includes(search.address.toLowerCase())
  );

  const handleDeleteContractor = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tego kontrahenta?')) {
      setContractors(contractors.filter(c => c.id !== id));
      if (editingContractor?.id === id) {
        setEditingContractor(null);
      }
    }
  };

  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingContractor({ ...editingContractor, [name]: value });
  };

  const handleSaveEdit = () => {
    setContractors(contractors.map(c => (c.id === editingContractor.id ? editingContractor : c)));
    setEditingContractor(null);
  };

  const handleCancelEdit = () => {
    setEditingContractor(null);
  };

  // Symulacja pobrania danych po NIP (online)
  const fetchDataByNip = () => {
    if (newContractor.nip === '') {
      alert('Wpisz najpierw NIP!');
      return;
    }
    setNewContractor({
      nip: newContractor.nip,
      regon: '987654321',
      name: 'Firma pobrana z API',
      address: 'ul. API 123, 00-001 Warszawa',
    });
  };

  return (
    <div className="contractors-container">
      <h1>Lista Kontrahentów</h1>
      <form onSubmit={handleAddContractor} className="add-contractor-form">
        <div className="mode-toggle-container">
          <div className="mode-toggle-label">Tryb dodawania:</div>
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={isOnline ? 'mode-toggle-button active' : 'mode-toggle-button'}
          >
            {isOnline ? 'Online (pobieranie danych po NIP)' : 'Offline (ręczne wpisywanie)'}
          </button>
        </div>

        <div className="form-row">
          <label>
            NIP:
            <input
              type="text"
              placeholder="Wpisz NIP"
              value={newContractor.nip}
              onChange={e => setNewContractor({ ...newContractor, nip: e.target.value })}
              required
            />
          </label>

          {/* Pola offline zawsze renderowane, ukrywane w trybie online */}
          <div className={`offline-fields ${isOnline ? 'hidden' : ''}`} style={{ display: 'flex', gap: '20px', flex: '1 1 100%' }}>
            <label style={{ flex: 1 }}>
              REGON:
              <input
                type="text"
                placeholder="Wpisz REGON"
                value={newContractor.regon}
                onChange={e => setNewContractor({ ...newContractor, regon: e.target.value })}
              />
            </label>
            <label style={{ flex: 1 }}>
              Nazwa:
              <input
                type="text"
                placeholder="Wpisz nazwę"
                value={newContractor.name}
                onChange={e => setNewContractor({ ...newContractor, name: e.target.value })}
                required={!isOnline}
              />
            </label>
            <label style={{ flex: 1 }}>
              Adres:
              <input
                type="text"
                placeholder="Wpisz adres"
                value={newContractor.address}
                onChange={e => setNewContractor({ ...newContractor, address: e.target.value })}
                required={!isOnline}
              />
            </label>
          </div>
        </div>

        <button type="submit" className="add-button">Dodaj kontrahenta</button>
      </form>

      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj NIP"
          value={search.nip}
          onChange={e => setSearch({ ...search, nip: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj REGON"
          value={search.regon}
          onChange={e => setSearch({ ...search, regon: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj nazwę"
          value={search.name}
          onChange={e => setSearch({ ...search, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj adres"
          value={search.address}
          onChange={e => setSearch({ ...search, address: e.target.value })}
        />
      </div>

      <table className="contractors-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort('nip')}
              className={sortConfig.key === 'nip' ? `sort-${sortConfig.direction}` : ''}
            >
              NIP
            </th>
            <th
              onClick={() => handleSort('regon')}
              className={sortConfig.key === 'regon' ? `sort-${sortConfig.direction}` : ''}
            >
              REGON
            </th>
            <th
              onClick={() => handleSort('name')}
              className={sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}
            >
              Nazwa
            </th>
            <th
              onClick={() => handleSort('address')}
              className={sortConfig.key === 'address' ? `sort-${sortConfig.direction}` : ''}
            >
              Adres
            </th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredContractors.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Brak wyników
              </td>
            </tr>
          )}
          {filteredContractors.map(contractor => (
            <tr key={contractor.id}>
              <td>{contractor.nip}</td>
              <td>{contractor.regon}</td>
              <td>{contractor.name}</td>
              <td>{contractor.address}</td>
              <td>
                <button
                  onClick={() => setEditingContractor(contractor)}
                  className="edit-button"
                  title="Edytuj"
                >
                  Edytuj
                </button>
                <button
                  onClick={(e) => handleDeleteContractor(e, contractor.id)}
                  className="delete-button"
                  title="Usuń"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingContractor && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Kontrahenta</h2>
            <label>
              NIP:
              <input
                type="text"
                name="nip"
                value={editingContractor.nip}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              REGON:
              <input
                type="text"
                name="regon"
                value={editingContractor.regon}
                onChange={handleChangeEditing}
              />
            </label>
            <label>
              Nazwa:
              <input
                type="text"
                name="name"
                value={editingContractor.name}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Adres:
              <input
                type="text"
                name="address"
                value={editingContractor.address}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <div className="buttons">
              <button onClick={handleSaveEdit}>Zapisz</button>
              <button onClick={handleCancelEdit}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contractors;
