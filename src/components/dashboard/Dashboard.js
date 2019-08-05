import React, { createContext, useCallback, useMemo, useState } from 'react';
import styles from './Dashboard.module.css';
import { DashboardHeader } from './DashboardHeader';
import { DashboardWidgetGrid } from './DashboardWidgetGrid';

export const DashboardApi = createContext(null);

export function Dashboard() {
  const [widgets, setWidgets] = useState([]);
  const addWidget = useCallback(newWidget => setWidgets(prevWidgets => [...prevWidgets, newWidget]), []);

  const api = useMemo(() => ({ addWidget }), [addWidget]);

  return (
    <div className={styles.root}>
      <DashboardApi.Provider value={api}>
        <DashboardHeader />
        <DashboardWidgetGrid widgets={widgets} />
      </DashboardApi.Provider>
    </div>
  );
}
