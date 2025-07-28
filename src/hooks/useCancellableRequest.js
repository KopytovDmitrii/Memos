import { useRef, useCallback } from 'react';

export const useCancellableRequest = () => {
  const abortControllerRef = useRef(null);

  const makeCancellableRequest = useCallback(async (requestFn) => {
    // Отменяем предыдущий запрос, если он есть
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    try {
      const result = await requestFn(abortControllerRef.current.signal);
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Запрос был отменен');
        throw new Error('Запрос был отменен пользователем');
      }
      throw error;
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    makeCancellableRequest,
    cancelRequest
  };
}; 