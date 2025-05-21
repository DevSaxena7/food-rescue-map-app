
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AuthTabs from "@/components/auth/AuthTabs";
import { useApp } from "@/context/AppContext";

const LoginPage = () => {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <AuthTabs />
      </div>
    </Layout>
  );
};

export default LoginPage;
