import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto shadow-sm">
      <div className="container px-4 mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-estate-primary font-bold text-xl mr-2">Royal Park</span>
            <span className="text-slate-700 font-medium">Estate Security</span>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-slate-600 hover:text-estate-primary transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-600 hover:text-estate-primary transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-slate-600 hover:text-estate-primary transition-colors text-sm">Contact</a>
          </div>
          
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Royal Park Estate Security System. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;