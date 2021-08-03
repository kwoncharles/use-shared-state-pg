import type { SetStateAction, Dispatch } from 'react';
import {
  useRef, useCallback, useEffect,
} from 'react';
import { useForceRender } from './hooks/useForceRender';

type Listener<T> = (state?: T) => void;
type Key = string;
type StoreState = {
  listeners: Set<Listener<any>>;
  data: any;
};

function createGlobalStore() {
  const store: Record<Key, StoreState> = {};

  return {
    createSharedState: <V>(key: Key, value: V) => {
      store[key] = {
        data: value,
        listeners: new Set(),
      };
    },
    getState: <V>(key: Key) => store[key].data as V,
    setState: <V>(key: Key, value: V) => {
      store[key].data = value;
      store[key].listeners.forEach((listener) => listener(value));
    },
    hasState: (key: Key) => key in store,
    subscribe: <V>(key: Key, listener: Listener<V>) => {
      store[key].listeners.add(listener);
    },
    unsubscribe: <V>(key: Key, listener: Listener<V>) => {
      store[key].listeners.delete(listener);
    },
  };
}

const isSameState = Object.is;

const store = createGlobalStore();

export function useSharedState<T>(
  key: string,
  initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const forceRender = useForceRender();

  if (!store.hasState(key)) {
    store.createSharedState(key, typeof initialState === 'function'
      ? (initialState as () => T)()
      : initialState);
  }
  const currentValue = store.getState<T>(key);

  const dataRef = useRef(currentValue);
  dataRef.current = currentValue;

  const setState = useCallback((
    state: T | ((prev: T) => T),
  ) => {
    const prev = store.getState<T>(key);
    const next = typeof state === 'function'
      ? (state as (v: T) => T)(prev)
      : state;

    if (!isSameState(prev, next)) {
      store.setState(key, next);
    }
  }, [key]);

  useEffect(() => {
    store.subscribe<T>(key, forceRender);

    return () => {
      /**
       * 현재 key를 사용하는 모든 component가 unmount되어 listener가 0개가 되었더라도
       * globalStore에 있는 데이터는 삭제하지 않는다. 같은 key로 접근했을 때 데이터를 유지해야하기 때문.
       * @TODO
       * 이걸 option으로 설정할 수 있게 해줘야할까?
       */
      store.unsubscribe<T>(key, forceRender);
    };
  }, [key, forceRender]);

  return [
    dataRef.current,
    setState,
  ];
}
