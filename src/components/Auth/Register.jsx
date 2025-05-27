import "./Css/Register.css";
import useRegister from "../Hooks/useRegister.js";
import { useNavigationHelpers } from '../Utils/navigation.js';

function Register() {
    const { formData, error, handleChange, handleSubmit } = useRegister();
    const { handleLoginClick } = useNavigationHelpers();

    return (
        <section className="register-container">
            <div className="register-box">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Nombre:</p>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </label>
                    <label>
                        <p>Email:</p>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </label>
                    <label>
                        <p>Contraseña:</p>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </label>
                    <label>
                        <p>Confirmar Contraseña:</p>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </label>
                    <div className="button_container">
                        <button type="submit" className="submit-button">
                            Registrarse
                        </button>
                        <p className="register-text">
                            ¿Ya tienes una cuenta? <br />
                            <a onClick={handleLoginClick} className="register-link">
                                Inicia sesión
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Register;