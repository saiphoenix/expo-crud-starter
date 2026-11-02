import * as React from 'react';

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { ProductForm } from './product-form';

afterEach(cleanup);

describe('productForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const onSubmit = jest.fn();
    const { user } = setup(<ProductForm submitLabel="Create" onSubmit={onSubmit} />);

    await user.press(screen.getByTestId('product-submit-button'));

    expect(await screen.findByText(/Title must be at least 3 characters/i)).toBeOnTheScreen();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the values when the form is valid', async () => {
    const onSubmit = jest.fn();
    const { user } = setup(<ProductForm submitLabel="Create" onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('product-title-input'), 'Running Shoes');
    await user.type(screen.getByTestId('product-description-input'), 'Lightweight shoes for runs');
    await user.type(screen.getByTestId('product-category-input'), 'fashion');
    await user.type(screen.getByTestId('product-price-input'), '49.99');
    await user.type(screen.getByTestId('product-stock-input'), '10');
    await user.press(screen.getByTestId('product-submit-button'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Running Shoes',
      description: 'Lightweight shoes for runs',
      category: 'fashion',
      price: '49.99',
      stock: '10',
    });
  });
});
