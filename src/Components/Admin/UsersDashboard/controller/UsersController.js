import React, { useEffect, useState } from "react";
import UsersView from "../view/UsersView";
import { useAuth } from "../../../Common/AuthContext";
import LoadingModal from "../../../Common/Modals/LoadingModal";
import { Users } from "../model/UsersModels";
import axios from "axios";
import OkayModal from "../../../Common/Modals/OkayModal";
import ErrorModal from "../../../Common/Modals/ErrorModal";
import PromptModal from "../../../Common/Modals/PromptModal";

const UsersController = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await Users(authUser);
        setUsers(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authUser]);

  const handleActivateAccount = async (id) => {
    setLoading(true);
    try {
      const url =
        process.env.REACT_APP_API_BASE_URL + `/users/activate/account`;
      const response = await axios.get(url, {
        params: {
          userId: id,
          token: authUser.accessToken,
        },
      });

      console.log(response, "++++++++++++++++++++++++++++++++++++++++=");
      setIsSuccess(true);
      setSuccessMessage("Account activated successfully!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Error activating account.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async (id) => {
    setLoading(true);
    try {
      const url =
        process.env.REACT_APP_API_BASE_URL + `/users/deactivate/${id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `${authUser.tokenType} ${authUser.accessToken}`,
        },
      });

      setIsSuccess(true);
      setSuccessMessage("Account deactivated successfully!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Error deactivating account.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalAction = () => setShowModal(!showModal);

  const handleConfirmAccountAction = (promptMessage, id) => {
    setPromptMessage(promptMessage);
    setIsPromptOpen(true);
    setId(id);
  };

  const handleConfirm = async () => {
    setIsPromptOpen(false);
    if (promptMessage.includes("deactivate")) await handleDeactivateAccount(id);
    else await handleActivateAccount(id);
  };

  return (
    <>
      <UsersView
        showModal={showModal}
        handleModalAction={handleModalAction}
        users={users}
        handleConfirmAccountAction={handleConfirmAccountAction}
      />

      <LoadingModal open={loading} />
      <OkayModal
        open={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          window.location.reload();
        }}
        message={successMessage}
      />

      <ErrorModal
        open={isError}
        onClose={() => {
          setIsError(false);
          window.location.reload();
        }}
        errorMessage={errorMessage}
      />

      <PromptModal
        open={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onConfirm={handleConfirm}
        message={promptMessage}
      />
    </>
  );
};

export default UsersController;
