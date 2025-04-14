
import { useState } from "react";
import { Listing, listings } from "@/data/mockData";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";
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
import { categories, conditions, neighborhoods } from "@/data/mockData";

const ListingGrid = () => {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Available Tech Treasures</h2>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {filteredListings.length} items
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
                    Narrow down your tech treasure hunt
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <FilterOptions />
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sort by: Latest
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="px-8">Load More</Button>
      </div>
    </div>
  );
};

const FilterOptions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox id={`condition-${condition}`} />
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
              <Checkbox id={`category-${category.id}`} />
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
        <RadioGroup defaultValue="all">
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
        <RadioGroup defaultValue="all">
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
        <Button className="flex-1" variant="default">Apply Filters</Button>
        <Button className="flex-1" variant="outline">Reset</Button>
      </div>
    </div>
  );
};

export default ListingGrid;
