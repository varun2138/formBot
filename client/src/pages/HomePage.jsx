import React, { useEffect, useState } from "react";
import styles from "./styles/homepage.module.css";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  acceptDashboard,
  createFolder,
  deleteFolder,
  getFolders,
  getSharedDashboard,
  shareDashboard,
} from "../services/folderService";

import Dropdown from "../components/Dropdown";
import ShareModal from "../components/ShareModal";
import FolderList from "../components/FolderList";
import ThemeToggle from "../components/ThemeToggle";
import FormList from "../components/FormList";
import { createForm, deleteForm, getForms } from "../services/formService";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";

const HomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // folder states
  const [folders, setFolders] = useState([]);
  const [selectedSharedFolders, setSelectedSharedFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);
  const [foldertoDelete, setFolderToDelete] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);

  // form states
  const [forms, setForms] = useState([]);
  const [selectedFolderForms, setSelectedFolderForms] = useState([]);
  const [selectedSharedForms, setSelectedSharedForms] = useState([]);
  const [formToDelete, setFormToDelete] = useState(null);
  const [deleteFormModal, setDeleteFormModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formOpen, setformOpen] = useState(false);

  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // dashboard
  const [sharedDashboards, setSharedDashboards] = useState([]);
  const [isProcessingToken, setIsProcessingToken] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [permissions, setPermissions] = useState("view");
  const [shareLink, setShareLink] = useState("");

  // workspace
  const { user, theme } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState(user?.username);
  const [userPermission, setUserPermission] = useState("edit");

  const location = useLocation();
  const navigate = useNavigate();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openFolder = () => setFolderOpen(true);
  const closeFolder = () => setFolderOpen(false);

  const openForm = () => setformOpen(true);
  const closeForm = () => setformOpen(false);

  // dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      handleFolders();
      handleForms();
    } else {
      setSelectedSharedFolders([]);
      setCurrentWorkspace(user?.username);
      setUserPermission("edit");
    }
  };

  // useEffect for token retrieval
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    const token = tokenFromURL || sessionStorage.getItem("dashboardToken");

    if (token && !isProcessingToken) {
      setIsProcessingToken(true);

      sessionStorage.setItem("dashboardToken", token);
      handleTokenAcceptance(token);
    } else if (!isProcessingToken) {
      handleFolders();
      handleForms();
      fetchSharedDashboards();
    }
  }, [location, isProcessingToken]);

  // token acceptance logic
  const handleTokenAcceptance = async (token) => {
    setIsProcessingToken(true);
    try {
      const response = await acceptDashboard({ token });
      sessionStorage.removeItem("dashboardToken");
      fetchSharedDashboards();
      navigate("/dashboard");
    } catch (error) {
      console.error("error accepting dashboard", error);
    } finally {
      setIsProcessingToken(false);
    }
  };

  // retrieving shared dashboards with the user
  const fetchSharedDashboards = async () => {
    try {
      const response = await getSharedDashboard();

      setSharedDashboards(response?.sharedData?.sharedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  // retrieving user folders
  const handleFolders = async () => {
    try {
      const data = await getFolders();

      setFolders(data?.folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  // retrieving user forms
  const handleForms = async () => {
    try {
      const data = await getForms();

      setForms(data?.forms);
    } catch (error) {
      console.error("error while fetching forms", error);
    }
  };

  // displaying the shared workspaces data
  const handleSharedUserClick = (sharedId) => {
    if (sharedId === user?.id) {
      setSelectedSharedFolders([]);

      setCurrentWorkspace(user?.username);
      setUserPermission("edit");
    } else {
      const selectedUser = sharedDashboards.find(
        (dashboard) => dashboard.id === sharedId
      );

      setSelectedSharedFolders(selectedUser?.folders || []);
      setSelectedSharedForms(selectedUser?.forms || []);
      setCurrentWorkspace(selectedUser?.name);
      setUserPermission(selectedUser?.permissions);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (currentWorkspace && userPermission) {
      handleFolders();
      handleForms();
    }
  }, [currentWorkspace, userPermission]);

  // sharing the dashboard with other users
  const handleSharedDashboard = async () => {
    try {
      const response = await shareDashboard({
        recipientEmail,
        permissions,
      });

      if (response.sharableLink) {
        setShareLink(response.sharableLink);
        navigator.clipboard.writeText(response.sharableLink);
        toast.success("link copied to clipboard");
      } else {
        fetchSharedDashboards();
        setRecipientEmail("");
        toast.success("dashboard shared successfully");
      }
    } catch (error) {
      console.error("error sharing dashboard");
    }
  };

  // folder creation logic
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (userPermission !== "edit") return;

    const dashboardId = sharedDashboards.find(
      (dashboard) => dashboard.name === currentWorkspace
    )?.id;

    const isDuplicate =
      folders.some(
        (folder) => folder.folderName.toLowerCase() === folderName.toLowerCase()
      ) ||
      selectedSharedFolders.some(
        (folder) => folder.folderName.toLowerCase() === folderName.toLowerCase()
      );
    if (isDuplicate) {
      toast.error(
        "A folder with the same name already exists in the workspace"
      );
      return;
    }
    try {
      const response = await createFolder({ dashboardId, folderName });
      setFolders([...folders, response.folder]);

      if (selectedSharedFolders.length > 0) {
        setSelectedSharedFolders([...selectedSharedFolders, response.folder]);
      }
      setFolderName("");
      closeFolder();
    } catch (error) {
      console.error("Error creating folder", error);
    }
  };

  // form creation logic
  const handleCreateForm = async (e) => {
    e.preventDefault();
    if (userPermission !== "edit") return;
    const dashboardId = sharedDashboards.find(
      (dashboard) => dashboard.name === currentWorkspace
    )?.id;

    const isDuplicate =
      forms.some(
        (form) => form.formName.toLowerCase() === formName.toLowerCase()
      ) ||
      forms.some(
        (form) =>
          form.formName.toLowerCase() === formName.toLowerCase() &&
          form.parentFolder === selectedFolder?._id
      ) ||
      (selectedFolderForms &&
        selectedFolderForms.some(
          (form) => form.formName.toLowerCase() === formName.toLowerCase()
        )) ||
      selectedSharedForms.some(
        (form) => form.toLowerCase() === formName.toLowerCase()
      );

    if (isDuplicate) {
      toast.error("A form with the same name already exists in the workspace");
      return;
    }
    try {
      const response = await createForm({
        dashboardId,
        formName,
        parentFolder: selectedFolder?._id || null,
      });

      const newForm = response.form;

      setForms((prevForms) => [...prevForms, newForm]);

      if (selectedFolder?._id === newForm.parentFolder) {
        setSelectedFolderForms((prevForms) => [...prevForms, newForm]);
      }
      if (selectedSharedForms.length > 0) {
        setSelectedSharedForms((prevForms) => [...prevForms, newForm]);
      }
      setFormName("");

      closeForm();
      console.log("selected folder forms in creation", selectedFolderForms);
    } catch (error) {
      console.error("Error creating form", error);
    }
  };

  // folder deletion logic
  const handleDeleteFolder = async () => {
    if (userPermission !== "edit" || !foldertoDelete) return;
    try {
      setFolders(folders.filter((folder) => folder._id !== foldertoDelete));
      if (selectedSharedFolders.length > 0) {
        setSelectedSharedFolders(
          selectedSharedFolders.filter((folder) => folder._id != foldertoDelete)
        );
      }
      await deleteFolder(foldertoDelete);
      closeDeleteFolder();
      handleFolders();
    } catch (error) {
      console.error("Error deleting folder", error);
      closeDeleteFolder();
    }
  };

  // form deletion logic
  const handleDeleteForm = async (formId) => {
    console.log("deelee folder is called");
    if (userPermission !== "edit" || !formId) return;
    try {
      setForms(forms.filter((form) => form._id !== formId));
      if (selectedFolder) {
        setSelectedFolderForms(
          selectedFolderForms.filter((form) => form._id !== formId)
        );

        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder._id === selectedFolder._id
              ? {
                  ...folder,
                  forms: folder.forms.filter((form) => form._id !== formId),
                }
              : folder
          )
        );
      }

      if (selectedSharedForms.length > 0) {
        setSelectedSharedForms(
          selectedSharedForms.filter((form) => form._id !== formId)
        );
      }
      await deleteForm(formId);
    } catch (error) {}
  };

  const handlefolderDelete = (folderId) => {
    setFolderToDelete(folderId);
    setDeleteModal(true);
  };
  const closeDeleteFolder = () => {
    setDeleteModal(false);
    setFolderToDelete(null);
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setActiveFolderId(folder._id);
    setSelectedFolderForms(folder?.forms);
  };
  useEffect(() => {
    if (selectedFolder) {
      setSelectedFolderForms(selectedFolder.forms);
    }
  }, [selectedFolder]);

  const handleFormDeleteClick = (formId) => {
    setFormToDelete(formId);
    setDeleteFormModal(true);
    console.log(foldertoDelete);
  };

  const closeDeleteFormModal = () => {
    setDeleteFormModal(false);
    setFormToDelete(null);
  };

  return (
    <div className={`${styles.homepage} ${theme}`}>
      <nav className={styles.navbar}>
        <Dropdown
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          user={user}
          sharedDashboards={sharedDashboards}
          handleSharedUserClick={handleSharedUserClick}
          currentWorkspace={currentWorkspace}
          setUserPermission={setUserPermission}
        />
        <div className={styles.theme}>
          <ThemeToggle />
        </div>
        <button onClick={openModal} className={styles.shareBtn}>
          share
        </button>
      </nav>

      <ShareModal
        isOpen={isOpen}
        closeModal={closeModal}
        permissions={permissions}
        setPermissions={setPermissions}
        recipientEmail={recipientEmail}
        setRecipientEmail={setRecipientEmail}
        handleSharedDashboard={handleSharedDashboard}
      />

      <div className={styles.folders}>
        {folderOpen && (
          <Modal
            title="Create New Folder"
            inputValue={folderName}
            onInputChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            onConfirm={handleCreateFolder}
            onCancel={closeFolder}
            isInputVisible={true}
            text="Done"
          />
        )}

        {formOpen && (
          <Modal
            title="Create New Form"
            inputValue={formName}
            onInputChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            onConfirm={handleCreateForm}
            onCancel={closeForm}
            isInputVisible={true}
            text="Done"
          />
        )}
        {deleteModal && (
          <Modal
            title="Are you sure you want to delete this folder?"
            onConfirm={handleDeleteFolder}
            onCancel={closeDeleteFolder}
            text="Confirm"
            isInputVisible={false}
          />
        )}

        {deleteFormModal && (
          <Modal
            title="Are you sure you want to delete this form?"
            onConfirm={() => {
              handleDeleteForm(formToDelete);
              closeDeleteFormModal();
            }}
            onCancel={closeDeleteFormModal}
            text="Confirm"
            isInputVisible={false}
          />
        )}
        <FolderList
          folders={folders}
          selectedSharedFolders={selectedSharedFolders}
          userPermission={userPermission}
          deleteFolder={handlefolderDelete}
          openFolder={openFolder}
          handleFolderClick={handleFolderClick}
          activeFolderId={activeFolderId}
          setCurrentWorkspace={setCurrentWorkspace}
          setUserPermission={setUserPermission}
        />
        <FormList
          forms={forms}
          selectedFolder={selectedFolder}
          selectedFolderForms={selectedFolderForms}
          selectedSharedForms={selectedSharedForms}
          openForm={openForm}
          userPermission={userPermission}
          handleFormDeleteClick={handleFormDeleteClick}
        />
      </div>
    </div>
  );
};

export default HomePage;
