
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import CategoryGrid from "./category/CategoryGrid";

const CategorySection = () => {
  return (
    <div className="w-full py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Browse Categories</h2>
        <Link to="/categories" className="text-tech-primary hover:text-tech-secondary flex items-center text-sm">
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <CategoryGrid />
    </div>
  );
};

export default CategorySection;
