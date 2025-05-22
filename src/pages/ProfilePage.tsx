
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useApp } from "@/context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoodGrid from "@/components/food/FoodGrid";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AwardIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { profile, isAuthenticated, foodListings } = useApp();
  const navigate = useNavigate();
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h2 className="text-xl font-medium mb-4">Loading profile...</h2>
        </div>
      </Layout>
    ); 
  }
  
  // Filter listings by user
  const userListings = foodListings.filter(
    listing => listing.postedBy.id === profile.id
  );
  
  // Filter listings claimed by user
  const claimedListings = foodListings.filter(
    listing => listing.isClaimed && listing.claimedBy === profile.id
  );
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">{profile.name || "User"}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile.location?.address || "Location not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="flex gap-1 items-center bg-secondary">
                      <AwardIcon className="h-3 w-3" />
                      <span>{profile.points || 0} points</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Button onClick={() => navigate("/add")} className="flex-1 sm:flex-none">
                Share Food
              </Button>
              <Button variant="outline" onClick={() => navigate("/map")} className="flex-1 sm:flex-none">
                Find Food
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="my-listings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="claimed">Claimed by Me</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-listings" className="pt-6">
            {userListings.length > 0 ? (
              <FoodGrid listings={userListings} />
            ) : (
              <div className="text-center p-12 border rounded-lg bg-muted/30">
                <h3 className="text-xl font-medium mb-2">No Listings Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't shared any food yet. Start sharing and earn points!
                </p>
                <Button onClick={() => navigate("/add")}>
                  Share Food Now
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="claimed" className="pt-6">
            {claimedListings.length > 0 ? (
              <FoodGrid listings={claimedListings} />
            ) : (
              <div className="text-center p-12 border rounded-lg bg-muted/30">
                <h3 className="text-xl font-medium mb-2">Nothing Claimed</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't claimed any food listings yet.
                </p>
                <Button onClick={() => navigate("/map")}>
                  Find Food Nearby
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
