"use client";

import React from "react";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
    React.useEffect(() => {
        console.log(error);
    }, [error]);

    return (
        <React.Fragment>
            <h1>Something Went Wrong</h1>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Try Again</button>
        </React.Fragment>
    );
};

export default Error;
