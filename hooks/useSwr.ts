"use client";

import useSWr, { preload } from "swr";

export interface FetcherType {
    data: any[];
    isLoading: boolean;
    error: any;
}

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
