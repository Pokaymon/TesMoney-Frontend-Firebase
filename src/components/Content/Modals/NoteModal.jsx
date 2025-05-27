import React, { useEffect } from 'react';
import './NoteModal.css';

function NoteModal({ isOpen, onClose, onSubmit, noteData, setNoteData, mode = 'create' }) {
  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (e.target.classList.contains('note-modal-overlay')) onClose();
    };
    window.addEventListener('click', closeOnOutsideClick);
    return () => window.removeEventListener('click', closeOnOutsideClick);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="note-modal-overlay">
      <div className="note-modal">
        <h2>{mode === 'edit' ? 'Editar Nota' : 'Crear Nota'}</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={noteData.title}
            onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Contenido"
            value={noteData.content}
            onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
            required
          />
          <div className="modal-actions">
            <button type="submit">{mode === 'edit' ? 'Guardar cambios' : 'Crear Nota'}</button>
            <button type="button" onClick={onClose} className="cancel">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;