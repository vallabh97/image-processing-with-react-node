import { createApi } from 'unsplash-js';

// As per Unsplash API usage guidelines, accessKey should not be exposed to the client and 
// that is why proxy server must be used.

export const api = createApi({
  apiUrl: "http://localhost:3001/unsplash-proxy",
});