import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as AppUser, FoodListing, Message, Claim } from '@/types';
import { messages as initialMessages, claims as initialClaims } from '@/lib/mock-data';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AppContextType {
  user: SupabaseUser | null;
  profile: AppUser | null;
  foodListings: FoodListing[];
  messages: Message[];
  claims: Claim[];
  isAuthenticated: boolean;
  setUser: (user: SupabaseUser | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => void;
  addFoodListing: (listing: Omit<FoodListing, 'id' | 'postedBy' | 'isClaimed' | 'createdAt'>) => void;
  claimListing: (listingId: string, pickupTime: Date) => Promise<boolean>;
  sendMessage: (receiverId: string, content: string) => void;
  getConversation: (userId: string) => Message[];
  fetchFoodListings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Authentication state
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  
  // App data
  const [foodListings, setFoodListings] = useState<FoodListing[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener on mount
  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          // Fetch user profile after sign in 
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        let location;
        try {
          location = typeof data.location === 'string' 
            ? JSON.parse(data.location) 
            : data.location || { address: 'Unknown location', latitude: 0, longitude: 0 };
        } catch (e) {
          location = { address: 'Unknown location', latitude: 0, longitude: 0 };
        }
        
        setProfile({
          id: data.id,
          name: data.name || 'Unknown User',
          email: data.email || '',
          location,
          points: data.points || 0,
          createdAt: new Date(data.created_at)
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

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
      const transformedListings: FoodListing[] = data.map(item => {
        let profileData = item.profiles;
        
        // Handle the case where profiles could be an array or an object
        if (Array.isArray(profileData)) {
          profileData = profileData[0] || {};
        }
        
        let postedByLocation;
        try {
          postedByLocation = typeof profileData?.location === 'string'
            ? JSON.parse(profileData.location)
            : profileData?.location || { address: 'Unknown location', latitude: 0, longitude: 0 };
        } catch (e) {
          postedByLocation = { address: 'Unknown location', latitude: 0, longitude: 0 };
        }
        
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          imageUrl: item.image_url,
          postedBy: {
            id: profileData?.id || 'unknown',
            email: profileData?.email || 'unknown',
            name: profileData?.name || 'Unknown User',
            location: postedByLocation,
            points: profileData?.points || 0,
            createdAt: new Date()
          },
          location: item.location,
          isClaimed: item.is_claimed,
          claimedBy: item.claimed_by,
          createdAt: new Date(item.created_at),
          expiresAt: item.expires_at ? new Date(item.expires_at) : undefined
        };
      });

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

  const logout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  const addFoodListing = async (listing: Omit<FoodListing, 'id' | 'postedBy' | 'isClaimed' | 'createdAt'>) => {
    if (user && profile) {
      try {
        // The actual insert to Supabase is now handled in the form
        // We just need to update the local state with optimistic updates
        const newListing: FoodListing = {
          id: `listing-${Date.now()}`, // Temporary ID, will be replaced by Supabase's
          ...listing,
          postedBy: profile,
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
    profile,
    foodListings,
    messages,
    claims,
    isAuthenticated: !!user,
    setUser,
    setSession,
    logout,
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
