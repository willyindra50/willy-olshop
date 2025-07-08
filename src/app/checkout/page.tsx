'use client';

import { useCart } from '@/store/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    alert('Order placed successfully! 🎉');
    clearCart();
    router.push('/');
  };

  return (
    <main className='max-w-4xl mx-auto px-6 py-12'>
      <h1 className='text-2xl font-bold mb-6'>Checkout</h1>

      {items.length === 0 ? (
        <p className='text-muted-foreground'>Your cart is empty.</p>
      ) : (
        <>
          <div className='space-y-4'>
            {items.map((item) => (
              <div
                key={item.id}
                className='flex items-center gap-4 border-b pb-4'
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={60}
                  height={60}
                  className='w-16 h-16 object-contain'
                />
                <div className='flex-1'>
                  <p className='font-medium'>{item.title}</p>
                  <p className='text-sm text-muted-foreground'>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className='text-right font-semibold'>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className='mt-6 flex justify-between items-center'>
            <p className='text-xl font-bold'>Total: ${total.toFixed(2)}</p>
            <Button onClick={handleCheckout} className='text-white'>
              Place Order
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
