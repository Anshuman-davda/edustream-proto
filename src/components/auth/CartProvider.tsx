import React, { useState, useEffect } from 'react';
import { CartItem, CartContextType } from '@/hooks/useCart';
import { Course } from '@/data/mockCourses';

export const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('edustream-cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        const cartItems = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setItems(cartItems);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('edustream-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems(prev => {
      const exists = prev.find(item => item.course.id === course.id);
      if (exists) {
        return prev;
      }
      return [...prev, { course, addedAt: new Date() }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setItems(prev => prev.filter(item => item.course.id !== courseId));
  };

  const isInCart = (courseId: string): boolean => {
    return items.some(item => item.course.id === courseId);
  };

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + item.course.price, 0);
  };

  const getTotalItems = (): number => {
    return items.length;
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, isInCart, getTotalPrice, getTotalItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
