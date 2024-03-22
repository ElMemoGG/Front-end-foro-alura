import useApi from "../hooks/useApi";
import "./../styles/login.css"
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//let renderCount = 0;

const Login = () => {

    const { auth, login } = useAuth();
    const navigate = useNavigate();

    const api = useApi()
    const {register, handleSubmit, 
        formState: { errors, isDirty },
        //watch
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    })  
    //renderCount++;


    useEffect(()=>{
      if(auth ){
        navigate("/home", { replace: true });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])



    const onSubmit = handleSubmit(async (data) =>{

        //data.email = data.trim();
        console.log(data)

        api.post("login", data).then(
          response => {
          console.log('Datos recibidos:', response);
          login(response)
          navigate("/home", { replace: true });
          
        })
        .catch(error => {
          console.error('Error al cargar datos:', error);
        });
    })

    return ( 
      <div className="body"> 
        <div className="box">
           {/*  <h3>{renderCount}</h3> */}
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <label className="email" htmlFor="email">
                    Correo
                </label>
                <input className="email" type="email" 
                {...register("email", {
                    required: {
                        value: true,
                        message: "Correo es requerido"
                    },
                    pattern: {
                        value:  /^[a-z0-9._%+-]+@[a-z0-9•-]+\.[a-z]{2,4}$/,
                        message: "Correo no válido"
                    },
            /*         validate: ()=>{
                        return true      
                    } */
                })}
                />
                {
                    errors.email && <span>{errors.email.message}</span>
                }

                <label className="password" htmlFor="password">
                    Contraseña
                </label>
                <input className="password" type="password"
                  {...register("password",{
                      required: {
                        value: true,
                        message: "Nombre es requerido"
                      },
                      maxLength: {
                        value: 250,
                        message: "Maximo 250 caracteres"
                      },
                      minLength: {
                        value: 3,
                        message: "Minimo 3 caracteres"
                      }

                  })} 
                />
                {
                    errors.password && <span>{errors.password.message}</span>
                }
        

                 <button className="send" type="submit" disabled={!isDirty}>Iniciar session</button>    
            </form>
      {/*       <pre>
            {JSON.stringify(watch(), null, 2)}
            </pre>
            */}
            {/* <button onClick={()=> setSend(prev=>!prev)}>send</button>     */}
        </div>
        </div>
     );
}
 
export default Login;

//rfce
