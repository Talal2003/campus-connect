import OpenAI from 'openai';
import { supabase } from '../supabase';
import { getAllItemImages } from '../db';

// Initialize the OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow running in browser environment
});

/**
 * Compare a user-uploaded image with all items in the database
 * @param {File} userImage - The image file uploaded by the user
 * @returns {Promise<Array>} - Array of items sorted by similarity
 */
export async function compareImageWithDatabase(userImage) {
  try {
    // 1. Get all items with images from the database
    const itemsWithImages = await getAllItemImages();
    
    if (!itemsWithImages.length) {
      return [];
    }
    
    // 2. Convert user image to base64
    const userImageBase64 = await fileToBase64(userImage);
    
    // 3. Process batches of items (to avoid API rate limits)
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < itemsWithImages.length; i += batchSize) {
      const batch = itemsWithImages.slice(i, i + batchSize);
      const batchResults = await processBatch(userImageBase64, batch);
      results.push(...batchResults);
    }
    
    // 4. Sort results by similarity score (highest first)
    return results.sort((a, b) => b.similarity - a.similarity);
    
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
}

/**
 * Process a batch of item images for comparison
 * @param {string} userImageBase64 - Base64 encoded user image
 * @param {Array} itemsBatch - Batch of items with images
 * @returns {Promise<Array>} - Similarity results for the batch
 */
async function processBatch(userImageBase64, itemsBatch) {
  try {
    // 1. Prepare array to store public URLs of all items in the batch
    const itemUrls = [];
    const itemIds = [];
    
    // 2. Get the public URL for each item image
    for (const item of itemsBatch) {
      if (item.image_url) {
        itemUrls.push(item.image_url);
        itemIds.push(item.id);
      }
    }
    
    if (!itemUrls.length) return [];
    
    // 3. Call OpenAI API to compare the images
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps with image comparison. Compare the uploaded image with the database images and return an array of similarity scores.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Compare this uploaded image with these database images. For each comparison, return a similarity score between 0 and 1, where 1 is an exact match. Return the results as a JSON array with each object containing "id" and "similarity" properties.'
            },
            {
              type: 'image_url',
              image_url: {
                url: userImageBase64
              }
            },
            ...itemUrls.map(url => ({
              type: 'image_url',
              image_url: {
                url: url
              }
            }))
          ]
        }
      ],
      temperature: 0.0,
      response_format: { type: 'json_object' }
    });
    
    // 4. Parse the response to get similarity scores
    const result = JSON.parse(response.choices[0].message.content);
    
    // 5. Format results with item IDs and similarity scores
    return itemIds.map((id, index) => ({
      id,
      similarity: result.results[index].similarity
    }));
    
  } catch (error) {
    console.error('Error processing image batch:', error);
    return [];
  }
}

/**
 * Convert a file to base64 encoded string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
} 