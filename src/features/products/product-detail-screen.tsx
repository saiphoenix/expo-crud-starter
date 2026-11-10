import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Image,
  ScrollView,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { translate } from '@/lib/i18n';
import { useDeleteProduct, useProduct } from './api';
import { formatPrice } from './utils';

/**
 * LAYER 4 — SCREEN (READ: detail + DELETE)
 */
export function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isPending, isError, error, refetch } = useProduct(productId);
  const deleteProduct = useDeleteProduct();

  const title = translate('products.detail_title');

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Stack.Screen options={{ title }} />
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Stack.Screen options={{ title }} />
        <Text className="mb-2 text-center">{translate('products.error_loading')}</Text>
        <Text className="mb-4 text-center text-sm text-muted-foreground">{error.message}</Text>
        <Button label={translate('common.retry')} onPress={() => refetch()} />
      </View>
    );
  }

  const onDelete = () =>
    Alert.alert(translate('products.delete_confirm_title'), product.title, [
      { text: translate('common.cancel'), style: 'cancel' },
      {
        text: translate('common.delete'),
        style: 'destructive',
        onPress: () =>
          deleteProduct.mutate(product.id, {
            onSuccess: () => {
              showMessage({ message: translate('products.deleted'), type: 'success' });
              router.back();
            },
            onError: e => showErrorMessage(e.message),
          }),
      },
    ]);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title }} />
      <FocusAwareStatusBar />
      <Image
        source={{ uri: product.thumbnail }}
        className="h-64 w-full rounded-xl bg-muted"
        contentFit="contain"
      />
      <Text testID="product-detail-title" className="mt-4 text-2xl font-bold">
        {product.title}
      </Text>
      <Text className="capitalize text-muted-foreground">{product.category}</Text>
      <Text className="mt-2 text-xl font-semibold">{formatPrice(product.price)}</Text>
      <Text className="mt-1 text-sm text-muted-foreground">
        {translate('products.form.stock')}
        :
        {' '}
        {product.stock}
      </Text>
      <Text className="mt-4 leading-6">{product.description}</Text>

      <View className="mt-6">
        <Button
          testID="product-edit-button"
          label={translate('common.edit')}
          variant="outline"
          onPress={() => router.push(`/product/${product.id}/edit`)}
        />
        <Button
          testID="product-delete-button"
          label={translate('common.delete')}
          variant="destructive"
          loading={deleteProduct.isPending}
          onPress={onDelete}
        />
      </View>
    </ScrollView>
  );
}
