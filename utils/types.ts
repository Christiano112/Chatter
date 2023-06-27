export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface DatabaseType {
    public: {
        Tables: {
            comments: {
                Row: {
                    author_id: string;
                    comment_id: string;
                    content: string | null;
                    created_at: string | null;
                    id: number;
                };
                Insert: {
                    author_id: string;
                    comment_id: string;
                    content?: string | null;
                    created_at?: string | null;
                    id?: number;
                };
                Update: {
                    author_id?: string;
                    comment_id?: string;
                    content?: string | null;
                    created_at?: string | null;
                    id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "comments_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "users";
                        referencedColumns: ["user_id"];
                    },
                    {
                        foreignKeyName: "comments_comment_id_fkey";
                        columns: ["comment_id"];
                        referencedRelation: "posts";
                        referencedColumns: ["post_id"];
                    },
                ];
            };
            posts: {
                Row: {
                    author_id: string;
                    content: string;
                    created_at: string | null;
                    id: number;
                    post_id: string;
                    title: string;
                };
                Insert: {
                    author_id: string;
                    content: string;
                    created_at?: string | null;
                    id?: number;
                    post_id: string;
                    title: string;
                };
                Update: {
                    author_id?: string;
                    content?: string;
                    created_at?: string | null;
                    id?: number;
                    post_id?: string;
                    title?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "posts_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "users";
                        referencedColumns: ["user_id"];
                    },
                ];
            };
            users: {
                Row: {
                    created_at: string | null;
                    email: string;
                    first_name: string | null;
                    id: number;
                    join_as: string;
                    last_name: string | null;
                    user_id: string;
                    username: string;
                };
                Insert: {
                    created_at?: string | null;
                    email: string;
                    first_name?: string | null;
                    id?: number;
                    join_as: string;
                    last_name?: string | null;
                    user_id: string;
                    username: string;
                };
                Update: {
                    created_at?: string | null;
                    email?: string;
                    first_name?: string | null;
                    id?: number;
                    join_as?: string;
                    last_name?: string | null;
                    user_id?: string;
                    username?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "users_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
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
