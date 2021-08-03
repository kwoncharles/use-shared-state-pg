import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T) {
  const valueRef = useRef<T>();

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef.current;
}
