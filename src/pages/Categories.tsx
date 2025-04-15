
import React from 'react';
import Header from "@/components/Header";
import CategoryGrid from "@/components/category/CategoryGrid";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Categories</h1>
        <CategoryGrid />
      </main>
    </div>
  );
};

export default Categories;
