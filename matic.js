const Web3 = require('web3');
const axios = require('axios');
const getABI = async (contractAddress) => {
  const API_KEY = '9PXNMQBI1241JAWJ23FPBPZPNDGNK8HDNN';
  try {
    const response = await axios.get(`https://api.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${API_KEY}`);
    return JSON.parse(response.data.result);
  } catch (e) {
    return null;
  }
}

const sendTransaction = async (data) => {
  const toAddress = data.to;
  const amount = data.amount;
  const privateKey = data.privateKey;
  const providerUrl = 'https://polygon.llamarpc.com';
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.add(account)
  const txObject = {
    to: toAddress,
    value: Web3.utils.toWei(amount.toString(), "ether"),
    gasPrice: Web3.utils.toHex(Web3.utils.toWei("5", "gwei")),
    gasLimit: Web3.utils.toHex(21000)
  };

  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

  const rawTx = signedTx.rawTransaction;
  const tx = await web3.eth.sendSignedTransaction(rawTx);

  return `https://polygonscan.com/tx/${tx.transactionHash}`;
}

const sendToken = async (data) => {
  const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon.llamarpc.com'));

  const privateKey = data.privateKey;
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const contractAddress = data.contractAddress;
  const contractABI = await getABI(contractAddress);
  if (!contractABI) return 'TX FAILED!'
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const txData = await contract.methods.transfer(data.to, web3.utils.toWei(data.amount.toString(), 'ether')).encodeABI();
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 200000;
  const nonce = await web3.eth.getTransactionCount(account.address);

  const txObject = {
    to: contractAddress,
    data: txData,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    nonce: nonce,
  };

  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return `https://polygonscan.com/tx/${txReceipt.transactionHash}`;
};

module.exports = { getABI, sendTransaction, sendToken };
