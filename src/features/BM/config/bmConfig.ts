// src/features/BM/config/bmConfig.ts

// .env frontend:
// REACT_APP_BM_TENANT_ZONE=HA_NOI
// REACT_APP_BM_API_BASE_URL=https://api.domain.com/bm
// REACT_APP_VERSION=1.0.0

const TENANT_ENV = process.env.REACT_APP_TENANT_ZONE;
const API_BASE_ENV = process.env.REACT_APP_BM_API_BASE_URL;
const APP_VERSION_ENV = process.env.REACT_APP_VERSION;

export const BM_TENANT_ZONE = (TENANT_ENV || 'HA_NOI') as string;

// Base URL cho BM backend (nếu không set thì dùng /bm với proxy)
export const BM_API_BASE_URL = (API_BASE_ENV || '/bm') as string;

// Version của frontend app – sẽ map vào client_app_version
export const BM_APP_VERSION = (APP_VERSION_ENV || 'unknown') as string;
