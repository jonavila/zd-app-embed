import { application, clientId, credentials } from '../config/zoomdata';
import { AppToaster } from './AppToaster';
import { getPopupDimensions } from './popup';
import { ScriptLoader } from './ScriptLoader';

export function getZoomdataUrl() {
  const { host, path, port, secure } = application;
  const protocol = secure ? 'https:' : 'http:';
  const portStr = port === 443 ? '' : `:${port}`;

  return `${protocol}//${host}${portStr}${path}`;
}

export async function loadZoomdataSDK() {
  try {
    return await ScriptLoader.load({
      url: `${getZoomdataUrl()}/sdk/zoomdata-client.js`,
      id: 'zoomdata-client',
    });
  } catch (error) {
    AppToaster.show({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'Error loading the Zoomdata SDK Client.',
    });

    return Promise.reject(error);
  }
}

export async function createClient() {
  try {
    return await window.ZoomdataSDK.createClient({ application, credentials });
  } catch (error) {
    AppToaster.show({
      icon: 'warning-sign',
      intent: 'danger',
      message: `Error creating the Zoomdata Client.`,
    });

    return Promise.reject(error);
  }
}

export async function createMetaThread(client) {
  try {
    return await client.createMetaThread();
  } catch (error) {
    AppToaster.show({
      icon: 'warning-sign',
      intent: 'danger',
      message: `Error creating the Zoomdata MetaThread.`,
    });

    return Promise.reject(error);
  }
}

export function getQueryConfigTimeAndPlayer(source = { controlsCfg: {} }) {
  const { controlsCfg = { playerControlCfg: null, timeControlCfg: null } } = source;
  const playerControlCfg = controlsCfg && controlsCfg.playerControlCfg;

  if (source.playbackMode) {
    controlsCfg.playerControlCfg = {
      pauseAfterRead: !source.live,
      timeWindowScale: playerControlCfg.timeWindowScale,
    };

    if (!source.live) {
      controlsCfg.playerControlCfg.stopTime = '$end_of_data';
    }
  }
  return { time: controlsCfg.timeControlCfg, player: controlsCfg.playerControlCfg };
}

export function getVisVariables(source, chartName) {
  return source.visualizations.filter(visualization => visualization.name === chartName)[0].source.variables;
}

let popup;

export async function authorizeUser() {
  const zoomdataUrl = getZoomdataUrl();
  popup = window.open(
    `${zoomdataUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${window.location.origin}/signIn&response_type=token&scope=read`,
    '',
    `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`,
  );

  const accessToken = await new Promise((resolve, reject) => {
    window.addEventListener('message', event => {
      if (event.data.type === 'signIn') {
        popup.close();
        const { accessToken } = event.data.data;
        resolve(accessToken);
      }
    });
    window.onmessageerror = () => reject();
  });

  return Promise.resolve(accessToken);
}
