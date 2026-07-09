// components/ImageEnhancer.tsx
'use client';
import { useState } from 'react';

export default function ImageEnhancer() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const enhanceImage = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/enhance-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Enhancement failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      alert('Error enhancing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) enhanceImage(file);
        }}
      />
      {loading && <p>Enhancing...</p>}
      {imageUrl && (
        <div>
          <p>Enhanced Image:</p>
          <img src={imageUrl} alt="Enhanced" style={{ maxWidth: '400px' }} />
          <a href={imageUrl} download="enhanced-image.jpg">Download</a>
        </div>
      )}
    </div>
  );
}