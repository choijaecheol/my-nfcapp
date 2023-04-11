import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MyNFT from './MyNFT.json';

const Test2 = () => {
    const [account, setAccount] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function connectWallet() {
      if (!window.ethereum) {
        alert('이더리움 지갑을 설치해주세요.');
        return;
      }
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        console.log('이더리움 지갑에 로그인해주세요.');
      }
    }
    connectWallet();
  }, []);

  useEffect(() => {
    async function loadContract() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MyNFT.networks[networkId]; //error 위치...1337
      const contract = new web3.eth.Contract(MyNFT.abi, deployedNetwork.address);
      setNftContract(contract);
    }
    loadContract();
  }, []);

  useEffect(() => {
    async function getNfts() {
      if (nftContract) {
        const nftCount = await nftContract.methods.totalSupply().call();
        const nftList = [];
        for (let i = 1; i <= nftCount; i++) {
          const nftId = await nftContract.methods.tokenByIndex(i - 1).call();
          const nft = await nftContract.methods.getNft(nftId).call();
          nftList.push(nft);
        }
        setNfts(nftList);
      }
    }
    getNfts();
  }, [nftContract]);

  async function buyNft(nft) {
    if (nftContract) {
      const price = nft.price;
      const tx = {
        from: account,
        to: nftContract.options.address,
        value: price,
      };
      await window.ethereum.request({ method: 'eth_sendTransaction', params: [tx] });
      const txHash = await nftContract.methods.buyNft(nft.id).send({ from: account });
      console.log(`트랜잭션 해시: ${txHash.transactionHash}`);
    }
  }

  return (
    <div>
      <h1>NFT 거래 사이트</h1>
      <div>계정: {account}</div>
      <ul>
        {nfts.map(nft => (
          <li key={nft.id}>
            <img src={nft.image} alt={nft.name} width={200} />
            <h3>{nft.name}</h3>
            <p>{nft.description}</p>
            <p>{Web3.utils.fromWei(nft.price, 'ether')} ETH</p>
            <button onClick={() => buyNft(nft)}>구매하기</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test2;