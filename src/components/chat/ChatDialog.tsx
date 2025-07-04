
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ChatDialogProps {
  listingId: string;
  recipientId: string;
  recipientName?: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  listing_id: string;
  read: boolean;
}

const ChatDialog = ({ listingId, recipientId, recipientName }: ChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    if (!isOpen) return;
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `listing_id=eq.${listingId}` },
        (payload) => {
          const message = payload.new as Message;
          if (
            (message.sender_id === user?.id && message.recipient_id === recipientId) ||
            (message.sender_id === recipientId && message.recipient_id === user?.id)
          ) {
            setMessages((prev) => [...prev, message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, user, recipientId, listingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
  }, [user, listingId, recipientId]);

  const sendMessage = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          content: newMessage.trim(),
          listing_id: listingId,
          sender_id: user.id,
          recipient_id: recipientId,
        });

      if (error) throw error;

      setNewMessage("");
      await fetchMessages();
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
          <DialogDescription>
            Send a message about this item to {recipientName || 'the owner'}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
