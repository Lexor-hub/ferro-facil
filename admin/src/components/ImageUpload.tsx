import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabaseAdmin } from '../lib/supabase';

interface UploadedImage {
  url: string;
  alt_text: string;
  sort_order: number;
}

interface ImageUploadProps {
  productId?: string;
  existingImages?: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({
  productId,
  existingImages = [],
  onImagesChange,
  maxImages = 5,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>(existingImages);

  const uploadImages = async (imageFiles: File[]): Promise<UploadedImage[]> => {
    const uploadedImages: UploadedImage[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;

      try {
        // Upload to Supabase Storage
        const { data: storageData, error: storageError } = await supabaseAdmin.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (storageError) {
          console.error('Error uploading file:', storageError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedImages.push({
          url: publicUrl,
          alt_text: file.name.split('.')[0],
          sort_order: images.length + uploadedImages.length + 1
        });

      } catch (error) {
        console.error('Error in upload process:', error);
      }
    }

    return uploadedImages;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    setUploading(true);

    try {
      const newImages = await uploadImages(acceptedFiles);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onImagesChange]);

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
      .map((img, index) => ({ ...img, sort_order: index + 1 }));

    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

        {uploading ? (
          <p className="text-sm text-gray-600">Fazendo upload...</p>
        ) : images.length >= maxImages ? (
          <p className="text-sm text-gray-600">Limite máximo de imagens atingido</p>
        ) : isDragActive ? (
          <p className="text-sm text-gray-600">Solte as imagens aqui...</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, GIF até 10MB ({images.length}/{maxImages})
            </p>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                <img
                  src={image.url}
                  alt={image.alt_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b7280">Erro</text></svg>';
                  }}
                />
              </div>

              {/* Remove Button */}
              <Button
                onClick={() => removeImage(index)}
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>

              {/* Order indicator */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {images.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ImageIcon className="h-4 w-4" />
          <span>Nenhuma imagem selecionada</span>
        </div>
      )}
    </div>
  );
}