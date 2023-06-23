export const SUPABASE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

export const SUPABASE_URL = process.env.NEXT_NEXT_PUBLIC_SUPABASE_FETCH_URL as string;

export const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

    return url;
};

const urls = {
    fetchDatabaseUsers: `${SUPABASE_URL}/users`,
    fetchDatabaseUserById: (id: string) => `${SUPABASE_URL}/users/${id}`,
};

export default urls;

// const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'github'
//   options: {
//         redirectTo: getURL()
//     }
// }
