import React from 'react';

const Contact = () => {
  return (
    <div>
      <h1 className="contact-title">Contact</h1>
      <p className="contact-content">
        If you want to contact me, here is the information below:
      </p>
      
      <p className="contact-info">
        <i className="fas fa-envelope"></i> Email: <a href="mailto:stjepandeveloper@yahoo.com" className="link-text">stjepandeveloper@yahoo.com</a>
      </p>

      <p className="contact-info">
        <i className="fab fa-github"></i> Github: <a href="https://github.com/stjepanDeveloper" className="link-text" target="_blank" rel="noopener noreferrer">https://github.com/stjepanDeveloper</a>
      </p>

      <p className="contact-info">
        <i className="fab fa-linkedin"></i> LinkedIn: ...
      </p>
    </div>
  );
};

export default Contact;