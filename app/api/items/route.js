import { NextResponse } from 'next/server';

// In a real application, this would connect to a database
// For now, we'll use in-memory storage
let items = [
  {
    id: 1,
    type: 'lost',
    title: 'Blue Backpack',
    category: 'accessories',
    description: 'Blue Jansport backpack with a rocket keychain',
    location: 'Student Union',
    date: '2023-10-15',
    status: 'lost',
    contactName: 'John Doe',
    contactEmail: 'john.doe@rockets.utoledo.edu',
    contactPhone: '(419) 123-4567',
    imageUrl: null,
    referenceNumber: 'REF-1234'
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
    contactName: 'Jane Smith',
    contactEmail: 'jane.smith@rockets.utoledo.edu',
    contactPhone: '(419) 987-6543',
    imageUrl: null,
    referenceNumber: 'REF-5678'
  }
];

let nextId = 3;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword');
  
  let filteredItems = [...items];
  
  if (type) {
    filteredItems = filteredItems.filter(item => item.type === type);
  }
  
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  if (status) {
    filteredItems = filteredItems.filter(item => item.status === status);
  }
  
  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(lowercaseKeyword) || 
      item.description.toLowerCase().includes(lowercaseKeyword) ||
      item.location.toLowerCase().includes(lowercaseKeyword)
    );
  }
  
  // Remove sensitive information before sending to client
  const sanitizedItems = filteredItems.map(({ contactName, contactEmail, contactPhone, ...item }) => item);
  
  return NextResponse.json(sanitizedItems);
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'category', 'description', 'location', 'date', 'type', 'contactName', 'contactEmail'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Generate a reference number
    const referenceNumber = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create new item
    const newItem = {
      id: nextId++,
      ...data,
      status: data.type === 'lost' ? 'lost' : 'found',
      referenceNumber,
      createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    
    // Return only the reference number and id
    return NextResponse.json({ 
      success: true, 
      referenceNumber: newItem.referenceNumber,
      id: newItem.id
    });
    
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
} 