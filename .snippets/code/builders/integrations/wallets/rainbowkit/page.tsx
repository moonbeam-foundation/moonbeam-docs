import Image from 'next/image';
import styles from './page.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className={styles.main}>
      <ConnectButton />
    </div>
  );
}
