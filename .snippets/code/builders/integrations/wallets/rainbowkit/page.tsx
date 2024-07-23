import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <ConnectButton />
    </div>
  );
}
