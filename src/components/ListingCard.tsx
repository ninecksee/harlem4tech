import { MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Listing } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const navigate = useNavigate();
  const { id, title, description, image, condition, location, postedAt, user, isNew, isFeatured } = listing;
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Working': return 'bg-green-100 text-green-800';
      case 'Needs Repair': return 'bg-yellow-100 text-yellow-800';
      case 'For Parts': return 'bg-red-100 text-red-800';
      case 'Like New': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer",
        isFeatured ? "border-tech-accent border-2" : ""
      )}
      onClick={() => navigate(`/listing/${id}`)}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-all hover:scale-105 duration-300"
          />
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isNew && (
            <span className="badge-new">NEW</span>
          )}
          {isFeatured && (
            <span className="badge-featured">FEATURED</span>
          )}
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          <Badge className={getConditionColor(condition)} variant="outline">
            {condition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-muted-foreground line-clamp-2 text-sm h-10">
          {description}
        </p>
        
        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="mr-3">{location}</span>
          <Clock className="mr-1 h-3 w-3" />
          <span>{postedAt}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-xs">{user.name}</span>
        </div>
        
        <Button size="sm" className="bg-tech-primary hover:bg-tech-secondary">
          Claim It
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
