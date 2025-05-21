import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, FoodListing, Message, Claim } from '@/types';
import { currentUser, messages as initialMessages, claims as initialClaims } from '@/lib/mock-data';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/lib/supabase';

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
  claimListing: (listingId: string, pickupTime: Date) => Promise<boolean>;
  sendMessage: (receiverId: string, content: string) => void;
  getConversation: (userId: string) => Message[];
  fetchFoodListings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(currentUser);
  const [foodListings, setFoodListings] = useState<FoodListing[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch food listings from Supabase
  const fetchFoodListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('food_listings')
        .select(`
          id,
          title,
          description,
          image_url,
          location,
          is_claimed,
          claimed_by,
          created_at,
          expires_at,
          profiles:posted_by (id, email, name, location, points)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching food listings:', error);
        return;
      }

      // Transform Supabase data to match our FoodListing type
      const transformedListings: FoodListing[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        postedBy: {
          // Fix: Properly access the profiles object properties
          id: item.profiles?.id || 'unknown',
          email: item.profiles?.email || 'unknown',
          name: item.profiles?.name || 'Unknown User',
          location: item.profiles?.location || { address: 'Unknown location', latitude: 0, longitude: 0 },
          points: item.profiles?.points || 0,
          createdAt: new Date()
        },
        location: item.location,
        isClaimed: item.is_claimed,
        claimedBy: item.claimed_by,
        createdAt: new Date(item.created_at),
        expiresAt: item.expires_at ? new Date(item.expires_at) : undefined
      }));

      setFoodListings(transformedListings);
    } catch (error) {
      console.error('Error in fetchFoodListings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch listings on component mount
  useEffect(() => {
    fetchFoodListings();
  }, []);

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

  const addFoodListing = async (listing: Omit<FoodListing, 'id' | 'postedBy' | 'isClaimed' | 'createdAt'>) => {
    if (user) {
      try {
        // The actual insert to Supabase is now handled in the form
        // We just need to update the local state with optimistic updates
        const newListing: FoodListing = {
          id: `listing-${Date.now()}`, // Temporary ID, will be replaced by Supabase's
          ...listing,
          postedBy: user,
          isClaimed: false,
          createdAt: new Date(),
        };
        
        setFoodListings([newListing, ...foodListings]);
      } catch (error) {
        console.error('Error adding food listing:', error);
        toast.error("Failed to add food listing");
      }
    } else {
      toast.error("You must be logged in to add a listing");
    }
  };

  const claimListing = async (listingId: string, pickupTime: Date) => {
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
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('food_listings')
        .update({ 
          is_claimed: true, 
          claimed_by: user.id 
        })
        .eq('id', listingId);
        
      if (error) throw error;
      
      // Create claim in Supabase
      const { error: claimError } = await supabase
        .from('claims')
        .insert({
          listing_id: listingId,
          user_id: user.id,
          pickup_time: pickupTime.toISOString(),
          status: 'pending'
        });
        
      if (claimError) throw claimError;
      
      // Update local state
      const updatedListings = [...foodListings];
      updatedListings[listingIndex] = {
        ...updatedListings[listingIndex],
        isClaimed: true,
        claimedBy: user.id,
      };
      
      setFoodListings(updatedListings);
      
      // Create a new claim locally
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
      
      // In a real app, we would update the user's points in Supabase here
      
      toast.success(`You have claimed this listing. Pickup scheduled!`);
      toast(`${listingOwner.name} has been awarded ${pointsToAward} points!`);
      
      return true;
    } catch (error) {
      console.error('Error claiming listing:', error);
      toast.error("Failed to claim listing");
      return false;
    }
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
    fetchFoodListings
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
