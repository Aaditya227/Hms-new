// import { createClient } from '@supabase/supabase-js';

// // Environment variables are accessed the same way in React/Vite JavaScript
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // Boolean check is straightforward JavaScript
// const hasValidCredentials = supabaseUrl && supabaseAnonKey && supabaseUrl !== '';

// // Conditional creation of the Supabase client
// export const supabase = hasValidCredentials
//   ? createClient(supabaseUrl, supabaseAnonKey, {
//       auth: {
//         autoRefreshToken: true,
//         persistSession: true,
//         detectSessionInUrl: true
//       }
//     })
//   : createClient('https://placeholder.supabase.co', 'placeholder-key', {
//       auth: {
//         // Disable auth features in demo mode
//         autoRefreshToken: false,
//         persistSession: false,
//         detectSessionInUrl: false
//       }
//     });

// // Export a flag to check if the app is running in DEMO mode
// export const DEMO_MODE = !hasValidCredentials;



// update

import { createClient } from '@supabase/supabase-js';
import base_url from '../utils/baseurl';


//  Aaditya 

const hasValidCredentials = base_url && base_url !== '';

export const supabase = hasValidCredentials
   createClient(base_url, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
})