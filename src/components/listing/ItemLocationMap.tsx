
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';

interface ItemLocationMapProps {
  location: string;
}

const ItemLocationMap: React.FC<ItemLocationMapProps> = ({ location }) => {
  // Coordinates for Harlem and Manhattan locations
  const locationCoordinates = useMemo(() => {
    // Base coordinates for different neighborhoods (approximate centers)
    const baseCoords: Record<string, [number, number]> = {
      'North Harlem': [40.825, -73.944],
      'Central Harlem': [40.812, -73.946],
      'South Harlem': [40.802, -73.952],
      'East Harlem': [40.795, -73.932],
      'West Harlem': [40.815, -73.955],
      'Upper Manhattan': [40.835, -73.944],
      'Midtown': [40.755, -73.978],
      'Downtown': [40.725, -73.997],
      'Brooklyn': [40.678, -73.944],
      'Queens': [40.728, -73.794],
      'Bronx': [40.837, -73.865],
      'Staten Island': [40.579, -74.150],
    };

    // Default to Midtown if location not found
    const baseCoord = baseCoords[location] || [40.755, -73.978];
    
    // Create a randomized point within ~0.5 miles of the base coordinates
    // 0.005 degrees is approximately 0.35 miles in Manhattan
    const randomLat = baseCoord[0] + (Math.random() * 0.01 - 0.005);
    const randomLng = baseCoord[1] + (Math.random() * 0.01 - 0.005);
    
    return {
      baseCoord,
      randomPoint: [randomLat, randomLng],
      zoom: 14
    };
  }, [location]);
  
  // Calculate the center of the map
  const { baseCoord, zoom } = locationCoordinates;
  
  // Create the OpenStreetMap URL with a circle marker
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${baseCoord[1] - 0.015}%2C${baseCoord[0] - 0.015}%2C${baseCoord[1] + 0.015}%2C${baseCoord[0] + 0.015}&layer=mapnik&marker=${baseCoord[0]}%2C${baseCoord[1]}`;

  return (
    <Card className="overflow-hidden border rounded-md">
      <div className="aspect-video">
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src={mapUrl} 
          title={`Map showing approximate area for ${location}`}
        ></iframe>
      </div>
      <div className="p-3 text-center text-sm text-muted-foreground">
        <p>Approximate area in {location}</p>
        <p className="text-xs">For privacy reasons, the exact location is somewhere within this area</p>
      </div>
    </Card>
  );
};

export default ItemLocationMap;
