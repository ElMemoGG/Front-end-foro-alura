/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/topicoDetail.css";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import Modal from "../components/modal";
import { useForm } from "react-hook-form";

const BACKPAGE = -1;

const TopicDetail = () => {
  const [topic, setTopic] = useState("");
  const [answers, setAnswers] = useState("");
  const api = useApi();
  const { auth } = useAuth();
  const { id } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTopic();
    getAnswers(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    //watch
  } = useForm({
    defaultValues: {
      mensaje: "",
      idTopico: id,
      idUsuario: Number(auth.id),
      fecha: new Date()

    },
  });

  const getTopic = () => {
    api
      .get(`topico/${id}`, true)
      .then((response) => {
        //console.log(response);
        setTopic(response);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
      });
  };

  const getAnswers = (loading) => {
    api
      .get(`respuesta?topico=${id}`, true, loading)
      .then((response) => {
        //console.log(response);
        setAnswers(response);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
      });
  };

  const deleteTopic = async () => {
    await api.del(`topico/${id}`, true);
    setModalDelete(false);
    navigate(BACKPAGE);
  };

  const onSubmitRespuesta = handleSubmit(  (data) =>{
    
    api.post("respuesta", data , true, false ).then(()=>{
      getAnswers();
      reset()
    })
    .catch(error => {
      console.error('Error al cargar datos:', error);
    });


})

  return (
    <>
      <ModalDelete
        open={modalDelete}
        setOpen={setModalDelete}
        deleteFunction={deleteTopic}
      />
      {topic && (
        <ModalEdit
          open={modalEdit}
          setOpen={setModalEdit}
          update={getTopic}
          dataTopic={topic}
        />
      )}
      <div className="container">
        {!api.isLoading && topic && (
          <>
            <header>
              <h2 className="title-topic">
                {topic.titulo.toUpperCase()}
                {auth.id === topic.usuario.id && (
                  <div className="edit-buttons">
                    <motion.button
                      className="button-1"
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                      onClick={() => setModalEdit(true)}
                    >
                      Editar
                    </motion.button>

                    <motion.button
                      className="button-delete"
                      style={{ padding: "0px 10px" }}
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                      onClick={() => setModalDelete(true)}
                    >
                      Eliminar
                    </motion.button>
                  </div>
                )}
              </h2>
            </header>
            <div className="tag-container">
              <div className="tag">{topic.curso.nombre}</div>
            </div>

            <p className="message">{topic.mensaje}</p>
          </>
        )}
        {api.isLoading && <div className="loading">Cargando...</div>}

        <section className="answers-container">
          <h3>Respuestas:</h3>
          {!api.isLoading &&
            answers &&
            answers?.content.map((answer, index) => (
              <ListAnswers answer={answer} key={index} />
            ))}

          {api.isLoading && <div className="loading">Cargando...</div>}
          {!api.isLoading && answers.content == "" && (
            <div className="loading">Esto parece vacio</div>
          )}

            <form   onSubmit={handleSubmit(onSubmitRespuesta)} className="form-add-topic add-comentario-container" >
              <div className="comentario-input">
                <label className="titulo" htmlFor="mensaje">
                  Agregar Comentario
                </label>
                <input
                  className="respuesta"
                  type="text"
                  {...register("mensaje", {
                    required: {
                      value: true,
                      message: "Comentario no valido",
                    },
                    maxLength: {
                      value: 250,
                      message: "Maximo 250 caracteres",
                    },
                    minLength: {
                      value: 3,
                      message: "Minimo 3 caracteres",
                    },
                  })}
                />
                {errors.mensaje && <span>{errors.mensaje.message}</span>}
              </div>
              <motion.button
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                className="button-1 comentario-button"
                type="submit"
                disabled={!isDirty}
              >
                Agregar
              </motion.button>
            </form>
   
        </section>
      </div>
    </>
  );
};

const ModalEdit = ({ open, setOpen, update, dataTopic }) => {
  const api = useApi();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    //watch
  } = useForm({
    defaultValues: {
      titulo: dataTopic.titulo,
      mensaje: dataTopic.mensaje,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  const onSubmit = handleSubmit(async (data) => {
    await api.put(`topico/${dataTopic.id}`, data, true);
    update();

    setOpen(false);
  });

  return (
    <Modal open={open} setOpen={setOpen} title="Editar topico">
      <div className="box-add-topic">
        <form onSubmit={onSubmit} className="form-add-topic">
          <label className="titulo" htmlFor="titulo">
            Título
          </label>
          <input
            className="titulo"
            type="text"
            {...register("titulo", {
              required: {
                value: true,
                message: "Título es requerido",
              },
              maxLength: {
                value: 250,
                message: "Maximo 250 caracteres",
              },
              minLength: {
                value: 3,
                message: "Minimo 3 caracteres",
              },
            })}
          />
          {errors.titulo && <span>{errors.titulo.message}</span>}
          <label className="messaje" htmlFor="messaje">
            Mensaje
          </label>
          <textarea
            className="messaje"
            type="text"
            rows="4"
            cols="50"
            {...register("mensaje", {
              required: {
                value: true,
                message: "Mensaje es requerido",
              },
              maxLength: {
                value: 250,
                message: "Maximo 250 caracteres",
              },
              minLength: {
                value: 3,
                message: "Minimo 3 caracteres",
              },
            })}
          />
          {errors.mensaje && <span>{errors.mensaje.message}</span>}

          <motion.button
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            className="send"
            type="submit"
            disabled={!isDirty}
          >
            Guardar
          </motion.button>
        </form>
      </div>
    </Modal>
  );
};

const ModalDelete = ({ open, setOpen, deleteFunction }) => {
  return (
    <Modal open={open} setOpen={setOpen} title="Alerta">
      <p>Seguro de que quieres eliminar este topico</p>
      <div className="buttons-alerta">
        <motion.button
          className="button-1 "
          whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          onClick={() => setOpen(false)}
        >
          Cancelar
        </motion.button>
        <motion.button
          className="button-delete"
          whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          onClick={() => deleteFunction()}
        >
          {" "}
          Eliminar
        </motion.button>
      </div>
    </Modal>
  );
};

const ListAnswers = ({ answer }) => {
  return (
    <div className="answer">
      <h3>{answer.idUsuario.name}:</h3>
      <p>{answer.mensaje}</p>
    </div>
  );
};

export default TopicDetail;
