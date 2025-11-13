import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import api, { setAuthTokens, clearAuthTokens, setRefreshHandler } from '../services/api';

const STORAGE_KEY = 'hdl_auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setAccessToken(parsed.accessToken);
        setRefreshToken(parsed.refreshToken);
        setAuthTokens(parsed.accessToken, parsed.refreshToken);
      } catch (error) {
        console.warn('Failed to parse auth storage', error);
      }
    }
  }, []);

  useEffect(() => {
    setRefreshHandler(async () => {
      if (!refreshToken) return null;
      try {
        const res = await api.post('/auth/refresh', { refreshToken });
        const payload = res.data.data;
        applySession(payload);
        return payload.accessToken;
      } catch (error) {
        logout();
        return null;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  const applySession = (payload) => {
    setUser(payload.user);
    setAccessToken(payload.accessToken);
    setRefreshToken(payload.refreshToken);
    setAuthTokens(payload.accessToken, payload.refreshToken);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken
      })
    );
  };

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    applySession(res.data.data);
  };

  const register = async (payload) => {
    await api.post('/auth/register', payload);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearAuthTokens();
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext);

