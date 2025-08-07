import React, { useState } from 'react';
import '../styles/Records.css';
import AddRecord from './Records/AddRecord';
import RecordTable from './Records/RecordTable';

function Records() {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [records, setRecords] = useState([]); 

  const contractors = ['Firma A', 'Firma B', 'Firma C'];
  const vehicles = ['Samochód 1', 'Samochód 2'];
  const drivers = ['Kierowca 1', 'Kierowca 2'];
  const destinations = ['Miejsce 1', 'Miejsce 2'];
  const wasteTypes = ['Odpady 1', 'Odpady 2'];

  // funkcja do wyswietlania panelu do dodawania rekordu
  const handleAddRecord = (record) => {
    console.log('Nowa ewidencja:', record);
    setRecords((prev) => [...prev, { ...record, id: prev.length + 1 }]);
    setShowAddRecord(false);
  };

  // funkcja do chowania panelu do dodawania rekordu
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
