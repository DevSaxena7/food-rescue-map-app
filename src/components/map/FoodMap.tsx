
import React, { useEffect, useRef, useState } from "react";
import { FoodListing } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MapPoint {
  latitude: number;
  longitude: number;
}

interface FoodMapProps {
  listings?: FoodListing[];
  center?: MapPoint;
  height?: string;
}

// Mock map component since we can't integrate a real map in this demo
const FoodMap = ({
  listings,
  center,
  height = "400px",
}: FoodMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  
  useEffect(() => {
    // In a real app, this would initialize the map
    console.log("Map initialized with center:", center);
  }, [center]);
  
  const handleListingClick = (listing: FoodListing) => {
    setSelectedListing(listing);
  };
  
  const handleViewDetails = (id: string) => {
    navigate(`/listing/${id}`);
  };

  return (
    <div className="relative w-full" style={{ height }}>
      <div
        ref={mapRef}
        className="w-full h-full bg-accent/20 rounded-lg flex items-center justify-center relative p-4"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Map Component (Mock)
          </p>
          <p className="text-xs text-muted-foreground">
            In a real app, this would show a map with food listings.
          </p>
          
          {listings && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-h-[300px] overflow-y-auto">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  className={`p-2 cursor-pointer hover:bg-accent/30 transition-colors ${
                    selectedListing?.id === listing.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleListingClick(listing)}
                >
                  <div className="flex gap-2">
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {listing.title}
                        </h4>
                        <Badge
                          variant={listing.isClaimed ? "outline" : "default"}
                          className="text-xs"
                        >
                          {listing.isClaimed ? "Claimed" : "Available"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {listing.location.address.split(",")[0]}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 bg-background rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold">{selectedListing.title}</h3>
            <Badge variant={selectedListing.isClaimed ? "outline" : "default"}>
              {selectedListing.isClaimed ? "Claimed" : "Available"}
            </Badge>
          </div>
          <p className="text-sm mb-2">{selectedListing.location.address}</p>
          <Button 
            size="sm" 
            onClick={() => handleViewDetails(selectedListing.id)}
            className="w-full"
          >
            View Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodMap;
