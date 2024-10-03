import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Signinform from "./Signinform";
import Signupform from "./Signupform";
import Base from "./Base";
import { useAuth } from "./auth";
import ProtectedRoutes from "./ProtectedRoutes";


function App(props) {
  const { isAuth } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {!isAuth ? (
          <>
            <Route path="/" element={<Signinform />} />
            <Route path="/signup/*" element={<Signupform />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Base />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
