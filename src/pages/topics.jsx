/* eslint-disable react/prop-types */
import {  useEffect, useState } from "react";
/* import useAuth from "../hooks/useAuth";
import useApi from "../hooks/useApi"; */
import { usePresence, motion } from "framer-motion";
import "../styles/topico.css"
import useTableFilters from "../hooks/useTableFilters";
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";
import Modal from "../components/modal";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import useApi from "../hooks/useApi";

const Topics = () => {
  //remove
/*   const { auth } = useAuth();
  const api = useApi(); */
  const navigate = useNavigate();
  const [topics, setTopics] = useState();
  const [open, setOpen] = useState(null)
/*   const filter = []
  filter.push({'key':'size', 'value': `1`})
 */
  // eslint-disable-next-line no-unused-vars
  const [params, isLoading, setParams, handleSearch, handleSearchEmpty, UdateTable] = useTableFilters("topico", setTopics)


  //remove effect and getTopics
/*   useEffect(() => {
    //getTopics();
    console.log(topics)
  }, [topics]); */

/*   const getTopics = () => {
    api
      .get("topico", {}, auth.jwtToken)
      .then((response) => {
        console.log(response);
        setTopics(response);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
      });
      
  }; */





  const colorStaus = (status)=>{
    
    return status === "NUEVO"? "rgb(0, 174, 255)" : status === "DISCUSION" ? "rgb(0, 255, 128)" : "rgb(255, 0, 0)"
  }

  return (
    <div className="grid-container topic-container">
      
      <header className="title" style={{color: "#fff"}}>Topicos</header>
      <motion.div className="search">
  
          <motion.div className="button-modal"
          whileHover= {{scale: 1.1, transition: { duration: 0.2 }}}
           layoutId={1}  onClick={()=>setOpen(1)}>
            Agregar topico
            </motion.div> 
            <AddTopicModal open={open} setOpen={setOpen} update={UdateTable}/>

        
          </motion.div>
      <aside className="filter">
      {/* {[...new Array(50)]
               .map(
                 () => `Cras mattis consectetur purus sit amet fermentum.
 Cras justo odio, dapibus ac facilisis in, egestas eget quam.
 Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
 Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
               )
               .join('\n')} */}
         
               
      </aside>
     {!isLoading && <section className="topics-container">
        {topics?.content &&
          topics.content.map((data) => (
            <ListTopics key={data.id}>
              <div className="box-topic" onClick={()=>navigate(`details/${data.id}`/* , { replace: true } */)}>
                <p style={{ background: colorStaus(data.estatus)}}></p>
                <h3>{data.titulo}</h3>
                
                </div>
            </ListTopics>
          ))}

      </section>}



      { topics && <div className={`page ${isLoading? "hidden-paginate": ""}`}>

      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={(e)=>{  handleSearch("page", e.selected+1)}}
        pageRangeDisplayed={3}
        pageCount={topics.totalPages}
        previousLabel="<"
        initialPage={topics.number }
        /* forcePage={params.get('page')-1} */
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"

        breakClassName="page-item"
        breakLinkClassName="page-link"

        containerClassName="pagination"
        activeClassName="active"
      
      />
      </div>}
      {isLoading &&
      <div className="loading">Cargando...</div>
      }
      {!isLoading && !topics &&
      <div className="loading">empty</div>
      }
    </div>
  );
};

export default Topics;

const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };

function ListTopics({ children }) {
  const [isPresent, safeToRemove] = usePresence();

  const animations = {
    layout: true,
    initial: "out",
    style: {
      display: "inline-block",
      margin: "8px 0",
      position: isPresent ? "static" : "absolute",
    },
    animate: isPresent ? "in" : "out",
    whileHover: "tapped",
    variants: {
      in: { scaleY: 1, opacity: 1 },
      out: { scaleY: 0, opacity: 0 },
      tapped: { scale: 1.03, transition: { duration: 0.2 } }, 
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  };

  return <motion.h2 {...animations}>{children}</motion.h2>;
}


const AddTopicModal = ({open, setOpen, update}) => {
  const { auth } = useAuth();
  const api = useApi();
  const [cursos, setCursos] = useState("");

  const {register, handleSubmit, reset,
    formState: { errors, isDirty },
    //watch
} = useForm({
    defaultValues: {
        titulo: "",
        mensaje: "",
        fecha: null,
        estatus: "NUEVO",
        idUsuario: auth.id,
        idCurso: "",
       
    }
})  

    useEffect(()=>{{
      if(cursos === "")
      getCursos()
    }
    if(!open){
      reset()
    }
    }, [open])

  const getCursos = async()=>{

    /* const response  = api.get("curso", true)
    setCursos(response) */

    api
    .get("curso", true)
    .then((response) => {
      console.log(response);
      setCursos(response)
    })




  }
  const onSubmit = handleSubmit(  async(data) =>{
    data.fecha = new Date();  /* "2023-10-13T09:30" */ /* new Date(); */

    data.idCurso = Number(data.idCurso) 
    console.log(Number(data.idCurso))
    console.log(data)

    
    const response = await api.post("topico", data , true )
    console.log(response)

    update();
    
    setOpen(false)
})


  return ( 
    <Modal open={open} setOpen={setOpen} title="Agregar un nuevo topico">
  <div className="box-add-topic">
      <form onSubmit={onSubmit} className="form-add-topic">

      <label className="titulo" htmlFor="titulo">
            Título
                </label>
                <input className="titulo" type="text"
                  {...register("titulo",{
                      required: {
                        value: true,
                        message: "Título es requerido"
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
                    errors.titulo && <span>{errors.titulo.message}</span>
                }
                <label className="messaje" htmlFor="messaje">
                    Mensaje
                </label>
                <textarea  className="messaje" type="text" rows="4" cols="50"
                  {...register("mensaje",{
                      required: {
                        value: true,
                        message: "Mensaje es requerido"
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
                    errors.mensaje && <span>{errors.mensaje.message}</span>
                }

                  <label className="curso" htmlFor="curso">
                    Curso
                  </label>
                  <select  {...register("idCurso",{
                      required: {
                        value: true,
                        message: "El curso es requerido"
                      },
                    })}>
                      {cursos && cursos.map((curso, index)=>(
                        <option key={index} value={curso.id}>{curso.nombre}</option>
                      ))}
                    
                  </select>

            
                {
                    errors.idCurso && <span>{errors.idCurso.message}</span>
                }
                  <motion.button whileHover= {{scale: 1.1, transition: { duration: 0.2 }}} className="send" type="submit" disabled={!isDirty}>Agregar</motion.button>

      </form>
      </div>
    </Modal>
   );
}
 
