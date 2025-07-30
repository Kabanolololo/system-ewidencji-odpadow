import { useState } from 'react';
import '../styles/Waste.css';
import '../styles/Modals.css';

function Waste() {
  const [wastes, setWastes] = useState([
    {
      id: 1,
      code: '150101',
      name: 'Opakowania z papieru i tektury',
      notes: 'łącznie z selektywnie gromadzonymi komunalnymi odpadami opakowaniowymi'
    },
    {
      id: 2,
      code: '200201',
      name: 'Odpady z produkcji farb',
      notes: ''
    }
  ]);

  const [newWaste, setNewWaste] = useState({
    code: '',
    name: '',
    notes: ''
  });

  const [searchCode, setSearchCode] = useState('');
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc'
  const [editingWaste, setEditingWaste] = useState(null);

  const handleAddWaste = (e) => {
    e.preventDefault();
    const newId = wastes.length ? Math.max(...wastes.map(w => w.id)) + 1 : 1;
    setWastes([...wastes, { id: newId, ...newWaste }]);
    setNewWaste({ code: '', name: '', notes: '' });
  };

  const handleSort = () => {
    let newOrder = 'asc';
    if (sortOrder === 'asc') newOrder = 'desc';
    else if (sortOrder === 'desc') newOrder = null;
    setSortOrder(newOrder);
  };

  const sortedWastes = [...wastes].sort((a, b) => {
    if (!sortOrder) return 0;
    if (a.code < b.code) return sortOrder === 'asc' ? -1 : 1;
    if (a.code > b.code) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredWastes = sortedWastes.filter(w =>
    w.code.toLowerCase().includes(searchCode.toLowerCase())
  );

  const handleDeleteWaste = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten odpad?')) {
      setWastes(wastes.filter(w => w.id !== id));
      if (editingWaste?.id === id) setEditingWaste(null);
    }
  };

  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingWaste({ ...editingWaste, [name]: value });
  };

  const handleSaveEdit = () => {
    setWastes(wastes.map(w => (w.id === editingWaste.id ? editingWaste : w)));
    setEditingWaste(null);
  };

  const handleCancelEdit = () => {
    setEditingWaste(null);
  };

  return (
    <div className="waste-container">
      <h1>Lista Odpadów</h1>

     <form onSubmit={handleAddWaste} className="add-waste-form">
        <div className="form-row">
          <label>
            Kod:
            <input
              type="text"
              value={newWaste.code}
              onChange={e => setNewWaste({ ...newWaste, code: e.target.value })}
              placeholder="Wpisz kod"
              required
            />
          </label>
          <label>
            Nazwa:
            <input
              type="text"
              value={newWaste.name}
              onChange={e => setNewWaste({ ...newWaste, name: e.target.value })}
              placeholder="Wpisz nazwę"
              required
            />
          </label>
          <label>
            Notatki:
            <input
              type="text"
              value={newWaste.notes}
              onChange={e => setNewWaste({ ...newWaste, notes: e.target.value })}
              placeholder="Dodatkowe notatki"
            />
          </label>
        </div>
        <button type="submit" className="add-button">Dodaj</button>
      </form>

      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj po kodzie"
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
        />
      </div>

      <table className="waste-table">
        <thead>
          <tr>
            <th onClick={handleSort} className={sortOrder ? `sort-${sortOrder}` : ''} style={{ cursor: 'pointer' }}>
              Kod
            </th>
            <th>Nazwa</th>
            <th>Notatki</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredWastes.map(w => (
            <tr key={w.id}>
              <td>{w.code}</td>
              <td>{w.name}</td>
              <td>{w.notes}</td>
              <td>
                <button onClick={() => setEditingWaste(w)} title="Edytuj" className='edit-button'>Edytuj</button>
                <button onClick={(e) => handleDeleteWaste(e, w.id)} title="Usuń" className='delete-button'>×</button>
              </td>
            </tr>
          ))}
          {filteredWastes.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>Brak wyników</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingWaste && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Odpad</h2>
            <label>
              Kod:
              <input
                type="text"
                name="code"
                value={editingWaste.code}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Nazwa:
              <input
                type="text"
                name="name"
                value={editingWaste.name}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Notatki:
              <input
                type="text"
                name="notes"
                value={editingWaste.notes}
                onChange={handleChangeEditing}
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

export default Waste;