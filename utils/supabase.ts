import { SUPABASE_BASE_URL, SUPABASE_API_KEY } from "./urls";
// import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { DatabaseUserType } from "./types";

// const supaBase = createClient<DatabaseUserType>(SUPABASE_BASE_URL, SUPABASE_API_KEY);
const supaBase = createClientComponentClient<DatabaseUserType>();

export default supaBase;
