import { productKeys } from './query-keys';

describe('productKeys', () => {
  it('builds a tree so lists and details share the same root', () => {
    expect(productKeys.all).toEqual(['products']);
    expect(productKeys.list({ q: 'phone' })).toEqual(['products', 'list', { q: 'phone' }]);
    expect(productKeys.detail(5)).toEqual(['products', 'detail', 5]);
  });

  it('list keys start with lists() so invalidating lists() refreshes all of them', () => {
    const lists = productKeys.lists();
    expect(productKeys.list({}).slice(0, lists.length)).toEqual([...lists]);
  });
});
