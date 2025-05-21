
import { User, FoodListing, Message, Claim } from "@/types";

// Mock users
export const users: User[] = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    location: {
      address: "123 Main St, New York, NY",
      latitude: 40.7128,
      longitude: -74.006,
    },
    points: 150,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    location: {
      address: "456 Elm St, New York, NY",
      latitude: 40.7148,
      longitude: -74.0031,
    },
    points: 80,
    createdAt: new Date("2023-02-20"),
  },
];

// Mock food listings
export const foodListings: FoodListing[] = [
  {
    id: "1",
    title: "Homemade Pasta",
    description: "Fresh homemade pasta with tomato sauce. Made today, enough for 2 people.",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    postedBy: users[0],
    location: {
      address: "123 Main St, New York, NY",
      latitude: 40.7128,
      longitude: -74.006,
    },
    isClaimed: false,
    createdAt: new Date("2023-05-20T10:30:00"),
    expiresAt: new Date("2023-05-21T10:30:00"),
  },
  {
    id: "2",
    title: "Leftover Birthday Cake",
    description: "Half of a chocolate birthday cake. Still very fresh!",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    postedBy: users[1],
    location: {
      address: "456 Elm St, New York, NY",
      latitude: 40.7148,
      longitude: -74.0031,
    },
    isClaimed: true,
    claimedBy: "1",
    createdAt: new Date("2023-05-19T14:20:00"),
    expiresAt: new Date("2023-05-22T14:20:00"),
  },
  {
    id: "3",
    title: "Vegetable Soup",
    description: "Homemade vegetable soup, about 4 servings left. Made with fresh organic vegetables.",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554",
    postedBy: users[0],
    location: {
      address: "123 Main St, New York, NY",
      latitude: 40.7128,
      longitude: -74.006,
    },
    isClaimed: false,
    createdAt: new Date("2023-05-20T16:45:00"),
    expiresAt: new Date("2023-05-22T16:45:00"),
  },
];

// Mock messages
export const messages: Message[] = [
  {
    id: "1",
    senderId: "1",
    receiverId: "2",
    content: "Hi, I'm interested in your leftover cake!",
    createdAt: new Date("2023-05-19T15:30:00"),
    read: true,
  },
  {
    id: "2",
    senderId: "2",
    receiverId: "1",
    content: "Great! When would you like to pick it up?",
    createdAt: new Date("2023-05-19T15:35:00"),
    read: true,
  },
];

// Mock claims
export const claims: Claim[] = [
  {
    id: "1",
    listingId: "2",
    userId: "1",
    pickupTime: new Date("2023-05-20T17:00:00"),
    status: "confirmed",
    createdAt: new Date("2023-05-19T15:40:00"),
  },
];

// Current user (for development)
export const currentUser = users[0];
