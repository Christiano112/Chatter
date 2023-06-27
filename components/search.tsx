"use client";

import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchInputType {
    placeholder?: string;
    onSearch: (query: string) => void;
    style?: React.CSSProperties;
}

const SearchInput = ({ placeholder, onSearch, style }: SearchInputType) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearch = () => {
        onSearch(searchQuery);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="relative" style={style}>
            <input
                type="search"
                id="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={handleChange}
                onKeyUp={(event) => {
                    if (event.key === "Enter") {
                        handleSearch();
                    }
                }}
                // add on clear function to set the query to ""
                className="w-full py-2 pl-8 pr-2 text-sm text-tertiary bg-white border border-primary-50 rounded-md focus:ring-1 focus:ring-primary focus:outline-none focus:ring-opacity-50"
            />
            <AiOutlineSearch
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-slate-400"
                size={20}
                onClick={handleSearch}
            />
        </div>
    );
};

export default SearchInput;
