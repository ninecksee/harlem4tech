
import { ChevronRight } from "lucide-react";
import CategoryGrid from "./category/CategoryGrid";

const CategorySection = () => {
  return (
    <div id="categories" className="w-full py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Browse Categories</h2>
      </div>
      
      <CategoryGrid />
    </div>
  );
};

export default CategorySection;
