import React, { useRef, useState } from 'react';
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
import SidebarMenu from './SidebarMenu';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ open, onClose }) {
  const sidebarRef = useRef();
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();

  function handleBackdropClick(e) {
    if (e.target === sidebarRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={sidebarRef}
      tabIndex={-1}
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-[rgba(0,0,0,0.2)] transition-opacity duration-200 z-[200] ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`fixed top-0 h-screen w-[320px] max-w-[90vw] bg-white shadow-[ -2px_0_16px_rgba(0,0,0,0.15)]
          flex flex-col pt-8 pb-6 px-6 z-[201] transition-[right] duration-300`}
        style={{
          right: open ? '0px' : '-320px',
          background: '#E9D3BE',
        }}
      >
        <button
          className="absolute top-3 right-4 bg-none border-none text-[2rem] text-[#6D3811] cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {!user ? (
          <>
            <div className="text-[1.5rem] font-bold mb-8 text-[#6D3811]">
              {showSignUp ? 'Sign In' : 'Log-In'}
            </div>
            {!showSignUp ? (
              <LogInForm onSignUpClick={() => setShowSignUp(true)} />
            ) : (
              <SignUpForm onLogInClick={() => setShowSignUp(false)} />
            )}
          </>
        ) : (
          <SidebarMenu onClose={onClose} />
        )}
      </div>
    </div>
  );
}