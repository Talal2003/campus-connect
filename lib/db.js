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
  const { data, error } = await supabase
    .from('items')
    .insert([itemData])
    .select()
    .single()
  
  if (error) throw error
  return data
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
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteItem = async (itemId) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
  
  if (error) throw error
} 