
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/mockData";
import CategoryCard from './CategoryCard';

const CategoryGrid = () => {
  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('category, count(*)', { count: 'exact' })
        .eq('status', 'available')
        .group('category');
      
      if (error) throw error;
      
      const countMap = data?.reduce((acc, { category, count }) => {
        acc[category] = Number(count);
        return acc;
      }, {} as Record<string, number>);
      
      return countMap;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={{
            ...category,
            count: categoryCounts?.[category.id] || 0
          }} 
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
