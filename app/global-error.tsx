"use client";

const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
    return (
        <html>
            <body>
                <h1>Something Went Wrong</h1>
                <p>{error.message}</p>
                <button onClick={() => reset()}>Try Again</button>
            </body>
        </html>
    );
};

export default GlobalError;
