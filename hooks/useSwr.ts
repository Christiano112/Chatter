"use client";

import useSWr, { preload } from "swr";
import useFetch from "./useFetch";
import { FetcherType } from "./useFetch";

const useSwr = (url: string): FetcherType => {
    preload(url, useFetch);

    const { data, error, isLoading } = useSWr(url, useFetch);

    return { data, error, isLoading };
};

export default useSwr;
