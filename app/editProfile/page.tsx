'use client';

import { useEffect, useState } from 'react';

export default function EditProfilePage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    birthdate: '',
    sex: '',
    occupation: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
  async function fetchUser() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/getProfile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (res.ok) {
      const data = await res.json();

      
      const birthdateOnly = data.birthdate?.split('T')[0];

      setForm({
        ...data,
        birthdate: birthdateOnly || '',
      });
    }
  }
  fetchUser();
}, []);


 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    const res = await fetch('/api/editProfile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' ,
        
        Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify(form),
    });

    



    const data = await res.json();
    setMessage(data.message || data.error);

    if (data.token) {
    localStorage.setItem('token', data.token);
    }

    window.location.href='profile';

    
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Edit Profile</h2>
      {message && <p className="text-center text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-1/2 border rounded p-2"
            placeholder='First name'
            required
          />
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-1/2 border rounded p-2"
            placeholder='Last name'
            required
          />
        </div>

        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <select
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Select an occupation</option>
          <option value="Student">Student</option>
          <option value="Employee">Employee</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded w-full">
          Save Changes
        </button>

      </form>
    </div>
  );
}
