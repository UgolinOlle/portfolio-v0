import { GandiButton } from 'registry/components/core/button/button.gandi';

function ButtonGandiExample() {
  return (
    <section className="flex flex-col space-y-10">
      <h2 className="text-xl font-semibold tracking-tight">Gandi Button</h2>
      <section className="grid grid-cols-2 gap-10 md:grid-cols-3">
        <GandiButton variant="default">Default</GandiButton>

        <GandiButton variant="primary">Primary</GandiButton>

        <GandiButton variant="secondary">Secondary</GandiButton>

        <GandiButton variant="destructive">Delete</GandiButton>

        <GandiButton variant="success">Success</GandiButton>

        <GandiButton variant="warning">Warning</GandiButton>

        <GandiButton variant="outline">Outline</GandiButton>

        <GandiButton variant="ghost">Ghost</GandiButton>
      </section>

      <h2 className="text-xl font-semibold tracking-tight">Loading state</h2>
      <section className="grid grid-cols-2 gap-6 md:grid-cols-3">
        <GandiButton variant="primary" loading>
          Save changes
        </GandiButton>
      </section>
    </section>
  );
}

export default ButtonGandiExample;
