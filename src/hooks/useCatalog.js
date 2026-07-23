import { getCatalog } from '../services/catalogApi.js';

export default function useCatalog() {
  const catalog = getCatalog();

  return {
    ...catalog,
    isLoading: false,
    hasApiError: Boolean(catalog.error),
  };
}
