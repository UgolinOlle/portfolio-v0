'use client';

import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

type Avatar = {
  name: string;
  image: string;
};

type AvatarStackProps = {
  avatars: Avatar[];
  className?: string;
};

export function AvatarStack({ avatars, className }: AvatarStackProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {avatars.slice(0, 5).map((avatar, index) => (
        <motion.div
          key={avatar.name}
          initial={{
            opacity: 0,
            x: -20,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.35,
            delay: index * 0.06,
            ease: 'easeOut',
          }}
          whileHover={{
            y: -6,
            scale: 1.08,
            zIndex: 50,
          }}
          className={cn(
            'relative -ml-3 cursor-pointer rounded-full ring-2 ring-background transition-shadow first:ml-0',
          )}
        >
          <motion.img
            whileHover={{ rotate: index % 2 === 0 ? -3 : 3 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
            src={avatar.image}
            alt={avatar.name}
            className="size-12 rounded-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
}
