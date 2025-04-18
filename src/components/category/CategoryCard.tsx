
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    description: string;
    count: number;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/?category=${category.id}`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-tech-primary/10 p-4 rounded-full">
            <span className="text-2xl" role="img" aria-label={category.name}>
              {category.icon}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4">
        <p className="text-sm">
          {category.count} {category.count === 1 ? 'item' : 'items'} available
        </p>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
