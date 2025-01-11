import { Keypair } from "@solana/web3.js";

export async function uploadMetadata(
    tokenName: string,
    tokenTicker: string,
    description: string,
    imageUrl: string,
    options?: {
      twitter?: string;
      telegram?: string;
      website?: string;
    }
  ): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("name", tokenName);
    formData.append("symbol", tokenTicker);
    formData.append("description", description);
    formData.append("showName", "true");
  
    if (options?.twitter) formData.append("twitter", options.twitter);
    if (options?.telegram) formData.append("telegram", options.telegram);
    if (options?.website) formData.append("website", options.website);
  
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const files = {
      file: new File([imageBlob], "token_image.png", { type: "image/png" })
    };
  
    const finalFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      finalFormData.append(key, value);
    }
    if (files?.file) {
      finalFormData.append("file", files.file);
    }
  
    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: finalFormData,
    });
  
    if (!metadataResponse.ok) {
      throw new Error(`Metadata upload failed: ${metadataResponse.statusText}`);
    }
  
    return metadataResponse.json();
  }
  
export async function createTokenTransaction(
    walletAddress: string,
    mintKeypair: Keypair,
    metadataResponse: any,
    options: {
      initialLiquiditySOL: number;
      slippageBps: number;
      priorityFee: number;
    }
  ) {
    const payload = {
      publicKey: walletAddress,
      action: "create",
      tokenMetadata: {
        name: metadataResponse.metadata.name,
        symbol: metadataResponse.metadata.symbol,
        uri: metadataResponse.metadataUri,
      },
      mint: mintKeypair.publicKey.toBase58(),
      denominatedInSol: "true",
      amount: options.initialLiquiditySOL,
      slippage: options.slippageBps,
      priorityFee: options.priorityFee,
      pool: "pump",
    };
  
    const response = await fetch("https://pumpportal.fun/api/trade-local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transaction creation failed: ${response.status} - ${errorText}`);
    }
  
    return response;
  }