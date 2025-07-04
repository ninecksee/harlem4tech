
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircuitBoard, Menu, PlusCircle, Search, User, LogOut, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "./SearchBar";
import { useState } from "react";

const Header = () => {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <CircuitBoard className="h-6 w-6 text-tech-primary" />
          <span className="font-bold text-xl hidden sm:inline">Harlem4Home</span>
          <span className="font-bold text-xl sm:hidden">H4H</span>
          <div className="hidden md:block">
            <span className="ml-2 text-xs bg-tech-secondary text-white px-2 py-0.5 rounded-full">BETA</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link to="/" className={`${location.pathname === '/' ? 'text-foreground' : 'text-foreground/60'} hover:text-foreground`}>Browse</Link>
            <Link to="/#categories-section" className="text-foreground/60 hover:text-foreground">Categories</Link>
            <Link to="/how-it-works" className={`${location.pathname === '/how-it-works' ? 'text-foreground' : 'text-foreground/60'} hover:text-foreground`}>How It Works</Link>
            <Link to="/about" className={`${location.pathname === '/about' ? 'text-foreground' : 'text-foreground/60'} hover:text-foreground`}>About</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/60">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <SearchBar />
            </DialogContent>
          </Dialog>
          
          {user ? (
            <>
              <Button 
                variant="default" 
                className="bg-tech-primary hover:bg-tech-secondary"
                asChild
              >
                <Link to="/create-listing">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:block">Post Item</span>
                  <span className="sm:hidden">Post</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages">
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">Messages</span>
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default" className="bg-tech-primary hover:bg-tech-secondary">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
          
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/">Browse</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#categories-section">Categories</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/how-it-works">How It Works</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about">About</Link>
                </DropdownMenuItem>
                {user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/create-listing">Post Item</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/messages">Messages</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
