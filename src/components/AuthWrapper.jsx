import React, {useState, useEffect} from "react";
import { supabase } from "./supabase";
import { Navigate } from "react-router";
import Loader from "./loader";

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
        setAuthenticated(!!session);
        setLoading(false);
    };
    
    getSession();

  }, []);


  if (loading) {
    return <div className="flex items-center justify-center h-screen">...</div>;
  } else {
    if (authenticated) {
      return <>{children}</>;
    }
    return <Navigate to="/login" replace />;
  }

}

export default AuthWrapper;