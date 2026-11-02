import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { showMessage } from 'react-native-flash-message';

import { showErrorMessage } from '@/components/ui';
import { translate } from '@/lib/i18n';
import { useCreateProduct } from './api';
import { ProductForm } from './components/product-form';
import { toProductInput } from './schema';

/**
 * LAYER 4 — SCREEN (CREATE)
 */
export function ProductCreateScreen() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  return (
    <>
      <Stack.Screen options={{ title: translate('products.add_title') }} />
      <ProductForm
        submitLabel={translate('products.form.create')}
        submitting={createProduct.isPending}
        onSubmit={values =>
          createProduct.mutate(toProductInput(values), {
            onSuccess: () => {
              showMessage({ message: translate('products.created'), type: 'success' });
              router.back(); // list refreshes automatically (invalidated in api.ts)
            },
            onError: e => showErrorMessage(e.message),
          })}
      />
    </>
  );
}
