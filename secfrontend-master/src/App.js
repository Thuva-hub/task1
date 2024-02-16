import { BrowserRouter, Routes, Route, Outlet,redirect} from "react-router-dom";
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

import Staff from "./components/Staff";
import 'bootstrap/dist/css/bootstrap.css';
function App() {

   const isAuthenticated = localStorage.getItem("valid");
    console.log("this", isAuthenticated);
  return (
    <BrowserRouter>
    <Routes >
    

     
     
        <Route path="/Staff" element={<Staff />} />
    
      
     
    </Routes>
    <ToastContainer />
  </BrowserRouter>
  );
}

export default App;
