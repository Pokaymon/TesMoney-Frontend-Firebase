import React from 'react';

function CreatePocketModal({ newPocket, setNewPocket, handleCreate, onClose }) {
  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2>Crear Nueva Billetera</h2>
        <form onSubmit={handleCreate} className='form_content'>
          <label>
            Nombre:
            <input type="text" value={newPocket.name} onChange={(e) => setNewPocket({ ...newPocket, name: e.target.value })} required />
          </label>
          <label>
            Descripción:
            <input type="text" value={newPocket.description} onChange={(e) => setNewPocket({ ...newPocket, description: e.target.value })} required />
          </label>
          <label>
            Balance Inicial:
            <input type="number" value={newPocket.balance} onChange={(e) => setNewPocket({ ...newPocket, balance: parseFloat(e.target.value) })} required />
          </label>
          <div className='modal_buttons'>
            <button type="submit">Crear</button>
            <button type="button" onClick={onClose} className="delete_btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePocketModal;
