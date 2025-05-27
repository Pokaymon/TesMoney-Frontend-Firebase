import { useState } from 'react';
import { useNavigationHelpers } from '../Utils/navigation';
import { toast } from 'react-toastify';

const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleClientPage, handleHomeClick } = useNavigationHelpers();

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setError('');
  
    try {
      const response = await fetch('https://tesmoney.ddnsfree.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Manejo del login exitoso
        console.log('Login exitoso:', data);
        localStorage.setItem('token', data.token);
        toast.success('Inicio de sesión exitoso');
        handleClientPage();
      } else {
        // Manejo del error en login
        toast.error(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      toast.error('Hubo un error en el servidor');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token de localStorage
    toast.info('Sesión cerrada');
    handleHomeClick();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    handleSubmit,
    handleLogout,
  };
};

export default useLogin;