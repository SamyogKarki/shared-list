import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type List = {
  id: string;
  room_code: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Item = {
  id: string;
  list_id: string;
  text: string;
  checked: boolean;
  position: number;
  created_at: string;
};
