import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

interface Profile {
  full_name: string;
  first_name: string;
  last_name: string;
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
  const [message, setMessage] = useState('');

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            first_name,
            last_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as Listing & { profiles: Profile };
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

  const getUserDisplayName = (profile: Profile) => {
    const firstName = profile.first_name || profile.full_name.split(' ')[0];
    const lastName = profile.last_name || profile.full_name.split(' ').slice(1).join(' ');
    return `${firstName} ${lastName[0]}.`;
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
        {isLoading ? (
          <div>Loading...</div>
        ) : !listing ? (
          <div>Listing not found</div>
        ) : (
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
                  <p className="text-muted-foreground">Listed by {listing.profiles && getUserDisplayName(listing.profiles)}</p>
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
                  <p className="mt-2">{listing.issues}</p>
                </div>
              </div>

              {user && user.id !== listing.user_id && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Owner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send a message about this item</DialogTitle>
                      <DialogDescription>
                        Your message will be sent to the owner of this item.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Your message</Label>
                        <Textarea
                          id="message"
                          placeholder="Hi! I'm interested in your item..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleSendMessage} className="w-full">
                        Send Message
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListingDetails;
