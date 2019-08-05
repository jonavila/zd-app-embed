import ky from 'ky';
import { credentials } from '../config/zoomdata';
import { AppToaster, getZoomdataUrl } from '../utils';

const api = ky.create({
  prefixUrl: getZoomdataUrl(),
  headers: { authorization: `Key ${credentials.key}` },
});

export async function getSources() {
  try {
    const response = await api.get('api/sources', {
      searchParams: 'fields=connectionTypeId',
    });

    return await response.json();
  } catch (error) {
    AppToaster.show({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'Error fetching the Zoomdata Sources.',
    });

    return Promise.reject(error);
  }
}

export async function getSource(sourceName) {
  try {
    const response = await api.get(`api/sources/name/${sourceName}`);

    return await response.json();
  } catch (error) {
    AppToaster.show({
      icon: 'warning-sign',
      intent: 'danger',
      message: `Error fetching the Zoomdata Source: ${sourceName}`,
    });

    return Promise.reject(error);
  }
}

export async function getChartsForSource(sourceId) {
  try {
    const response = await api.get(`api/visdefs/${sourceId}`);

    return await response.json();
  } catch (error) {
    AppToaster.show({
      icon: 'warning-sign',
      intent: 'danger',
      message: `Error fetching the charts for the Source: ${sourceId}`,
    });

    return Promise.reject(error);
  }
}
