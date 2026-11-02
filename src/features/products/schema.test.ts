import { productSchema, toProductFormValues, toProductInput } from './schema';

const valid = {
  title: 'Running Shoes',
  description: 'Lightweight shoes for daily runs',
  category: 'fashion',
  price: '49.99',
  stock: '10',
};

describe('productSchema', () => {
  it('accepts a valid product', () => {
    expect(productSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a short title', () => {
    expect(productSchema.safeParse({ ...valid, title: 'ab' }).success).toBe(false);
  });

  it('rejects a zero or non-numeric price', () => {
    expect(productSchema.safeParse({ ...valid, price: '0' }).success).toBe(false);
    expect(productSchema.safeParse({ ...valid, price: 'abc' }).success).toBe(false);
  });

  it('rejects a decimal stock', () => {
    expect(productSchema.safeParse({ ...valid, stock: '1.5' }).success).toBe(false);
  });
});

describe('form <-> API converters', () => {
  it('converts form strings to numbers for the API', () => {
    expect(toProductInput(valid)).toEqual({
      title: 'Running Shoes',
      description: 'Lightweight shoes for daily runs',
      category: 'fashion',
      price: 49.99,
      stock: 10,
    });
  });

  it('converts an API product to form values', () => {
    const values = toProductFormValues({
      id: 1,
      thumbnail: 'https://example.com/a.png',
      ...toProductInput(valid),
    });
    expect(values.price).toBe('49.99');
    expect(values.stock).toBe('10');
  });
});
