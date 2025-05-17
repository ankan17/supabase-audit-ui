export const API = {
  AUTH_LOGIN: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/supabase/login`,
  AUTH_SUPABASE_CALLBACK: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/supabase/callback`,
  AUTH_LOGOUT: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
  AUTH_VERIFY: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`,

  USERS_SUPABASE_ORGANISATIONS: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/supabase/organisations`,

  CHECKS_MFA: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/checks/supabase/mfa`,
  CHECKS_RLS: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/checks/supabase/rls`,
  CHECKS_PITR: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/checks/supabase/pitr`,
};
