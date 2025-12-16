import { useAuth } from "./LoginContext";
import React, { useState } from 'react';

function ManageCommunities() {
    return (
        <div className="MainContent">
            <h1>Manage communities</h1>
            <div className="search-container">
                <svg
                    className="search-icon"
                    rpl=""
                    aria-hidden="true"
                    fill="currentColor"
                    height="16"
                    icon-name="browse"
                    viewBox="0 0 20 20"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M5.301 18A3.304 3.304 0 012 14.699V5.301C2 3.481 3.48 2 5.301 2h9.4c1.819 0 3.3 1.48 3.3 3.301v4.516A5.768 5.768 0 0016.2 8.633V5.302c0-.827-.672-1.5-1.499-1.5H5.3c-.827 0-1.5.673-1.5 1.5v9.399c0 .827.673 1.5 1.5 1.5h3.336a5.778 5.778 0 001.181 1.801L5.301 18zm13.935 1.236a.897.897 0 01-1.274 0l-1.85-1.85a3.98 3.98 0 01-4.941-.558 4.006 4.006 0 010-5.657A3.98 3.98 0 0114 9.999c1.068 0 2.073.417 2.828 1.173a3.971 3.971 0 01.558 4.94l1.85 1.85a.9.9 0 010 1.274zm-3.681-3.68c.416-.416.644-.969.644-1.557s-.229-1.14-.644-1.555a2.188 2.188 0 00-1.556-.644c-.587 0-1.141.229-1.556.644a2.204 2.204 0 000 3.111c.829.829 2.279.831 3.11 0l.002.001z"></path>
                </svg>
                        <input
                className="SearchBar"
                placeholder="Filter your communities"
               
                />
            </div>
        </div>
    );
}

export default ManageCommunities;
