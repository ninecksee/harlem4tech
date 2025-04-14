
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircuitBoard, Menu, PlusCircle, Search, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <CircuitBoard className="h-6 w-6 text-tech-primary" />
          <span className="font-bold text-xl hidden sm:inline">Harlem4Tech</span>
          <span className="font-bold text-xl sm:hidden">H4T</span>
          <div className="hidden md:block">
            <span className="ml-2 text-xs bg-tech-secondary text-white px-2 py-0.5 rounded-full">BETA</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link to="/" className="text-foreground/60 hover:text-foreground">Browse</Link>
            <Link to="/" className="text-foreground/60 hover:text-foreground">Categories</Link>
            <Link to="/" className="text-foreground/60 hover:text-foreground">How It Works</Link>
            <Link to="/" className="text-foreground/60 hover:text-foreground">About</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-foreground/60">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {user ? (
            <>
              <Button variant="default" className="bg-tech-primary hover:bg-tech-secondary">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:block">Post Item</span>
                <span className="sm:hidden">Post</span>
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
                  <Link to="/">Categories</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/">How It Works</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/">About</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
