import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
  if (client) {
    return client;
  }

  const url = process.env.SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !secretKey) {
    const missingVariables = [
      !url && 'SUPABASE_URL',
      !secretKey && 'SUPABASE_SECRET_KEY',
    ].filter((variable): variable is string => Boolean(variable));
    throw new Error(
      `${missingVariables.join(' and ')} ${missingVariables.length === 1 ? 'is' : 'are'} required to connect to Supabase.`
    );
  }

  client = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return client;
}
