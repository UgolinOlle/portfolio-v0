import { Download, Plus } from 'lucide-react';
import { Button } from 'registry/components/core/button/button';

function ButtonExample() {
  return (
    <section className="flex flex-col space-y-10">
      <h2 className="text-xl font-semibold tracking-tight">Button core</h2>
      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <Button>Default</Button>

        <Button variant="secondary">Secondary</Button>

        <Button variant="outline">Outline</Button>

        <Button variant="ghost">Ghost</Button>

        <Button variant="destructive">Delete</Button>

        <Button variant="success">Success</Button>

        <Button variant="warning">Warning</Button>

        <Button variant="purple">Purple</Button>
      </section>

      <h2 className="text-xl font-semibold tracking-tight">Button with icons</h2>
      <section className="grid grid-cols-2 gap-10 md:grid-cols-3">
        <Button variant="shine">Shine</Button>

        <Button variant="link">Documentation</Button>

        <Button size="icon">
          <Plus />
        </Button>
      </section>

      <h2 className="text-xl font-semibold tracking-tight">Button with loading state</h2>
      <section className="grid grid-cols-2 gap-6 md:grid-cols-3">
        <Button leadingIcon={<Download />}>Download</Button>

        <Button variant="outline" trailingIcon={<Plus />}>
          Add item
        </Button>

        <Button variant="purple" loading>
          Save changes
        </Button>
      </section>
    </section>
  );
}

export default ButtonExample;
