
interface ListingInfoProps {
  title: string;
  description: string;
  condition: string;
  category: string;
  location: string;
  issues: string | null;
  ownerName: string;
}

const ListingInfo = ({ 
  title,
  description,
  condition,
  category,
  location,
  issues,
  ownerName,
}: ListingInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground">{location}</p>
          <span className="text-muted-foreground">•</span>
          <p className="text-muted-foreground">Listed by {ownerName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2">{description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Condition</h2>
          <p className="mt-2">{condition}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Category</h2>
          <p className="mt-2">{category}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Known Issues</h2>
          <p className="mt-2">{issues || 'None reported'}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
