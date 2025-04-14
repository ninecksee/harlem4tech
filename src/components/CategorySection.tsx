
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/mockData";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategorySection = () => {
  return (
    <div className="w-full py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Browse Categories</h2>
        <Link to="/" className="text-tech-primary hover:text-tech-secondary flex items-center text-sm">
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link to="/" key={category.id}>
            <Card className="hover:shadow-md transition-all duration-300 hover:border-tech-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <span className="text-3xl mb-2">{category.icon}</span>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{category.count} items</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
