import type { Product } from './types';

import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import * as React from 'react';

import {
  ActivityIndicator,
  Button,
  EmptyList,
  FocusAwareStatusBar,
  Input,
  Text,
  View,
} from '@/components/ui';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { translate } from '@/lib/i18n';
import { useProducts } from './api';
import { ProductCard } from './components/product-card';

/**
 * LAYER 4 — SCREEN (READ: list)
 *
 * Handles all 4 UI states: ⏳ loading · ❌ error · 📭 empty · ✅ success
 * The screen never calls axios — it only uses the `useProducts` hook.
 */
export function ProductListScreen() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const q = useDebounce(search.trim(), 400) || undefined;

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(q);

  const products = React.useMemo(
    () => data?.pages.flatMap(page => page.products) ?? [],
    [data],
  );

  const openProduct = React.useCallback(
    (product: Product) => router.push(`/product/${product.id}`),
    [router],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={openProduct} />
    ),
    [openProduct],
  );

  const onEndReached = () => {
    // Guard prevents loading the same page twice (duplicate items).
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <View className="px-4 pt-3">
        <Input
          testID="product-search-input"
          placeholder={translate('products.search_placeholder')}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      </View>

      {isError
        ? (
            <View className="flex-1 items-center justify-center p-6">
              <Text className="mb-2 text-center">{translate('products.error_loading')}</Text>
              <Text className="mb-4 text-center text-sm text-neutral-500">{error.message}</Text>
              <Button label={translate('common.retry')} onPress={() => refetch()} />
            </View>
          )
        : (
            <FlashList
              testID="product-list"
              data={products}
              renderItem={renderItem}
              keyExtractor={item => String(item.id)}
              ListEmptyComponent={<EmptyList isLoading={isPending} />}
              ListFooterComponent={isFetchingNextPage ? <View className="py-4"><ActivityIndicator /></View> : null}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              onRefresh={refetch}
              refreshing={isRefetching && !isFetchingNextPage}
            />
          )}
    </View>
  );
}
