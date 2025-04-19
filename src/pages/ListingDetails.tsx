import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ChatDialog from "@/components/chat/ChatDialog";
import ImageGallery from '@/components/listing/ImageGallery';
import ListingInfo from '@/components/listing/ListingInfo';

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
          <ImageGallery listingId={listing.id} />

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
