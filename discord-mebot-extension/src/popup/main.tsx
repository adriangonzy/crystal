import "../styles";
import React from "react";
import ReactDOM from "react-dom";
import { Popup } from "./Popup";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { RequireAuth } from "./features/auth/RequireAuth";
import { AuthProvider } from "./features/auth/AuthProvider";

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Popup />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
