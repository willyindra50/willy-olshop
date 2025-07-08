'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <p className='p-6'>Loading...</p>;
  if (isError || !product)
    return <p className='p-6 text-red-500'>Product not found.</p>;

  return (
    <main className='max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8'>
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={400}
        height={400}
        className='rounded-lg object-contain w-full max-w-sm'
      />

      <div className='flex-1 space-y-4'>
        <h1 className='text-2xl font-bold'>{product.title}</h1>
        <p className='text-muted-foreground'>{product.category}</p>
        <p className='text-lg font-semibold'>${product.price}</p>
        <p className='text-sm text-gray-600'>{product.description}</p>

        <Button
          onClick={() =>
            addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.thumbnail,
            })
          }
          className='bg-blue-600 text-white hover:bg-blue-800'
        >
          Add to Cart
        </Button>
      </div>
    </main>
  );
}
