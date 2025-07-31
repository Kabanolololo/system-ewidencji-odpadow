import React, { useState } from "react";

function EditRecordModal({ record, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...record });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onCancel}>
          ×
        </button>
        <h2>Edytuj rekord</h2>

        <label>
          Kontrahent ID:
          <input
            type="number"
            name="contractor_id"
            value={formData.contractor_id}
            onChange={handleChange}
          />
        </label>

        <label>
          Użytkownik ID:
          <input
            type="number"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          />
        </label>

        {/* Dodaj resztę pól tak jak potrzebujesz */}

        <label>
          Notatki:
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>

        <div className="buttons">
          <button onClick={handleSave}>Zapisz</button>
          <button onClick={onCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}

export default EditRecordModal;
