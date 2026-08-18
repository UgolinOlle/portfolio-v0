'use client';

import { Badge } from '@portfolio-v0/shadcn/components/badge';
import { Card, CardContent, CardHeader } from '@portfolio-v0/shadcn/components/card';
import { cn } from '@portfolio-v0/shadcn/utils';

import { Check, ChevronRight, LoaderCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

const files = [
  'app/page.tsx',
  'components/ui/button.tsx',
  'components/status-card.tsx',
  'components/navbar.tsx',
  'components/theme-toggle.tsx',
  'lib/utils.ts',
];

export default function StatusCardExample() {
  const [status, setStatus] = useState<'building' | 'success'>('building');
  const [progress, setProgress] = useState(25);
  const [openFiles, setOpenFiles] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((value) => {
        if (value >= 75) return value;

        return value + Math.random() * 8;
      });
    }, 800);

    const timeout = setTimeout(() => {
      setStatus('success');
      setProgress(100);
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Card className="relative w-64 overflow-hidden">
      {/* Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-blue-500/10 blur-3xl"
        animate={{
          opacity: status === 'building' ? 1 : 0,
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white to-green-500/20 blur-2xl"
        animate={{
          opacity: status === 'success' ? 1 : 0,
        }}
        transition={{
          duration: 1.5,
        }}
      />

      <CardHeader className="relative flex flex-row items-center justify-between px-4 py-3">
        <p className="text-sm font-medium">Déploiement</p>

        <Badge
          variant="secondary"
          className={cn(
            'overflow-hidden text-[10px]',
            status === 'building' && 'border-blue-500/20 bg-blue-500/10 text-blue-600',
            status === 'success' && 'border-green-500/20 bg-green-500/10 text-green-600',
          )}
        >
          <AnimatePresence mode="wait">
            {status === 'building' ? (
              <motion.span
                key="build"
                className="flex items-center gap-1"
                initial={{
                  opacity: 0,
                  filter: 'blur(5px)',
                }}
                animate={{
                  opacity: 1,
                  filter: 'blur(0)',
                }}
                exit={{
                  opacity: 0,
                  filter: 'blur(5px)',
                }}
              >
                <LoaderCircle className="size-3 animate-spin" />
                Build
              </motion.span>
            ) : (
              <motion.span
                key="success"
                className="flex items-center gap-1"
                initial={{
                  opacity: 0,
                  filter: 'blur(5px)',
                }}
                animate={{
                  opacity: 1,
                  filter: 'blur(0)',
                }}
              >
                <Check className="size-3" />
                Success
              </motion.span>
            )}
          </AnimatePresence>
        </Badge>
      </CardHeader>

      <CardContent className="relative space-y-3 px-4 pb-4">
        <p className="text-xs text-muted-foreground">
          {status === 'building' ? 'Compiling files...' : 'Build successful'}
        </p>

        {/* Files dropdown */}
        <div
          onMouseEnter={() => setOpenFiles(true)}
          onMouseLeave={() => setOpenFiles(false)}
          className="rounded-md border bg-muted/20"
        >
          <div className="flex h-8 items-center justify-between px-3 text-[10px] font-medium">
            <span>Files builds</span>

            <motion.div
              animate={{
                rotate: openFiles ? 90 : 0,
              }}
            >
              <ChevronRight className="size-3" />
            </motion.div>
          </div>

          <AnimatePresence>
            {openFiles && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                  filter: 'blur(4px)',
                }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  filter: 'blur(0)',
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  filter: 'blur(4px)',
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden"
              >
                <div className="space-y-1 px-3 pb-3">
                  {files.map((file, index) => (
                    <motion.div
                      key={file}
                      className="flex items-center gap-2 font-mono text-[9px]"
                      animate={{
                        color: status === 'success' ? '#22c55e' : '#3b82f6',
                      }}
                      transition={{
                        delay: index * 0.08,
                      }}
                    >
                      {status === 'success' ? (
                        <Check className="size-2.5" />
                      ) : (
                        <span className="size-1 rounded-full bg-current" />
                      )}

                      {file}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress */}
        <div className="relative h-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{
              width: `${progress}%`,
              backgroundColor: status === 'success' ? '#22c55e' : '#3b82f6',
            }}
            transition={{
              width: {
                duration: 0.6,
                ease: 'easeOut',
              },
              backgroundColor: {
                duration: 0.8,
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
