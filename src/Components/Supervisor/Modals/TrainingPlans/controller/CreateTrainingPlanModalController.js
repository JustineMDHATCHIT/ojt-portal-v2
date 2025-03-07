import React, { useState } from "react";
import CreateTrainingPlanModalView from "../view/CreateTrainingPlanModalView";
import { trainingPlanModel } from "../model/CreateTrainingPlanModalModel";
import axios from "axios";
import LoadingModal from "../../../../Common/Modals/LoadingModal";
import OkayModal from "../../../../Common/Modals/OkayModal";
import ErrorModal from "../../../../Common/Modals/ErrorModal";
import PromptModal from "../../../../Common/Modals/PromptModal";
import { useAuth } from "../../../../Common/AuthContext";

const CreateTrainingPlanModalController = ({
  showModal,
  handleModalAction,
}) => {
  const [trainingPlan, setTrainingPlan] = useState(trainingPlanModel);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { userInfo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainingPlan((prevData) => ({
      ...prevData,
      [name]: value,
      mentorId: userInfo.user.id,
    }));
  };

  const handleCreateTrainingPlanAction = async () => {
    setIsSubmitting(true);
    try {
      const url = apiBaseUrl + "/training/plans";
      const response = await axios.post(url, trainingPlan);

      if (response.status === 201) {
        setIsSuccess(true);
      } else {
        setIsError(true);
        setErrorMessage("Error creating training plan.");
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setErrorMessage("Error creating training plan: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTrainingPlan = () => {
    setIsPromptOpen(true);
  };

  const handleConfirm = async () => {
    setIsPromptOpen(false);
    await handleCreateTrainingPlanAction();
  };

  return (
    <>
      <CreateTrainingPlanModalView
        showModal={showModal}
        handleModalAction={handleModalAction}
        handleChange={handleChange}
        handleCreateTrainingPlan={handleCreateTrainingPlan}
      />
      <LoadingModal open={isSubmitting} />

      <OkayModal
        open={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          window.location.reload();
        }}
        message="Training plan created successfully!"
      />

      <ErrorModal
        open={isError}
        onClose={() => setIsError(false)}
        errorMessage={errorMessage}
      />

      <PromptModal
        open={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onConfirm={handleConfirm}
        message="Are you sure you want to submit create this training plan?"
      />
    </>
  );
};

export default CreateTrainingPlanModalController;
