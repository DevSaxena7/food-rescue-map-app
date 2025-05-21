
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AddFoodForm from "@/components/food/AddFoodForm";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

const AddFoodPage = () => {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to add a food listing.
          </p>
          <Button onClick={() => navigate("/login")}>
            Login or Register
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Share Your Food
        </h1>
        <AddFoodForm />
      </div>
    </Layout>
  );
};

export default AddFoodPage;
