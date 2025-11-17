// src/components/SignUpForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpForm({ onLogInClick }) {
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email');
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      setError('Password too short');
      setLoading(false);
      return;
    }

    const success = signup(name, email, password);
    setLoading(false);
    if (!success) {
      setError('Email already exists');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Name:
        <input required name="name" className="mt-1.5 p-2 border border-[#5C3A2E] rounded text-[1rem] bg-[#E9D3BE]" />
      </label>
      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Email:
        <input required type="email" name="email" className="mt-1.5 p-2 border border-[#5C3A2E] rounded text-[1rem] bg-[#E9D3BE]" />
      </label>
      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Password:
        <input required type="password" name="password" className="mt-1.5 p-2 border border-[#5C3A2E] rounded text-[1rem] bg-[#E9D3BE]" />
      </label>
      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Confirm:
        <input required type="password" name="confirmPassword" className="mt-1.5 p-2 border border-[#5C3A2E] rounded text-[1rem] bg-[#E9D3BE]" />
      </label>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" disabled={loading} className="mt-3 py-2.5 bg-[#5C3A2E] text-[#E9D3BE] rounded text-[1.1rem] font-bold">
        {loading ? 'Creating...' : 'Sign Up'}
      </button>
      <button type="button" onClick={onLogInClick} className="mt-2.5 py-2 bg-transparent text-[#5C3A2E] rounded text-[1rem] font-bold w-full border border-[#5C3A2E]">
        Log In
      </button>
    </form>
  );
}