/**
 * MobileNav.jsx — React island for mobile hamburger navigation
 * Loaded via client:media="(max-width: 1023px)" — zero JS on desktop.
 *
 * Handles: menu open/close, click-outside dismiss, auth state, logout.
 */
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { LuHome } from 'react-icons/lu';
import { MdOutlineLocationOn } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';
import { HiOutlineNewspaper, HiOutlineLogout } from 'react-icons/hi';
import { TbLogin2, TbLogout2 } from 'react-icons/tb';
import { FaUser, FaHistory } from 'react-icons/fa';
import { API_URL } from '../../lib/constants';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);

  // Check auth on mount
  useEffect(() => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return;

    fetch(`${API_URL}/api/token/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refresh }),
    })
      .then((res) => { if (res.ok) setIsLoggedIn(true); })
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  const navTo = (path) => {
    setIsOpen(false);
    window.location.href = path;
  };

  return (
    <div className="flex items-center" ref={dropdownRef}>
      {/* Hamburger toggle */}
      <button
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost lg:hidden hover:bg-white/10 transition-colors duration-200"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Logo (mobile) */}
      <a href="/">
        <img
          src="/Logo.webp"
          alt="Sightseeing Roma"
          width="160"
          height="85"
          className="w-24 h-auto sm:w-28 md:w-32"
        />
      </a>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          aria-label="Navigation menu"
          className="menu menu-sm absolute left-2 top-full mt-1 space-y-2 bg-white text-black text-lg rounded-xl z-[100] w-64 p-4 shadow-xl border border-gray-100"
        >
          <li onClick={() => navTo('/')}>
            <a className="text-base font-semibold pt-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
              <LuHome className="text-blue-600" /> Home
            </a>
          </li>

          {isLoggedIn ? (
            <>
              <li onClick={() => navTo('/yourticket')}>
                <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                  <FaHistory className="text-green-600" /> Purchase History
                </a>
              </li>
              <li onClick={() => navTo('/agentPoints')}>
                <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                  <MdOutlineLocationOn className="text-orange-600" /> Agent Points
                </a>
              </li>
              <li onClick={() => navTo('/profile')}>
                <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                  <FaUser className="text-purple-600" /> Profile
                </a>
              </li>
            </>
          ) : (
            <>
              <li onClick={() => navTo('/about-us')}>
                <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                  <BsInfoCircle className="text-blue-600" /> About Us
                </a>
              </li>
              <li onClick={() => navTo('/agentPoints')}>
                <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                  <MdOutlineLocationOn className="text-orange-600" /> Agent Points
                </a>
              </li>
            </>
          )}

          <li onClick={() => navTo('/blogs')}>
            <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
              <HiOutlineNewspaper className="text-indigo-600" /> Blog
            </a>
          </li>

          <hr className="my-2" />

          {isLoggedIn ? (
            <li onClick={logout}>
              <a className="text-base font-semibold hover:bg-red-50 text-red-600 rounded-lg px-3 py-2 transition-colors duration-200">
                <TbLogout2 className="text-red-600" /> Log Out
              </a>
            </li>
          ) : (
            <li onClick={() => navTo('/login')}>
              <a className="text-base font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors duration-200">
                <TbLogin2 className="text-blue-600" /> Log In
              </a>
            </li>
          )}
        </ul>
      )}

      {/* Mobile right-side auth icons (profile + logout) */}
      {isLoggedIn && (
        <div className="fixed right-16 top-3 flex items-center space-x-3 z-50">
          <a href="/profile" aria-label="View profile" className="text-white hover:text-gray-300 transition-colors duration-200">
            <FaUser size={18} />
          </a>
          <button
            onClick={logout}
            aria-label="Log out"
            className="text-white hover:text-red-300 transition-colors duration-200 p-1"
          >
            <HiOutlineLogout size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
