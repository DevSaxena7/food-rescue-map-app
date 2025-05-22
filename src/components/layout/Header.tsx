
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusIcon, MapPinIcon, AwardIcon, UserIcon } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  const { profile, isAuthenticated, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-background sticky top-0 z-10 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">F</span>
          </div>
          <span className="font-bold text-lg">FoodShare</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/map")}
                className="hidden sm:flex items-center gap-1"
              >
                <MapPinIcon className="h-4 w-4" />
                <span>Map</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/add")}
                className="hidden sm:flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Food</span>
              </Button>
              <div className="hidden sm:flex items-center gap-1 text-sm mr-2 px-2 py-1 bg-accent rounded-md">
                <AwardIcon className="h-4 w-4 text-secondary" />
                <span>{profile?.points || 0} points</span>
              </div>
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(profile?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/map")}>
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <span>Map</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/add")}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <span>Add Food</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ModeToggle />
              <Button size="sm" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
