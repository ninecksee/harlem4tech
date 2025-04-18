
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Handshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

// Define a type for the activity data structure
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

  const { data: activities, refetch } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          listings:item_id (
            title
          ),
          profiles:user_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Activity[];
    }
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activities?.map((activity) => (
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
                {activity.profiles?.full_name?.split(' ')[0] || 'Someone'}
                <span className="text-muted-foreground font-normal">
                  {' '}
                  {activity.action_type === 'claim' ? 'claimed' : 'listed'}{' '}
                </span>
                {activity.listings?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        {(!activities || activities.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
