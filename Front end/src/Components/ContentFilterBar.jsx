import React from 'react';
import { Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function ContentFilterBar() {
  const navigate = useNavigate(); 

  return (
    <div className="content-filter-bar clickable" 
      onClick={() => navigate('/settings')}>
      <div className="filter-content-left">
        <Eye size={20} className="filter-icon" />
        <span className="filter-text">Showing all content</span>
      </div>
      <ChevronRight size={20} className="filter-arrow" />
      
    </div>
  );
}