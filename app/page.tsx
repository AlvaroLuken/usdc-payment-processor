"use client";
import testnetTokenAbi from "@common/utils/abi/TestnetToken.json";
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSignMessage,
} from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [hasVerified, setHasVerified] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  const { data } = useContractRead({
    address: "0x18cF7aA688e76e0A19bAcf016d33F3c3686894Eb",
    abi: testnetTokenAbi,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    console.log(data);
    const bigNumber: any = data;

    if (bigNumber) {
      setUserBalance(bigNumber.toString().substring(0, 4));
    }
  }, []);

  const { config } = usePrepareContractWrite({
    address: "0x18cF7aA688e76e0A19bAcf016d33F3c3686894Eb",
    abi: [
      {
        name: "drip",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
    ],
    functionName: "drip",
  });

  const { write } = useContractWrite(config);

  const [message] = useState(
    "$USDC helps facilitate payments like this and WAY more..."
  );
  const { error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      setSecretMessage("Verifying payment... ⏳");
      setTimeout(() => {
        checkIfUserHasPaid(address, variables.message, data);
      }, 3000);
      setHasVerified(true);
    },
  });

  const [secretMessage, setSecretMessage] = useState(
    `You have to pay ${process.env.NEXT_PUBLIC_MIN_PAYMENT} $USDC to see the secret! 👀`
  );

  useEffect(() => {
    setTimeout(() => {
      setHasVerified(false);
      setSecretMessage(
        `You have to pay ${process.env.NEXT_PUBLIC_MIN_PAYMENT} $USDC to see the secret! 👀`
      );
    }, 500);
  }, [address]);

  async function checkIfUserHasPaid(userAddress: any, message: any, data: any) {
    const verificationData = {
      signerAddress: userAddress,
      signerMessage: message,
      signerData: data,
    };
    const response = await fetch("/api/verify-payment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationData),
    });
    const messageResponse = await response.json();
    setSecretMessage(messageResponse.message);
  }

  return (
    <div className="hero my-10 min-h-full w-full">
      <main className="flex flex-col text-center justify-center items-center w-[100vw]">
        <h1 className="text-5xl font-bold">
          Welcome to the $USDC Payment Processor
        </h1>
        <h2 className="text-2xl mt-6 mx-8">
          This app is a demo to demonstrate how merchants can sell items easily
          in exchange for USDC. Items most appropriate for this format include:
          one-time-use API Keys, secret URLs, video download links, cooking
          recipes, stories & literature, location of a party, etc.{" "}
        </h2>
        <div className="flex mt-10 justify-center gap-16 w-full">
          <div className="text-2xl bg-white border rounded-lg h-[412px] w-[50%]">
            <div className="my-4 mx-4">
              <i>
                In this example, imagine a merchant is selling the time/location
                of a secret party...
              </i>
              🤫
            </div>
            <div className="text-left p-4 text-xl">
              1. <b>Merchant</b> (pay this address):{" "}
              <a
                className="link link-accent"
                href={`https://goerli.arbiscan.io/address/${process.env.NEXT_PUBLIC_MERCHANT_ADDRESS}`}
              >
                {process.env.NEXT_PUBLIC_MERCHANT_ADDRESS}
              </a>
            </div>
            <div className="text-left p-4 text-xl">
              2. <b>Min. Payment</b>: {process.env.NEXT_PUBLIC_MIN_PAYMENT}{" "}
              $USDC (acquire some{" "}
              <span
                className="link link-primary"
                onClick={() => write?.()}
                style={{ cursor: "pointer" }}
              >
                by triggering this transaction
              </span>
              )
            </div>
            <div className="text-left p-4 text-xl">
              3. <b>Required Network</b>:{" "}
              {process.env.NEXT_PUBLIC_REQUIRED_NETWORK} (acquire some{" "}
              <span className="link link-primary" style={{ cursor: "pointer" }}>
                <a
                  href="https://faucet.quicknode.com/arbitrum/goerli"
                  target="_blank"
                >
                  here
                </a>
              </span>
              ) to pay for gas fees!
            </div>
            <div className="text-left p-4 text-sm">
              <b>TLDR</b>: Send {process.env.NEXT_PUBLIC_MIN_PAYMENT} $USDC
              to&nbsp;
              {process.env.NEXT_PUBLIC_MERCHANT_ADDRESS} in order to unlock the
              location of the party.
            </div>
          </div>
          <div className="text-2xl bg-white border rounded-lg h-[412px] w-[40%]">
            <div className="flex flex-col justify-between my-4 h-[372px]">
              <h1 className="text-4xl font-bold">Secret 👇</h1>
              <div className="text-xl">{secretMessage}</div>
              <div>
                {!hasVerified && isConnected ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => signMessage({ message })}
                  >
                    <b>Verify Payment With Signature</b>
                  </button>
                ) : (
                  <div className="flex justify-center items-center">
                    <ConnectKitButton />
                  </div>
                )}
                {error && <div>{error.message}</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          Your current $TNUSDC balance is: {Number(userBalance)}
        </div>
      </main>
    </div>
  );
}
