import { useState } from 'react';
import './Css/Navbar.css';
import { useNavigationHelpers } from '../Utils/navigation';
import useLogin from '../Hooks/useLogin';

function NavbarClient() {
  const { handlePlansPage, handleClientPage } = useNavigationHelpers();
  const { handleLogout } = useLogin();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`navbar ${isMenuActive ? 'active' : ''}`}>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>

      <img src="/img/TesLogo.webp" alt="TesMoney" className='navbar-logo' />
      <ul>
        <li><a onClick={handleClientPage}>Billeteras</a></li>
        <li><a onClick={handlePlansPage}>Seleccionar Plan</a></li>
        <li className="dropdown">
          <img 
            src="/img/User_icon.webp" 
            alt="Usuario" 
            className="user-icon" 
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default NavbarClient;
