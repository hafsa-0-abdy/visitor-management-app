import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const PageContainer = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 py-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageContainer;
