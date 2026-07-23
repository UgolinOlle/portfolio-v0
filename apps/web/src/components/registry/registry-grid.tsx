import { RegistryCard } from '~/components/registry/registry-card';
import type { RegistryItem } from '~/lib/registry';

type RegistryGridProps = {
  items: RegistryItem[];
};

export const RegistryGrid = ({ items }: RegistryGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <RegistryCard item={item} key={item.href} />
      ))}
    </div>
  );
};
