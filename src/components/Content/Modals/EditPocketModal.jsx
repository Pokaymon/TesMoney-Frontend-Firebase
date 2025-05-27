import React from 'react';

function EditPocketModal({ selectedPocket, setSelectedPocket, handleEdit, handleDelete, onClose }) {
  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2>Editar Billetera</h2>
        <form onSubmit={handleEdit} className='form_content'>
          <label>
            Nombre:
            <input type="text" value={selectedPocket.name} onChange={(e) => setSelectedPocket({ ...selectedPocket, name: e.target.value })} required />
          </label>
          <label>
            Descripción:
            <input type="text" value={selectedPocket.description} onChange={(e) => setSelectedPocket({ ...selectedPocket, description: e.target.value })} required />
          </label>
          <div className='modal_buttons'>
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleDelete} className="delete_btn">Eliminar</button>
          </div>
        </form>
        <button className='close_btn' onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default EditPocketModal;
