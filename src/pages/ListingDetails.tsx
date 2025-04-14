
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: string;
  title: string;
  description: string;
  condition: string;
  category: string;
  location: string;
  issues: string;
  user_id: string;
  created_at: string;
  status: string;
}

interface ListingImage {
  storage_path: string;
  order_index: number;
}

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Listing;
    },
  });

  useEffect(() => {
    const fetchImages = async () => {
      if (!id) return;

      const { data: imageRecords, error: imageError } = await supabase
        .from('listing_images')
        .select('storage_path, order_index')
        .eq('listing_id', id)
        .order('order_index');

      if (imageError) {
        console.error('Error fetching images:', imageError);
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
  }, [id]);

  const startChat = async () => {
    if (!user || !listing) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          listing_id: listing.id,
          sender_id: user.id,
          recipient_id: listing.user_id,
          content: `Hi! I'm interested in your ${listing.title}.`,
        });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "The owner will be notified of your interest.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div>Loading...</div>
      </main>
    </div>;
  }

  if (!listing) {
    return <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div>Listing not found</div>
      </main>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {selectedImage && (
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img 
                  src={selectedImage} 
                  alt={listing.title}
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
                    alt={`${listing.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <p className="text-muted-foreground mt-2">{listing.location}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-2">{listing.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Condition</h2>
                <p className="mt-2">{listing.condition}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Category</h2>
                <p className="mt-2">{listing.category}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Known Issues</h2>
                <p className="mt-2">{listing.issues}</p>
              </div>
            </div>

            {user && user.id !== listing.user_id && (
              <Button 
                onClick={startChat}
                className="w-full"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Owner
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetails;
