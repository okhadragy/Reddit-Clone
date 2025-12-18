import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTopics from "./AddTopics";
import CommunityVisibility from "./CommunityVisibility";
import CommunityNameDesc from "./CommunityNameDesc";
import StyleCommunity from "./StyleCommunity";
import "../Styles/StartACommunityModal.css";
import ModalPortal from "./ModalPortal";

export default function StartACommunityModal({ onClose }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

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
    const completeData = { ...communityData, ...finalData };
    const formData = new FormData();

    formData.append("name", completeData.name);
    formData.append("description", completeData.description);
    formData.append("visibility", completeData.visibility);
    formData.append("topics", JSON.stringify(completeData.topics));
    const token = localStorage.getItem("token");
    if (completeData.icon) {
        formData.append("icon", completeData.icon);
    }
    if (completeData.banner) {
        formData.append("coverImage", completeData.banner); 
    }
    console.log("Final community data:", completeData);
    try {
      
      const response = await fetch("http://localhost:5000/api/communities", {
        method: "POST",
        body: formData, 
        headers: {"authorization":`Bearer${token}`}
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Community created:", data);
        handleClose();
        // Navigate to the new community
        navigate(`/r/${completeData.name}`);
      } else {
        console.error("Error:", data.message);
        // Optional: Add an alert or error state here
      }
    } catch (error) {
      console.error("Network Error:", error);
    }

    // Close the modal
    handleClose();

    // Prepare serializable state for navigation (remove banner and icon)
    const { banner, icon, ...serializableData } = completeData;

    navigate(`/r/${completeData.name}`, {
      state: serializableData
    });
  };

  return (
    <ModalPortal>
      <div className="modal-overlay">
        <div className="modal-container">
          {step === 0 && (
            <AddTopics
              data={communityData}
              onNext={(topics) => handleNext({ topics })}
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
