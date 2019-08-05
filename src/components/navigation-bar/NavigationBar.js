import { Navbar } from '@blueprintjs/core';
import React from 'react';
import logo from '../../assets/zoomdata-logo-charcoal.svg';
import { NavbarLogo } from './NavbarLogo';
import styles from './NavigationBar.module.css';

export function NavigationBar() {
  return (
    <Navbar className={styles.root}>
      <NavbarLogo src={logo} />
    </Navbar>
  );
}
