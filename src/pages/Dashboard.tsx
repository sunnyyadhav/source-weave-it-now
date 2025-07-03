
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Package, Store, User } from 'lucide-react';
import AddProductDialog from '@/components/AddProductDialog';
import ProductCard from '@/components/ProductCard';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
  category_id: string | null;
  seller_id: string;
  is_active: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    if (profile?.role === 'seller') {
      fetchMyProducts();
    }
  }, [profile]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProducts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMyProducts(data || []);
    } catch (error) {
      console.error('Error fetching my products:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity === 0) {
      toast({
        title: "Product unavailable",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    // Update product quantity
    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity: product.quantity - 1 })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });

      // Refresh products to show updated quantity
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleProductAdded = () => {
    fetchMyProducts();
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">E-Commerce Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{profile?.full_name || user?.email}</span>
                <Badge variant={profile?.role === 'seller' ? 'default' : 'secondary'}>
                  {profile?.role}
                </Badge>
              </div>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seller Dashboard */}
        {profile?.role === 'seller' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Package className="h-6 w-6 mr-2" />
                  My Products
                </h2>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
              <AddProductDialog onProductAdded={handleProductAdded} />
            </div>

            {myProducts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-4">Start selling by adding your first product</p>
                  <AddProductDialog onProductAdded={handleProductAdded} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {myProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAddToCart={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Marketplace */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile?.role === 'seller' ? 'Marketplace' : 'Products'}
            </h2>
            <p className="text-gray-600">
              {profile?.role === 'seller' 
                ? 'Browse products from other sellers' 
                : 'Discover amazing products from our sellers'}
            </p>
          </div>

          {products.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                <p className="text-gray-600">Check back later for new products</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showAddToCart={profile?.role === 'buyer'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
