import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { HeadNavBar } from "../components/HeadNavBar.js";
import { NFTContainer } from "../components/NFTContainer.js";

export default function Home() {
  return (
    <div className={styles.container}>
        <Head>
            <title>NFT Showroom</title>
            <meta name="description" content="Showroom for the NFTs in your wallet" />
            <meta charSet="UTF-8" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
            <HeadNavBar brandName="Showroom" metaMaskText="Metamask" walletConnectText="WalletConnect" />
            <NFTContainer />
        </main>

        <footer className={styles.footer}>
            created with &#128156;
        </footer>
    </div>
  )
}
