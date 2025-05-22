
export interface User {
  id: string;
  email: string;
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  points: number;
  createdAt: Date;
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  postedBy: User;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  isClaimed: boolean;
  claimedBy?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Claim {
  id: string;
  listingId: string;
  userId: string;
  pickupTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

// Extended Supabase user type to differentiate from our app User type
export interface SupabaseUserProfile {
  id: string;
  email: string | null;
  name: string | null; 
  location: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  points: number;
  createdAt: Date;
}
