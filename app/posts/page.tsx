"use client";

// import Counter from "../counter";
import { useState, useEffect } from "react";
import supaBase from "@/utils/supabase";
import type { DatabaseUserType } from "@/utils/types";
const Posts = () => {
    const [data, setData] = useState<DatabaseUserType[]>([]);
    useEffect(() => {
        const fetchDBData = async () => {
            const { data: users, error } = await supaBase.from("users").select();
            if (users) {
                setData(users as unknown as DatabaseUserType[]);
            }
        };
        fetchDBData();
    }, []);
    console.log("data", data);
    return (
        <div className="p-8">
            <h1>Main Posts Page</h1>
            {/* <Counter /> */}
        </div>
    );
};

export default Posts;
