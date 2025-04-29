import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 10); // Small delay to ensure CSS transition applies
    return () => setIsVisible(false); // Reset on unmount
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`modal p-4 sm:p-6 w-full max-w-sm relative transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[var(--primary-text)] hover:text-[var(--accent-color)]"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg sm:text-xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-[var(--border-color)] rounded mb-2 bg-[var(--secondary-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-[var(--border-color)] rounded mb-4 bg-[var(--secondary-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
        />

        <button
          onClick={handleLogin}
          className="button w-full bg-[var(--accent-color)] text-white hover:bg-blue-600"
        >
          Log In
        </button>

        <button
          onClick={handleGoogleLogin}
          className="button w-full mt-3 bg-red-500 text-white hover:bg-red-600"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginModal;