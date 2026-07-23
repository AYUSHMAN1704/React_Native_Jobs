import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: "GET",
    url: `https://jsearch.p.rapidapi.com/${endpoint}-v2`,
    params: {
      ...query,
    },
    headers: {
      "x-rapidapi-key": "88d40638eamsh5e91a7c4376150ep1d6938jsn928031bb40e2",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.request(options);

      console.log("API Response:", response.data);

      setData(response.data.data.jobs);
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Error:", err.response?.data);

      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useFetch;