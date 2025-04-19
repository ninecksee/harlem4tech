
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
   'North Harlem': [40.8185, -73.9448], // Updated
   'Central Harlem': [40.8116, -73.9465], // Updated
   'South Harlem': [40.8021, -73.9555], // Updated
   'East Harlem': [40.7947, -73.9339], // Updated
   'West Harlem': [40.8180, -73.9529], // Updated
   'Upper Manhattan': [40.8417, -73.9393], // Updated
   'Midtown': [40.7549, -73.9840], // Updated
   'Downtown': [40.7131, -74.0072], // Updated
   'Brooklyn': [40.6782, -73.9442], // Updated
   'Queens': [40.7282, -73.7949], // Updated
   'Bronx': [40.8448, -73.8648], // Updated
   'Staten Island': [40.5795, -74.1502], // Updated
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
  
  // Calculate the center of the map and the circle radius (approximately 0.5 miles)
  const { baseCoord } = locationCoordinates;
  
  // Create the OpenStreetMap URL with both a marker and a circle
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${baseCoord[1] - 0.015}%2C${baseCoord[0] - 0.015}%2C${baseCoord[1] + 0.015}%2C${baseCoord[0] + 0.015}&layer=mapnik&marker=${baseCoord[0]}%2C${baseCoord[1]}&circle=${baseCoord[0]}%2C${baseCoord[1]}%2C800`;

  return (
    <Card className="overflow-hidden border rounded-md h-full">
      <div className="aspect-square">
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
