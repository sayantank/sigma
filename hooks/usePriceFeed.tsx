import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const usePriceFeed = (mints: [string]) => {
  const { data, error, isValidating } = useSWR(
    "https://price-api.sonar.watch/prices",
    fetcher,
    { revalidateOnFocus: false } // DEV ONLY
  );

  return {
    prices: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
  };
};

export default usePriceFeed;
