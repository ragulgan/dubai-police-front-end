"use client"

import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface ImageUploadProps {
  name: string;
  control: Control<any>;
  setValue: (name: string, value: any) => void;
  defaultImage?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  control,
  setValue,
  defaultImage,
  label = 'Upload Image',
}) => {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      setValue(name, file); // Set the file in react-hook-form
    }
  };

  return (
    <Box>
      <Typography>{label}</Typography>
      {preview && (
        <Box
          component="img"
          src={preview}
          alt="Image Preview"
          sx={{ width: '100px', height: '100px', objectFit: 'cover', mt: 2, mb: 2 }}
        />
      )}
      <Button variant="contained" component="label">
        Choose Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>
    </Box>
  );
};

export default ImageUpload;
