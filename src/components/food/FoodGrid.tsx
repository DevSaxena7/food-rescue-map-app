
import React from "react";
import FoodCard from "./FoodCard";
import { FoodListing } from "@/types";
import { useApp } from "@/context/AppContext";

interface FoodGridProps {
  listings?: FoodListing[];
  showOnlyAvailable?: boolean;
}

const FoodGrid = ({ listings, showOnlyAvailable = false }: FoodGridProps) => {
  const { foodListings } = useApp();
  
  const displayListings = listings || foodListings;
  const filteredListings = showOnlyAvailable 
    ? displayListings.filter(listing => !listing.isClaimed)
    : displayListings;

  if (filteredListings.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No food listings available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredListings.map((listing) => (
        <FoodCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default FoodGrid;
