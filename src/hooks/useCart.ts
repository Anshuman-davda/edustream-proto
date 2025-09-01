import { useState, useEffect } from 'react';
import { Course } from '@/data/mockCourses';

export interface CartItem {
  course: Course;
  addedAt: Date;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('edustream-cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Convert addedAt strings back to Date objects
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

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('edustream-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems(prev => {
      // Check if course is already in cart
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

  return {
    items,
    addToCart,
    removeFromCart,
    isInCart,
    getTotalPrice,
    getTotalItems,
    clearCart
  };
};