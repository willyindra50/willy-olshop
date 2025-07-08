'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useCart } from '@/store/cart';
import { useSearch } from '@/store/search';
import { ArrowUp } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  category: string;
}

export default function HomePage() {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch();

  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async () => {
    if (loading) return;
    setLoading(true);
    const res = await api.get(`/products?limit=10&skip=${skip}`);
    setProducts((prev) => [...prev, ...res.data.products]);
    setTotal(res.data.total);
    setSkip((prev) => prev + 10);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && products.length < total) {
          fetchProducts();
        }
      },
      { rootMargin: '300px' }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [products, total]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchTitle = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      return matchTitle && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const categoryList = useMemo(() => {
    const rawCats = products.map((p) => p.category).filter(Boolean);
    const unique = Array.from(new Set(rawCats));
    return ['all', ...unique];
  }, [products]);

  return (
    <>
      {/* Filter Kategori */}
      <div className='px-6 pt-4 flex gap-2 flex-wrap items-center'>
        {categoryList.map((cat, index) => (
          <Button
            key={`${cat}-${index}`}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* List Produk */}
      {filteredProducts.length === 0 ? (
        <p className='p-6 text-muted-foreground'>No products found.</p>
      ) : (
        <main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-4'>
          {filteredProducts.map((product) => (
            <div key={product.id} className='flex flex-col'>
              <Link href={`/product/${product.id}`} className='block'>
                <Card className='cursor-pointer hover:shadow-xl transition flex flex-col'>
                  <CardContent className='p-4'>
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={200}
                      height={200}
                      className='h-48 w-full object-contain mb-4'
                    />
                    <h2 className='font-semibold mb-2 line-clamp-2 min-h-[48px]'>
                      {product.title}
                    </h2>
                    <p className='text-sm text-muted-foreground mb-2'>
                      ${product.price}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Button
                variant='secondary'
                onClick={() =>
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.thumbnail,
                  })
                }
                className='bg-blue-500 text-white hover:bg-blue-700 mt-2'
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </main>
      )}

      {/* Infinite Scroll Anchor */}
      <div ref={loadMoreRef} className='h-10' />

      {loading && (
        <p className='text-center text-muted-foreground py-4'>Loading...</p>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition'
          aria-label='Scroll to top'
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
