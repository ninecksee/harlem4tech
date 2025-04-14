
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategorySection from "@/components/CategorySection";
import ListingGrid from "@/components/ListingGrid";
import HowItWorks from "@/components/HowItWorks";
import RecentActivity from "@/components/RecentActivity";
import Footer from "@/components/Footer";
import { CircuitBoard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-tech-dark text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-circuit-pattern"></div>
          <div className="container relative z-10 py-16 md:py-24 flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-6">
              <div className="flex items-center mb-4">
                <CircuitBoard className="h-8 w-8 text-tech-primary mr-2" />
                <span className="bg-tech-primary/20 text-tech-primary text-sm px-3 py-1 rounded-full">
                  Community Tech Exchange
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Give Your Old Tech <span className="text-tech-primary">A New Home</span>
              </h1>
              
              <p className="text-tech-light/80 text-lg max-w-md">
                Connect with neighbors to share unwanted tech items. Reduce waste while helping others access technology.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-tech-primary hover:bg-tech-secondary">
                  Post an Item
                </Button>
                <Button variant="outline" className="bg-transparent border-tech-light/30 hover:bg-tech-dark/50">
                  Browse Items
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="/lovable-uploads/b3fad430-c636-4c4a-990a-5d2cb76613fe.png" 
                  alt="Tech Treasure Trove" 
                  className="rounded-lg shadow-2xl max-h-[400px] object-contain mx-auto"
                />
                <div className="absolute -bottom-3 -right-3 bg-tech-primary text-white p-3 rounded-lg shadow-lg">
                  <p className="text-sm font-bold">100% Free</p>
                  <p className="text-xs">No fees, just community</p>
                </div>
              </div>
            </div>
          </div>
          <div className="circuit-line"></div>
        </section>
        
        {/* Search Section */}
        <section className="container py-8">
          <SearchBar />
        </section>
        
        {/* Categories Section */}
        <section className="container">
          <CategorySection />
        </section>
        
        {/* Main Content Section */}
        <section className="container py-8">
          {isMobile ? (
            <>
              <ListingGrid />
              <div className="mt-12">
                <RecentActivity />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <ListingGrid />
              </div>
              <div className="lg:col-span-1">
                <RecentActivity />
              </div>
            </div>
          )}
        </section>
        
        {/* How It Works Section */}
        <section className="bg-gray-50">
          <div className="container">
            <HowItWorks />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container py-16">
          <div className="bg-tech-primary rounded-xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join the Tech Sharing Community?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Your unused tech could be someone else's treasure. Get started today and make a difference in your community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-tech-primary hover:bg-gray-100">
                Post Your First Item
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-tech-primary/80">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
