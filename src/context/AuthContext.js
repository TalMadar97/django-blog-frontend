import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    console.log("Fetching user profile with token:", storedUser.access);
    try {
      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedUser.access}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const userData = await response.json();
      console.log("Fetched user data:", userData);

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
    console.log("Login response data:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    await fetchUserProfile(userData);
    setUser(userData);
    console.log("Updated user state:", userData);
    toast.success("Login successful!");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully");
  };

  useEffect(() => {
    console.log("Updated User:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
