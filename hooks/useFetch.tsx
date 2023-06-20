"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface FetcherType {
    data: any[];
    isLoading: boolean;
    error: any;
}

const useFetch = (url: string): FetcherType => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(url)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [url]);

    return { data, isLoading, error };
};

export default useFetch;
