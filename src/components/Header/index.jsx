import React from 'react';
import styles from './header.module.css';
import { MdMenu } from "react-icons/md";
import todoLogo from '../../assets/todo.svg';

export function Header() {
  return (
    <header className={styles.header}>
      <img src={todoLogo} className={styles.iconContainer} />
    </header>
  );
}