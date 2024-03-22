import {useState, useEffect} from 'react'

function useDebounced(value, delay) {
    let [debouncedValue, setDebouncedValue] = useState(value)
    
    useEffect(() => {
      let timeoutId = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
  
      return () => {
        clearTimeout(timeoutId)
      }
    }, [value, delay])
  
    return debouncedValue
  }

  export default useDebounced;