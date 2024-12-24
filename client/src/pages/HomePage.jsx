import React, { useEffect, useState } from "react";
import styles from "./styles/homepage.module.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  acceptDashboard,
  createFolder,
  deleteFolder,
  getFolders,
  getSharedDashboard,
  shareDashboard,
} from "../services/folderService";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Dropdown from "../components/Dropdown";
import ShareModal from "../components/ShareModal";
import FolderList from "../components/FolderList";

const HomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [sharedDashboards, setSharedDashboards] = useState([]);
  const [selectedSharedFolders, setSelectedSharedFolders] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [permissions, setPermissions] = useState("view");
  const [shareLink, setShareLink] = useState("");
  const [isProcessingToken, setIsProcessingToken] = useState(false);
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState(user?.username);

  const [isOpen, setIsOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [userPermission, setUserPermission] = useState("edit");

  const [deleteModal, setDeleteModal] = useState(false);
  const [foldertoDelete, setFolderToDelete] = useState(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openFolder = () => setFolderOpen(true);
  const closeFolder = () => setFolderOpen(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      handleFolders();
    } else {
      setSelectedSharedFolders([]);
      setCurrentWorkspace(user?.username);
      setUserPermission("edit");
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    const token = tokenFromURL || sessionStorage.getItem("dashboardToken");
    console.log("token in useEffect", token);
    if (token && !isProcessingToken) {
      setIsProcessingToken(true);
      console.log("token if present", token);
      sessionStorage.setItem("dashboardToken", token);
      handleTokenAcceptance(token);
    } else if (!isProcessingToken) {
      handleFolders();
      fetchSharedDashboards();
    }
  }, [location, isProcessingToken]);

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

  const fetchSharedDashboards = async () => {
    try {
      const response = await getSharedDashboard();
      console.log("Shared Dashboards Response:", response);
      setSharedDashboards(response?.sharedData?.sharedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFolders = async () => {
    try {
      const data = await getFolders();
      setFolders(data?.folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

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
      setCurrentWorkspace(selectedUser?.name);
      setUserPermission(selectedUser?.permissions);
    }
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    console.log("Current Workspace:", currentWorkspace);
    console.log("User Permission:", userPermission);
    if (currentWorkspace && userPermission) {
      handleFolders();
    }
  }, [currentWorkspace, userPermission]);

  const handleSharedDashboard = async () => {
    try {
      const response = await shareDashboard({
        recipientEmail,
        permissions,
      });

      if (response.sharableLink) {
        setShareLink(response.sharableLink);
        navigator.clipboard.writeText(response.sharableLink);
        alert("link copied");
      } else {
        fetchSharedDashboards();

        alert("dashboard shared");
      }
    } catch (error) {
      console.error("error sharing dashboard");
    }
  };

  const handleCreateFolder = async () => {
    if (userPermission !== "edit") return;

    const dashboardId = sharedDashboards.find(
      (dashboard) => dashboard.name === currentWorkspace
    )?.id;
    console.log(dashboardId);

    try {
      const response = await createFolder({ dashboardId, folderName });
      setFolders([...folders, response.folder]);

      if (selectedSharedFolders.length > 0) {
        setSelectedSharedFolders([...selectedSharedFolders, response.folder]);
      }
      setFolderName("");
      closeFolder();
      // handleFolders();
    } catch (error) {
      console.error("Error creating folder", error);
    }
  };
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

  const handlefolderDelete = (folderId) => {
    setFolderToDelete(folderId);
    setDeleteModal(true);
  };
  const closeDeleteFolder = () => {
    setDeleteModal(false);
    setFolderToDelete(null);
  };
  return (
    <div className={styles.homepage}>
      <nav className={styles.navbar}>
        <Dropdown
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          user={user}
          sharedDashboards={sharedDashboards}
          handleSharedUserClick={handleSharedUserClick}
          currentWorkspace={currentWorkspace}
        />
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
        <button onClick={openFolder} className={styles.createFolder}>
          <MdOutlineCreateNewFolder size={20} /> Create a folder
        </button>

        {folderOpen && (
          <div className={styles.folderModal}>
            <div className={styles.openFolder}>
              <h1>Create New Folder</h1>
              <input
                type="text"
                className={styles.folderName}
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
              <div className={styles.buttons}>
                <button
                  onClick={handleCreateFolder}
                  className={styles.createBtn}
                >
                  Done
                </button>
                <p>|</p>
                <button onClick={closeFolder} className={styles.cancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteModal && (
          <div className={styles.folderModal}>
            <div className={styles.openFolder}>
              <h1>Are you sure want to delete this form</h1>

              <div className={styles.buttons}>
                <button
                  onClick={handleDeleteFolder}
                  className={styles.createBtn}
                >
                  Confirm
                </button>
                <p>|</p>
                <button onClick={closeDeleteFolder} className={styles.cancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <FolderList
          folders={folders}
          selectedSharedFolders={selectedSharedFolders}
          // onDeleteFolder={handleDeleteFolder}
          userPermission={userPermission}
          deleteFolder={handlefolderDelete}
        />
      </div>
    </div>
  );
};

export default HomePage;
