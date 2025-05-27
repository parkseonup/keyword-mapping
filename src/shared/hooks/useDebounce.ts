import { useEffect, useRef } from 'react';

// TODO: debounce 호출시 > key 만들어서 timer 쌓이게. 조회 가능하도록. 지금은 한 컴포넌트에서 하나만 쓸 수 있음.
export default function useDebounce() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (callback: TimerHandler, timeout?: number) => {
    clear();
    timerRef.current = setTimeout(callback, timeout);
  };

  const clear = () => {
    if (!timerRef.current) return;

    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return {
    debounce,
    clear,
  };
}
