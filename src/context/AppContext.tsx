
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, FoodListing, Message, Claim } from '@/types';
import { currentUser, foodListings as initialFoodListings, messages as initialMessages, claims as initialClaims } from '@/lib/mock-data';
import { toast } from '@/components/ui/sonner';

interface AppContextType {
  user: User | null;
  foodListings: FoodListing[];
  messages: Message[];
  claims: Claim[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, address: string) => Promise<boolean>;
  addFoodListing: (listing: Omit<FoodListing, 'id' | 'postedBy' | 'isClaimed' | 'createdAt'>) => void;
  claimListing: (listingId: string, pickupTime: Date) => boolean;
  sendMessage: (receiverId: string, content: string) => void;
  getConversation: (userId: string) => Message[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(currentUser);
  const [foodListings, setFoodListings] = useState<FoodListing[]>(initialFoodListings);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);

  const login = async (email: string, password: string) => {
    // Mock login functionality
    if (email && password) {
      setUser(currentUser);
      toast.success("Logged in successfully");
      return true;
    }
    toast.error("Invalid credentials");
    return false;
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out successfully");
  };

  const register = async (email: string, password: string, name: string, address: string) => {
    // Mock registration
    if (email && password && name && address) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        location: {
          address,
          // In a real app, we would geocode the address
          latitude: 40.7128,
          longitude: -74.006,
        },
        points: 0,
        createdAt: new Date(),
      };
      
      setUser(newUser);
      toast.success("Registered successfully");
      return true;
    }
    toast.error("Please fill all fields");
    return false;
  };

  const addFoodListing = (listing: Omit<FoodListing, 'id' | 'postedBy' | 'isClaimed' | 'createdAt'>) => {
    if (user) {
      const newListing: FoodListing = {
        id: `listing-${Date.now()}`,
        ...listing,
        postedBy: user,
        isClaimed: false,
        createdAt: new Date(),
      };
      
      setFoodListings([newListing, ...foodListings]);
      toast.success("Food listing added successfully");
    } else {
      toast.error("You must be logged in to add a listing");
    }
  };

  const claimListing = (listingId: string, pickupTime: Date) => {
    if (!user) {
      toast.error("You must be logged in to claim a listing");
      return false;
    }
    
    const listingIndex = foodListings.findIndex(listing => listing.id === listingId);
    
    if (listingIndex === -1) {
      toast.error("Listing not found");
      return false;
    }
    
    if (foodListings[listingIndex].isClaimed) {
      toast.error("This listing has already been claimed");
      return false;
    }
    
    // Update the listing
    const updatedListings = [...foodListings];
    updatedListings[listingIndex] = {
      ...updatedListings[listingIndex],
      isClaimed: true,
      claimedBy: user.id,
    };
    
    setFoodListings(updatedListings);
    
    // Create a new claim
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      listingId,
      userId: user.id,
      pickupTime,
      status: 'pending',
      createdAt: new Date(),
    };
    
    setClaims([...claims, newClaim]);
    
    // Award points to the lister
    const listingOwner = foodListings[listingIndex].postedBy;
    const pointsToAward = Math.floor(Math.random() * 10) + 5; // Random points between 5-15
    
    toast.success(`You have claimed this listing. Pickup scheduled!`);
    toast(`${listingOwner.name} has been awarded ${pointsToAward} points!`);
    
    return true;
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      senderId: user.id,
      receiverId,
      content,
      createdAt: new Date(),
      read: false,
    };
    
    setMessages([...messages, newMessage]);
    toast.success("Message sent");
  };

  const getConversation = (userId: string) => {
    if (!user) return [];
    
    return messages.filter(
      m => (m.senderId === user.id && m.receiverId === userId) || 
           (m.senderId === userId && m.receiverId === user.id)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const value = {
    user,
    foodListings,
    messages,
    claims,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    addFoodListing,
    claimListing,
    sendMessage,
    getConversation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
