
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Store, ShoppingCart, Package, Users } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">E-Commerce Platform</h1>
            </div>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Ultimate
            <span className="text-blue-600"> E-Commerce </span>
            Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you're looking to buy amazing products or start selling your own, 
            our platform provides everything you need for a seamless e-commerce experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
              Start Shopping
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
              Become a Seller
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Easy Shopping</h3>
            <p className="text-gray-600">
              Browse through thousands of products with our intuitive interface. 
              Add items to cart and checkout with ease.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Sell Products</h3>
            <p className="text-gray-600">
              Start your business by listing products. Upload images, set prices, 
              and manage inventory with our seller tools.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Trusted Community</h3>
            <p className="text-gray-600">
              Join our growing community of buyers and sellers. 
              Real-time inventory updates and secure transactions.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already buying and selling on our platform.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
            Create Your Account
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
