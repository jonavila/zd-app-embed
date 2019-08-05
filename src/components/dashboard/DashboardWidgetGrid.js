import React from 'react';
import { DashboardWidget, WidgetPlaceholder } from './DashboardWidget';
import styles from './DashboardWidgetGrid.module.css';

export function DashboardWidgetGrid(props) {
  const { widgets } = props;

  return (
    <div className={styles.root}>
      {widgets.length > 0 ? (
        widgets.map(widget => {
          const { chartId, name, source } = widget;

          return (
            <DashboardWidget
              name={name}
              key={`${source.id}_${chartId}`}
              sourceName={source.name}
              sourceConfig={source}
            />
          );
        })
      ) : (
        <WidgetPlaceholder />
      )}
    </div>
  );
}
