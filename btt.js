const Web3 = require('web3');
const axios = require('axios');
const getABI = async (contractAddress) => {
  const API_KEY = 'U3UZ9S6AB8XVWH81EBMZTR7RZKNVUF154Y';
  try {
    const response = await axios.get(`https://api-testnet.bttcscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${API_KEY}`);
    return JSON.parse(response.data.result);
  } catch (e) {
    return null;
  }
}

const sendTransaction = async (data) => {
  const toAddress = data.to;
  const amount = data.amount.toString();
  const privateKey = data.privateKey;
  const providerUrl = 'https://pre-rpc.bt.io';
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.add(account)
  const txObject = {
    to: toAddress,
    value: web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18))),
    gasPrice: await web3.eth.getGasPrice(),
    gasLimit: 200000
  };

  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

  const rawTx = signedTx.rawTransaction;
  const tx = await web3.eth.sendSignedTransaction(rawTx);
  //console.log(await web3.eth.getTransactionReceipt)
  return `https://testnet.bttcscan.com/tx/${tx.transactionHash}`;
}

const sendToken = async (data) => {
  const web3 = new Web3(new Web3.providers.HttpProvider('https://pre-rpc.bt.io'));

  const privateKey = data.privateKey;
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const contractAddress = data.contractAddress;
  const contractABI = await getABI(contractAddress);
  if (!contractABI) return 'TX FAILED!'
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const value = web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(6)))
  const txData = await contract.methods.transfer(data.to, value).encodeABI();
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 200000;
  const nonce = await web3.eth.getTransactionCount(account.address);

  const txObject = {
    to: contractAddress,
    data: txData,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    nonce: nonce + 1,
  };

  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return `https://testnet.bttcscan.com/tx/${txReceipt.transactionHash}`;
};

module.exports = { getABI, sendTransaction, sendToken };