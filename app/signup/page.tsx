// components/SignupAdvancedForm.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const occupations = [
  'Student',
  'Finance',
  'Health',
  'Education',
  'Service',
  'Tech',
  'Sports',
  'No occupation'
];

export default function SignupAdvancedForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    email: '',
    password:'',
    confirmPassword:'',
    birthdate: '',
    occupation: '',
  });


  const [Error, setPasswordError] = useState('');

  const router = useRouter(); 



  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Email validation
    if (!emailRegex.test(formData.email)) {
        setPasswordError('Please enter a valid email address.');
        return;
     }

    // Password length check
    if (formData.password.length < 6) {
        setPasswordError('Password must be at least 6 characters long.');
        return;
     }

    if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
     }
      
      //setPasswordError('Succussefull');


    try{
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const data = await res.json();
    
        if (data.success) {
          localStorage.setItem('token', data.token);
          setPasswordError('User registered successfully!');
          console.log(data.user); // optional
        } else {
          setPasswordError(data.error);
        }

        const res2 = await fetch ('api/send-email', { 
          method : 'POST' ,
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
          }),
        });

      } catch (err) {
        setPasswordError('Something went wrong!');
        console.error(err);
      }

        
      // Redirect to profile page
      window.location.href = '/profile';
      //router.push('/profile');
      //console.log(formData);  

  };

    
  
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-8"> {/* Added mx-auto for horizontal centering */}
       <h2 className="text-2xl font-bold text-center mb-6 text-green-800">Sign Up</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Sex *</label>
          <select
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            onChange={(e) => setFormData({...formData, sex: e.target.value})}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Repeat Password *</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Birthdate *</label>
          <input
            type="date"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
          />
        </div>

        <div>
            <label className="block text-gray-700 mb-2">Occupation *</label>
            <select
              required
              value={formData.occupation}
              onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            >
              <option value="">Select an occupation</option>
              {occupations.map((occupation) => (
                <option key={occupation} value={occupation}>
                  {occupation}
                </option>
              ))}
            </select>
          </div>
        <button
          type="submit" 
          className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900 transition-colors mt-6"
        >
          Complete Sign Up
        </button>
        {Error && <div className="text-green-800 mb-4">{Error}</div>}
      </form>
      </div>
    </div>
  );
}
