
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Category } from '@/data/mockData';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/category/${category.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-tech-primary/10 p-4 rounded-lg">
              {category.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {category.count} items
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
