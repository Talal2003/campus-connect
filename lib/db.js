// This is a placeholder for a real database connection
// In a production app, you would use a real database like MongoDB, PostgreSQL, etc.

// Mock data for lost items
const mockLostItems = [
  {
    id: 1,
    type: 'lost',
    title: 'Blue Backpack',
    category: 'accessories',
    description: 'Blue Jansport backpack with a rocket keychain',
    location: 'Student Union',
    date: '2023-10-15',
    status: 'lost',
    imageUrl: null
  },
  {
    id: 2,
    type: 'lost',
    title: 'MacBook Pro',
    category: 'electronics',
    description: 'Silver MacBook Pro 13" with stickers on the cover',
    location: 'Carlson Library, 2nd floor',
    date: '2023-10-18',
    status: 'found',
    imageUrl: null
  },
  {
    id: 3,
    type: 'lost',
    title: 'Student ID Card',
    category: 'id-cards',
    description: 'UT Rocket ID card',
    location: 'Engineering Building',
    date: '2023-10-20',
    status: 'delivered',
    imageUrl: null
  },
  {
    id: 4,
    type: 'lost',
    title: 'Water Bottle',
    category: 'other',
    description: 'Blue Hydro Flask with UT stickers',
    location: 'Recreation Center',
    date: '2023-10-22',
    status: 'lost',
    imageUrl: null
  },
  {
    id: 5,
    type: 'lost',
    title: 'Textbook - Calculus II',
    category: 'books',
    description: 'Calculus II textbook with yellow highlights',
    location: 'Mathematics Building',
    date: '2023-10-25',
    status: 'pending',
    imageUrl: null
  },
  {
    id: 6,
    type: 'lost',
    title: 'AirPods Pro',
    category: 'electronics',
    description: 'White AirPods Pro in a black case',
    location: 'Student Union Food Court',
    date: '2023-10-27',
    status: 'lost',
    imageUrl: null
  }
];

// Mock data for found items
const mockFoundItems = [
  {
    id: 1,
    type: 'found',
    title: 'Black Umbrella',
    category: 'accessories',
    description: 'Black folding umbrella with wooden handle',
    location: 'Snyder Memorial Building',
    date: '2023-10-14',
    status: 'found',
    imageUrl: null
  },
  {
    id: 2,
    type: 'found',
    title: 'iPhone 13',
    category: 'electronics',
    description: 'Black iPhone 13 with clear case',
    location: 'Carlson Library, 1st floor',
    date: '2023-10-16',
    status: 'delivered',
    imageUrl: null
  },
  {
    id: 3,
    type: 'found',
    title: 'Car Keys',
    category: 'keys',
    description: 'Honda car keys with a rocket keychain',
    location: 'Parking Lot 10',
    date: '2023-10-19',
    status: 'claimed',
    imageUrl: null
  },
  {
    id: 4,
    type: 'found',
    title: 'Blue Scarf',
    category: 'clothing',
    description: 'Blue knitted scarf with UT logo',
    location: 'Student Union',
    date: '2023-10-21',
    status: 'found',
    imageUrl: null
  },
  {
    id: 5,
    type: 'found',
    title: 'Glasses',
    category: 'accessories',
    description: 'Black-rimmed prescription glasses in a brown case',
    location: 'Savage Arena',
    date: '2023-10-24',
    status: 'delivered',
    imageUrl: null
  },
  {
    id: 6,
    type: 'found',
    title: 'Scientific Calculator',
    category: 'electronics',
    description: 'TI-84 Plus calculator',
    location: 'North Engineering Building',
    date: '2023-10-26',
    status: 'found',
    imageUrl: null
  }
];

// Mock data for tracking
const mockTrackingData = {
  'REF-1234': {
    id: 1,
    type: 'lost',
    title: 'Blue Backpack',
    category: 'accessories',
    location: 'Student Union',
    date: '2023-10-15',
    status: 'found',
    updates: [
      { date: '2023-10-15', status: 'lost', message: 'Item reported as lost' },
      { date: '2023-10-18', status: 'found', message: 'Item has been found and matched to your report' },
      { date: '2023-10-19', status: 'delivered', message: 'Item has been delivered to UTPD' }
    ]
  },
  'REF-5678': {
    id: 2,
    type: 'found',
    title: 'iPhone 13',
    category: 'electronics',
    location: 'Carlson Library',
    date: '2023-10-16',
    status: 'claimed',
    updates: [
      { date: '2023-10-16', status: 'found', message: 'Item reported as found' },
      { date: '2023-10-17', status: 'delivered', message: 'Item has been delivered to UTPD' },
      { date: '2023-10-20', status: 'claimed', message: 'Item has been claimed by the owner' }
    ]
  }
};

export const db = {
  getLostItems: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockLostItems];
  },
  
  getFoundItems: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFoundItems];
  },
  
  getItemByReference: async (referenceNumber) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockTrackingData[referenceNumber] || null;
  },
  
  createItem: async (itemData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a reference number
    const referenceNumber = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    
    return {
      success: true,
      referenceNumber
    };
  },
  
  updateItemStatus: async (id, status) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true
    };
  }
}; 