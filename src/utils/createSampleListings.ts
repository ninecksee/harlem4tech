
import { supabase } from "@/integrations/supabase/client";

const sampleListings = [
  {
    title: 'MacBook Pro 2019',
    description: 'Great condition MacBook Pro with 16GB RAM and 512GB SSD. Perfect for developers and designers.',
    category: 'laptops',
    condition: 'Like New',
    location: 'Central Harlem',
    issues: null
  },
  {
    title: 'iPhone 13',
    description: 'iPhone 13 128GB in perfect condition. Includes original charger and box.',
    category: 'phones',
    condition: 'Working',
    location: 'East Harlem',
    issues: 'Minor scratches on screen'
  },
  {
    title: 'Dell Monitor 27"',
    description: '4K Dell Monitor, perfect for work or gaming. HDMI and DisplayPort inputs.',
    category: 'monitors',
    condition: 'Working',
    location: 'West Harlem',
    issues: null
  },
  {
    title: 'Logitech MX Master 3',
    description: 'Wireless gaming mouse with customizable buttons and ergonomic design.',
    category: 'peripherals',
    condition: 'Like New',
    location: 'Hamilton Heights',
    issues: null
  },
  {
    title: 'HP LaserJet Pro',
    description: 'All-in-one printer, scanner, and copier. Needs new toner cartridge.',
    category: 'printers',
    condition: 'Needs Repair',
    location: 'Sugar Hill',
    issues: 'Needs new toner cartridge'
  },
  {
    title: 'iPad Air 4th Gen',
    description: 'Latest iPad Air with Apple Pencil support. Includes protective case.',
    category: 'tablets',
    condition: 'Working',
    location: 'Manhattanville',
    issues: null
  },
  {
    title: 'Xbox Series X Controller',
    description: 'Wireless controller in good condition. Works with Xbox Series X/S and PC.',
    category: 'gaming',
    condition: 'Working',
    location: 'Morningside Heights',
    issues: 'Slight stick drift on right analog'
  },
  {
    title: 'Samsung T7 SSD',
    description: '1TB External SSD with USB-C connection. Fast and reliable.',
    category: 'storage',
    condition: 'Like New',
    location: 'Central Harlem',
    issues: null
  }
];

export const createSampleListings = async (userId: string) => {
  for (const listing of sampleListings) {
    await supabase
      .from('listings')
      .insert({
        ...listing,
        user_id: userId
      });
  }
};
