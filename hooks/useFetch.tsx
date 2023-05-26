"use client";

import React from "react";
import axios from "axios";

export interface FetcherType {
    data: any;
    isLoading: boolean;
    error: any;
}

const useFetch = (url: string): FetcherType => {
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
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
