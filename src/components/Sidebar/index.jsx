import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import styles from './sidebar.module.css';
import { FaTasks, FaUserEdit, FaGithub, FaGlobe } from 'react-icons/fa';

const CustomSidebar = ({ sidebarOpen, onSetSidebarOpen, setUserName, children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(localStorage.getItem('userName') || '');

  const handleSaveName = (e) => {
    setName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      localStorage.setItem('userName', name);
      setUserName(name);
      setIsEditing(false);
    }
  };

  return (
    <Sidebar
      sidebar={
        <div className={styles.sidebarContent}>
          <div className={styles.links}>
            <a href="#" className={styles.link} onClick={() => onSetSidebarOpen(false)}>
              <FaTasks className={styles.icon} /> Show Tasks
            </a>
            <a href="https://github.com/lendl1" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <FaGithub className={styles.icon} /> GitHub
            </a>
            <a href="https://lexmeet.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <FaGlobe className={styles.icon} /> Website
            </a>
          </div>
          <div className={styles.userSection}>
            <div className={styles.link} onClick={() => setIsEditing(true)}>
              <FaUserEdit className={styles.icon}/> 
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className={styles.input}
                  autoFocus
                />
              ) : (
                <span>{name || 'User'}</span>
              )}
            </div>
          </div>
        </div>
      }
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      pullRight={true}
      styles={{ sidebar: { background: "#F8FFFE", width: "250px", overflow: "hidden" } }}
    >
      {children}
    </Sidebar>
  );
};

export default CustomSidebar;
