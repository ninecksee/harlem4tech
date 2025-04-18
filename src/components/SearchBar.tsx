
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { categories, neighborhoods } from "@/data/mockData";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [location_, setLocation] = useState('all');

  // Initialize search state from URL params when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('q') || '');
    setCategory(params.get('category') || 'all');
    setLocation(params.get('location') || 'all');
  }, [location.search]);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (search) searchParams.set('q', search);
    if (category !== 'all') searchParams.set('category', category);
    if (location_ !== 'all') searchParams.set('location', location_);
    
    const queryString = searchParams.toString();
    
    // Always navigate to home with search params
    navigate(queryString ? `/?${queryString}` : '/');

    // Scroll to listings section if we're on the homepage
    if (location.pathname === '/') {
      setTimeout(() => {
        const listingsSection = document.getElementById('listings-section');
        if (listingsSection) {
          listingsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tech items..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={location_} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-4">
          <Button 
            onClick={handleSearch}
            className="w-full bg-tech-primary hover:bg-tech-secondary"
          >
            <Search className="mr-2 h-4 w-4" />
            Find Available Items
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
