import dotenv from 'dotenv';
dotenv.config();
/**
 * Fetch a transaction receipt for a contract
 * @param {string} txHash - The transaction hash
 * @returns {Promise<Object>} - The receipt object
 */
async function fetchReceipt(txHash) {
  const rpcUrl = process.env['RPC_URL'];
  const node = process.env['NODE_RPC_URL'];
  
  if (!rpcUrl) {
    throw new Error('RPC URL required');
  }

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

  return receiptResult;
}


// Example usage:
const txReceipt = "0xc0ea899205433ffd48820ed627d7be955590b813c228c4b5a4aedb971cf1b7c1";

// Deploy the contract
fetchReceipt(txReceipt).catch(console.error);