import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const rpcUrl = process.env['RPC_URL'];

/**
 * Format contract call data using ABI encoding
 * @param {string} functionName - The function name (e.g., "multiply")
 * @param {Array<string>} argTypes - Argument types (e.g., ["uint256"])
 * @param {Array<any>} argValues - Argument values (e.g., [6])
 * @param {string} contractAddress - The contract address
 * @returns {Promise<Object>} - Formatted transaction object
 */
async function formatContractCall(functionName, argTypes, argValues, contractAddress) {
  
  if (!rpcUrl) {
    throw new Error('RPC URL required');
  }

  // Assemble function signature
  const functionSignature = `${functionName}(${argTypes.join(',')})`;
  console.log("Function signature:", functionSignature);

  // Convert to hex format (web3_sha3 expects hex input)
  const hexSignature = '0x' + Buffer.from(functionSignature, 'utf8').toString('hex');
  console.log("Hex signature:", hexSignature);

  // Get web3_sha3 hash via HTTP
  const hashResponse = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "web3_sha3",
      params: [hexSignature]
    })
  });

  const hashResult = await hashResponse.json();
  const fullHash = hashResult.result;
  // Get first 4 bytes = 10 characters
  const functionSelector = fullHash.substring(0, 10);
  console.log("Function selector:", functionSelector);

  // Encode arguments
  let encodedArgs = '';
  for (let i = 0; i < argValues.length; i++) {
    const value = argValues[i];
    const type = argTypes[i];
    
    if (type === 'uint256' || type === 'uint') {
      // Pad to 32 bytes (64 hex characters)
      const hexValue = value.toString(16);
      const paddedValue = hexValue.padStart(64, '0');
      encodedArgs += paddedValue;
    }
  }

  // Combine function selector + encoded arguments
  const data = functionSelector + encodedArgs;
  console.log("Final data:", data);

  //  Return formatted transaction object
  return {
    to: contractAddress,
    data: data
  };
}

/**
 * Send the contract call transaction
 * @param {Object} txParams - Transaction parameters from formatContractCall
 * @returns {Promise<string>} - Transaction hash
 */
async function sendContractCall(txParams) {
    const privateKey = process.env['PRIVATE_KEY'];
    
    if (!privateKey || !rpcUrl) {
      throw new Error('RPC URL and Private Key are required');
    }
  
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const nonce = await provider.getTransactionCount(wallet.address);
    const feeData = await provider.getFeeData();
  
    // Build transaction object
    const tx = {
        // @ts-ignore
        to: txParams.to,
        // @ts-ignore
        data: txParams.data,
        chainId: 43113,
        gasLimit: 300000,
        gasPrice: feeData.gasPrice?.toString() || 1,
        nonce: nonce,
    };
  
    // Sign transaction locally
    const signedTx = await wallet.signTransaction(tx);

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
    return result.result;
}

/**
 * Get transaction receipt and decode logs
 * @param {string} txHash - Transaction hash
 * @returns {Promise<Object>} - Transaction receipt with decoded logs
 */
async function getTransactionReceipt(txHash) {
  if (!rpcUrl) {
    throw new Error('RPC URL is required');
  }
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txHash]
    })
  });

  const result = await response.json();
  
  if (result.error) {
    throw new Error(`Receipt Error: ${result.error.message}`);
  }

  const receipt = result.result;
  
  // Decode logs if they exist
  if (receipt && receipt.logs && receipt.logs.length > 0) {
    // @ts-ignore
    receipt.logs.forEach((log, index) => {
      console.log(`\nLog ${index}:`);
      console.log("Address:", log.address);
      console.log("Topics:", log.topics);
      console.log("Data:", log.data);
      
      // Decode the Print event data (expecting uint256)
      if (log.data && log.data.length > 2) {
        const hexValue = log.data;
        const decimalValue = parseInt(hexValue, 16);
        console.log("Decoded value:", decimalValue);
      }
    });
  }
  
  return receipt;
}

/**
 * Get contract bytecode to verify it exists
 * @param {string} contractAddress - Contract address
 * @returns {Promise<string>} - Contract bytecode
 */
async function getContractCode(contractAddress) {
  if (!rpcUrl) {
    throw new Error('RPC URL is required');
  }
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getCode",
      params: [contractAddress, "latest"]
    })
  });

  const result = await response.json();
  
  if (result.error) {
    throw new Error(`GetCode Error: ${result.error.message}`);
  }

  console.log("Contract code length:", result.result.length);
  console.log("Contract exists:", result.result !== '0x');
  
  return result.result;
}

// Example usage - calling multiply(6) function
async function callMultiplyFunction() {
  try {
    const contractAddress = "0xac76594ca8062be9a0430935d465c9e851e7f36c";
    
    // Check if contract exists
    console.log("Checking contract...");
    const exists = await getContractCode(contractAddress);
    if (!exists) {
      throw new Error("Contract does not exist");
    }
    
    // Format the contract call
    const txParams = await formatContractCall(
      "multiply",           // function name
      ["uint256"],         // argument types
      [6],                 // argument values
      contractAddress
    );
    
    // Send the transaction
    const txHash = await sendContractCall(txParams);
    console.log("Contract called →", txHash);
    
    // Wait a moment for the transaction to be mined
    console.log("Waiting for transaction to be mined...");
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Get the transaction receipt
    await getTransactionReceipt(txHash);
    
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
  }
}

// Run the example
callMultiplyFunction();