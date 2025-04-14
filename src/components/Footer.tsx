
import { Link } from "react-router-dom";
import { CircuitBoard, Facebook, Github, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-tech-dark text-white">
      <div className="circuit-line"></div>
      
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <CircuitBoard className="h-6 w-6 text-tech-primary" />
              <span className="font-bold text-xl">Tech Treasure Trove</span>
            </Link>
            <p className="text-tech-light/70 mb-6 max-w-md">
              Connecting neighbors to share unused tech, reduce e-waste,
              and build a more sustainable community.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-tech-light/70 hover:text-tech-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-tech-light/70 hover:text-tech-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-tech-light/70 hover:text-tech-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-tech-light/70 hover:text-tech-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-tech-light/70 hover:text-tech-primary">Browse Items</Link>
              </li>
              <li>
                <Link to="/" className="text-tech-light/70 hover:text-tech-primary">Post an Item</Link>
              </li>
              <li>
                <Link to="/" className="text-tech-light/70 hover:text-tech-primary">Categories</Link>
              </li>
              <li>
                <Link to="/" className="text-tech-light/70 hover:text-tech-primary">How It Works</Link>
              </li>
              <li>
                <Link to="/" className="text-tech-light/70 hover:text-tech-primary">Community Guidelines</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Stay Updated</h3>
            <p className="text-tech-light/70 mb-4 text-sm">
              Sign up for our newsletter to get the latest listings and community news.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-tech-dark/50 border-tech-light/20"
              />
              <Button className="bg-tech-primary hover:bg-tech-secondary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-tech-light/10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-tech-light/50 text-sm">
            © 2025 Tech Treasure Trove. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-tech-light/50">
            <Link to="/" className="hover:text-tech-primary">Privacy Policy</Link>
            <Link to="/" className="hover:text-tech-primary">Terms of Service</Link>
            <Link to="/" className="hover:text-tech-primary">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
