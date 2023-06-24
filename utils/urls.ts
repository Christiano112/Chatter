export const SUPABASE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

export const SUPABASE_URL = process.env.NEXT_NEXT_PUBLIC_SUPABASE_FETCH_URL as string;

export const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        "http://localhost:3000/";

    url = url.includes("http") ? url : `https://${url}`;

    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

    return url;
};

const urls = {
    fetchDatabaseUsers: `${SUPABASE_URL}/users`,
    fetchDatabaseUserById: (id: string) => `${SUPABASE_URL}/users/${id}`,
};

export default urls;
