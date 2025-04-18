export interface Listing {
  id: string;
  title: string;
  description: string;
  image: string;
  condition: 'Working' | 'Needs Repair' | 'For Parts' | 'Like New';
  category: string;
  location: string;
  postedAt: string;
  user: {
    name: string;
    avatar?: string;
  };
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

// Placeholder image paths - we would replace these with actual images in a real app
const placeholderImages = [
  '/placeholder.svg',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300',
  'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?auto=format&fit=crop&w=300',
  '/lovable-uploads/b3fad430-c636-4c4a-990a-5d2cb76613fe.png',
];

export const categories: Category[] = [
  { id: 'computers', name: 'Computers', icon: '💻', count: 24, description: 'Laptops, desktops, and parts' },
  { id: 'phones', name: 'Phones', icon: '📱', count: 18, description: 'Smartphones and mobile devices' },
  { id: 'accessories', name: 'Accessories', icon: '🎧', count: 32, description: 'Headphones, cables, and peripherals' },
  { id: 'screens', name: 'Monitors', icon: '🖥️', count: 15, description: 'Display screens and projectors' },
  { id: 'tablets', name: 'Tablets', icon: '📟', count: 9, description: 'Tablets and e-readers' },
  { id: 'cameras', name: 'Cameras', icon: '📷', count: 12, description: 'Digital cameras and video equipment' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', count: 21, description: 'Consoles and gaming accessories' },
  { id: 'other', name: 'Other', icon: '🔌', count: 19, description: 'Other electronic items' },
];

export const neighborhoods = [
  'Downtown',
  'Midtown',
  'Uptown',
  'West Side',
  'East Side',
  'South End',
  'North Hills',
];

export const conditions = [
  'Working',
  'Needs Repair',
  'For Parts',
  'Like New',
];

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Old MacBook Pro (2015)',
    description: 'Still works but has a cracked screen. Good for parts or could be repaired.',
    image: placeholderImages[1],
    condition: 'Needs Repair',
    category: 'computers',
    location: 'Downtown',
    postedAt: '2 days ago',
    user: {
      name: 'Sarah K.',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    isNew: true,
  },
  {
    id: '2',
    title: 'iPhone 8 - Battery Issue',
    description: 'iPhone 8 with battery that drains quickly. Everything else works fine.',
    image: placeholderImages[2],
    condition: 'Needs Repair',
    category: 'phones',
    location: 'Midtown',
    postedAt: '3 days ago',
    user: {
      name: 'Mike R.',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  },
  {
    id: '3',
    title: 'Samsung Monitor 24"',
    description: 'Older LCD monitor, works perfectly. No longer needed after upgrade.',
    image: placeholderImages[3],
    condition: 'Working',
    category: 'screens',
    location: 'East Side',
    postedAt: '5 days ago',
    user: {
      name: 'Diana L.',
    },
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Broken Dell Laptop',
    description: 'Won\'t power on. Good for parts - keyboard, screen and hdd all intact.',
    image: placeholderImages[4],
    condition: 'For Parts',
    category: 'computers',
    location: 'North Hills',
    postedAt: '1 week ago',
    user: {
      name: 'Taylor J.',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
  },
  {
    id: '5',
    title: 'Amazon Kindle (Old Gen)',
    description: 'Works but has slow page turns. Perfect for basic reading.',
    image: placeholderImages[5],
    condition: 'Working',
    category: 'tablets',
    location: 'South End',
    postedAt: '2 weeks ago',
    user: {
      name: 'Ryan M.',
    },
  },
  {
    id: '6',
    title: 'Google Home Mini',
    description: 'First gen Google Home Mini. Works great but I upgraded.',
    image: placeholderImages[6],
    condition: 'Working',
    category: 'accessories',
    location: 'West Side',
    postedAt: '3 weeks ago',
    user: {
      name: 'Leslie P.',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    isNew: true,
  },
  {
    id: '7',
    title: 'Mechanical Keyboard',
    description: 'Cherry MX Red switches. Missing a few keycaps but works perfectly.',
    image: placeholderImages[0],
    condition: 'Needs Repair',
    category: 'accessories',
    location: 'Downtown',
    postedAt: '3 weeks ago',
    user: {
      name: 'Jordan K.',
    },
  },
  {
    id: '8',
    title: 'Xbox 360 Console',
    description: 'Old Xbox 360. Powers on but has red ring of death. For parts or repair.',
    image: placeholderImages[7],
    condition: 'For Parts',
    category: 'gaming',
    location: 'Uptown',
    postedAt: '1 month ago',
    user: {
      name: 'Chris B.',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    isFeatured: true,
  },
];

export const recentActivities = [
  {
    id: '1',
    type: 'claim',
    item: 'iPhone 7',
    user: 'Sophie L.',
    time: '30 minutes ago',
  },
  {
    id: '2',
    type: 'listing',
    item: 'Bluetooth Speakers',
    user: 'Marcus T.',
    time: '2 hours ago',
  },
  {
    id: '3',
    type: 'claim',
    item: 'Dell Monitor',
    user: 'Riley P.',
    time: '3 hours ago',
  },
  {
    id: '4',
    type: 'listing',
    item: 'Nintendo DS',
    user: 'Jamie S.',
    time: '5 hours ago',
  },
];
