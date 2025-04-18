
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type SortOption = 'latest' | 'oldest' | 'alphabetical';

interface ListingSorterProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const ListingSorter = ({ sortBy, onSortChange }: ListingSorterProps) => {
  const getSortButtonText = () => {
    switch (sortBy) {
      case 'latest': return 'Latest';
      case 'oldest': return 'Oldest';
      case 'alphabetical': return 'A-Z';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-tech-primary text-white hover:bg-tech-secondary">
          Sort by: {getSortButtonText()}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange('latest')} className={sortBy === 'latest' ? "bg-muted" : ""}>
          Latest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('oldest')} className={sortBy === 'oldest' ? "bg-muted" : ""}>
          Oldest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('alphabetical')} className={sortBy === 'alphabetical' ? "bg-muted" : ""}>
          Alphabetical (A-Z)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListingSorter;
