
import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import RecentListings from "@/components/home/RecentListings";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const { isAuthenticated } = useApp();
  
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <RecentListings />
    </Layout>
  );
};

export default Index;
