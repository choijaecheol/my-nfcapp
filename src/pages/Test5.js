import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import NFT_CONTRACT_ABI from './SampleERC20.json'; // ERC20.json 파일을 가져옵니다.

// NFT 스마트 컨트랙트 주소 및 ABI를 사용하여 상수를 정의하십시오.
const NFT_CONTRACT_ADDRESS = '0xCDAF6920687Da6602431a194aAB1645936A031bF';


function MintNFTButton() {
  const { library, account } = useWeb3React();

  const mintNFT = async () => {
    if (!library || !account) {
      alert('Please connect to MetaMask first.');
      return;
    }

    // 라이브러리에서 서명자를 가져옵니다.
    const signer = library.getSigner();

    // 서명자를 사용하여 NFT 컨트랙트 인스턴스를 생성합니다.
    //const tokenContract = new Contract(tokenAddress, erc20ABI, library.getSigner());
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);

    // NFT를 민팅하려는 함수를 호출합니다. 이 예에서는 'mint'라고 가정합니다.
    try {
      const mintTx = await nftContract.mint(account);
      await mintTx.wait();
      alert('NFT successfully minted!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Error minting NFT');
    }
  };

  return (
    <button onClick={mintNFT}>
      Mint NFT
    </button>
  );
}

export default MintNFTButton;
