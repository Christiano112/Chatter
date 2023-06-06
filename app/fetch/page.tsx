"use client";

import React from "react";
import useFetch from "@/hooks/useFetch";
import useSwr from "@/hooks/useSwr";

const Fetch = () => {
    const { data, error, isLoading } = useSwr("https://jsonplaceholder.typicode.com/posts");
    // const { data, error, isLoading } = useFetch('https://jsonplaceholder.typicode.com/posts');

    console.log([data, error, isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error...</div>;
    }

    if (data) {
        return (
            <div>
                {data.map((item: any) => (
                    <div key={item.id}>{item.title}</div>
                ))}
            </div>
        );
    }

    return <div>Fetch</div>;
};

export default Fetch;
