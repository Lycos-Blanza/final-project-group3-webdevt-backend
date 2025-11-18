import React, { useState } from 'react';
import api from '../api/api';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpForm({ onLogInClick }) {
  const { login } = useAuth();
  const notify = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if (password !== confirm) {
      notify('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, user } = res.data;

      localStorage.setItem('diner28_token', token);
      login(user.email, null, user);
      notify('Account created successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      notify(msg, 'error');
    } finally {
      setLoading(false);
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
      <button type="submit" disabled={loading} className="mt-3 py-2.5 bg-[#5C3A2E] text-[#E9D3BE] rounded text-[1.1rem] font-bold">
        {loading ? 'Creating...' : 'Sign Up'}
      </button>
      <button type="button" onClick={onLogInClick} className="mt-2.5 py-2 bg-transparent text-[#5C3A2E] rounded text-[1rem] font-bold w-full border border-[#5C3A2E]">
        Already have an account? Log In
      </button>
    </form>
  );
}