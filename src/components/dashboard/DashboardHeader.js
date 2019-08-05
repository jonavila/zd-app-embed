import React from 'react';
import { AddChart } from '../popovers/AddChart';
import styles from './DashboardHeader.module.css';

export function DashboardHeader() {
  return (
    <div className={styles.root}>
      <div className={styles.controlsRight}>
        <AddChart />
      </div>
    </div>
  );
}
