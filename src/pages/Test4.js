import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import {ERC20ABI as abi} from "./abi/ERC20ABI"
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";


function App() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { account, library, chainId } = useWeb3React();

  console.log(account);
  console.log(library);
  console.log(chainId);

  const tokenAddress = '0x8416628D411992996a4fD5C4A568E1f61d288407'; // company
  //const tokenAddress = '0x1CBBdD12BB66535AE934bD263e896015c1697100'; // home
  

  async function transfer() {
    try {
      const tokenContract = new Contract(tokenAddress, abi, library.getSigner());

      const tx = await tokenContract.transfer(recipient, amount);

      const gas = await tx.estimateGas();

      await tx.send({ from: account, gas });

      console.log('Transaction sent.');
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  }

  return (
    <div>
      <h1>Transfer Tokens  </h1> <p>{`Account: ${account}`}</p>
      <div>
        <label>Recipient:</label>
        <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      </div>
      <div>
        <label>Amount:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button onClick={transfer}>Transfer</button>

    </div>
  );
}

function getLibrary(provider) {
  const library = new Web3(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function Web3App() {
  return (
    
      <App />
    
  );
}
