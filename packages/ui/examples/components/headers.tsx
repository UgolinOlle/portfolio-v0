import { Header } from 'registry/components/core/headers/headers';

function HeadersExample() {
  return (
    <section className="flex flex-col gap-4">
      <Header>Heading 1</Header>

      <Header as="h2">Heading 2</Header>

      <Header as="h3" className="text-primary">
        Heading 3
      </Header>

      <Header as="h4">Heading 4</Header>

      <Header as="h5">Heading 5</Header>

      <Header as="h6">Heading 6</Header>
    </section>
  );
}

export default HeadersExample;
