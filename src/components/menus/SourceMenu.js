import { Menu, MenuItem, Spinner } from '@blueprintjs/core';
import React, { useContext, useEffect, useState } from 'react';
import { ZoomdataAccessToken } from '../../App';
import { getSources } from '../../requests';
import { getZoomdataUrl } from '../../utils';
import styles from './SourceMenu.module.css';

function ConnectionTypeIcon(props) {
  const { id } = props;

  return (
    <div className={styles.root}>
      <img alt="Source Icon" className={styles.icon} src={`${getZoomdataUrl()}/api/connection/types/icon/${id}`} />
    </div>
  );
}

export function SourceMenu(props) {
  const accessToken = useContext(ZoomdataAccessToken);
  const { initialSources = [], onFetchEnd = () => {}, onItemClick } = props;
  const [sources, setSources] = useState(initialSources);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedSources = await getSources(accessToken);
        onFetchEnd(fetchedSources);
        setSources(fetchedSources);
      } catch (error) {
        console.error(error);
      }
    }

    if (initialSources.length === 0) {
      fetchData();
    }
  }, [initialSources.length, onFetchEnd, accessToken]);

  return (
    <Menu>
      {sources.length > 0 ? (
        sources.map(source => {
          const icon = <ConnectionTypeIcon id={source.connectionTypeId} />;

          return (
            <MenuItem
              icon={icon}
              key={source.id}
              onClick={() => onItemClick(source)}
              shouldDismissPopover={false}
              text={source.name}
            />
          );
        })
      ) : (
        <MenuItem icon={<Spinner shouldDismissPopover={false} size={Spinner.SIZE_SMALL} />} />
      )}
    </Menu>
  );
}
