import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import {ERC20ABI as abi} from "./abi/ERC20ABI" // ERC721 컨트랙트 ABI를 가져옵니다.

// NFT 스마트 컨트랙트 주소를 사용하여 상수를 정의하십시오.
const NFT_CONTRACT_ADDRESS = '0xCDAF6920687Da6602431a194aAB1645936A031bF';

function Test2() {
  const { library, account } = useWeb3React();
  const [tokenId, setTokenId] = useState('');

  const buyNFT = async () => {
    if (!library || !account) {
      alert('Please connect to MetaMask first.');
      return;
    }

    // 라이브러리에서 서명자를 가져옵니다.
    const signer = library.getSigner();

    // 서명자를 사용하여 NFT 컨트랙트 인스턴스를 생성합니다.
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

    // NFT 구매 함수를 호출합니다. 이 예에서는 'buyToken'이라고 가정합니다.
    try {
      const buyTx = await nftContract.buyToken(tokenId, {
        value: ethers.parseEther('0.1'), // 구매 가격을 wei 단위로 전달합니다.
        gasLimit: 300000 // 필요한 경우 가스 한도를 설정할 수 있습니다.
      });
      await buyTx.wait();
      alert('NFT successfully purchased!');
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Error purchasing NFT');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="Enter Token ID"
      />
      <button onClick={buyNFT}>
        Buy NFT
      </button>
    </div>
  );
}

export default Test2;
