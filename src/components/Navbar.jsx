import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import ThemeToggle from './ThemrToggle';

const Navbar = ({ toggleTheme, theme }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-[var(--secondary-bg)] border-b shadow sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4">
      <Link to="/" className="text-xl font-bold no-underline hover:no-underline">
  🌍 Country Scope
</Link>



        <button
          className="md:hidden text-[var(--primary-text)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row items-center gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-[var(--secondary-bg)] md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}
        >
          <Link to="/favorites" className="text-[var(--accent-color)] hover:underline">
            My Favorites
          </Link>

          {user ? (
            <>
              <span className="text-[var(--primary-text)]">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="button bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="button bg-blue-500 text-white hover:bg-blue-600"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="button bg-green-500 text-white hover:bg-green-600"
              >
                Register
              </button>
            </>
          )}

          <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </nav>
  );
};

export default Navbar;