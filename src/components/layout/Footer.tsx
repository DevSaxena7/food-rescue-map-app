
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">F</span>
              </div>
              <span className="font-bold text-lg">FoodShare</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Reducing food waste, one share at a time.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <h3 className="text-sm font-medium mb-2">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link to="/map" className="text-muted-foreground hover:text-foreground">Map</Link></li>
                <li><Link to="/add" className="text-muted-foreground hover:text-foreground">Add Food</Link></li>
                <li><Link to="/login" className="text-muted-foreground hover:text-foreground">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FoodShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
