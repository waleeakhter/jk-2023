import { useEffect } from 'react';

const useBodyScrollLock = (lock : boolean) => {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Clean up the effect when the component unmounts or lock changes
    return () => {
      document.body.style.overflow = '';
    };
  }, [lock]);
};

export default useBodyScrollLock;
