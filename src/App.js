import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';


function App() {
  const [balance, setBalance] = useState(0); //balance 변수 초기값 0
  let [isConnect, setIsConnect] = useState(false);
  let [account, setAccount] = useState(''); //balance 변수 초기값 0

  // MetaMask를 통해 사용자에게 승인을 요청합니다.
  // 승인 요청 버튼을 클릭하면 requestAccounts 함수를 실행합니다.
  const requestAccounts = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts: ', accounts);
      setIsConnect(true) //이미 접속되어 있으면 true 로 변경.
    } catch (error) {
      console.error(error);
    }
  };

  //useEffect( ()=>{}, [] ) 이 때는 화면이 처음 나타났을 때 한 번만 실행된다.  
  useEffect(() => {
    async function getBalance() {
      //web3 객체 생성.
      const web3 = new Web3(
        window.ethereum || 'http://localhost:8545'
      );

      // Metamask 라이브러리가 설치되어 있는지 확인합니다.
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
      }

      
      //현재 계정을 가져오기.
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      console.log('currentAccount : ' + currentAccount);

      if (typeof currentAccount !== 'undefined') {      
          setIsConnect(true) //이미 접속되어 있으면 true 로 변경.
          const weiBalance = await web3.eth.getBalance(currentAccount);
          const etherBalance = web3.utils.fromWei(weiBalance, 'ether');
          setBalance(etherBalance); //이더리움 잔액세팅.
          setAccount(currentAccount); //계정 세팅.
      }  
      
      
    }
    getBalance();
  }, []);

  return (
    <div>
      {!isConnect && (<button onClick={requestAccounts}> try metamask connect </button>)}
      
      {isConnect && (<p>안녕하세요 {account} 님. 현재 계정의 잔액: {balance} ETH</p>)}
      
    </div>
  );
}

export default App;

