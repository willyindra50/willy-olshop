'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { useSearch } from '@/store/search';

export default function Navbar() {
  const { items } = useCart();
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <nav className='w-full px-4 sm:px-6 py-4 border-b bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div className='flex justify-between items-center w-full sm:w-auto'>
        <Link
          href='/'
          className='text-xl font-bold tracking-tight text-blue-600'
        >
          My Olshop
        </Link>

        <Link href='/cart' className='sm:hidden'>
          <Button variant='outline' size='icon' className='relative'>
            <ShoppingCart className='h-5 w-5' />
            {totalQty > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
                {totalQty}
              </span>
            )}
          </Button>
        </Link>
      </div>

      <div className='flex flex-1 gap-4 items-center sm:justify-end'>
        <input
          type='text'
          placeholder='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border px-3 py-1.5 rounded-md w-full sm:w-72'
        />

        <Link href='/cart' className='hidden sm:block'>
          <Button variant='outline' size='icon' className='relative'>
            <ShoppingCart className='h-5 w-5' />
            {totalQty > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
                {totalQty}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </nav>
  );
}
