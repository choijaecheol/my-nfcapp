import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import { Contract } from '@ethersproject/contracts';
import {ERC20ABI as abi} from "./abi/ERC20ABI"

const useBalanceOf = (tokenAddress, account) => {
  const { library, chainId } = useWeb3React();
  const [balance, setBalance] = useState();

  useEffect(() => {
    if (!!account && !!library) {
      const contract = new Contract(tokenAddress, abi, library.getSigner());
      contract.balanceOf(account).then((balance) => {
        setBalance(balance);
      }).catch((error) => {
        console.error(`Failed to fetch balance: ${error}`);
      });
    }
  }, [account, library, chainId, tokenAddress]);

  return balance;
};

export default useBalanceOf;
