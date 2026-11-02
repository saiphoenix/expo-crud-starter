import type { ProductFormValues } from '../schema';

import { useForm } from '@tanstack/react-form';
import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Button, Input } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';
import { translate } from '@/lib/i18n';
import { emptyProductForm, productSchema } from '../schema';

export type ProductFormProps = {
  defaultValues?: ProductFormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: ProductFormValues) => void;
};

/**
 * Reusable form for BOTH create and edit.
 * It knows nothing about the API — the screen decides what to do on submit.
 * Pattern copied from src/features/auth/components/login-form.tsx
 */
export function ProductForm({
  defaultValues = emptyProductForm,
  submitLabel,
  submitting = false,
  onSubmit,
}: ProductFormProps) {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: productSchema as any,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <form.Field
        name="title"
        children={field => (
          <Input
            testID="product-title-input"
            label={translate('products.form.title')}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />
      <form.Field
        name="description"
        children={field => (
          <Input
            testID="product-description-input"
            label={translate('products.form.description')}
            multiline
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />
      <form.Field
        name="category"
        children={field => (
          <Input
            testID="product-category-input"
            label={translate('products.form.category')}
            autoCapitalize="none"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />
      <form.Field
        name="price"
        children={field => (
          <Input
            testID="product-price-input"
            label={translate('products.form.price')}
            keyboardType="decimal-pad"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />
      <form.Field
        name="stock"
        children={field => (
          <Input
            testID="product-stock-input"
            label={translate('products.form.stock')}
            keyboardType="number-pad"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />
      <form.Subscribe
        selector={state => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button
            testID="product-submit-button"
            label={submitLabel}
            loading={submitting || isSubmitting}
            onPress={form.handleSubmit}
          />
        )}
      />
    </KeyboardAwareScrollView>
  );
}
