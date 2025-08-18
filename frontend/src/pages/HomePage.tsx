import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { OurMission } from '../components/home/OurMission';
import { CustomerTestimonials } from '../components/home/CustomerTestimonials';
import { HeroSection } from '../components/home/HeroSection';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-dark-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover our top-selling supplements carefully selected to fuel your fitness journey
            </p>
          </motion.div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Our Mission Section */}
      <OurMission />

      {/* Customer Testimonials */}
      <CustomerTestimonials />

      {/* Newsletter Signup */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              Stay Updated with Vitality Store
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Get the latest updates on new products, fitness tips, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-dark-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              />
              <button className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                Subscribe
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};