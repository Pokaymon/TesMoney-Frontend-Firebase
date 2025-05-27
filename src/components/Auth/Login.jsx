import { useNavigationHelpers } from '../Utils/navigation';
import useLogin from '../Hooks/useLogin';
import './Css/Login.css';

const Login = () => {
  const { email, setEmail, password, setPassword, error, handleSubmit } = useLogin();
  const { handleRegisterClick } = useNavigationHelpers();

  return (
    <section className='login-container'>
      <div className='login-box'>
        <h2>Login</h2>
        {error && <p className='error-message'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            <p>Email:</p>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='input-field'
              required
            />
          </label>
          <label>
            <p>Contraseña:</p>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='input-field'
              required
            />
          </label>
          <div className='button_container'>
            <button type='submit' className='submit-button'>
              Iniciar sesión
            </button>
            <p className='register-text'>
              ¿Usuario no registrado? <br />
              <a onClick={handleRegisterClick} className='register-link'>
                Ven y Regístrate
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;