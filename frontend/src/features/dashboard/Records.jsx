import React, { useState } from 'react';
import './styles/Records.css';
import AddRecord from './components/AddRecord';
import RecordTable from './components/RecordTable'; // <-- dodaj import

function Records() {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [records, setRecords] = useState([]); // <-- stan na listę rekordów

  const contractors = ['Firma A', 'Firma B', 'Firma C'];
  const vehicles = ['Samochód 1', 'Samochód 2'];
  const drivers = ['Kierowca 1', 'Kierowca 2'];
  const destinations = ['Miejsce 1', 'Miejsce 2'];
  const wasteTypes = ['Odpady 1', 'Odpady 2'];

  const handleAddRecord = (record) => {
    console.log('Nowa ewidencja:', record);
    // Dodaj nowy rekord do listy:
    setRecords((prev) => [...prev, { ...record, id: prev.length + 1 }]);
    setShowAddRecord(false); // schowaj formularz
  };

  const handleCancel = () => {
    setShowAddRecord(false);
  };

  return (
    <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
      <h2>Lista Ewidencji</h2>
      {!showAddRecord ? (
        <>
          <button
            className="centered-button"
            onClick={() => setShowAddRecord(true)}
          >
            Dodaj ewidencję
          </button>
        </>
      ) : (
        <div className='fade-in'>
        <AddRecord
          contractors={contractors}
          vehicles={vehicles}
          drivers={drivers}
          destinations={destinations}
          wasteTypes={wasteTypes}
          onAddRecord={handleAddRecord}
          onCancel={handleCancel}
        />
        </div>
      )}

      {/* Tabela zawsze widoczna */}
      <RecordTable records={records} />
    </div>
  );
}

export default Records;
