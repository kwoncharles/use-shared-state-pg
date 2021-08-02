/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  useState, useEffect, useCallback, useRef, Dispatch, SetStateAction,
} from 'react';

export default function Home() {
  const [showFirst, setShowFirst] = useState(true);
  const [show, setShow] = useState(true);

  return (
    <div>
      {showFirst && (
        <First />
      )}
      {show && (
        <Second />
      )}
      <button
        type="button"
        onClick={() => setShowFirst((prev) => !prev)}
      >
        toggle first visibility
      </button>
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
      >
        toggle second visibility
      </button>
    </div>
  );
}

function First() {
  const [count, setCount] = useSharedState('1', 0);
  console.log('first renders');

  return (
    <div>
      first:
      {count}
      <br />
      <button
        type="button"
        onClick={() => setCount((prev) => prev + 1)}
      >
        increase
      </button>
      <br />
      <button
        type="button"
        onClick={() => setCount(count)}
      >
        stay
      </button>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

function Second() {
  const [count, setCount] = useSharedState('1', 0);
  console.log('second renders');

  return (
    <div>
      second:
      {count}
      <br />
      <button
        type="button"
        onClick={() => setCount((prev) => prev + 1)}
      >
        increase
      </button>
      <br />
      <button
        type="button"
        onClick={() => setCount(count)}
      >
        stay
      </button>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

const globalStore: {
  [key: string]: {
    data: any,
    listeners: Array<(data?: any) => void>,
  },
} = {};

const isSameState = Object.is;

function useSharedState<T>(
  key: string,
  initialState: T,
): [T, Dispatch<SetStateAction<T>>] {
  const forceRender = useForceRender();

  if (!(key in globalStore)) {
    globalStore[key] = {
      data: initialState,
      listeners: [],
    };
  }

  const dataRef = useRef(globalStore[key].data);
  dataRef.current = globalStore[key].data;

  const setState = useCallback((
    state: T | ((prev: T) => T),
  ) => {
    const prev = globalStore[key].data;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const next = typeof state === 'function' ? state(prev) : state;

    if (!isSameState(prev, next)) {
      globalStore[key].data = next;
      dataRef.current = next;

      globalStore[key].listeners.forEach((fn) => {
        fn(next);
      });
    }
  }, [key]);

  useEffect(() => {
    function onListen() {
      forceRender();
    }
    globalStore[key].listeners.push(onListen);

    return () => {
      const idx = globalStore[key].listeners.indexOf(onListen);
      globalStore[key].listeners.splice(idx, 1);
      /**
       * listener가 0개가 되었더라도 (현재 key를 이용하고 있는 컴포넌트가 모두 unmount되었더라도 globalStore에 있는 데이터는 삭제하지 않는다.)
       * 같은 key로 접근했을 때 데이터를 유지해야하기 때문.
       * @TODO
       * 이걸 option으로 설정할 수 있게 해줘야할까?
       */
    };
  }, [key, forceRender]);

  return [
    dataRef.current,
    setState,
  ];
}

function useForceRender() {
  const [, setState] = useState(0);

  return useCallback(() => setState((prev) => prev + 1), []);
}
