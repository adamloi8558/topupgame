'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AddProductButton() {
  const handleAddProduct = () => {
    // TODO: Implement add product functionality
    console.log('Add product clicked');
  };

  return (
    <Button variant="gaming" onClick={handleAddProduct}>
      <Plus className="mr-2 h-4 w-4" />
      เพิ่มสินค้าใหม่
    </Button>
  );
} 