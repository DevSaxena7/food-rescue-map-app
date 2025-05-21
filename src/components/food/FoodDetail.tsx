import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDistanceToNow, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPinIcon, UserIcon, MessageCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatInterface from "../chat/ChatInterface";
import FoodMap from "../map/FoodMap";
import { Skeleton } from "@/components/ui/skeleton";

interface FoodDetailProps {
  isLoading?: boolean;
}

const FoodDetail = ({ isLoading = false }: FoodDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { foodListings, user, claimListing } = useApp();
  
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [pickupTime, setPickupTime] = useState<string>("12:00");
  const [showChat, setShowChat] = useState(false);
  
  const listing = foodListings.find((item) => item.id === id);
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="h-[300px]">
              <Skeleton className="w-full h-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The food listing you are looking for does not exist.
        </p>
        <Button onClick={() => navigate("/")}>Go Back to Listings</Button>
      </div>
    );
  }
  
  const isOwnListing = user?.id === listing.postedBy.id;
  const canClaim = !isOwnListing && !listing.isClaimed && user;
  
  const handleClaimSubmit = async () => {
    if (!pickupDate) return;
    
    // Combine date and time
    const [hours, minutes] = pickupTime.split(":").map(Number);
    const pickupDateTime = new Date(pickupDate);
    pickupDateTime.setHours(hours, minutes);
    
    const success = await claimListing(listing.id, pickupDateTime);
    if (success) {
      setShowChat(true);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <div className="overflow-hidden rounded-t-lg">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-[300px] object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{listing.title}</CardTitle>
                <Badge
                  variant={listing.isClaimed ? "outline" : "default"}
                  className={
                    listing.isClaimed ? "border-secondary text-secondary" : ""
                  }
                >
                  {listing.isClaimed ? "Claimed" : "Available"}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPinIcon size={14} />
                {listing.location.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{listing.description}</p>
              
              <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <UserIcon size={14} />
                  <span>Posted by {listing.postedBy.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon size={14} />
                  <span>
                    {formatDistanceToNow(new Date(listing.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              
              {listing.expiresAt && (
                <div className="text-sm">
                  <span className="font-medium">Best before: </span>
                  {format(new Date(listing.expiresAt), "PPP")}
                </div>
              )}
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Location</h3>
                <div className="h-[200px] rounded-md overflow-hidden">
                  <FoodMap listings={[listing]} center={listing.location} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {canClaim && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Claim This Food</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Pickup</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium">
                          Select Pickup Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal mt-1"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {pickupDate ? (
                                format(pickupDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={pickupDate}
                              onSelect={setPickupDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">
                          Select Pickup Time
                        </label>
                        <Input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleClaimSubmit} 
                        className="w-full mt-4"
                      >
                        Confirm Pickup
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              
              {listing.isClaimed && !isOwnListing && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled
                >
                  This food has been claimed
                </Button>
              )}
              
              {user && !isOwnListing && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowChat(true)}
                  className="w-full flex items-center"
                >
                  <MessageCircleIcon className="mr-2 h-4 w-4" />
                  Message {listing.postedBy.name}
                </Button>
              )}
              
              {isOwnListing && (
                <div className="w-full">
                  <p className="text-center text-muted-foreground mb-2">
                    This is your listing
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!listing.isClaimed}
                    onClick={() => setShowChat(true)}
                  >
                    {listing.isClaimed 
                      ? "Chat with claimer" 
                      : "Waiting for someone to claim"}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className={!showChat ? "hidden md:block" : ""}>
          {showChat ? (
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {isOwnListing 
                        ? "CL" 
                        : getInitials(listing.postedBy.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {isOwnListing 
                        ? "Claimer" 
                        : listing.postedBy.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {isOwnListing 
                        ? "Chat with the person who claimed your food" 
                        : "Chat with the donor"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-130px)]">
                <ChatInterface recipientId={
                  isOwnListing 
                    ? (listing.claimedBy || "") 
                    : listing.postedBy.id
                } />
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <MessageCircleIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-1">No Chat Selected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {!user 
                    ? "Login to chat with the food donor"
                    : canClaim 
                      ? "Claim this food to start chatting with the donor"
                      : "Click 'Message' to start chatting"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
