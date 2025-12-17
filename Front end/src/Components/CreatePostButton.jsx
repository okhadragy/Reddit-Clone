import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import '../Styles/CreatePost.css'
export default function CreatePostButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("New");

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSortSelect = (sortType) => {
    setSelectedSort(sortType);
    setIsDropdownOpen(false);
  };
  const navigate = useNavigate();

  return (
    <div className="create-post-wrapper">
      {/* Create Post Button */}
      <button  onClick={() => navigate('/create-post')} className="btn-create-post">
        <Plus size={20} />
        <span>Create Post</span>
      </button>

      {/* Sort Dropdown Section */}
      <div className="sort-dropdown-container">
        <button className="btn-sort-trigger" onClick={toggleDropdown}>
          <span className="sort-label">{selectedSort}</span>
          <ChevronDown size={16} className={`sort-chevron ${isDropdownOpen ? 'open' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="sort-dropdown-menu">
            <div className="sort-header">Sort by</div>
            
            {['Hot', 'New', 'Top'].map((item) => (
              <button 
                key={item}
                className={`sort-option ${selectedSort === item ? 'selected' : ''}`}
                onClick={() => handleSortSelect(item)}
              >
                <span>{item}</span>
                {/* Check icon removed as requested */}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}