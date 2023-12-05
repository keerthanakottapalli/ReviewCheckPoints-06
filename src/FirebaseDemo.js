import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';

const FirebaseFileUpload = () => {
  const mockData = Array.from({ length: 100 }, (_, index) => ({
    file: null,
    uploading: false,
    progress: 0,
    imageUrl: null,
    id: index + 1,
  }));

  const firebaseConfig = {
    apiKey: "AIzaSyDD6YZm2vcDGYrPoMJGN6WPWTluyzKahSk",
    authDomain: "clouddemo-2e42b.firebaseapp.com",
    projectId: "clouddemo-2e42b",
    storageBucket: "clouddemo-2e42b.appspot.com",
    messagingSenderId: "644022241974",
    appId: "1:644022241974:web:7ed1bf6cf3ca496763b417",
    measurementId: "G-25998DYZT5"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const [rows, setRows] = useState(mockData);
  const storage = firebase.storage();

  useEffect(() => {
    // You may want to do something with imageUrls, e.g., save them in the database, etc.
    const imageUrls = rows.map((row) => row.imageUrl);
    console.log('Image URLs:', imageUrls);
  }, [rows]);

  const handleFileChange = (e, rowIndex) => {
    const selectedFile = e.target.files[0];
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        file: selectedFile,
      };
      return newRows;
    });
  };

  const handleUpload = async (rowIndex) => {
    const { file } = rows[rowIndex];

    if (file) {
      const storageRef = storage.ref(`uploads/${file.name}`);
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const newProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setRows((prevRows) => {
            const newRows = [...prevRows];
            newRows[rowIndex] = {
              ...newRows[rowIndex],
              progress: newProgress,
            };
            return newRows;
          });
        },
        (error) => {
          console.error(error.message);
        },
        () => {
          storageRef.getDownloadURL().then((downloadURL) => {
            setRows((prevRows) => {
              const newRows = [...prevRows];
              newRows[rowIndex] = {
                ...newRows[rowIndex],
                imageUrl: downloadURL,
              };
              return newRows;
            });
          });
        }
      );

      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex] = { ...newRows[rowIndex], uploading: true };
        return newRows;
      });

      await uploadTask;

      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex] = { ...newRows[rowIndex], uploading: false };
        return newRows;
      });
    } else {
      console.error('No file selected');
    }
  };

  const handleDownload = (imageUrl) => {
    // You can use the imageUrl to download the file
    // For simplicity, let's open the image in a new tab for download
    const downloadWindow = window.open(imageUrl, '_blank');
    if (downloadWindow) {
      downloadWindow.focus();
    } else {
      console.error('Failed to open download window');
    }
  };

  return (
    <div>
      {rows.map((row, index) => (
        <div key={index}>
          <p>Row {row.id}</p>
          <input type="file" onChange={(e) => handleFileChange(e, index)} />
          <button onClick={() => handleUpload(index)} disabled={row.uploading}>
            Upload
          </button>
          {row.uploading && <p>Uploading: {row.progress}%</p>}
          {row.imageUrl && (
            <div>
              <img
                src={row.imageUrl}
                alt={`Uploaded ${index + 1}`}
                style={{ width: '100%', marginTop: '20px' }}
              />
              <button onClick={() => handleDownload(row.imageUrl)}>
                Download
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FirebaseFileUpload;
