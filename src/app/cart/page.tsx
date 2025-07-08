'use client';

import { useCart } from '@/store/cart';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className='max-w-4xl mx-auto px-6 py-12'>
      <h1 className='text-2xl font-bold mb-6'>Your Cart</h1>

      {items.length === 0 ? (
        <p className='text-muted-foreground'>Your shopping cart is empty.</p>
      ) : (
        <div className='space-y-6'>
          {items.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-4 border-b pb-4'
            >
              <Image
                src={item.image}
                alt={item.title}
                width={80}
                height={80}
                className='w-20 h-20 object-contain'
              />
              <div className='flex-1'>
                <h2 className='font-medium'>{item.title}</h2>
                <p className='text-sm text-muted-foreground'>
                  ${item.price.toFixed(2)}
                </p>
                <div className='flex items-center gap-2 mt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          ))}

          <div className='mt-6 flex justify-between items-center'>
            <p className='text-lg font-semibold'>Total: ${total.toFixed(2)}</p>
            <div className='flex gap-2'>
              <Button variant='destructive' onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href='/checkout'>
                <Button>Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
