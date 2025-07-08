import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();
/**
 * Deploy a smart contract to the blockchain
 * @param {string} contractBytecode - The compiled contract bytecode
 * @param {object} [options] - Deployment options
 * @param {string} [options.rpcUrl] - RPC endpoint URL
 * @param {number} [options.gasLimit] - Gas limit for deployment
 * @returns {Promise<string>} - Transaction hash
 */
async function deployContract(contractBytecode, options = {}) {
  const rpcUrl = options?.rpcUrl || process.env['RPC_URL'];
  const privateKey = process.env['PRIVATE_KEY'];
  const node = process.env['NODE_RPC_URL'];
  
  if (!rpcUrl || !privateKey || !node) {
    throw new Error('RPC URL and Private Key are required');
  }

  // Collect transaction parameters
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const nonce = await provider.getTransactionCount(wallet.address);

  const feeData = await provider.getFeeData();
  // alternatively, using our bootstraped node
  // Broadcast transaction to the network
  // const feeData = await fetch(node, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     id: 1,
  //     jsonrpc: "2.0",
  //     method: "eth_gasPrice", 
  //     params: []
  //   })
  // });

  const txParams = {
    data: '0x' + contractBytecode,
    // fuji test net chain id
    chainId: 43113,
    gasLimit: 300000,
    gasPrice: feeData.gasPrice?.toString() || 1,
    nonce: nonce,
  };

  console.log("txParams", txParams);

  // Sign transaction locally
  const signedTx = await wallet.signTransaction(txParams);
  console.log("Signed transaction:", signedTx);

  // Broadcast transaction to the network
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_sendRawTransaction", 
      params: [signedTx]
    })
  });

  const result = await response.json();
  
  if (result.error) {
    throw new Error(`Broadcast Error: ${result.error.message}`);
  }

  const txHash = result.result;
  console.log("Contract deployed →", txHash);

  // Get transaction receipt
  const receipt = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt", 
      params: [txHash]
    })
  });

  const receiptResult = await receipt.json();
  console.log("Receipt:", receiptResult);

  return txHash;
}


// Example usage:
const contractBytecode = "6080604052348015600e575f5ffd5b506101dc8061001c5f395ff3fe608060405234801561000f575f5ffd5b5060043610610029575f3560e01c8063c6888fa11461002d575b5f5ffd5b610047600480360381019061004291906100e5565b61005d565b604051610054919061011f565b60405180910390f35b5f5f60078361006c9190610165565b90507f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da8160405161009d919061011f565b60405180910390a180915050919050565b5f5ffd5b5f819050919050565b6100c4816100b2565b81146100ce575f5ffd5b50565b5f813590506100df816100bb565b92915050565b5f602082840312156100fa576100f96100ae565b5b5f610107848285016100d1565b91505092915050565b610119816100b2565b82525050565b5f6020820190506101325f830184610110565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61016f826100b2565b915061017a836100b2565b9250828202610188816100b2565b9150828204841483151761019f5761019e610138565b5b509291505056fea26469706673582212203a9f7465616e3b6406890dc708656cf00b1600d62628aba03173e9c18747472d64736f6c634300081e0033";

// Deploy the contract
deployContract(contractBytecode).catch(console.error);