
import React from "react";
import { useApp } from "@/context/AppContext";
import FoodGrid from "../food/FoodGrid";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RecentListings = () => {
  const { foodListings } = useApp();
  const navigate = useNavigate();
  
  // Get only available (not claimed) listings, sorted by most recent
  const availableListings = foodListings
    .filter(listing => !listing.isClaimed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Available Food</h2>
        <Button variant="outline" onClick={() => navigate("/map")}>
          View All
        </Button>
      </div>
      
      {availableListings.length > 0 ? (
        <FoodGrid listings={availableListings} />
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium mb-2">No Available Listings</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to share food with your community!
          </p>
          <Button onClick={() => navigate("/add")}>
            Share Food Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentListings;
