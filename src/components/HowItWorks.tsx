
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MessagesSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  return (
    <div className="w-full py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">How Tech Treasure Trove Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Help reduce e-waste while helping your community get access to the tech they need.
          Follow these simple steps to get started.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div className="bg-tech-primary/10 rounded-full p-3 inline-flex mb-3">
              <Camera className="h-6 w-6 text-tech-primary" />
            </div>
            <CardTitle>1. Post Your Tech</CardTitle>
            <CardDescription>
              Snap a photo and create a listing for your unused tech items in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Whether it's working or not, someone might find value in your old tech.
              Be honest about the condition and include as many details as possible.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="bg-tech-primary/10 rounded-full p-3 inline-flex mb-3">
              <MessagesSquare className="h-6 w-6 text-tech-primary" />
            </div>
            <CardTitle>2. Connect with Neighbors</CardTitle>
            <CardDescription>
              Respond to interested neighbors and arrange a convenient pickup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Connect safely with people in your community who are interested in your items.
              Use our built-in messaging to coordinate details.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="bg-tech-primary/10 rounded-full p-3 inline-flex mb-3">
              <ThumbsUp className="h-6 w-6 text-tech-primary" />
            </div>
            <CardTitle>3. Reduce Waste, Help Others</CardTitle>
            <CardDescription>
              Give your tech a new life while helping someone else in your community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your unwanted tech could be exactly what someone else needs.
              Reduce electronic waste and strengthen your local community connections.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-10">
        <Button className="bg-tech-primary hover:bg-tech-secondary px-8 py-6">
          Post Your First Item
        </Button>
      </div>
    </div>
  );
};

export default HowItWorks;
