import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChatDialog from "@/components/chat/ChatDialog";

interface Listing {
  id: string;
  title: string;
  description: string;
  condition: string;
  category: string;
  location: string;
  issues: string | null;
  user_id: string;
  created_at: string;
  status: string;
}

interface Profile {
  full_name: string | null;
}

interface ListingImage {
  storage_path: string;
  order_index: number;
}

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [ownerProfile, setOwnerProfile] = useState<Profile | null>(null);

  const { data: listing, isLoading: listingLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!id) throw new Error('No listing ID provided');
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching listing:', error);
        throw error;
      }
      
      return data as Listing;
    },
    retry: 1,
  });

  const { isLoading: profileLoading } = useQuery({
    queryKey: ['profile', listing?.user_id],
    queryFn: async () => {
      if (!listing?.user_id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', listing.user_id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setOwnerProfile({ full_name: null });
        return null;
      }
      
      const profile = data as Profile;
      setOwnerProfile(profile);
      return profile;
    },
    enabled: !!listing?.user_id,
    retry: 1,
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
  }, [id]);

  const getUserDisplayName = (profile: Profile | null) => {
    if (!profile) return 'Unknown User';
    
    if (profile.full_name) {
      const nameParts = profile.full_name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + '.' : '';
      return lastName ? `${firstName} ${lastName}` : firstName;
    }
    
    return 'Unknown User';
  };

  const handleSendMessage = async () => {
    if (!user || !listing || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          listing_id: listing.id,
          sender_id: user.id,
          recipient_id: listing.user_id,
          content: message,
        });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "The owner will be notified of your interest.",
      });
      
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChatClick = () => {
    if (!user) {
      navigate('/auth', { state: { from: `/listing/${id}` } });
    }
  };

  const isLoading = listingLoading || profileLoading;

  if (isLoading && !listing) {
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
              <div className="flex items-center gap-2 mt-2">
                <p className="text-muted-foreground">{listing.location}</p>
                <span className="text-muted-foreground">•</span>
                <p className="text-muted-foreground">Listed by {getUserDisplayName(ownerProfile)}</p>
              </div>
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
                <p className="mt-2">{listing.issues || 'None reported'}</p>
              </div>
            </div>

            {user ? (
              user.id !== listing.user_id ? (
                <ChatDialog
                  listingId={listing.id}
                  recipientId={listing.user_id}
                />
              ) : null
            ) : (
              <Button 
                className="w-full"
                onClick={handleChatClick}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Sign in to Chat
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetails;
