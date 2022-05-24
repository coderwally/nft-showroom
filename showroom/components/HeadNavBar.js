import styles from '../styles/Home.module.css';
import { FaStore } from "react-icons/fa";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import Web3Modal from "web3modal";

import WalletConnect from "@walletconnect/web3-provider";

const providerOptions = {
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: process.env.INFURA_KEY // required
    }
  }
};

const networkParams = {
    "0x63564c40": {
      chainId: "0x63564c40",
      rpcUrls: ["https://api.harmony.one"],
      chainName: "Harmony Mainnet",
      nativeCurrency: { name: "ONE", decimals: 18, symbol: "ONE" },
      blockExplorerUrls: ["https://explorer.harmony.one"],
      iconUrls: ["https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png"]
    },
    "0xa4ec": {
      chainId: "0xa4ec",
      rpcUrls: ["https://forno.celo.org"],
      chainName: "Celo Mainnet",
      nativeCurrency: { name: "CELO", decimals: 18, symbol: "CELO" },
      blockExplorerUrl: ["https://explorer.celo.org"],
      iconUrls: [
        "https://celo.org/images/marketplace-icons/icon-celo-CELO-color-f.svg"
      ]
    }
  };
  
  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions // required
  });

function ConnectMetaMaskButton({buttonText}) {
    return <button className={"btn btn-warning btn-lg"}>{buttonText}</button>
}

function WalletConnectButton({buttonText}) {
    return <button className={"disabled btn btn-warning btn-lg"}>{buttonText}</button>
}

function HeadNavBar({brandName, metaMaskText, walletConnectText}) {

    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");
    const [chainId, setChainId] = useState();
    const [network, setNetwork] = useState();
    const [message, setMessage] = useState("");
    const [signedMessage, setSignedMessage] = useState("");
    const [verified, setVerified] = useState();
  
    const connectWallet = async () => {
      try {
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const accounts = await library.listAccounts();
        const network = await library.getNetwork();
        setProvider(provider);
        setLibrary(library);
        if (accounts) setAccount(accounts[0]);
        setChainId(network.chainId);
      } catch (error) {
        setError(error);
      }
    };
  
    const handleNetwork = (e) => {
      const id = e.target.value;
      setNetwork(Number(id));
    };
  
    const handleInput = (e) => {
      const msg = e.target.value;
      setMessage(msg);
    };
  
    const switchNetwork = async () => {
      try {
        await library.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(network) }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await library.provider.request({
              method: "wallet_addEthereumChain",
              params: [networkParams[toHex(network)]]
            });
          } catch (error) {
            setError(error);
          }
        }
      }
    };
  
    const signMessage = async () => {
      if (!library) return;
      try {
        const signature = await library.provider.request({
          method: "personal_sign",
          params: [message, account]
        });
        setSignedMessage(message);
        setSignature(signature);
      } catch (error) {
        setError(error);
      }
    };
  
    const verifyMessage = async () => {
      if (!library) return;
      try {
        const verify = await library.provider.request({
          method: "personal_ecRecover",
          params: [signedMessage, signature]
        });
        setVerified(verify === account.toLowerCase());
      } catch (error) {
        setError(error);
      }
    };
  
    const refreshState = () => {
      setAccount();
      setChainId();
      setNetwork("");
      setMessage("");
      setSignature("");
      setVerified(undefined);
    };
  
    const disconnect = async () => {
      await web3Modal.clearCachedProvider();
      refreshState();
    };
  
    useEffect(() => {
      if (web3Modal.cachedProvider) {
        connectWallet();
      }
    }, []);
  
    useEffect(() => {
      if (provider?.on) {
        const handleAccountsChanged = (accounts) => {
          console.log("accountsChanged", accounts);
          if (accounts) setAccount(accounts[0]);
        };
  
        const handleChainChanged = (_hexChainId) => {
          setChainId(_hexChainId);
        };
  
        const handleDisconnect = () => {
          console.log("disconnect", error);
          disconnect();
        };
  
        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);
  
        return () => {
          if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
            provider.removeListener("disconnect", handleDisconnect);
          }
        };
      }
    }, [provider]);
        
    return ( 
    <div className={"brand"}><h1><FaStore />{brandName}</h1>
        <div className={"connect"}>
            <WalletConnectButton buttonText={walletConnectText} />{' '}
            <ConnectMetaMaskButton buttonText={metaMaskText} />
        </div>
    </div>)
}

export { HeadNavBar }