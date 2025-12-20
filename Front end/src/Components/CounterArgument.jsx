import React, { useState } from "react";
import api from "../api/api"; 
import { Sparkles, Bot } from "lucide-react"; 

export default function GaslighterInsight({ title, content }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); 
  const fetchInsight = async () => {
    if (insight) return; 

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/ai/analyze", { title, content });
      setInsight(response.data.result);
    } catch (err) {
      setError("The Gaslighter emind is asleep. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleInsight = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !insight) {
      fetchInsight();
    }
  };

  return (
    <div className="hivemind-container" style={{ margin: "20px 0", border: "1px solid #343536", borderRadius: "8px", overflow: "hidden" }}>
      
      <div 
        onClick={toggleInsight}
        style={{ 
          background: "linear-gradient(90deg, #2b0f42 0%, #1a1a1b 100%)", 
          padding: "12px 16px", 
          cursor: "pointer",
          display: "flex", 
          alignItems: "center",
          gap: "10px",
          color: "#d7dadc"
        }}
      >
        <Sparkles size={18} color="#8a5ebd" />
        <span style={{ fontWeight: "bold", fontSize: "14px" }}>
           {isOpen ? "Hide Gaslighter Insight" : "Ask the Gaslighter emind (AI Analysis)"}
        </span>
      </div>


      {isOpen && (
        <div style={{ padding: "16px", backgroundColor: "#1A1A1B" }}>
          {loading && (
             <div style={{ color: "#818384", fontStyle: "italic", display: "flex", gap: "8px" }}>
                <Bot className="spin-animation" /> 
                Consulting the digital spirits...
             </div>
          )}
          
          {error && <div style={{ color: "#ff4500" }}>{error}</div>}
          
          {insight && (
            <div style={{ lineHeight: "1.6", fontSize: "14px", color: "#D7DADC", whiteSpace: "pre-line" }}>
              {insight}
            </div>
          )}
        </div>
      )}
    </div>
  );
}