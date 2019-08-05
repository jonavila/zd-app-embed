import ky from 'ky';
import { AppToaster, getZoomdataUrl } from '../utils';

const api = ky.create({
  prefixUrl: getZoomdataUrl(),
});

export function getAuthorizationHeader(accessToken) {
  return { authorization: `Bearer ${accessToken}` };
}

export async function getDashboards(accessToken) {
  try {
    const response = await api.get('api/dashboards', {
      headers: { ...getAuthorizationHeader(accessToken) },
    });

    return await response.json();
  } catch (error) {
    AppToaster.show({
      icon: 'warning-sign',
      intent: 'danger',
      message: 'Error fetching the Zoomdata Dashboards.',
    });
  }
}

export async function getSources(accessToken) {
  try {
    const response = await api.get('api/sources', {
      searchParams: 'fields=connectionTypeId',
      headers: { ...getAuthorizationHeader(accessToken) },
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

export async function getSource(sourceName, accessToken) {
  try {
    const response = await api.get(`api/sources/name/${sourceName}`, {
      headers: { ...getAuthorizationHeader(accessToken) },
    });

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

export async function getChartsForSource(sourceId, accessToken) {
  try {
    const response = await api.get(`api/visdefs/${sourceId}`, {
      headers: { ...getAuthorizationHeader(accessToken) },
    });

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
