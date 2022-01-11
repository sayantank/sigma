import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

const useProvider = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return {
    wallet,
    connection,
  };
};

export default useProvider;
