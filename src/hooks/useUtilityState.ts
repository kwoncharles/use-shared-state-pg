import type { Dispatch, SetStateAction } from 'react';
import {
  useState, useCallback, useReducer, useEffect,
} from 'react';
import { usePrevious } from './usePrevious';

type ReactDispatchFn<T> = Dispatch<SetStateAction<T>>;

type UtilityType =
  | 'toggle'
  | 'open-close'
  | 'counter';

export function useUtilityState<T>(
  initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>];

export function useUtilityState(
  initialState: boolean | (() => boolean),
  type: 'toggle'
): [boolean, () => void];

export function useUtilityState(
  initialState: boolean | (() => boolean),
  type: 'open-close'
): [boolean, { open: () => void; close: () => void }];

export function useUtilityState(
  initialState: number | (() => number),
  type: 'counter'
): [number, { increase: () => void; decrease: () => void }];

export function useUtilityState<T>(
  initialState: T | (() => T),
  type?: UtilityType,
) {
  const [state, setState] = useState(initialState);
  const prevType = usePrevious(type);

  const setTrue = useCallback(() => {
    (setState as unknown as ReactDispatchFn<boolean>)(true);
  }, []);

  const setFalse = useCallback(() => {
    (setState as unknown as ReactDispatchFn<boolean>)(false);
  }, []);

  const toggleState = useCallback(() => {
    (setState as unknown as ReactDispatchFn<boolean>)((prev) => !prev);
  }, []);

  const increase = useCallback(() => {
    (setState as unknown as ReactDispatchFn<number>)((prev) => prev + 1);
  }, []);

  const decrease = useCallback(() => {
    (setState as unknown as ReactDispatchFn<number>)((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (type !== prevType) {
      setState(initialState);
    }
  }, [type, prevType, initialState]);

  if (type === 'toggle') {
    return [state, toggleState];
  }

  if (type === 'open-close') {
    return [state, {
      open: setTrue,
      close: setFalse,
    }];
  }

  if (type === 'counter') {
    return [state, {
      increase,
      decrease,
    }];
  }

  return [state, setState];
}

type Setter<T> = (prev: T) => T;

type Action<T> =
  | { type: 'toggle' }
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'increase' }
  | { type: 'decrease' }
  | { type: 'set', value: T | Setter<T> };

export function useUtilityStateReducer<T>(
  initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>];

export function useUtilityStateReducer(
  initialState: boolean | (() => boolean),
  type: 'toggle'
): [boolean, () => void];

export function useUtilityStateReducer(
  initialState: boolean | (() => boolean),
  type: 'open-close'
): [boolean, { open: () => void; close: () => void }];

export function useUtilityStateReducer(
  initialState: number | (() => number),
  type: 'counter'
): [number, { increase: () => void; decrease: () => void }];

export function useUtilityStateReducer<T>(
  initialState: T | (() => T),
  type?: UtilityType,
) {
  const [state, dispatch] = useReducer(
    (prevState: T, action: Action<T>) => {
      switch (action.type) {
        case 'close':
          return false;
        case 'open':
          return true;
        case 'increase':
          return (prevState as unknown as number) + 1;
        case 'decrease':
          return (prevState as unknown as number) - 1;
        case 'set':
          // eslint-disable-next-line no-case-declarations
          const val = action.value;
          return typeof val === 'function'
            ? (val as Setter<T>)(prevState)
            : val;
        default:
          return prevState;
      }
    },
    typeof initialState === 'function'
      ? (initialState as (() => T))()
      : initialState,
  );

  const setState = useCallback((newState: T) => {
    dispatch({ type: 'set', value: newState });
  }, []);

  const setTrue = useCallback(() => {
    dispatch({ type: 'open' });
  }, []);

  const setFalse = useCallback(() => {
    dispatch({ type: 'close' });
  }, []);

  const toggleState = useCallback(() => {
    dispatch({ type: 'toggle' });
  }, []);

  const increase = useCallback(() => {
    dispatch({ type: 'increase' });
  }, []);

  const decrease = useCallback(() => {
    dispatch({ type: 'decrease' });
  }, []);

  if (type === 'toggle') {
    return [state, toggleState];
  }

  if (type === 'open-close') {
    return [state, {
      open: setTrue,
      close: setFalse,
    }];
  }

  if (type === 'counter') {
    return [state, {
      increase,
      decrease,
    }];
  }

  return [state, setState];
}
