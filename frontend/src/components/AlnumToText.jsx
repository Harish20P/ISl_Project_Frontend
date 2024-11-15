import React, { useState } from "react";
import Header from './Header';
import '../styles/AlnumToText.css';

const AlnumToText = () => {
  const [imageFile, setImageFile] = useState(null);
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // Array to hold uploaded images and their predicted text

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setOutputText('');  // Clear previous output
    }
  };

  // Send image to Flask backend for text extraction
  const processImage = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newImageData = {
          image: imageFile,
          text: data.text, // Assuming the result contains the extracted text
        };
        setUploadedImages([...uploadedImages, newImageData]); // Add the new image and text to the uploadedImages state
        setImageFile(null); // Reset the image input after upload
        setOutputText('');  // Clear output text
      } else {
        setOutputText('Error processing image.');
      }
    } catch (error) {
      console.error('Error:', error);
      setOutputText('Error connecting to server.');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Header />
      <p className="alnum-title">Image To Text Converter</p>
      <div className="alnum-container">
        {/* Display previously uploaded images and their predicted texts */}
        <div className="uploaded-images">
          {uploadedImages.map((item, index) => (
            <div key={index} className="image-text-container">
              <img
                src={URL.createObjectURL(item.image)}
                alt={`Uploaded ${index + 1}`}
                className="image-preview"
              />
              <p className="output-text-content">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="alnum-display">
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Uploaded"
              className="image-preview"
            />
          )}
        </div>
        
        <div className="alnum-text-output">
          {outputText && <p className="output-text-content">{outputText}</p>}
        </div>
        
      </div>
      <div className="upload-controls">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-label">Choose Image</label>
        <button 
          onClick={processImage} 
          disabled={!imageFile || isLoading} 
          className="process-button"
        >
          {isLoading ? 'Processing...' : 'Convert to Text'}
        </button>
      </div>
    </div>
  );
};

export default AlnumToText;