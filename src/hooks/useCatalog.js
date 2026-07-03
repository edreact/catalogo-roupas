import { useEffect, useState } from 'react';
import { fetchCatalog } from '../services/catalogApi.js';

const initialCatalog = {
  products: [],
  categories: [],
  collections: [],
  config: {},
  banners: [],
  updatedAt: '',
  source: 'loading',
  error: '',
};

export default function useCatalog() {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      setIsLoading(true);
      const nextCatalog = await fetchCatalog();

      if (isMounted) {
        setCatalog(nextCatalog);
        setIsLoading(false);
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...catalog,
    isLoading,
    hasApiError: Boolean(catalog.error),
  };
}
