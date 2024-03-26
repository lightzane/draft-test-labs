import { ReactNode, useEffect, useRef } from 'react';
import styles from './scrolly.module.css';

type Props = {
  /** @default 'left' */
  direction?: 'left' | 'right';
  children: ReactNode;
};

export default function AppScrolly(props: Readonly<Props>) {
  const { children, direction = 'left' } = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && direction) {
      ref.current.setAttribute('data-direction', direction);
    }
  }, [ref, direction]);

  // * Simulates an animation of infinite scroll horizontally
  return (
    // Scrolly container
    <div className={styles.scrolly}>
      <div className={styles.scrollyInner} ref={ref}>
        {/* Display "twice" to simulate infinite scrolling */}
        {children}
        {children}
        {/* See scrolly.module.css for the animation part */}
      </div>
    </div>
  );
}
