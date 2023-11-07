import { verifyMessage } from "ethers";
import { NextResponse } from "next/server";

const { Alchemy, Network, AssetTransfersCategory } = require("alchemy-sdk");

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ARB_GOERLI, // Replace with your desired network.
};

const alchemy = new Alchemy(settings);

export async function POST(request: Request) {
  const requestMethod = request.method;
  const body = await request.json();

  const { signerAddress, signerMessage, signerData } = body;
  const recoveredAddress = verifyMessage(signerMessage, signerData);
  let totalTokensSent = 0;

  if (signerAddress == recoveredAddress) {
    console.log("Successful signature verification!");
    totalTokensSent = await getAmountTokensSent(recoveredAddress);
  }

  switch (requestMethod) {
    case "POST":
      // if the user has paid the merchant 1 $USDC on Arbitrum Goerli, reveal the secret!
      if (totalTokensSent >= 1) {
        return NextResponse.json({
          message:
            "The secret party is on July 28th, 2024 at 555 Krabby Patty St. at 9pm PST! 🤫",
        });
      } else {
        // if the user hasn't paid yet, prompt them to pay!
        return NextResponse.json({
          message: `You haven't paid ${process.env.NEXT_PUBLIC_MIN_PAYMENT} $USDC to ${process.env.NEXT_PUBLIC_MERCHANT_ADDRESS}! ❌`,
        });
      }
  }
}

async function getAmountTokensSent(userAddress: any) {
  // uses getAssetTransfer endpoint to get back ALL ERC-20 asset transfers from/to
  const getTransfers = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    fromAddress: userAddress,
    // merchant address! replace with one you own!
    toAddress: process.env.NEXT_PUBLIC_MERCHANT_ADDRESS,
    excludeZeroValue: true,
    category: ["erc20"],
  });
  console.log(userAddress);
  console.log(getTransfers);
  // aggregates all values to create a total amount sent... EVER!
  let totalTransferValue = 0;
  getTransfers["transfers"].forEach((tx: any) => {
    // tx.value is not being indexed properly, this is a cheat
    totalTransferValue++;
  });
  return totalTransferValue;
}
