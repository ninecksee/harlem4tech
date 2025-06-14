import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ChatDialog from "@/components/chat/ChatDialog";
import ImageGallery from '@/components/listing/ImageGallery';
import ListingInfo from '@/components/listing/ListingInfo';
import ItemLocationMap from '@/components/listing/ItemLocationMap';

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

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ownerProfile, setOwnerProfile] = useState<Profile | null>(null);
  const [hasImages, setHasImages] = useState<boolean>(false);

  const { data: listing, isLoading: listingLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!id) throw new Error('No listing ID provided');
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Listing;
    },
  });

  // Add a new query to check for images
  const { isLoading: imagesLoading } = useQuery({
    queryKey: ['listing-images', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data } = await supabase
        .from('listing_images')
        .select('*')
        .eq('listing_id', id);
      
      setHasImages(Boolean(data && data.length > 0));
      return data;
    },
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

  const getUserDisplayName = (profile: Profile | null) => {
    if (!profile || !profile.full_name) return "Anonymous";
    
    const nameParts = profile.full_name.split(' ');
    
    if (nameParts.length === 1) return nameParts[0];
    
    const firstName = nameParts[0];
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + '.' : '';
    
    return lastInitial ? `${firstName} ${lastInitial}` : firstName;
  };

  const handleChatClick = () => {
    if (!user) {
      navigate('/auth', { state: { from: `/listing/${id}` } });
    }
  };

  const isLoading = listingLoading || imagesLoading;

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

  const showChatButton = listing.user_id !== user?.id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {hasImages ? (
            <ImageGallery listingId={listing.id} />
          ) : (
            <div className="aspect-square">
              <ItemLocationMap location={listing.location} />
            </div>
          )}

          <div>
            <ListingInfo
              title={listing.title}
              description={listing.description}
              condition={listing.condition}
              category={listing.category}
              location={listing.location}
              issues={listing.issues}
              ownerName={getUserDisplayName(ownerProfile)}
            />

            {showChatButton && (
              <div className="mt-4">
                <ChatDialog
                  listingId={listing.id}
                  recipientId={listing.user_id}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetails;
