import React, { ReactNode } from 'react';
import Footer from './footer';
import '@ant-design/v5-patch-for-react-19';
import Navbar from './navbar';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <header className="bg-grey-600 text-white">
        <Navbar />
      </header>

     
      <main className=" flex-grow container mx-auto p-4">
        
        {children}
      </main>

      
      <Footer />
    </div>
  );
};

export default Layout;