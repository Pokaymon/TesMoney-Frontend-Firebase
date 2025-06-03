import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('https://tesmoney.ddnsfree.com/api/notes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Error al obtener notas:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, setNotes, fetchNotes };
};