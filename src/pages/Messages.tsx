
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  listing_id: string;
  read: boolean;
}

interface Conversation {
  otherUserId: string;
  listingId: string;
  lastMessage: Message;
  unreadCount: number;
  otherUserName?: string;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, string>>({});

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (userProfiles[userId]) return userProfiles[userId];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (!error && data?.full_name) {
        setUserProfiles(prev => ({ ...prev, [userId]: data.full_name }));
        return data.full_name;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    
    return `User ${userId.slice(0, 8)}`;
  }, [userProfiles]);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    const conversationsMap = new Map<string, Conversation>();

    data.forEach((message: Message) => {
      const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
      const key = `${otherUserId}-${message.listing_id}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          otherUserId,
          listingId: message.listing_id,
          lastMessage: message,
          unreadCount: message.recipient_id === user.id && !message.read ? 1 : 0
        });
      }
    });

    const conversationsArray = Array.from(conversationsMap.values());
    
    // Fetch user names for all conversations
    const conversationsWithNames = await Promise.all(
      conversationsArray.map(async (conversation) => {
        const userName = await fetchUserProfile(conversation.otherUserId);
        return { ...conversation, otherUserName: userName };
      })
    );

    setConversations(conversationsWithNames);
  }, [user, fetchUserProfile]);

  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data);

    // Mark messages as read
    const unreadMessages = data.filter(
      (message: Message) => message.recipient_id === user.id && !message.read
    );

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map((message: Message) => message.id);
      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);
      
      // Refresh conversations to update unread counts
      fetchConversations();
    }
  }, [user, fetchConversations]);

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const [otherUserId, listingId] = selectedConversation.split('-');

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: user.id,
          recipient_id: otherUserId,
          listing_id: listingId
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(otherUserId);
      fetchConversations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      const [otherUserId] = selectedConversation.split('-');
      fetchMessages(otherUserId);
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user || !selectedConversation) return;

    const [otherUserId, listingId] = selectedConversation.split('-');
    
    const channel = supabase
      .channel('messages-page')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `listing_id=eq.${listingId}`
        },
        (payload) => {
          const message = payload.new as Message;
          if (
            (message.sender_id === user.id && message.recipient_id === otherUserId) ||
            (message.sender_id === otherUserId && message.recipient_id === user.id)
          ) {
            setMessages((prev) => [...prev, message]);
            // Also refresh conversations to update last message
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation, fetchConversations]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold text-lg">Conversations</h2>
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={`${conversation.otherUserId}-${conversation.listingId}`}
                  onClick={() => setSelectedConversation(`${conversation.otherUserId}-${conversation.listingId}`)}
                  className={`w-full p-3 rounded-lg text-left hover:bg-accent ${
                    selectedConversation === `${conversation.otherUserId}-${conversation.listingId}` 
                      ? 'bg-accent' 
                      : ''
                  }`}
                >
                  <div className="font-medium">{conversation.otherUserName || `User ${conversation.otherUserId.slice(0, 8)}`}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.content}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="mt-1 text-xs text-primary font-medium">
                      {conversation.unreadCount} unread
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 border rounded-lg p-4">
            {selectedConversation ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
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
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
