import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/login";
import Menu from "../layout/menu";
import Topics from "../pages/topics";
import Answers from "../pages/answers";
import Error from "../pages/error";
//import useAuth from '../hooks/useAuth';
import RequireAuth from "./RequireAuth";
import TopicDetail from "../pages/topicDetail";
import { SnackbarProvider } from 'notistack'



const Routers = () => {


  const router = createBrowserRouter([
    {
      path: "/login",
      errorElement: <Error />,
      element: <Login />,
    },
    {
      path: "/",
      errorElement: <Error />,
      element: <Login />,
    },
    {
      path: "/",
      element: <RequireAuth />,
      errorElement: <Error />,
      children: [
        {
          path: "home",
          element: <Menu />,
          errorElement: <Error />,
          children: [
            {
              path: "topics",
              element: <Topics />,
    
            },
            {
              path: "answers",
              element: <Answers />,
            },
            {
              path: "topics/details/:id",
              element: <TopicDetail />
            },
          ],
        },
      ],
    },
  ]);
  

  return (
    <SnackbarProvider  autoHideDuration={2000}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  );
};

export default Routers;

//rfce