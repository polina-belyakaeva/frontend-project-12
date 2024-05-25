import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentChannel } from "../slices/channelsSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/routes";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = () => {
    setIsAuthenticated(true);
    navigate(ROUTES.home);
  };
  const logout = () => {
    setIsAuthenticated(false);
    dispatch(setCurrentChannel({ id: "1", name: "general", removable: false }));
    navigate(ROUTES.login);
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
