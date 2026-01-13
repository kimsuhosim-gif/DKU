
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-champagne-100 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-8 md:mb-0">
          <h2 className="font-serif text-2xl text-sage-600 italic">DKU-RE09</h2>
          <p className="text-sage-400 text-sm mt-2 max-w-xs font-light">
            Premium golf community for Dankook University Urban Planning & Real Estate Class of '09.
          </p>
        </div>

        {/* Navigation links removed per user request */}
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-champagne-50 flex flex-col md:flex-row justify-between items-center text-[10px] text-sage-300 uppercase tracking-widest">
        <span>&copy; since 2009 DKU-RE09 Golf Club. All Rights Reserved.</span>
        <span className="mt-4 md:mt-0">Design for Excellence</span>
      </div>
    </footer>
  );
};

export default Footer;
