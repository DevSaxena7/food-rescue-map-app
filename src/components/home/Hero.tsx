
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-accent/30 to-background rounded-lg mb-12">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-8 text-center lg:text-left mb-8 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Share Food, <span className="gradient-text">Not Waste</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
            Connect with your community to share surplus food and reduce waste.
            Post your leftovers or find free food near you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              onClick={() => navigate(isAuthenticated ? "/add" : "/login")}
            >
              {isAuthenticated ? "Share Food" : "Get Started"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/map")}
            >
              Find Food Nearby
            </Button>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <div className="flex justify-center lg:justify-start gap-8">
              <div>
                <p className="text-2xl font-bold gradient-text">1000+</p>
                <p>Meals Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">500+</p>
                <p>Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">50+</p>
                <p>Communities</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
              <img
                className="rounded-lg shadow-lg object-cover w-full h-auto animate-float"
                src="https://images.unsplash.com/photo-1547592180-85f173990554"
                alt="Food sharing"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
