
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { categories, conditions, neighborhoods, Listing } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

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
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    condition: [],
    category: [],
    location: 'all',
    listingAge: 'all'
  });
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // Initialize filters from URL params
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
    
    // We don't handle the query param here as it would require text search functionality
    // The query param is just being passed to the server for the backend to handle
    
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
      
      // Apply text search if query param exists
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
      
      // Apply sorting
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
      
      // Get unique user IDs from listings
      const userIds = listingsData?.map(item => item.user_id) || [];
      const uniqueUserIds = [...new Set(userIds)];
      
      // Fetch profiles for these users
      let profiles: Record<string, { full_name?: string, avatar_url?: string }> = {};
      
      if (uniqueUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', uniqueUserIds);
          
        // Create a lookup object for easy access
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
      
      // Transform the data to match the Listing interface
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
          isNew: new Date(item.created_at) > new Date(Date.now() - 86400000), // 24 hours
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

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load listings. Please try again.",
      variant: "destructive",
    });
  }

  const getSortButtonText = () => {
    switch (sortBy) {
      case 'latest': return 'Latest';
      case 'oldest': return 'Oldest';
      case 'alphabetical': return 'A-Z';
    }
  };

  const FilterOptions = () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox 
                id={`condition-${condition}`}
                checked={filters.condition.includes(condition)}
                onCheckedChange={() => handleFilterChange('condition', condition)}
              />
              <Label htmlFor={`condition-${condition}`} className="text-sm">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      
      <div>
        <h4 className="mb-2 text-sm font-medium">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`}
                checked={filters.category.includes(category.id)}
                onCheckedChange={() => handleFilterChange('category', category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm">
                {category.icon} {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      
      <div>
        <h4 className="mb-2 text-sm font-medium">Location</h4>
        <RadioGroup value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="location-all" />
            <Label htmlFor="location-all" className="text-sm">All Locations</Label>
          </div>
          {neighborhoods.map((neighborhood) => (
            <div key={neighborhood} className="flex items-center space-x-2">
              <RadioGroupItem value={neighborhood} id={`location-${neighborhood}`} />
              <Label htmlFor={`location-${neighborhood}`} className="text-sm">{neighborhood}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />
      
      <div>
        <h4 className="mb-2 text-sm font-medium">Listing Age</h4>
        <RadioGroup value={filters.listingAge} onValueChange={(value) => handleFilterChange('listingAge', value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="age-all" />
            <Label htmlFor="age-all" className="text-sm">Any time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="today" id="age-today" />
            <Label htmlFor="age-today" className="text-sm">Today</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="age-week" />
            <Label htmlFor="age-week" className="text-sm">This week</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="age-month" />
            <Label htmlFor="age-month" className="text-sm">This month</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="pt-4 flex gap-2">
        <Button 
          className="flex-1" 
          variant="default"
          onClick={() => setFilters({
            condition: [],
            category: [],
            location: 'all',
            listingAge: 'all'
          })}
        >
          Reset Filters
        </Button>
      </div>
    </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-tech-primary text-white hover:bg-tech-secondary">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Sort by: {getSortButtonText()}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('latest')} className={sortBy === 'latest' ? "bg-muted" : ""}>
                  Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')} className={sortBy === 'oldest' ? "bg-muted" : ""}>
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('alphabetical')} className={sortBy === 'alphabetical' ? "bg-muted" : ""}>
                  Alphabetical (A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No items found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg" />
            ))
          ) : listings && listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-muted-foreground">No items found. Try adjusting your filters.</p>
            </div>
          )}
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
