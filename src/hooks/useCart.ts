import { useContext } from 'react';
import { CartContext } from '@/components/auth/CartProvider';
import { Course } from '@/data/mockCourses';

export interface CartItem {
  course: Course;
  addedAt: Date;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  isInCart: (courseId: string) => boolean;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};