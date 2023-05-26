import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";

export default function Home() {
    return (
        <React.Fragment>
            <Header />
            <main>
                <h1>Christiano Chatter App</h1>
            </main>
        </React.Fragment>
    );
}
