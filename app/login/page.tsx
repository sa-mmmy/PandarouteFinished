"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success,setSuccess]= useState('');

  const router = useRouter(); 

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message)
        // Store the token and user data in localStorage
        // To change later for cookies and not local storage 
        localStorage.setItem('token', data.token);
        //localStorage.setItem('user', JSON.stringify(data.user)); // Store the user object (if needed)
        window.location.href = 'profile';
        
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong!');
      console.error(err);
    }

    //router.push('/profile');
    //window.location.reload();
    
    console.log({ email, password });
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">PandaRoute</h1>
        <p className="text-center mb-8 text-gray-600">Welcome to PandaRoute</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
              placeholder="john.doe@gmail.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
              placeholder="**********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900 transition-colors"
          >
            Sign in
          </button>
          {error && <div className="text-green-800 mb-4">{error}</div>}
          {success && <div className="text-green-800 mb-4">{success}</div>}
        </form>

        <div className="my-6 flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="mt-8 text-center text-gray-600">
          <Link href="/forgotPassword" className="text-gray-600 hover:underline">
            Forgot Password ? 
          </Link>
        </div>

        <p className="mt-8 text-center text-gray-600">
          New to Pandaroute?{' '}
          <Link href="/signup" className="text-orange-500 hover:underline">
            Create Account
          </Link>
          
        </p>
      </div>
    </div>
  );
}