
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivities } from "@/data/mockData";
import { PlusCircle, Handshake } from "lucide-react";

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {recentActivities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-center gap-4 rounded-md border p-3"
          >
            <div className={`rounded-full p-2 ${
              activity.type === 'claim' 
                ? 'bg-green-100' 
                : 'bg-blue-100'
            }`}>
              {activity.type === 'claim' ? (
                <Handshake className={`h-4 w-4 ${
                  activity.type === 'claim'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`} />
              ) : (
                <PlusCircle className={`h-4 w-4 ${
                  activity.type === 'claim'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`} />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">
                {activity.user}
                <span className="text-muted-foreground font-normal">
                  {' '}
                  {activity.type === 'claim' ? 'claimed' : 'listed'}{' '}
                </span>
                {activity.item}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
