import { useState } from 'react';

export function useSetToggle<T>() {
  const [selected, setSelected] = useState<Set<T>>(new Set());

  const toggle = (item: T) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const clear = () => {
    setSelected(new Set());
  };

  return { selected, toggle, clear };
}
