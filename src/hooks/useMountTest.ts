import { useEffect } from 'react';

export default function useMountTest(id: number | string) {
  useEffect(() => {
    console.log(`${id} mount`);
    return () => console.log(`${id} unmount`);
  }, []);
}