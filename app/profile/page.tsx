"use client" ; 

import {jwtDecode} from 'jwt-decode';
import { useState , useEffect ,useRef} from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [userInfo,setUserInfo] = useState({
    name: '',
    email: '',
    profilePicture: '/public/profile.jpg', 
  });
  
  const [file, setFile] = useState<File | null>(null);
  //const [file, setFile] = useState(null); 
  //const fileInputRef = useRef(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);


  interface CustomJwtPayload {
  firstName?: string;
  email?: string;
  profilePicture?: string;
  
}



  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        
        //const decodedToken = jwtDecode(token);
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
       
        setUserInfo({
          name: decodedToken.firstName || 'Unknown User',
          email: decodedToken.email || 'No email provided',
          profilePicture: decodedToken.profilePicture || '/profile.jpg',
        });
      } catch (error) {
        console.error('Error decoding JWT:', error);
        router.push('/'); 
      }
    } else {
      router.push('/'); 
    }
  }, [router]);

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    
    //router.push('/');
    //window.location.reload();
    window.location.href = '/';
  };


  const handleEdit = () => {
     
     window.location.href = 'editProfile';
  };

  


  const viewHistory=()=>{
        window.location.href='profile/historique'
  };

  

  //const handleImageClick = () => {
  //fileInputRef.current.click(); // Trigger the file input click
  //};


  const handleImageClick = () => {
  fileInputRef.current?.click();
  };



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {

        if(typeof reader.result === 'string'){
            setUserInfo((prevState) => ({
              ...prevState,
              profilePicture: reader.result as string  
          }));
        }
      }
      reader.readAsDataURL(selectedFile); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          Welcome back, {userInfo.name}!
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture (Clickable) */}
          <img
            src={userInfo.profilePicture}
            alt="Profile Picture"
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-800 cursor-pointer"
            onClick={handleImageClick} 
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* User Information */}
          <div className="w-full text-center">
            <p className="text-xl font-semibold text-gray-700">{userInfo.name}</p>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              className="bg-green-800 text-white py-2 px-6 rounded-lg hover:bg-green-900 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={viewHistory}
              className="bg-green-800 text-white py-2 px-6 rounded-lg hover:bg-green-900 transition-colors"
            >
              View History
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
