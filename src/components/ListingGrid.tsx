import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import FiltersSection from "./filters/FiltersSection";
import ListingSorter from "./listing/ListingSorter";
import ListingsContent from "./listing/ListingsContent";
import RecentActivity from "./RecentActivity";

interface Filters {
  condition: string[];
  category: string[];
  location: string;
  listingAge: string;
}

type SortOption = 'latest' | 'oldest' | 'alphabetical';

const ListingGrid = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    condition: [],
    category: [],
    location: 'all',
    listingAge: 'all'
  });
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');
    const queryParam = searchParams.get('q');
    
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        category: [categoryParam]
      }));
    }
    
    if (locationParam) {
      setFilters(prev => ({
        ...prev,
        location: locationParam
      }));
    }
    
    if (queryParam) {
      setFilters(prev => ({
        ...prev,
        listingAge: 'all'
      }));
    }
  }, [searchParams]);

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['listings', filters, sortBy, searchParams.toString()],
    queryFn: async () => {
      const queryParam = searchParams.get('q');
      
      let query = supabase
        .from('listings')
        .select(`
          *,
          listing_images (
            storage_path,
            order_index
          )
        `);
      
      if (queryParam) {
        query = query.ilike('title', `%${queryParam}%`);
      }

      if (filters.condition.length > 0) {
        query = query.in('condition', filters.condition);
      }
      
      if (filters.category.length > 0) {
        query = query.in('category', filters.category);
      }
      
      if (filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }
      
      if (filters.listingAge !== 'all') {
        const now = new Date();
        let dateFilter = now;
        switch (filters.listingAge) {
          case 'today':
            dateFilter = new Date(now.setDate(now.getDate() - 1));
            break;
          case 'week':
            dateFilter = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            dateFilter = new Date(now.setMonth(now.getMonth() - 1));
            break;
        }
        query = query.gte('created_at', dateFilter.toISOString());
      }
      
      switch (sortBy) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'alphabetical':
          query = query.order('title', { ascending: true });
          break;
      }

      const { data: listingsData, error: listingsError } = await query;
      
      if (listingsError) throw listingsError;
      
      const userIds = listingsData?.map(item => item.user_id) || [];
      const uniqueUserIds = [...new Set(userIds)];
      
      let profiles: Record<string, { full_name?: string, avatar_url?: string }> = {};
      
      if (uniqueUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', uniqueUserIds);
          
        if (profilesData) {
          profiles = profilesData.reduce((acc, profile) => {
            acc[profile.id] = {
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
            };
            return acc;
          }, {} as Record<string, { full_name?: string, avatar_url?: string }>);
        }
      }
      
      return listingsData?.map(item => {
        const imagePath = item.listing_images?.[0]?.storage_path;
        const imageUrl = imagePath 
          ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/listing-images/${imagePath}`
          : '/placeholder.svg';
          
        const userProfile = profiles[item.user_id] || {};
        
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          image: imageUrl,
          condition: item.condition,
          category: item.category,
          location: item.location,
          postedAt: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
          user: {
            name: userProfile.full_name || 'Anonymous',
            avatar: userProfile.avatar_url,
          },
          isNew: new Date(item.created_at) > new Date(Date.now() - 86400000),
          isFeatured: item.status === 'featured',
        } as Listing;
      }) || [];
    }
  });

  const handleFilterChange = (type: keyof Filters, value: any) => {
    setFilters(prev => {
      if (type === 'condition' || type === 'category') {
        const array = prev[type] as string[];
        const newArray = array.includes(value)
          ? array.filter(item => item !== value)
          : [...array, value];
        return { ...prev, [type]: newArray };
      }
      return { ...prev, [type]: value };
    });
  };

  const clearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('q');
    navigate(`${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const resetFilters = () => {
    setFilters({
      condition: [],
      category: [],
      location: 'all',
      listingAge: 'all'
    });
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load listings. Please try again.",
      variant: "destructive",
    });
  }

  const FilterOptions = () => (
    <FiltersSection
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilters={resetFilters}
      searchTerm={searchParams.get('q') || undefined}
      onClearSearch={clearSearch}
    />
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Available Items</h2>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {listings?.length || 0} items
          </div>
          
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down your search
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <FilterOptions />
              </SheetContent>
            </Sheet>
          ) : (
            <ListingSorter sortBy={sortBy} onSortChange={setSortBy} />
          )}
        </div>
      </div>
      
      {!isMobile && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-20">
              <h3 className="font-semibold mb-4">Filters</h3>
              <FilterOptions />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <ListingsContent listings={listings} isLoading={isLoading} />
          </div>
        </div>
      )}
      
      {isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ListingsContent listings={listings} isLoading={isLoading} />
        </div>
      )}
      
      {listings && listings.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="px-8">Load More</Button>
        </div>
      )}
    </div>
  );
};

export default ListingGrid;
