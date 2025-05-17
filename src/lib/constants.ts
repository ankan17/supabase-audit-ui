export const API = {
  AUTH_LOGIN: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/supabase/login`,
  AUTH_SUPABASE_CALLBACK: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/supabase/callback`,
  AUTH_LOGOUT: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
  AUTH_VERIFY: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`,
};