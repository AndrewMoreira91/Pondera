import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className='header-conteiner'>
      <div className="logo">
        <img src="/logo-icon.svg" alt="logo" />
        <h1>Pondera</h1>
      </div>
      <div className='nav-user-conteiner'>
        <nav className='header-nav'>
          <Link to="/">Dashboard</Link>
          <Link to="/pomodoro">Pomodoro</Link>
        </nav>
        <div className='user-conteiner'>
          <img src="https://github.com/andrewmoreira91.png" alt="user" />
        </div>
      </div>
    </header>
  );
}

export default Header;