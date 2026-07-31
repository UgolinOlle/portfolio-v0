import { ShopifyButton } from 'registry/components/core/button/button.shopify';

function ButtonShopifyExample() {
  return (
    <section className="flex flex-col space-y-10">
      <h2 className="text-xl font-semibold tracking-tight">Shopify Button</h2>
      <section className="grid grid-cols-2 gap-10 md:grid-cols-3">
        <ShopifyButton variant="default">Continue</ShopifyButton>

        <ShopifyButton variant="primary">Upgrade</ShopifyButton>

        <ShopifyButton variant="secondary">Cancel</ShopifyButton>

        <ShopifyButton variant="destructive">Delete</ShopifyButton>

        <ShopifyButton variant="outline">Learn more</ShopifyButton>

        <ShopifyButton variant="ghost">Skip</ShopifyButton>

        <ShopifyButton variant="success">Confirm</ShopifyButton>
      </section>

      <h2 className="text-xl font-semibold tracking-tight">Loading state</h2>
      <section className="grid grid-cols-2 gap-6 md:grid-cols-3">
        <ShopifyButton variant="primary" loading>
          Save changes
        </ShopifyButton>
      </section>
    </section>
  );
}

export default ButtonShopifyExample;
