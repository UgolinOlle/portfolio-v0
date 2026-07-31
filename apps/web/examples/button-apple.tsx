import { AppleButton } from 'registry/components/core/button/button.apple';

function ButtonAppleExample() {
  return (
    <section className="flex flex-col space-y-10">
      <h2 className="text-xl font-semibold tracking-tight">Apple Button</h2>
      <section className="grid grid-cols-2 gap-10 md:grid-cols-3">
        <AppleButton variant="default">Default</AppleButton>

        <AppleButton variant="primary">Primary</AppleButton>

        <AppleButton variant="secondary">Secondary</AppleButton>

        <AppleButton variant="destructive">Delete</AppleButton>

        <AppleButton variant="outline">Outline</AppleButton>

        <AppleButton variant="ghost">Ghost</AppleButton>

        <AppleButton variant="link">Documentation</AppleButton>
      </section>

      <h2 className="text-xl font-semibold tracking-tight">Loading state</h2>
      <section className="grid grid-cols-2 gap-6 md:grid-cols-3">
        <AppleButton variant="primary" loading>
          Save changes
        </AppleButton>
      </section>
    </section>
  );
}

export default ButtonAppleExample;
