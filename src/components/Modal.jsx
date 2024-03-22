/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import "../styles/modal.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";


const backdrop = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

function Modal({open, setOpen, title, children}) {


  const [windowOffset, setWindowOffset] = useState(window.scrollY);

  const openModal = ()=> {
    setWindowOffset (window.scrollY);
    document.body.setAttribute('style', `top: -${window.scrollY}px; left: 0; righ: 0;`)
    /* document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left: 0; righ: 0;`) */
  }
  const closeModal = (e)=> {
    e.stopPropagation()
      setOpen(null)
      document.body.setAttribute('style', '')
      window.scrollTo(0, windowOffset)
  }

  useEffect(()=>{
    if(open !== null){
      openModal()
    }
  },[open])

  return (
    <motion.div>
      <AnimatePresence  initial={false}>
        {open &&(
       
       <motion.div
       key="modal"
         className="backdrop"
         variants={backdrop}
         initial="hidden"
         /* transition={{ type: "spring", 	delay: 0.03 }} */
         animate="visible"
         exit={{ opacity: 0 }}
         onClick={closeModal}
       >
         <motion.div className="modal" exit={{ opacity: 0, }}  layoutId={open} onClick={ e => e.stopPropagation() }>
           <motion.header>
            <motion.h3>{title}</motion.h3>
      
            {/* <motion.button onClick={(e)=>{ closeModal(e);}}>X</motion.button> */}
            <FontAwesomeIcon className="close" icon={faXmark} size="xl" onClick={(e)=>{ closeModal(e);}} />
           </motion.header>

          <motion.div className="content-modal">
            {children}

          </motion.div>

         </motion.div>
   
       </motion.div>
        )
        }

      </AnimatePresence>
      </motion.div>

  );
}

export default Modal;
