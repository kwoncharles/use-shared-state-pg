import { useSharedState } from '@/useSharedState';
import { useUtilityState } from '@/hooks/useUtilityState';

export default function Home() {
  const [showFirst, toggleFirst] = useUtilityState(true, 'toggle');
  const [showSecond, toggleSecond] = useUtilityState(true, 'toggle');

  return (
    <div>
      {showFirst && (
        <First />
      )}
      {showSecond && (
        <Second />
      )}
      <button
        type="button"
        onClick={toggleFirst}
      >
        toggle first visibility
      </button>
      <button
        type="button"
        onClick={toggleSecond}
      >
        toggle second visibility
      </button>
    </div>
  );
}

function First() {
  const [count, setCount] = useSharedState('counter', 0);
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
  const [count, setCount] = useSharedState('counter', 0);
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
