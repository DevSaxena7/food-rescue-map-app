
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import FoodDetail from "@/components/food/FoodDetail";
import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const FoodDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchFoodListings } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchFoodListings();
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchFoodListings, id]);
  
  return (
    <Layout>
      <FoodDetail isLoading={isLoading} />
    </Layout>
  );
};

export default FoodDetailPage;
