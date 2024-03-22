import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState();
    // Espera a que verifique si hay datos de autenticación en el localStorage 
    // y asi evitar que lo redirija al login el requireAuth de manera automatica 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        setLoading(true)
        // Verificar si hay datos de autenticación en el localStorage al cargar la aplicación
        const authData = localStorage.getItem('auth');
        if (authData) {
          setAuth(JSON.parse(authData));
/*           console.log("cargo")
          console.log(JSON.parse(authData).jwtToken) */
        }
        //Libera la espera
        setLoading(false)
        
      }, []);
    
      // eslint-disable-next-line no-unused-vars
      const login = (userData) => {
        // Realiza la lógica de inicio de sesión aquí
    
        // Guarda la información de autenticación en el estado y en el localStorage
        setAuth(userData);
        localStorage.setItem('auth', JSON.stringify(userData));
      };
    
      // eslint-disable-next-line no-unused-vars
      const logout = () => {
        // Realiza la lógica de cierre de sesión aquí
    
        // Elimina la información de autenticación del estado y del localStorage
        setAuth(null);
        localStorage.removeItem('auth');
      };


    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
           { !loading &&  <>{children}</>}
        </AuthContext.Provider>
    )
}

export default AuthContext;


