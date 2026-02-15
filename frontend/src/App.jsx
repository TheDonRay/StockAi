import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Homepage from "./components/Homepage.jsx";
import SignUpPage from "./components/Signuppage.jsx";
import DashPage from "./components/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        {/* Example: <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Homepage />} /> 
        <Route path="/signup" element={<SignUpPage />} />  
        <Route path="/dashboard" element={<DashPage />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
