
import React from 'react';
// import { FaDownload } from 'react-icons/fa';
const Preview = ({ imageUrl }) => {

    const handleDownload = () => {
       
        const downloadWindow = window.open(imageUrl, '_blank');
        if (downloadWindow) {
          downloadWindow.focus();
        } else {
          console.error('Failed to open download window');
        }
      };


  return (
    <div>
    {imageUrl && (
      <div>
        <img
          src={imageUrl}
          alt="Preview"
          style={{ width: '100%', marginTop: '20px' }}
        />
        {/* Download icon */}
        <button onClick={handleDownload} style={{ marginTop: '10px' }}>
           Download
        </button>
      </div>
    )}
  </div>
  );
};

export default Preview;
