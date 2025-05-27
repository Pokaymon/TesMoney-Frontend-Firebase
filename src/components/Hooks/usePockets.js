import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const usePockets = () => {
  const [pockets, setPockets] = useState([]);
  const [selectedPocket, setSelectedPocket] = useState(null);

  const fetchPockets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://tesmoney.ddnsfree.com/pocket', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener las billeteras');
      const data = await response.json();
      setPockets(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const createPocket = async (newPocket, onSuccess) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://tesmoney.ddnsfree.com/pocket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPocket)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al crear la billetera');

      setPockets(prev => [...prev, { ...newPocket, id: result.pocketId }]);
      toast.success('Billetera creada correctamente');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const editPocket = async (updatedPocket, onSuccess) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://tesmoney.ddnsfree.com/pocket/${updatedPocket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPocket)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al actualizar la billetera');

      setPockets(prev =>
        prev.map(p => (p.id === data.id ? data : p))
      );
      toast.success('Billetera actualizada correctamente');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const deletePocket = async (id, onSuccess) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://tesmoney.ddnsfree.com/pocket/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar la billetera');

      setPockets(prev => prev.filter(p => p.id !== id));
      toast.success('Billetera eliminada');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPockets();
  }, []);

  return {
    pockets,
    selectedPocket,
    setSelectedPocket,
    fetchPockets,
    createPocket,
    editPocket,
    deletePocket
  };
};