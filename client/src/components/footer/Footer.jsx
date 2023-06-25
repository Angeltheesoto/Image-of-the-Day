import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer-container">
      <hr />
      <p>&copy; {currentYear} IOTD. All rights reserved.</p>
    </div>
  );
};

export default Footer;
