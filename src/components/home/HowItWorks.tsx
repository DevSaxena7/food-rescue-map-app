
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon, PlusIcon, CheckIcon, MessageCircleIcon } from "lucide-react";

const steps = [
  {
    title: "Add Your Food",
    description: "Take a photo and post your leftover food with a description and location for pickup.",
    icon: PlusIcon,
    color: "bg-primary/20 text-primary",
  },
  {
    title: "Connect Locally",
    description: "Users in your area can view your listing on a map and browse what's available.",
    icon: MapPinIcon,
    color: "bg-secondary/20 text-secondary",
  },
  {
    title: "Claim Food",
    description: "Users can claim food listings and arrange a time for pickup through the app.",
    icon: CheckIcon,
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    title: "Chat & Pickup",
    description: "Use the in-app chat to communicate details and coordinate the food pickup.",
    icon: MessageCircleIcon,
    color: "bg-primary/20 text-primary",
  },
];

const HowItWorks = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          FoodShare makes it easy to share surplus food with people in your
          community and reduce food waste.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div
                  className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-center mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-center">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
