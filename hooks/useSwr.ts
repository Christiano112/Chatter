"use client";

import useSWr, { preload } from "swr";
import { FetcherType } from "./useFetch";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
};

const useSwr = (url: string): FetcherType => {
    preload(url, fetcher);

    const { data, error, isValidating: isLoading } = useSWr(url, fetcher);

    return { data, error, isLoading };
};

export default useSwr;
