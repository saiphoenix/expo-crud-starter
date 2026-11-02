import type { Product } from '../types';

import * as React from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';
import { formatPrice } from '../utils';

type Props = {
  product: Product;
  onPress: (product: Product) => void;
};

export function ProductCard({ product, onPress }: Props) {
  return (
    <Pressable
      testID={`product-card-${product.id}`}
      accessibilityRole="button"
      accessibilityLabel={product.title}
      onPress={() => onPress(product)}
      className="mx-4 my-2 flex-row rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <Image
        source={{ uri: product.thumbnail }}
        className="size-20 rounded-lg bg-neutral-100"
        contentFit="cover"
      />
      <View className="ml-3 flex-1 justify-center">
        <Text className="font-semibold" numberOfLines={1}>
          {product.title}
        </Text>
        <Text className="text-sm text-neutral-500 capitalize">
          {product.category}
        </Text>
        <Text className="mt-1 font-bold">{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}
