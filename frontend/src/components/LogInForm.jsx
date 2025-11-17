import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LogInForm({ onSignUpClick }) {
  const { login } = useAuth();
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const result = login(email, password);
    if (result) {
      alert(`Login successful: ${email}`);
    } else {
      setError('Incorrect email or password');
      alert('Incorrect email or password');
    }
  }

  return (
    <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Email:
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="mt-[6px] p-[8px] border border-[#5C3A2E] rounded-[4px] text-[1rem] bg-[#E9D3BE]"
        />
      </label>

      <label className="flex flex-col text-[1rem] text-[#5C3A2E]">
        Password:
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-[6px] p-[8px] border border-[#5C3A2E] rounded-[4px] text-[1rem] bg-[#E9D3BE]"
        />
      </label>

      <button
        type="submit"
        className="mt-[12px] py-[10px] bg-[#5C3A2E] text-[#E9D3BE] rounded-[4px] text-[1.1rem] font-bold cursor-pointer"
      >
        Log-in
      </button>

      <button
        type="button"
        className="mt-[10px] py-[8px] bg-transparent text-[#5C3A2E] rounded-[4px] text-[1rem] font-bold cursor-pointer w-full border border-[#5C3A2E]"
        onClick={onSignUpClick}
      >
        Sign-up
      </button>

      {error && (
        <div className="text-red-600 font-medium mt-2">
          {error}
        </div>
      )}
    </form>
  );
}
