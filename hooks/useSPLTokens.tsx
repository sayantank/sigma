import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import useProvider from "./useProvider";

const TOKEN_LIST_API =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json";

interface TokenAccount {
  publicKey: string;
  mint: string;
  amount: number;
  decimals: number;
  symbol: string;
  logo: string;
}

const useSPLTokens = () => {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<TokenAccount[] | null>(null);
  const { wallet, connection } = useProvider();

  const fetchTokens = useCallback(async () => {
    if (wallet) {
      setLoading(true);
      const {
        data: { tokens: tokenList },
      } = await axios.get(TOKEN_LIST_API);
      const response = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );
      let parsedTokens: TokenAccount[] = [];
      response.value.forEach((tokenAccount) => {
        const mint = tokenAccount.account.data["parsed"]["info"]["mint"];
        const amount = Number(
          tokenAccount.account.data["parsed"]["info"]["tokenAmount"]["amount"]
        );
        if (amount) {
          const tokenMetadata = tokenList.find(
            (tokenInfo: any) => tokenInfo.address === mint
          );
          if (tokenMetadata) {
            parsedTokens.push({
              publicKey: tokenAccount.pubkey.toBase58(),
              mint,
              amount,
              decimals: tokenMetadata.decimals,
              symbol: tokenMetadata.symbol,
              logo: tokenMetadata.logoURI,
            });
          }
        }
      });
      setTokens(parsedTokens);
      setLoading(false);
    }
  }, [connection, wallet]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, loading };
};

export default useSPLTokens;
