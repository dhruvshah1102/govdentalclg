import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export interface AdminSession {
  id: string;
  username: string;
}

function getSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a context where cookies can't be mutated (e.g. during render) - safe to ignore.
          }
        },
      },
    }
  );
}

export { getSupabaseServerClient };

export async function getSession(): Promise<AdminSession | null> {
  const supabase = getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !user.email) return null;
  return { id: user.id, username: user.email };
}
