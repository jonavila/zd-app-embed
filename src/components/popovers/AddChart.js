import { Button, Divider, PanelStack, Popover } from '@blueprintjs/core';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { DashboardApi } from '../dashboard/Dashboard';
import { ChartsForSourceMenu } from '../menus/ChartsForSourceMenu';
import { SourceMenu } from '../menus/SourceMenu';
import styles from './AddChart.module.css';

function ChartForSourceMenuPanel(props) {
  const { api, closePanel, source } = props;

  return (
    <>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeaderTitle}>
          <span>
            <Button icon="chevron-left" minimal={true} onClick={closePanel} small={true} />
          </span>
          <div>Add New Chart</div>
          <span />
        </div>
        <div className={styles.panelHeaderSubTitle}>
          <div>Step 2/2: Select Chart</div>
          <div className={styles.sourceLabel}>{source.name}</div>
        </div>
      </div>
      <Divider />
      <ChartsForSourceMenu
        initialCharts={source.charts}
        source={source}
        onFetchEnd={api.cacheChartsForSource}
        onItemClick={api.addWidget}
      />
    </>
  );
}

function SourceMenuPanel(props) {
  const { api, initialSources, openPanel } = props;
  const onItemClick = source => {
    openPanel({
      component: ChartForSourceMenuPanel,
      props: { source, api },
    });
  };

  return (
    <>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeaderTitle}>
          <div>Add New Chart</div>
        </div>
        <div className={styles.panelHeaderSubTitle}>
          <div>Step 1/2: Select Data Source</div>
        </div>
      </div>
      <Divider />
      <SourceMenu initialSources={initialSources} onFetchEnd={api.cacheSources} onItemClick={onItemClick} />
    </>
  );
}

export function AddChart() {
  const dashboardApi = useContext(DashboardApi);
  const [sources, setSources] = useState([]);
  const cacheSources = useCallback(fetchedSources => setSources(fetchedSources), []);
  const cacheChartsForSource = useCallback(
    (fetchedCharts, sourceId) =>
      setSources(prevSources => {
        const sourceToUpdateCharts = prevSources.find(source => source.id === sourceId);

        if (sourceToUpdateCharts) {
          sourceToUpdateCharts.charts = fetchedCharts;
        }

        return prevSources;
      }),
    [],
  );

  const api = useMemo(() => ({ addWidget: dashboardApi.addWidget, cacheSources, cacheChartsForSource }), [
    dashboardApi.addWidget,
    cacheSources,
    cacheChartsForSource,
  ]);

  return (
    <Popover position="bottom">
      <Button icon="add" minimal title="Add Chart" />
      <PanelStack
        className={styles.panelStack}
        initialPanel={{ component: SourceMenuPanel, props: { api, initialSources: sources } }}
        showPanelHeader={false}
      />
    </Popover>
  );
}
