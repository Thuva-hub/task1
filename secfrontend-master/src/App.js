import { BrowserRouter, Routes, Route, Outlet,redirect} from "react-router-dom";
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

import Staff from "./components/Task";
import 'bootstrap/dist/css/bootstrap.css';
import Task from "./components/Task";
function App() {

   const isAuthenticated = localStorage.getItem("valid");
    console.log("this", isAuthenticated);
  return (
    <BrowserRouter>
    <Routes >
     <Route path="/" element={<Task />} /> 
    </Routes>
    <ToastContainer />
  </BrowserRouter>
  );
}

export default App;
