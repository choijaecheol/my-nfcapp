const Web3 = require('web3');

// Check if MetaMask is installed and unlocked
if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
  // Connect to MetaMask
  const web3 = new Web3(window.ethereum);

  // Request account access if needed
  window.ethereum.enable()
    .then(() => {
      // Get the selected account
      return web3.eth.getAccounts();
    })
    .then((accounts) => {
      const account = accounts[0];

      const tokenAddress = '0xCDAF6920687Da6602431a194aAB1645936A031bF'; // Replace with the ERC-20 token contract address
      const recipient = '0xfa45031CfF019BF84588309EB2CbE1f0d68a4298'; // Replace with the recipient's address
      const amount = '500'; // Replace with the amount of tokens to transfer (in wei)

      const contractABI = [
        // Replace with the ERC-20 contract ABI
        // ...
      ];
      const contract = new web3.eth.Contract(contractABI, tokenAddress);

      const tx = contract.methods.transfer(recipient, amount);

      tx.estimateGas({ from: account })
        .then((gas) => {
          // Sign and send the transaction using MetaMask
          return window.ethereum.send({
            from: account,
            to: tokenAddress,
            gas: gas,
            data: tx.encodeABI(),
          });
        })
        .then((result) => {
          console.log('Transaction result:', result);
        })
        .catch((error) => {
          console.error('Error sending transaction:', error);
        });
    })
    .catch((error) => {
      console.error('Error connecting to MetaMask:', error);
    });
} else {
  console.error('MetaMask is not installed or not unlocked.');
}
