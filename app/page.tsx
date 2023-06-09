import React from "react";
// import Image from "next/image";
// import Link from "next/link";
import Header from "@/components/header";
// import Counter from "./counter";

export default function Home() {
    return (
        <React.Fragment>
            <Header />
            <main>
                <h1>Christiano Chatter App</h1>
                {/* <Counter /> */}
            </main>
        </React.Fragment>
    );
}
