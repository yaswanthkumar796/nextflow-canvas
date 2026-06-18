import React, { useRef } from 'react';

export default function ImageUploadZone({ onUpload, currentImage }) {
  const fileInputRef = useRef(null);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      onUpload(imgUrl);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onUpload(null);
  };

  return (
    <div 
      onClick={handleBoxClick}
      style={{
        border: '2px dashed #9ca3af',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        cursor: 'pointer',
        position: 'relative',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        color: '#6b7280'
      }}
    >
      <input 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      {currentImage ? (
        <>
          <img 
            src={currentImage} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '4px' }} 
          />
          <button 
            onClick={handleClear}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}
          >
            ×
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span style={{ fontSize: '14px' }}>Upload Image</span>
        </div>
      )}
    </div>
  );
}
