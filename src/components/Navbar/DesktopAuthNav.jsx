/**
 * DesktopAuthNav.jsx — React island for desktop auth buttons
 * Loaded via client:idle — renders Login/Logout button based on JWT token.
 * Minimal footprint: only auth check + one button.
 */
import { useState, useEffect } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import { TbLogin2 } from 'react-icons/tb';
import { FaHistory, FaUser } from 'react-icons/fa';
import { API_URL } from '../../lib/constants';

export default function DesktopAuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      setChecked(true);
      return;
    }

    fetch(`${API_URL}/api/token/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refresh }),
    })
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  function logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  // Don't render until auth check is complete to avoid flash
  if (!checked) return null;

  if (isLoggedIn) {
    return (
      <>
        <li>
          <a href="/yourticket" className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
            <FaHistory className="text-lg" /> History
          </a>
        </li>
        <li>
          <a href="/profile" className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
            <FaUser className="text-lg" /> Profile
          </a>
        </li>
        <li>
          <button
            onClick={logout}
            className="btn btn-ghost text-white hover:bg-red-500/20 hover:text-red-200 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2"
          >
            <HiOutlineLogout size={20} />
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <li>
      <a
        href="/login"
        className="btn btn-ghost text-white hover:bg-blue-500/20 hover:text-blue-200 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2"
      >
        <TbLogin2 size={20} />
        Login
      </a>
    </li>
  );
}
