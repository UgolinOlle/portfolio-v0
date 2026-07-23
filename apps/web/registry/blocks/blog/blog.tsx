import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
}

interface BlogProps {
  tagline?: string;
  heading?: string;
  description?: string;
  posts?: Post[];
}

const defaultPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Getting Started with shadcn/ui Components',
    summary:
      'Learn how to quickly integrate and customize shadcn/ui components in your Next.js projects.',
    label: 'Tutorial',
    author: 'Sarah Chen',
    published: '1 Jan 2024',
    url: '#',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg',
  },
  {
    id: 'post-2',
    title: 'Building Accessible Web Applications',
    summary:
      "Explore how to create inclusive web experiences using shadcn/ui's accessible components.",
    label: 'Accessibility',
    author: 'Marcus Rodriguez',
    published: '1 Jan 2024',
    url: '#',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg',
  },
  {
    id: 'post-3',
    title: 'Modern Design Systems with Tailwind CSS',
    summary: 'Dive into creating scalable design systems using Tailwind CSS and shadcn/ui.',
    label: 'Design Systems',
    author: 'Emma Thompson',
    published: '1 Jan 2024',
    url: '#',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg',
  },
];

export function Blog({
  tagline = 'Latest Updates',
  heading = 'Blog',
  description = 'Discover the latest trends, tips, and best practices in modern web development.',
  posts = defaultPosts,
}: BlogProps) {
  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-5xl tracking-tighter text-pretty md:mb-4 lg:mb-6 lg:max-w-3xl lg:text-7xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0"
            >
              <div className="aspect-video w-full">
                <a href={post.url} target="_blank" rel="noreferrer">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover object-center"
                  />
                </a>
              </div>
              <CardHeader>
                <h3 className="text-xl hover:underline md:text-xl">
                  <a href={post.url} target="_blank" rel="noreferrer">
                    {post.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm font-semibold text-foreground/80">
                  {post.author} · {post.published}
                </p>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{post.summary}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:underline"
                >
                  Read more
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
