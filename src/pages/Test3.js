import useWeb3 from "./hooks/useWeb3";
import React, { useState, useEffect } from 'react';

const Test3 = () => {
  const [account, web3] = useWeb3();
    const [isLogin, setIsLogin] = useState(false);
    const [balance, setBalance] = useState(0);

  useEffect(() => {
    const init = async () => {
      // ? 를 씀으로써 web3가 null값일때의 에러를 대비해줌
      const balance = await web3?.eth.getBalance(account);
      setBalance(balance / 10 ** 18);
    };
    if (account) setIsLogin(true);
    init();
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx = {
      from: account,
      to: e.target.recipient.value,
      value: web3.utils.toWei(e.target.amount.value, "ether"),
    };
    await web3.eth.sendTransaction(tx);
  };
  if (!isLogin) return <div>메타마스크 로그인 후 사용해주세요</div>;
  return (
    <div>
      <div>
        <h2>{account}님 환영합니다.</h2>
        <div>Balance : {balance} ETH </div>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" id="recipient" placeholder="받을 계정" />
          <input type="number" id="amount" placeholder="보낼 금액" />
          <input type="submit" value="전송" />
        </form>
      </div>
    </div>
  );
};

export default Test3;