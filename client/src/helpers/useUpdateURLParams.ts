import { useSearchParams } from "react-router-dom";

export const useUpdateURLParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }

    setSearchParams(searchParams);
  };

  return updateParams;
};
