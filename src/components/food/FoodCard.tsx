
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FoodListing } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";

interface FoodCardProps {
  listing: FoodListing;
}

const FoodCard = ({ listing }: FoodCardProps) => {
  const { user } = useApp();
  const navigate = useNavigate();
  const isOwnListing = user?.id === listing.postedBy.id;

  const handleViewDetails = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <Card className="food-card">
      <div className="relative">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="food-card-image"
        />
        {listing.isClaimed && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <Badge className="text-lg px-3 py-1.5 bg-secondary">Claimed</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg line-clamp-1">{listing.title}</h3>
          <Badge
            variant={listing.isClaimed ? "outline" : "default"}
            className={
              listing.isClaimed ? "border-secondary text-secondary" : ""
            }
          >
            {listing.isClaimed ? "Claimed" : "Available"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPinIcon size={14} />
          {listing.location.address.split(",")[0]}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2 mb-2">{listing.description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <UserIcon size={12} />
          <span>Posted by {listing.postedBy.name}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <CalendarIcon size={12} />
          <span>
            {formatDistanceToNow(new Date(listing.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleViewDetails}
          className="w-full"
          variant={isOwnListing || listing.isClaimed ? "outline" : "default"}
        >
          {isOwnListing
            ? "Manage Listing"
            : listing.isClaimed
            ? "View Details"
            : "Claim Food"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
