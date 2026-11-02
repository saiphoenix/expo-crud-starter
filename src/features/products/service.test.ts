import { client } from '@/lib/api';
import { productService } from './service';

jest.mock('@/lib/api', () => ({
  client: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedClient = client as jest.Mocked<typeof client>;

describe('productService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll calls /products when there is no search query', async () => {
    mockedClient.get.mockResolvedValueOnce({ data: { products: [], total: 0, skip: 0, limit: 20 } });
    await productService.getAll({});
    expect(mockedClient.get).toHaveBeenCalledWith('/products', {
      params: { q: undefined, skip: 0, limit: 20 },
    });
  });

  it('getAll calls /products/search when there is a search query', async () => {
    mockedClient.get.mockResolvedValueOnce({ data: { products: [], total: 0, skip: 0, limit: 20 } });
    await productService.getAll({ q: 'phone' });
    expect(mockedClient.get).toHaveBeenCalledWith('/products/search', {
      params: { q: 'phone', skip: 0, limit: 20 },
    });
  });

  it('create POSTs to /products/add and returns the data', async () => {
    const input = { title: 'A', description: 'B', category: 'c', price: 1, stock: 1 };
    mockedClient.post.mockResolvedValueOnce({ data: { id: 195, ...input } });
    const result = await productService.create(input);
    expect(mockedClient.post).toHaveBeenCalledWith('/products/add', input);
    expect(result.id).toBe(195);
  });

  it('update PUTs and remove DELETEs the right URL', async () => {
    mockedClient.put.mockResolvedValueOnce({ data: {} });
    mockedClient.delete.mockResolvedValueOnce({ data: {} });
    await productService.update(5, { title: 'New' });
    await productService.remove(5);
    expect(mockedClient.put).toHaveBeenCalledWith('/products/5', { title: 'New' });
    expect(mockedClient.delete).toHaveBeenCalledWith('/products/5');
  });
});
