import { useReducer } from 'react';

export function useForceRender() {
  const [, dispatch] = useReducer((prev) => !prev, true);

  return dispatch;
}
