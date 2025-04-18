
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  searchTerm?: string;
  onClearSearch: () => void;
}

const ActiveFilters = ({ searchTerm, onClearSearch }: ActiveFiltersProps) => {
  if (!searchTerm) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="secondary" className="flex items-center gap-1">
        Search: {searchTerm}
        <button onClick={onClearSearch} className="hover:text-destructive">
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </div>
  );
};

export default ActiveFilters;
