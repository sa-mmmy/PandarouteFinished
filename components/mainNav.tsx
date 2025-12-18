
import Link from "next/link";
import Image from "next/image";
export default function MainNav() {
    return (
         <div className="items-center ml-10 object contain">
          <Link href='/'> 
          <Image src="/Group 4.png" alt="Logo" width={200} height={90}/>
          </Link>
         </div>
        
    );
    
};
