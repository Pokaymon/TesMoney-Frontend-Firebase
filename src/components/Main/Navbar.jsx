import { useState } from 'react';
import './Css/Navbar.css';
import { useNavigationHelpers } from '../Utils/navigation';

function Navbar() {
  const { handleLoginClick, handleHomeClick } = useNavigationHelpers();
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  return (
    <nav className={`navbar ${isMenuActive ? 'active' : ''}`}>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>

      <img src="/img/TesLogo.webp" alt="TesMoney" className='navbar-logo' />
      <ul>
        <li><a onClick={handleHomeClick}>Inicio</a></li>
        <li><a onClick={handleLoginClick}>Ingresar | Registrarse</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;