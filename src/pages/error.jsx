
import { useRouteError } from 'react-router-dom';
import "../styles/error.css"
const Error = () => {
    const error = useRouteError()
    return ( 
        <div className='error-container'>
            <div className='message-box'>

            
            <h1>Error</h1>
            <p>{error.statusText || error.message}</p>
           </div>
        </div>
     );
}
 
export default Error;