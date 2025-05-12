import { OMDB_CONFIG } from './config';

/**
 * This file is used to test the OMDB API key
 * You can run this file directly in a Node.js environment
 * or import and use the testApiKey function elsewhere
 */

export const testApiKey = async () => {
  try {
    // Test with a known movie ID (Guardians of the Galaxy Vol. 2)
    const response = await fetch(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&i=tt3896198`);
    const data = await response.json();
    
    if (data.Response === 'True') {
      console.log('API key is valid! Test movie:', data.Title);
      return { success: true, data };
    } else {
      console.error('API key test failed:', data.Error);
      return { success: false, error: data.Error };
    }
  } catch (error) {
    console.error('Error testing API key:', error);
    return { success: false, error: error.message };
  }
};

// You can run this directly if needed
if (typeof window !== 'undefined' && window.document) {
  // Only run in browser environment
  console.log('Testing OMDB API key...');
  testApiKey().then(result => {
    if (result.success) {
      console.log('✅ API key is working!');
    } else {
      console.log('❌ API key test failed!');
    }
  });
}

export default testApiKey; 