import React from 'react';
import styles from './header.module.css';
import { MdMenu } from "react-icons/md";
import todoLogo from '../../assets/todo.svg';

export const Header = ({ onSetSidebarOpen }) => {
  return (
    <header className={styles.header}>
      <img src={todoLogo} className={styles.iconContainer} alt="Todo Logo" />
      <button onClick={() => onSetSidebarOpen(true)} className={styles.menuButton}>
        <MdMenu size={24} />
      </button>
    </header>
  );
};