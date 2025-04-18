
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ChatDialogProps {
  listingId: string;
  recipientId: string;
}

const ChatDialog = ({ listingId, recipientId }: ChatDialogProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          content: message.trim(),
          listing_id: listingId,
          sender_id: user.id,
          recipient_id: recipientId,
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      
      setMessage("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Button
        onClick={() => {
          toast({
            title: "Sign in required",
            description: "Please sign in to send messages",
            variant: "destructive",
          });
        }}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Contact Owner
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Owner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            Send a message about this item to the owner
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSendMessage}
            className="w-full"
            disabled={!message.trim()}
          >
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
