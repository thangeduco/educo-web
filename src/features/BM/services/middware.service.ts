// src/features/BM/services/middware.service.ts

import { BM_APP_VERSION } from '../config/bmConfig';

export interface ClientContext {
  page_url: string | null;
  referrer_url: string | null;

  client_user_agent: string | null;
  client_device_type: string | null;

  client_language: string | null;
  client_timezone: string | null;

  client_screen_width: number | null;
  client_screen_height: number | null;

  client_os_name: string | null;
  client_os_version: string | null;

  client_browser_name: string | null;
  client_browser_version: string | null;

  client_app_version: string | null;
}

function detectOS(userAgent: string | null) {
  if (!userAgent) {
    return { osName: null, osVersion: null };
  }

  if (/Windows NT/i.test(userAgent)) {
    return {
      osName: 'Windows',
      osVersion: userAgent.match(/Windows NT ([0-9._]+)/)?.[1] ?? null,
    };
  }

  if (/Android/i.test(userAgent)) {
    return {
      osName: 'Android',
      osVersion: userAgent.match(/Android ([0-9._]+)/)?.[1] ?? null,
    };
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return {
      osName: 'iOS',
      osVersion:
        userAgent.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') ?? null,
    };
  }

  if (/Mac OS X/i.test(userAgent)) {
    return {
      osName: 'macOS',
      osVersion:
        userAgent.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') ?? null,
    };
  }

  return { osName: 'Linux', osVersion: null };
}

function detectBrowser(userAgent: string | null) {
  if (!userAgent) {
    return { browserName: null, browserVersion: null };
  }

  if (/Edg/i.test(userAgent)) {
    return {
      browserName: 'Edge',
      browserVersion: userAgent.match(/Edg\/([\d.]+)/)?.[1] ?? null,
    };
  }

  if (/Chrome/i.test(userAgent)) {
    return {
      browserName: 'Chrome',
      browserVersion: userAgent.match(/Chrome\/([\d.]+)/)?.[1] ?? null,
    };
  }

  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    return {
      browserName: 'Safari',
      browserVersion: userAgent.match(/Version\/([\d.]+)/)?.[1] ?? null,
    };
  }

  if (/Firefox/i.test(userAgent)) {
    return {
      browserName: 'Firefox',
      browserVersion: userAgent.match(/Firefox\/([\d.]+)/)?.[1] ?? null,
    };
  }

  return { browserName: null, browserVersion: null };
}

export const getClientContext = (): ClientContext => {
  const isBrowser =
    typeof window !== 'undefined' && typeof document !== 'undefined';

  if (!isBrowser) {
    return {
      page_url: null,
      referrer_url: null,
      client_user_agent: null,
      client_device_type: null,
      client_language: null,
      client_timezone: null,
      client_screen_width: null,
      client_screen_height: null,
      client_os_name: null,
      client_os_version: null,
      client_browser_name: null,
      client_browser_version: null,
      client_app_version: BM_APP_VERSION,
    };
  }

  const userAgent = navigator.userAgent || null;
  const { osName, osVersion } = detectOS(userAgent);
  const { browserName, browserVersion } = detectBrowser(userAgent);

  const deviceType = /Mobi|Android|iPhone|iPad/i.test(userAgent || '')
    ? 'mobile'
    : 'desktop';

  return {
    page_url: window.location.pathname,
    referrer_url: document.referrer || null,

    client_user_agent: userAgent,
    client_device_type: deviceType,

    client_language: navigator.language || null,
    client_timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || null,

    client_screen_width: window.screen?.width ?? null,
    client_screen_height: window.screen?.height ?? null,

    client_os_name: osName,
    client_os_version: osVersion,

    client_browser_name: browserName,
    client_browser_version: browserVersion,

    client_app_version: BM_APP_VERSION,
  };
};
