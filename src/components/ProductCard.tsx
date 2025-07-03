
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
  category_id: string | null;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  showAddToCart = true 
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4">
        <div className="aspect-square relative mb-2">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">${product.price}</span>
          <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </Badge>
        </div>
      </CardContent>
      {showAddToCart && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={() => onAddToCart?.(product.id)}
            disabled={product.quantity === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
