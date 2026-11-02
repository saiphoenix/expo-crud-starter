import type { Product } from '../types';

import * as React from 'react';

import { cleanup, screen, setup } from '@/lib/test-utils';
import { ProductCard } from './product-card';

afterEach(cleanup);

const product: Product = {
  id: 1,
  title: 'Running Shoes',
  description: 'Lightweight shoes',
  category: 'fashion',
  price: 49.99,
  stock: 10,
  thumbnail: 'https://example.com/shoes.png',
};

describe('productCard', () => {
  it('shows the title, category and formatted price', () => {
    setup(<ProductCard product={product} onPress={jest.fn()} />);
    expect(screen.getByText('Running Shoes')).toBeOnTheScreen();
    expect(screen.getByText('fashion')).toBeOnTheScreen();
    expect(screen.getByText('$49.99')).toBeOnTheScreen();
  });

  it('calls onPress with the product', async () => {
    const onPress = jest.fn();
    const { user } = setup(<ProductCard product={product} onPress={onPress} />);
    await user.press(screen.getByTestId('product-card-1'));
    expect(onPress).toHaveBeenCalledWith(product);
  });
});
