import { Menu, MenuItem, Spinner } from '@blueprintjs/core';
import { sortBy } from 'lodash-es';
import React, { useEffect, useContext, useState } from 'react';
import { ZoomdataAccessToken } from '../../App';
import { getChartsForSource } from '../../requests';
import styles from './ChartsForSourceMenu.module.css';

export function ChartsForSourceMenu(props) {
  const accessToken = useContext(ZoomdataAccessToken);
  const { initialCharts = [], onFetchEnd = () => {}, onItemClick, source } = props;
  const [charts, setCharts] = useState(initialCharts);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedCharts = await getChartsForSource(source.id, accessToken);
        onFetchEnd(fetchedCharts, source.id);
        setCharts(fetchedCharts);
      } catch (error) {
        console.error(error);
      }
    }

    if (initialCharts.length === 0) {
      fetchData();
    }
  }, [initialCharts.length, onFetchEnd, source.id, accessToken]);

  return (
    <Menu className={styles.root}>
      {charts.length > 0 ? (
        sortBy(charts, chart => chart.name.toLowerCase()).map(chart => {
          return (
            <MenuItem
              key={chart.visId}
              onClick={() => {
                const widget = { chartId: chart.visId, name: chart.name, source: { id: source.id, name: source.name } };
                onItemClick(widget);
              }}
              text={chart.name}
            />
          );
        })
      ) : (
        <MenuItem icon={<Spinner shouldDismissPopover={false} size={Spinner.SIZE_SMALL} />} />
      )}
    </Menu>
  );
}
