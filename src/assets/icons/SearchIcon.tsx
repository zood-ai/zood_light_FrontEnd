import * as React from "react";

const Search = ({ color = '#8CD9ED' }) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none" >
            <path
                d="M13 13l-2.9-2.9m1.567-3.767A5.333 5.333 0 111 6.333a5.333 5.333 0 0110.667 0z"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const SearchIcon = React.memo(Search);
export default SearchIcon;
