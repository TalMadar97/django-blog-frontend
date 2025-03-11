import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.access) {
      fetchUserProfile(storedUser);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (storedUser) => {
    try {
      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedUser.access}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const userData = await response.json();
      const fullUserData = { ...storedUser, ...userData };
      setUser(fullUserData);
      localStorage.setItem("user", JSON.stringify(fullUserData));
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    await fetchUserProfile(userData);
    setUser(userData); // ✅ שינוי קריטי – גורם לרינדור מיידי
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
