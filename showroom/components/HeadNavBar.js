import styles from '../styles/Home.module.css';
import { FaStore } from "react-icons/fa";

function ConnectMetaMaskButton({buttonText}) {
    return <button className={"btn btn-warning btn-lg"}>{buttonText}</button>
}

function WalletConnectButton({buttonText}) {
    return <button className={"disabled btn btn-warning btn-lg"}>{buttonText}</button>
}

function HeadNavBar({brandName, metaMaskText, walletConnectText}) {
    return ( 
    <div className={"brand"}><h1><FaStore />{brandName}</h1>
        <div className={"connect"}>
            <WalletConnectButton buttonText={walletConnectText} />{' '}
            <ConnectMetaMaskButton buttonText={metaMaskText} />
        </div>
    </div>)
}

export { HeadNavBar }