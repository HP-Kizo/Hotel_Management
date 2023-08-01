import { useState, useEffect } from "react";
import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:5000",
});

function useFetch(url) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchURL = async () => {
      try {
        setIsLoading(true);
        const res = await instance.get(url);
        setData(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err);
      }
    };
    fetchURL(url);
  }, [url]);
  const reFetch = async () => {
    try {
      setIsLoading(true);
      const res = await instance.get(url);
      setData(res.data);
      setIsLoading(false);
      console.log(res.data);
    } catch (err) {
      setIsLoading(false);

      setError(err);
    }
  };
  return { data, isLoading, error, reFetch };
}

export default useFetch;
