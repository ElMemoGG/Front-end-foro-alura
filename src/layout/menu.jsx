import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/menu.css"

const Menu = () => {
  const {logout} = useAuth();
  

  return (
    <div className="container-all">
      <nav className="nav-menu">
        <ul>
          <li>
          <Link className="link" to={`/home`}> {`<> Foro Alura </>`}</Link>
           
          </li>
          <li>
            <Link className="link" to={`answers`}>Mis Respuestas</Link>
          </li>
          <li>
            <Link className="link" to={`topics`}>Topicos</Link>
          </li>
          <li>
            <Link className="link" onClick={()=>logout()} to={`/login`}>cerrar session</Link>
          </li>
        </ul>
      </nav>
      <main className="content-layout">
        <Outlet />
      </main>
    </div>
  );
};

export default Menu;
