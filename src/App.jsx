import "./styles/App.css"
import Routers from './routers/routers'
import { AuthProvider } from "./routers/AuthProvider"

function App() {


  return (
    <AuthProvider>
      <Routers/>
    </AuthProvider>
  )
}

export default App
