import React, { ReactNode } from 'react';
import Navbar from './navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <header className="bg-grey-600 text-white p-4">
        <Navbar/>
        
      </header>

     
      <main className=" flex-grow container mx-auto p-4">
        
        {children}
      </main>

      
      <footer className="bg-purple-800 text-white p-4">
        <p>© 2024 Your Website</p>
      </footer>
    </div>
  );
};

export default Layout;