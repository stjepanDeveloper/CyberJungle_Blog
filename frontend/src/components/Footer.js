import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <p className="footer-text">Made by stjepanDeveloper &copy; {currentYear}</p>
    </div>
  );
};

export default Footer;