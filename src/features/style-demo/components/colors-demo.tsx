import * as React from 'react';
import { Text, View } from '@/components/ui';
import colors from '@/components/ui/colors';

import { Title } from './title';

type ColorName = keyof typeof colors;

// Semantic theme tokens from src/global.css. Use these in components;
// they switch automatically between light and dark mode.
const THEME_TOKENS = [
  { name: 'background', className: 'bg-background' },
  { name: 'foreground', className: 'bg-foreground' },
  { name: 'card', className: 'bg-card' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'muted-foreground', className: 'bg-muted-foreground' },
  { name: 'border', className: 'bg-border' },
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'destructive', className: 'bg-destructive' },
  { name: 'success', className: 'bg-success' },
  { name: 'warning', className: 'bg-warning' },
] as const;

export function Colors() {
  return (
    <>
      <Title text="Theme tokens" />
      <View className="flex-row flex-wrap">
        {THEME_TOKENS.map(token => (
          <View key={token.name} className="mb-3 w-1/3 pr-2">
            <View className={`h-12 w-full rounded-md border border-border ${token.className}`} />
            <Text className="text-xs">{token.name}</Text>
          </View>
        ))}
      </View>
      <Title text="Palette" />
      {(Object.keys(colors) as ColorName[]).map(name => (
        <Color name={name} key={name} />
      ))}
    </>
  );
}

function Color({ name }: { name: ColorName }) {
  if (typeof colors[name] === 'string')
    return null;
  return (
    <View className="pt-2">
      <Text className="font-medium">{name.toUpperCase()}</Text>
      <View className="flex-row flex-wrap content-between justify-around">
        {Object.entries(colors[name]).map(([key, value]) => {
          return (
            <ColorCard
              key={`${colors[name]}-${key}`}
              value={key}
              color={value}
            />
          );
        })}
      </View>
    </View>
  );
}

function ColorCard({ color, value }: { value: string; color: string }) {
  return (
    <View className="flex-1">
      <View
        className="h-14 w-full rounded-sm"
        style={{ backgroundColor: color }}
      />
      <Text className="text-sm">{value}</Text>
    </View>
  );
}
