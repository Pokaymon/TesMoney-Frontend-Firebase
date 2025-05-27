import { useState, useEffect } from "react";
import { useNavigationHelpers } from '../Utils/navigation';
import { toast } from 'react-toastify';

function useRegister() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const { handleLoginClick } = useNavigationHelpers();
    const [error, setError] = useState("");

    useEffect(() => {
        const testConnection = async () => {
            try {
                const response = await fetch("https://tesmoney.ddnsfree.com/api/test");
                const data = await response.json();
                console.log("Respuesta del backend:", data);
            } catch (error) {
                console.error("Error al conectar con el backend:", error);
            }
        };

        testConnection();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
   
        console.log("Formulario enviado con:", formData);
   
        try {
            const response = await fetch("https://tesmoney.ddnsfree.com/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
   
            const data = await response.json();
   
            if (response.ok) {
                console.log("Registro exitoso:", data);
                toast.info(`Registro exitoso. Por favor, verifica tu correo electrónico.`);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                });
                handleLoginClick();
            } else {
                console.error("Error en el registro:", data);
                toast.error(data.message || "Hubo un error en el registro. Intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            toast.error("Error de conexión con el servidor.");
        }
    };

    return { formData, error, handleChange, handleSubmit };
}

export default useRegister;