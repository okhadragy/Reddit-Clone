import React, {
  useState,
  forwardRef,
  useImperativeHandle
} from "react";
import { Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Styles/CreatePost.css";

const CreatePostButton = forwardRef((props, ref) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("New");
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSortSelect = (sortType) => {
    setSelectedSort(sortType);
    setIsDropdownOpen(false);
  };

  const openCreatePost = () => {
    navigate("/create-post");
  };

  // 👇 expose function to parent
  useImperativeHandle(ref, () => ({
    openCreatePost,
  }));

  return (
    <div className="create-post-wrapper">
      {/* Create Post Button */}
      <button onClick={openCreatePost} className="btn-create-post">
        <Plus size={20} />
        <span>Create Post</span>
      </button>

      {/* Sort Dropdown */}
      <div className="sort-dropdown-container">
        <button className="btn-sort-trigger" onClick={toggleDropdown}>
          <span className="sort-label">{selectedSort}</span>
          <ChevronDown
            size={16}
            className={`sort-chevron ${isDropdownOpen ? "open" : ""}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="sort-dropdown-menu">
            <div className="sort-header">Sort by</div>

            {["Hot", "New", "Top"].map((item) => (
              <button
                key={item}
                className={`sort-option ${
                  selectedSort === item ? "selected" : ""
                }`}
                onClick={() => handleSortSelect(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default CreatePostButton;
