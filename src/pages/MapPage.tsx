
import React from "react";
import Layout from "@/components/layout/Layout";
import FoodMap from "@/components/map/FoodMap";
import { useApp } from "@/context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MapPage = () => {
  const { foodListings } = useApp();
  
  // Only show available (not claimed) listings
  const availableListings = foodListings.filter(listing => !listing.isClaimed);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Food Map</CardTitle>
            <CardDescription>
              Find available food shared by people near you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FoodMap listings={availableListings} height="70vh" />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MapPage;
