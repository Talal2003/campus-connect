import { supabase } from './supabase'

// User operations
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUser = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Item operations
export const createItem = async (itemData) => {
  try {
    // Log the data being submitted
    console.log('Creating item with data:', JSON.stringify(itemData, null, 2));
    
    // Ensure we're not sending any fields that don't exist in the database schema
    const safeItemData = {
      type: itemData.type,
      title: itemData.title,
      category: itemData.category,
      description: itemData.description,
      location: itemData.location,
      building: itemData.building,
      // room_number might not be in the schema
      // room_number: itemData.room_number,
      date: itemData.date,
      contact_name: itemData.contact_name,
      contact_email: itemData.contact_email,
      contact_phone: itemData.contact_phone,
      image_url: itemData.image_url,
      user_id: itemData.user_id,
      status: itemData.status,
      id: itemData.id
    };
    
    const { data, error } = await supabase
      .from('items')
      .insert([safeItemData])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error creating item:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createItem function:', err.message);
    throw err;
  }
}

export const getItems = async (type = null, category = null, status = null) => {
  let query = supabase.from('items').select('*')
  
  if (type) query = query.eq('type', type)
  if (category) query = query.eq('category', category)
  if (status) query = query.eq('status', status)
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getItem = async (itemId) => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', itemId)
    .single()
  
  if (error) throw error
  return data
}

export const updateItem = async (itemId, updates) => {
  try {
    if (!itemId) {
      throw new Error('No item ID provided');
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No update data provided');
    }
    
    console.log('Updating item in database:', { itemId, updates });
    
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) {
      console.error('Database error when updating item:', JSON.stringify(error));
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned after update. Item may not exist.');
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateItem function:', err.message, err.stack);
    throw err;
  }
}

export const deleteItem = async (itemId) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
  
  if (error) throw error
}

// Function to get all images from storage
export const getAllItemImages = async () => {
  // Get all items that have an image_url
  const { data: items, error } = await supabase
    .from('items')
    .select('id, image_url')
    .not('image_url', 'is', null)
  
  if (error) throw error
  return items
} 