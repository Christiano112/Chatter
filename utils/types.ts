export type JsonType = string | number | boolean | null | { [key: string]: JsonType } | JsonType[];

export interface DatabaseUserType {
    public: {
        Tables: {
            users: {
                Row: {
                    created_at: string | null;
                    email: string;
                    first_name: string | null;
                    id: number;
                    join_as: string | null;
                    last_name: string | null;
                    password: string;
                    user_id: string;
                    username: string;
                };
                Insert: {
                    created_at?: string | null;
                    email: string;
                    first_name?: string | null;
                    id?: number;
                    join_as?: string | null;
                    last_name?: string | null;
                    password: string;
                    user_id: string;
                    username: string;
                };
                Update: {
                    created_at?: string | null;
                    email?: string;
                    first_name?: string | null;
                    id?: number;
                    join_as?: string | null;
                    last_name?: string | null;
                    password?: string;
                    user_id?: string;
                    username?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
