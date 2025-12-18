"use client" ;
import MainNav from "./mainNav" ;
import SideNav from "./sideNav";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import {jwtDecode} from 'jwt-decode';


export default function Navbar(){

  const [user, setUser] = useState({
    name: '',
  });

  interface MyJwtPayload {
  firstName: string;
  // add any other fields you use (e.g., email, id, etc.)
}

  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        //const decodedToken = jwtDecode(token);
        const decodedToken = jwtDecode<MyJwtPayload>(token);
        setUser({ name: decodedToken.firstName || 'Unknown User' });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      setUser({ name: '' }); // Clear user when no token exists
    }
  }, []); 


  return (
    <nav className="sticky top-0 w-full border justify-between">
         <div className="h-14  flex items-center bg-gradient-to-r custom-green to-orange-400">
            {/*Desktop and mobile */}
           <MainNav/>
            
            {/*Desktop*/}
           <h1 className='hidden md:flex items-center justify-end gap-4 flex-1 ml-20 mr-8 '>
           

               <Link href="/" className="text-gray-700 hover:text-white font-medium "> Home </Link>

               {/*<Link href="/login" className="text-gray-700 hover:text-white font-medium "> Sign In  </Link>*/}

               {user.name ? (
                  <Link href="/profile" className="text-gray-700 hover:text-white font-medium">Hello  {user.name}</Link>
                 ) : (
                <Link href="/login" className="text-gray-700 hover:text-white font-medium">
                  Sign In
                </Link>
              )}
              {/*<Link href="/contact" className="text-gray-700 hover:text-white font-medium "> Contact us </Link> */}
            </h1>
        
          


          {/*Mobile */}

            <h1 className="md:hidden">

             <SideNav/>
            </h1>
        
        </div>




    </nav>

  );

}