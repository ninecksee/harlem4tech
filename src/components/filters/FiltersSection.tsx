
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { categories, conditions, neighborhoods } from "@/data/mockData";
import ActiveFilters from "./ActiveFilters";

interface FiltersSectionProps {
  filters: {
    condition: string[];
    category: string[];
    location: string;
    listingAge: string;
  };
  onFilterChange: (type: string, value: any) => void;
  onResetFilters: () => void;
  searchTerm?: string;
  onClearSearch: () => void;
}

const FiltersSection = ({ 
  filters, 
  onFilterChange, 
  onResetFilters,
  searchTerm,
  onClearSearch 
}: FiltersSectionProps) => {
  return (
    <div className="space-y-6">
      <ActiveFilters 
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
      />
      
      <div>
        <h4 className="mb-2 text-sm font-medium">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox 
                id={`condition-${condition}`}
                checked={filters.condition.includes(condition)}
                onCheckedChange={() => onFilterChange('condition', condition)}
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
                onCheckedChange={() => onFilterChange('category', category.id)}
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
        <RadioGroup value={filters.location} onValueChange={(value) => onFilterChange('location', value)}>
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
        <RadioGroup value={filters.listingAge} onValueChange={(value) => onFilterChange('listingAge', value)}>
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
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FiltersSection;
