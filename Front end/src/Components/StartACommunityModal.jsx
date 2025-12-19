import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTopics from "./AddTopics";
import CommunityVisibility from "./CommunityVisibility";
import CommunityNameDesc from "./CommunityNameDesc";
import StyleCommunity from "./StyleCommunity";
import "../Styles/StartACommunityModal.css";
import ModalPortal from "./ModalPortal";
import api from "../api/api";

export default function StartACommunityModal({ onClose }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  const [communityData, setCommunityData] = useState({
    name: "",
    description: "",
    visibility: "public",
    topics: [],
    banner: null, // File object
    icon: null,   // File object
  });

  const handleNext = (data = {}) => {
    setCommunityData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleBack = (data = {}) => {
    setCommunityData(prev => ({ ...prev, ...data }));
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleCreateCommunity = async (finalData = {}) => {
    const incomingData = (finalData && typeof finalData.preventDefault === "function") 
      ? {} 
      : finalData;
    setError(null);
    const completeData = { ...communityData, ...incomingData };
    const formData = new FormData();
    
    formData.append("name", completeData.name);
    formData.append("description", completeData.description);
    formData.append("visibility", completeData.visibility);
    formData.append("topics", JSON.stringify(completeData.topics));
    
    if (completeData.icon) {
        formData.append("icon", completeData.icon);
    }
    if (completeData.banner) {
        formData.append("coverImage", completeData.banner); 
    }
    console.log("Final community data:", completeData);
  try {
  
      const response = await api.post("/community", formData);
      console.log("Community created:", response.data);
      handleClose();
      
    } catch (error) {
      setError("name is already taken");
      console.error("Error:", error.response?.data?.message || error.message);
    }


    // Prepare serializable state for navigation (remove banner and icon)
    const { banner, icon, ...serializableData } = completeData;

  };

  return (
    <ModalPortal>
      <div className="modal-overlay">
        <div className="modal-container">
          {step === 0 && (
            <AddTopics
              data={communityData}
              onNext={(topicArray) => handleNext({ topics:topicArray })}
              onClose={handleClose}
            />
          )}
          {step === 1 && (
            <CommunityVisibility
              data={communityData}
              onNext={(visibilityData) => handleNext(visibilityData)}
              onBack={(visibilityData) => handleBack(visibilityData)}
              onClose={handleClose}
            />
          )}
          {step === 2 && (
            <CommunityNameDesc
              data={communityData}
              onNext={(nameDescData) => handleNext(nameDescData)}
              onBack={(nameDescData) => handleBack(nameDescData)}
              onClose={handleClose}
            />
          )}
          {step === 3 && (
            <StyleCommunity
              data={communityData}
              error={error}
              onUpdate={(newData) => setCommunityData(prev => ({ ...prev, ...newData }))}
              onNext={handleCreateCommunity}
              onBack={(mediaData) => handleBack(mediaData)}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
