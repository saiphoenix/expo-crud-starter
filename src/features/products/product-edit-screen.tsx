import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { showMessage } from 'react-native-flash-message';

import {
  ActivityIndicator,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { translate } from '@/lib/i18n';
import { useProduct, useUpdateProduct } from './api';
import { ProductForm } from './components/product-form';
import { toProductFormValues, toProductInput } from './schema';

/**
 * LAYER 4 — SCREEN (UPDATE)
 * Same form as create — pre-filled with the current product.
 */
export function ProductEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isPending, isError } = useProduct(productId);
  const updateProduct = useUpdateProduct(productId);

  const title = translate('products.edit_title');

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
        <Text>{translate('products.error_loading')}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ProductForm
        defaultValues={toProductFormValues(product)}
        submitLabel={translate('products.form.save')}
        submitting={updateProduct.isPending}
        onSubmit={values =>
          updateProduct.mutate(toProductInput(values), {
            onSuccess: () => {
              showMessage({ message: translate('products.updated'), type: 'success' });
              router.back();
            },
            onError: e => showErrorMessage(e.message),
          })}
      />
    </>
  );
}
