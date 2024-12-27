import React from "react";
import styles from "./styles/folderlist.module.css";

import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCreateNewFolder } from "react-icons/md";

const FolderList = ({
  selectedSharedFolders,
  folders,
  openFolder,
  userPermission,
  deleteFolder,
  handleFolderClick,
  activeFolderId,
}) => {
  const folderItems =
    selectedSharedFolders.length > 0 ? selectedSharedFolders : folders;
  return (
    <div className={styles.folders}>
      {userPermission === "edit" && (
        <button onClick={openFolder} className={styles.createFolder}>
          <MdOutlineCreateNewFolder size={20} /> Create a folder
        </button>
      )}
      {folderItems.length === 0 ? (
        <p className={styles.noFolders}>No folders created yet.</p>
      ) : (
        folderItems.map((folder) => (
          <div
            className={`${styles.folder} ${
              activeFolderId === folder._id ? styles.active : ""
            }`}
            key={folder._id}
            onClick={() => {
              handleFolderClick(folder);
            }}
          >
            <p>{folder.folderName}</p>
            {userPermission === "edit" && (
              <RiDeleteBin6Line
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder._id);
                }}
                className={styles.delete}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FolderList;
