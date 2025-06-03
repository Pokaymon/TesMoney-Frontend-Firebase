import './Css/PocketSection.css';
import { FaCog, FaRobot } from 'react-icons/fa';
import { useState } from 'react';
import { usePockets } from '../Hooks/usePockets';
import { useNotes } from '../Hooks/useNotes';
import CreatePocketModal from './Modals/CreatePocketModal';
import EditPocketModal from './Modals/EditPocketModal';
import { useNavigationHelpers } from '../Utils/navigation';

import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import NoteModal from './Modals/NoteModal';

function PocketSection() {
  const {
    pockets,
    selectedPocket,
    setSelectedPocket,
    createPocket,
    editPocket,
    deletePocket
  } = usePockets();

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteMode, setNoteMode] = useState('create');
  const [noteData, setNoteData] = useState({ title: '', content: '' });

  const { notes, setNotes } = useNotes();
  const { handlePocketPage } = useNavigationHelpers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPocket, setNewPocket] = useState({ name: '', description: '', balance: 0 });

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    const method = noteMode === 'edit' ? 'PUT' : 'POST';
    const url = noteMode === 'edit'
      ? `https://tesmoney.ddnsfree.com/api/notes/${noteData._id}`
      : 'https://tesmoney.ddnsfree.com/api/notes';
  
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(noteData)
      });
  
      const updatedNote = await res.json();
  
      if (!res.ok) throw new Error('Error en la operación');
  
      if (noteMode === 'edit') {
        setNotes(prev =>
          prev.map(note => note._id === updatedNote._id ? updatedNote : note)
        );
      } else {
        setNotes(prev => [...prev, updatedNote]);
      }
  
      Swal.fire('Éxito', `Nota ${noteMode === 'edit' ? 'editada' : 'creada'} correctamente`, 'success');
      setShowNoteModal(false);
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la nota', 'error');
    }
  };

  const handleDeleteNote = (noteId) => {
    Swal.fire({
      title: '¿Eliminar esta nota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://tesmoney.ddnsfree.com/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
  
          if (!response.ok) throw new Error('Error al eliminar la nota.');
  
          setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
          Swal.fire('Eliminada', 'La nota ha sido eliminada.', 'success');
        } catch {
          Swal.fire('Error', 'No se pudo eliminar la nota.', 'error');
        }
      }
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createPocket(newPocket, () => {
      setShowCreateModal(false);
      setNewPocket({ name: '', description: '', balance: 0 });
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    editPocket(selectedPocket, () => setShowModal(false));
  };

  const handleDelete = () => {
    deletePocket(selectedPocket.id, () => setShowModal(false));
  };

  const token = localStorage.getItem("token");

  const consultarEstadoSyncro = async () => {
    try {
      const response = await fetch('https://tesmoney.ddnsfree.com/api/syncro', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al consultar estado");

      const data = await response.json();
      return data.state === true;
    } catch (error) {
      console.error("Error al obtener estado de sincronización:", error);
      Swal.fire('Error', 'No se pudo consultar el estado de sincronización', 'error');
      return null;
    }
  };

  const confirmarActivacionSyncro = async () => {
    const result = await Swal.fire({
      title: '¿Activar sincronización con Tes-Agent?',
      text: 'Si activas esta opción, el agente inteligente de TesMoney revisará tus notas rápidas cada día y automatizará ingresos o gastos diarios.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    });

    return result.isConfirmed;
  };

  const confirmarDesactivacionSyncro = async () => {
    const result = await Swal.fire({
      title: '¿Cancelar sincronización con Tes-Agent?',
      text: 'Si desactivas esta opción, el agente dejará de automatizar tus ingresos o gastos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Mantener sincronización',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    });

    return result.isConfirmed;
  };

  const actualizarEstadoSyncro = async (nuevoEstado) => {
    try {
      const response = await fetch('https://tesmoney.ddnsfree.com/api/syncro', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ state: nuevoEstado })
      });

      if (!response.ok) throw new Error("Error al actualizar");

      Swal.fire(
        nuevoEstado ? '¡Sincronización activada!' : 'Sincronización cancelada',
        nuevoEstado
          ? 'El agente comenzará a automatizar tus notas diarias.'
          : 'El agente dejará de procesar tus notas automáticamente.',
        'success'
      );
    } catch (error) {
      console.error("Error al actualizar sincronización:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado de sincronización', 'error');
    }
  };

  const handleClickSyncro = async () => {
    const estadoActual = await consultarEstadoSyncro();
    if (estadoActual === null) return;

    if (estadoActual) {
      const deseaDesactivar = await confirmarDesactivacionSyncro();
      if (deseaDesactivar) await actualizarEstadoSyncro(false);
    } else {
      const deseaActivar = await confirmarActivacionSyncro();
      if (deseaActivar) await actualizarEstadoSyncro(true);
    }
  };

  return (
    <section className='PocketsContainer'>
      <div className='Pocket_textContainer'>
        <h2>
          <span className="tes">Tes</span>
          <span className="tesmoney">Money</span>
          <span className="pockets"> | Pockets</span>
        </h2>
        <div className='Pocket_button_container'>
          <button onClick={() => setShowCreateModal(true)}>Crear Pocket</button>
          <button onClick={() => {
            setNoteMode('create');
            setNoteData({ title: '', content: '' });
            setShowNoteModal(true);
          }}>Crear Nota</button>
          <button onClick={ handleClickSyncro }>
            <figure>
              <FaRobot size={20} />
            </figure>
          </button>
        </div>
      </div>

      <div className='Pocket_Notes_Container'>
        <div className='Poacke_real_container'>
          {pockets.map((pocket) => (
            <div key={pocket.id} className='Pocket_Container' onClick={() => handlePocketPage(pocket)}>
              <h1>{pocket.name}</h1>
              <figure>
                <FaCog
                  size={24}
                  className='figure_edit'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPocket(pocket);
                    setShowModal(true);
                  }}
                />
              </figure>
            </div>
          ))}
        </div>
          <div className='Notes_Container'>
            { /* Mapear Dinamicamente las Notas */ }
            {notes.map((note) => (
              <div key={note._id} className='Note_Item'>
                <div
                  className='Note_Title_Container'
                  onClick={() => {
                    setNoteMode('edit');
                    setNoteData(note);
                    setShowNoteModal(true);
                  }}
                  onMouseEnter={(e) => e.currentTarget.querySelector('.delete-icon').style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.querySelector('.delete-icon').style.opacity = 0}
                >
                  {note.title}
                  <FaTrash
                    className="delete-icon"
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note._id);
                    }}
                  />
                </div>
                <div className='Note_Tooltip'>{note.content}</div>
              </div>
            ))}
          </div>
      </div>

      {showCreateModal && (
        <CreatePocketModal
          newPocket={newPocket}
          setNewPocket={setNewPocket}
          handleCreate={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showModal && selectedPocket && (
        <EditPocketModal
          selectedPocket={selectedPocket}
          setSelectedPocket={setSelectedPocket}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          onClose={() => setShowModal(false)}
        />
      )}

      {showNoteModal && (
        <NoteModal
          isOpen={showNoteModal}
          mode={noteMode}
          noteData={noteData}
          setNoteData={setNoteData}
          onClose={() => setShowNoteModal(false)}
          onSubmit={handleNoteSubmit}
        />
      )}
    </section>
  );
}

export default PocketSection;
