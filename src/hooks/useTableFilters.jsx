import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounced from "./useDebounce";
import useApi from "./useApi";

function useTableFilters(
  endPoint,
  setTable,
  filter = null,
  headers = {},
  avoid = "",
  debounce = 0
) {
  const [params, setParams] = useSearchParams();
  const api = useApi();
  const totalPerPage = 10;


  // eslint-disable-next-line no-unused-vars
  const useDebouseSearch = useDebounced(params, debounce);

  const handleSearchEmpty = (event) => {
    if (event.target.value.length !== 0) {
      params.set(event.target.name, event.target.value);
      setParams(params);
    } else if (event.target.value.length === 0 || event.target.value === "") {
      params.delete(event.target.name);
      setParams(params);
    }
  };

  const handleSearch = (key, value) => {
    params.set(key, value);
    setParams(params);
  };

  const UdateTable = () => {
    (async () => {
      let irequestFilter = [];

      params.forEach((value, key) => {
        if (key === "page") {
          irequestFilter.push({ key: key, value: `${value - 1}` });
        } else if (avoid != key) {
          irequestFilter.push({ key: key, value: `${value}` });
        }
      });

      irequestFilter.push({ key: "size", value: `${totalPerPage}` });

      if (filter) {
        filter.forEach((data) => {
          irequestFilter.push({ key: data.key, value: `${data.value}` });
        });
      }
      //console.log(irequestFilter);

      let response = await api.getFilter(
        endPoint,
        headers,
        true,
        irequestFilter
      );

      setTable(response);
    })();
  };

  useEffect(() => {
    if (debounce !== 0) {
      return;
    }
    
    //console.log(params.has("page"))
    if (!params.has("page")) {
      params.set("page", 1);
      setParams(params);

    } else {
      UdateTable();
    }

  }, [params]);

  /* useEffect(() => {
    if (debounce === 0) {
      return;
    }
    if (!params.has("page")) {
      params.set("page", 1);
      setParams(params);
    } else {
      UdateTable();
    }
    //console.log("rendereo")
  }, [useDebouseSearch]); */

  return [params, api.isLoading,  setParams, handleSearch, handleSearchEmpty, UdateTable];
}

export default useTableFilters;
