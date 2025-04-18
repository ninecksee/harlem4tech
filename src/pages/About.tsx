
import React from 'react';
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { CircuitBoard, Heart, Sprout, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-tech-dark text-white py-16">
          <div className="container">
            <h1 className="text-4xl font-bold text-center mb-4">About Harlem4Home</h1>
            <p className="text-center text-tech-light/80 max-w-2xl mx-auto">
              We're building a community-driven platform to make technology accessible 
              to everyone in Harlem while reducing electronic waste.
            </p>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <CircuitBoard className="h-12 w-12 text-tech-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Tech For All</h3>
                <p className="text-muted-foreground">
                  Making technology accessible to everyone in our community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Sprout className="h-12 w-12 text-tech-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Eco-Friendly</h3>
                <p className="text-muted-foreground">
                  Reducing electronic waste by giving tech a second life.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-tech-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Community-Driven</h3>
                <p className="text-muted-foreground">
                  Built by and for the Harlem community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-tech-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Free Forever</h3>
                <p className="text-muted-foreground">
                  No fees, just neighbors helping neighbors.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              Harlem4Home aims to get old and broken or useless technology to hands that know how to utilize it better.
              In a manner that's easy, secure, and fulfilling.
              Additionally, the redistribution of what would otherwise become e-waste means a greener planet for our future.
            </p>
            <p className="text-muted-foreground mb-4">
              By facilitating the redistribution of used but functional tech items within our 
              community, we're not just helping individuals - we're building a more sustainable 
              and connected Harlem.
            </p>
            <p className="text-muted-foreground">
              Join us in our mission to make technology accessible to everyone while reducing 
              electronic waste and strengthening our community bonds.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
