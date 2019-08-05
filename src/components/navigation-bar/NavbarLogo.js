import React from 'react';
import styles from './NavbarLogo.module.css';

export function NavbarLogo(props) {
  const { src } = props;

  return <img alt="Application Logo" className={styles.root} src={src} />;
}
