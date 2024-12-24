import React from "react";
import styles from "./styles/folderlist.module.css";

import { RiDeleteBin6Line } from "react-icons/ri";
const FolderList = ({
  selectedSharedFolders,
  folders,
  onDeleteFolder,
  userPermission,
}) => {
  const folderItems =
    selectedSharedFolders.length > 0 ? selectedSharedFolders : folders;
  return (
    <div className={styles.folders}>
      {folderItems.map((folder) => (
        <div className={styles.folder} key={folder._id}>
          <h2>{folder.folderName}</h2>
          {userPermission === "edit" && (
            <RiDeleteBin6Line
              onClick={() => onDeleteFolder(folder._id)}
              className={styles.delete}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderList;
