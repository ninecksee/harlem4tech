
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Handshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface Activity {
  id: string;
  action_type: string;
  created_at: string;
  item_id: string | null;
  user_id: string;
  listings?: {
    title: string;
  } | null;
  profiles?: {
    full_name: string | null;
  } | null;
}

const RecentActivity = () => {
  const { toast } = useToast();
  const { data: activities, refetch, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      try {
        // First fetch activities with listing information
        const { data, error } = await supabase
          .from('activities')
          .select(`
            id,
            action_type,
            created_at,
            item_id,
            user_id,
            listings:item_id (
              title
            )
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        console.log("Fetched activities:", data);
        
        if (!data || data.length === 0) {
          return [];
        }
        
        // Then fetch user profiles separately
        const activitiesWithProfiles = await Promise.all(
          data.map(async (activity) => {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', activity.user_id)
              .single();
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              return {
                ...activity,
                profiles: { full_name: null }
              };
            }
            
            return {
              ...activity,
              profiles: profileData
            };
          })
        );
        
        console.log("Activities with profiles:", activitiesWithProfiles);
        return activitiesWithProfiles as Activity[];
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        toast({
          title: "Error",
          description: "Failed to fetch recent activities",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const getUserDisplayName = (activity: Activity) => {
    if (!activity.profiles || !activity.profiles.full_name) {
      return "Anonymous";
    }
    
    const fullName = activity.profiles.full_name;
    const nameParts = fullName.split(' ');
    
    if (nameParts.length === 1) return nameParts[0];
    
    const firstName = nameParts[0];
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
    
    return `${firstName} ${lastInitial}.`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading && (
          <p className="text-sm text-center text-muted-foreground">Loading activities...</p>
        )}
        
        {!isLoading && activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center gap-4 rounded-md border p-3"
            >
              <div className={`rounded-full p-2 ${
                activity.action_type === 'claim' 
                  ? 'bg-green-100' 
                  : 'bg-blue-100'
              }`}>
                {activity.action_type === 'claim' ? (
                  <Handshake className="h-4 w-4 text-green-600" />
                ) : (
                  <PlusCircle className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {getUserDisplayName(activity)}
                  <span className="text-muted-foreground font-normal">
                    {' '}
                    {activity.action_type === 'claim' ? 'claimed' : 'listed'}{' '}
                  </span>
                  {activity.item_id ? (
                    <Link 
                      to={`/listing/${activity.item_id}`}
                      className="text-primary hover:underline"
                    >
                      {activity.listings?.title || 'an item'}
                    </Link>
                  ) : (
                    activity.listings?.title || 'an item'
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        ) : (
          !isLoading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
