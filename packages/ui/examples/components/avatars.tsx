import { AvatarStack } from 'registry/components/core/avatars/avatars';

const avatars = [
  {
    name: 'Emma',
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Lucas',
    image: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Noah',
    image: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Léa',
    image: 'https://i.pravatar.cc/150?img=4',
  },
  {
    name: 'Jade',
    image: 'https://i.pravatar.cc/150?img=5',
  },
];

export default function AvatarsDemo() {
  return <AvatarStack avatars={avatars} />;
}
