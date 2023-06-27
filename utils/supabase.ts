import { SUPABASE_BASE_URL, SUPABASE_API_KEY } from "./urls";
// import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { DatabaseType } from "./types";

// const supaBase = createClient<DatabaseType>(SUPABASE_BASE_URL, SUPABASE_API_KEY);
const supaBase = createClientComponentClient<DatabaseType>();

export default supaBase;
