import { Menu, MenuItem, Spinner } from '@blueprintjs/core';
import { sortBy } from 'lodash-es';
import React, { useContext, useEffect, useState } from 'react';
import { ZoomdataAccessToken } from '../../App';
import { getDashboards } from '../../requests';
import styles from './DashboardMenu.module.css';

export function DashboardMenu(props) {
  const accessToken = useContext(ZoomdataAccessToken);
  const { initialDashboards = [], onFetchEnd = () => {}, onItemClick } = props;
  const [dashboards, setDashboards] = useState(initialDashboards);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedDashboards = (await getDashboards(accessToken)).bookmarksMap;
        onFetchEnd(fetchedDashboards);
        setDashboards(fetchedDashboards);
      } catch (error) {
        console.error(error);
      }
    }

    if (initialDashboards.length === 0) {
      fetchData();
    }
  }, [initialDashboards.length, onFetchEnd, accessToken]);

  return (
    <Menu className={styles.root}>
      {dashboards.length > 0 ? (
        sortBy(dashboards, dashboard => dashboard.name.toLowerCase()).map(dashboard => {
          return (
            <MenuItem
              key={dashboard.id}
              onClick={() => {
                dashboard.visualizations.forEach(visualization => {
                  const chart = visualization;
                  const widget = {
                    chartId: chart.visId,
                    name: chart.name,
                    source: {
                      ...chart.source,
                      ...{ id: chart.source.sourceId, name: chart.source.sourceName, controlsCfg: chart.controlsCfg },
                    },
                  };
                  onItemClick(widget);
                });
              }}
              text={dashboard.name}
            />
          );
        })
      ) : (
        <MenuItem icon={<Spinner shouldDismissPopover={false} size={Spinner.SIZE_SMALL} />} />
      )}
    </Menu>
  );
}
