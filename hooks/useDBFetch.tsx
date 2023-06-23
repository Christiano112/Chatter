"use client";

import useSWr, { preload } from "swr";
import { FetcherType } from "./useFetch";
import { SUPABASE_API_KEY } from "@/utils/urls";

const fetcher = async (url: string) => {
    const headers = new Headers();
    headers.append("apikey", SUPABASE_API_KEY);
    headers.append("Authorization", `Bearer ${SUPABASE_API_KEY}`);

    const res = await fetch(url, {
        headers: headers,
    });

    return res.json();
};

const useDBFetch = (url: string): FetcherType => {
    preload(url, fetcher);

    const { data, error, isValidating: isLoading } = useSWr(url, fetcher);

    return { data, error, isLoading };
};

export default useDBFetch;
