// prettier-ignore
import React, {
  createContext, useState, useMemo, useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentChannel } from '../slices/uiSlice';
import { ROUTES } from '../utils/routes';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useCallback(() => {
    setIsAuthenticated(true);
    navigate(ROUTES.home);
  }, [navigate]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    dispatch(setCurrentChannel({ id: '1', name: 'general', removable: false }));
    navigate(ROUTES.login);
  }, [dispatch, navigate]);

  // prettier-ignore
  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
