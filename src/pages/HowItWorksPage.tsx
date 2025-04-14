
import React from 'react';
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container py-16">
          <h1 className="text-4xl font-bold text-center mb-16">
            How Harlem4Home Works
          </h1>
          <HowItWorks />
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;
