import { NonIdealState, ResizeSensor, Spinner } from '@blueprintjs/core';
import React, { useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { ZoomdataAccessToken } from '../../App';
import { ZoomdataClient } from '../../pages/Home';
import { getSource } from '../../requests';
import { getQueryConfigTimeAndPlayer, getVisVariables } from '../../utils';
import styles from './DashboardWidget.module.css';

const types = {
  VISUALIZE_STARTED: 0,
  VISUALIZE_COMPLETE: 1,
  VISUALIZE_ERROR: 2,
};

function reducer(state, action) {
  switch (action.type) {
    case types.VISUALIZE_STARTED: {
      return { ...state, visualized: false, loading: true };
    }
    case types.VISUALIZE_COMPLETE: {
      return {
        ...state,
        visualized: true,
        source: action.source,
        chart: action.chart,
        errorStack: null,
        loading: false,
      };
    }
    case types.VISUALIZE_ERROR: {
      return { ...state, visualized: false, errorStack: action.errorStack, loading: false };
    }
    default: {
      return state;
    }
  }
}

export function DashboardWidget(props) {
  const { name, sourceName, sourceConfig } = props;
  const accessToken = useContext(ZoomdataAccessToken);
  const client = useContext(ZoomdataClient);
  const [state, dispatch] = useReducer(reducer, {
    visualized: false,
    loading: false,
    chart: null,
    errorStack: null,
  });
  const { visualized, loading, chart, errorStack } = state;
  const ref = useRef(null);

  const handleResize = useCallback(
    entries => {
      const { width, height } = entries[0].contentRect;

      if (chart) {
        chart.resize(width, height);
      }
    },
    [chart],
  );

  useEffect(() => {
    const chartEl = ref.current;

    async function renderChart() {
      dispatch({ type: types.VISUALIZE_STARTED });
      try {
        // checked if the data source is cached on the Zoomdata client
        let source = client.sources.get({ name: sourceName })[0];

        if (!source) {
          // source is not cached so let's fetch it and cache it
          const fetchedSource = (await getSource(sourceName, accessToken))[0];
          source = client.sources.add(fetchedSource)[0];
        }

        const queryConfig = { filters: sourceConfig.filters, ...getQueryConfigTimeAndPlayer(sourceConfig) };
        const visVariables = sourceConfig.variables;
        const chart = await client.visualize({
          config: queryConfig,
          element: chartEl,
          source,
          variables: visVariables,
          visualization: name,
          interactive: true,
        });
        const { thread } = chart;
        chart.eventDispatcher.once.call(thread, thread.EVENTS.MESSAGE, () => {
          dispatch({ type: types.VISUALIZE_COMPLETE, chart });
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: types.VISUALIZE_ERROR, errorStack: error.stack || error });
      }
    }

    renderChart();
  }, [client, name, sourceName, accessToken, sourceConfig]);

  return (
    <div className={styles.root}>
      {loading ? (
        <Spinner className={styles.overlay} size={Spinner.SIZE_LARGE} />
      ) : !visualized && !loading && !!errorStack ? (
        <NonIdealState description={errorStack} icon="error" title="Failed to Visualize Chart" />
      ) : null}
      <ResizeSensor onResize={handleResize}>
        <div className={styles.content} ref={ref} />
      </ResizeSensor>
    </div>
  );
}

export function WidgetPlaceholder() {
  return (
    <div className={styles.root}>
      <NonIdealState
        description="Click on Add Chart to select a chart to embed."
        icon="chart"
        title="No Chart Selected"
      />
    </div>
  );
}
