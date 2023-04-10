import { useEffect, useState } from "react";
//import Web3 from "web3/dist/web3.min.js";
import Web3 from 'web3';

const useWeb3 = () => {
    const [account, setAccount] = useState(null);
    const [web3, setWeb3] = useState(null);
    
    const getChainId = async() => {
    	const chainId = await window.ethereum.request({
            method: "eth_chainId",
        });
        return chainId; // 메타마스크 네트워크를 바꾸면 이 chainId도 바뀐다.
    };
    
    const getReqAccts = async() => {
    	const acct = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        return acct; // 메타마스크 계정 연결 팝업이 뜨고 프론트와 연결할 계정을 선택해주면 계정#가 찍힌다
    };
    
    const addNetwork = async (chainId) => {
      const network = {
        chainId,
        chainName: "yjGanache",
        rpcUrls: ["http://127.0.0.1:8545"],
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
        },
      };
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [network],
    });
  };
    // useEffect 훅스에는 async 구문을 쓰지 못하므로 함수 init으로 따로 뺌
    useEffect(()=>{
     const init = async() => {
     try{
        const targetChainId = "0x1e2a";
        const chainId = await getChainId();
        if (targetChainId !== chainId) {
          addNetwork(targetChainId);
        }
        const [account] = await getReqAccts(); // 결과물이 배열로 떨어져서 구조분해할당
        const web3 = new Web3(window.ethereum);
    
        setAccount(account);
        setWeb3(web3);
        
      }catch(e){
        console.error(e.message);
       }
     }
     // 메타마스크가 설치되있다면,
     if(window.ethereum){
     	init();
     }else{
     // 설치 안 된사람에게 실행할 부분
     }
    },[])
    
    return [account, web3];
}

export default useWeb3;