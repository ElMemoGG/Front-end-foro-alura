import { useState } from 'react';
import { BASE_PATH } from '../util/constants';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import { useSnackbar } from 'notistack'


const useApi = () => {
  const [isLoading, setIsLoading] = useState();
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {auth, logout} = useAuth();
  const { enqueueSnackbar } = useSnackbar()

  const handleRequest =  async(url, method = 'GET', data = null, headers = {}, authR = false, loading) => {
    setIsLoading(loading);




    try {
      const response = await fetch(BASE_PATH + url, {   // TODO: const contoller = new AbortController()
        method,
        body: data ? JSON.stringify(data) : null,
        headers: {
          'Content-Type': 'application/json',
          ...(authR && { Authorization: `Bearer ${auth.jwtToken}` }),
          ...headers,
        },
      });

      
        if(response.status == 403){
          
          logout();
          navigate(`/login`, { replace: true })
          //TODO: agregar un snakbar 
          setIsLoading(false);
          return null;
        }

      

      

      const responseData = await response.json();
      console.log(responseData)
      if (!response.ok) {
        console.log(responseData.error)

        // throw new Error(responseData.message);
        enqueueSnackbar(responseData.error, {
           variant: 'error' 
        })
      }else if(method == 'POST' || method == 'PUT' || method == 'DELETE'){
        enqueueSnackbar('ok', {
          variant: 'success' 
       })
      }

  
      setIsLoading(false);
      return responseData;
      
    } catch (err) {
      setIsLoading(false);
      console.log(err)
      console.log(err.message)
      enqueueSnackbar(err.message, {
        variant: 'error' 
     })
      //setError(err.message || 'Something went wrong');
      //throw err;
    } 
  };

  const get = (url, auth = false, loading = false, headers = {}) =>
    handleRequest(url, 'GET', null, headers, auth, loading);

  const getFilter = (url, headers = {}, auth = false, param, loading = false) =>{
    let newUrl = url + "?"
    param.forEach((element, index) => {
      newUrl += element.key +"="+element.value 
      if(index +1 < param.length){
        newUrl += "&"
      }
    });
    //console.log(newUrl)
    return handleRequest(newUrl, 'GET', null, headers, auth, loading);
  }
    

  const post = (url, data, auth = false, loading = false, headers = {} ) =>
    handleRequest(url, 'POST', data, headers, auth, loading);

  const put = (url, data, auth = false, loading = false, headers = {} ) =>
    handleRequest(url, 'PUT', data, headers, auth, loading);

  const del = (url, auth = false, loading = false, headers = {} ) =>
    handleRequest(url, 'DELETE', null, headers, auth, loading);

  return {
    isLoading,
    error,
    get,
    getFilter,
    post,
    put,
    del,
  };
};

export default useApi;


