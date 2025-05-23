
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/mockData";
import CategoryCard from './CategoryCard';

const CategoryGrid = () => {
  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      // First, fetch all available listings
      const { data: listings, error } = await supabase
        .from('listings')
        .select('category')
        .eq('status', 'available');
      
      if (error) throw error;
      
      // Manually count categories from the result
      const countMap: Record<string, number> = {};
      
      // Initialize all categories with 0 count
      categories.forEach(category => {
        countMap[category.id] = 0;
      });
      
      // Count listings by category
      if (listings && listings.length > 0) {
        listings.forEach(listing => {
          if (listing.category && countMap[listing.category] !== undefined) {
            countMap[listing.category]++;
          }
        });
      }
      
      return countMap;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={{
            ...category, // Spread the entire category object which includes description
            count: categoryCounts?.[category.id] || 0
          }} 
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
