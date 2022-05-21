import styles from '../styles/Home.module.css';

function NFTContainer({children}) {
    return <div className={styles.nftcontainer + " border border-warning" }>{children}</div>
}

export { NFTContainer }