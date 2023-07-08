import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { DatabaseType } from "./types";

const supaBase = createClientComponentClient<DatabaseType>();

export default supaBase;
