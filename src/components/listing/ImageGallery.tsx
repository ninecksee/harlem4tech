
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ListingImage {
  storage_path: string;
  order_index: number;
}

interface ImageGalleryProps {
  listingId: string;
}

const ImageGallery = ({ listingId }: ImageGalleryProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!listingId) return;

      const { data: imageRecords, error: imageError } = await supabase
        .from('listing_images')
        .select('storage_path, order_index')
        .eq('listing_id', listingId)
        .order('order_index');

      if (imageError) {
        console.error('Error fetching images:', imageError);
        return;
      }

      if (!imageRecords || imageRecords.length === 0) {
        console.log('No images found for this listing');
        return;
      }

      const imageUrls = await Promise.all(
        (imageRecords as ListingImage[]).map(async (record) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('listing-images')
            .getPublicUrl(record.storage_path);
          return publicUrl;
        })
      );

      setImages(imageUrls);
      if (imageUrls.length > 0) {
        setSelectedImage(imageUrls[0]);
      }
    };

    fetchImages();
  }, [listingId]);

  return (
    <div className="space-y-4">
      {selectedImage && (
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img 
            src={selectedImage} 
            alt="Selected listing image"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`aspect-square overflow-hidden rounded-lg border-2 ${
              selectedImage === image ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img 
              src={image} 
              alt={`Listing image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
