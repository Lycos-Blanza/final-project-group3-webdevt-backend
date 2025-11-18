import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import { useNotification } from '../contexts/NotificationContext';

export default function LogInForm({ onSignUpClick }) {
  const { login } = useAuth();
  const notify = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('diner28_token', token);
      login(user.email, null, user); // password not needed anymore
      notify('Login successful!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Email:
        <input required name="email" type="email" className="mt-1.5 p-2 border border-[#5C3A2E] rounded text-[1rem] bg-[#E9D3BE]" />
      </label>
      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Password:
        <input required name="password" type="password" className="mt-1.5 p-2 border border-[#5C3A2E] rounded text-[1rem] bg-[#E9D3BE]" />
      </label>
      <button type="submit" disabled={loading} className="mt-3 py-2.5 bg-[#5C3A2E] text-[#E9D3BE] rounded text-[1.1rem] font-bold">
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      <button type="button" onClick={onSignUpClick} className="mt-2.5 py-2 bg-transparent text-[#5C3A2E] rounded text-[1rem] font-bold w-full border border-[#5C3A2E]">
        Create Account
      </button>
    </form>
  );
}