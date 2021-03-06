import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import useProvider from "../hooks/useProvider";
import usePriceFeed from "../hooks/usePriceFeed";
import useSPLTokens from "../hooks/useSPLTokens";
import Image from "next/image";

const Home: NextPage = () => {
  const { wallet, connection } = useProvider();
  const { tokens, loading: tokenLoading } = useSPLTokens();
  const [balance, setBalance] = useState<number | null>(null);

  const refetchSOL = useCallback(async () => {
    if (wallet) {
      setBalance(
        (await connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL
      );
    }
  }, [wallet, connection]);

  useEffect(() => {
    if (tokens) {
      console.log(tokens);
    }
  }, [tokens]);

  useEffect(() => {
    void refetchSOL();
  }, [refetchSOL]);

  return (
    <div className="max-w-3xl mx-auto py-4 px-4 lg:px-0 flex flex-col">
      <div className="w-full flex justify-between items-center">
        <h1>Sigma</h1>
        {wallet ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </div>
      {wallet && (
        <div className="p-4 shadow-md w-full rounded-md bg-slate-50">
          <h3 className="mb-2">Wallet</h3>
          <div className="mb-4">
            <h5>Address</h5>
            <p className="text-2xl">
              {wallet?.publicKey.toBase58().substring(0, 10)}...
            </p>
          </div>
          <div className="space-y-2">
            {tokens &&
              tokens.map((token) => (
                <div key={token.mint} className="flex space-x-2 items-center">
                  <div className="h-8 w-8">
                    <Image
                      src={token.logo}
                      width={32}
                      height={32}
                      layout="responsive"
                      alt={token.symbol}
                    />
                  </div>
                  <p>
                    {token.amount} {10 ** token.decimals}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
