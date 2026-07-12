'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { ChevronDown, TerminalIcon } from 'lucide-react';
import { Component as ComponentIcon, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '~/hooks/use-media-query';

import { LanguageSwitcher } from './language-switcher';

const links = [
  { href: '#about', label: 'About' },
  { href: '#works', label: 'Works' },
  { href: '#projects', label: 'Projects', mega: true },
  { href: '#stacks', label: 'Stacks' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [openDesktop, setOpenDesktop] = useState(false); // hover desktop
  const [openMobile, setOpenMobile] = useState(false); // click mobile
  const isMobile = useMediaQuery('(max-width: 1023px)'); // < lg
  const navRef = useRef<HTMLDivElement | null>(null);

  const open = openDesktop || openMobile;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!openMobile) return;

      const target = event.target as Node | null;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpenMobile(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMobile]);

  const mobileWidthClosed = 60; // Taille du triangle + padding
  const mobileWidthOpen = 340;

  return (
    <motion.nav
      ref={navRef}
      className={cn(
        'fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl',
        'border border-b-2 border-secondary bg-zinc-100/50 text-primary shadow-md backdrop-blur-3xl',
        'ring shadow-zinc-950/20 ring-white/15 transition-[filter,scale,background]',
        'duration-200 ring-inset hover:bg-zinc-100/90 hover:brightness-110 active:scale-98',
        'backdrop-blur-3xl dark:border-primary dark:bg-primary/90 dark:ring-transparent dark:hover:bg-primary',
      )}
      initial={{
        height: 44,
        width: isMobile ? mobileWidthClosed : undefined,
      }}
      animate={{
        height: open ? 320 : 44,
        width: isMobile ? (open ? mobileWidthOpen : mobileWidthClosed) : undefined,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      {/* NAV DESKTOP */}
      <ul
        className={cn(
          'hidden h-10 items-center justify-center gap-8 px-3 font-mono text-sm lg:flex',
          'tracking-wider uppercase',
        )}
      >
        {links.map((link) => {
          if (link.mega) {
            return (
              <li
                key={link.href}
                onMouseEnter={() => setOpenDesktop(true)}
                className="relative flex cursor-pointer items-center gap-1"
              >
                <span>{link.label}</span>

                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <ChevronDown size={16} />
                </motion.span>
              </li>
            );
          }

          return (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          );
        })}

        <LanguageSwitcher />
      </ul>

      {/* NAV MOBILE : clic sur le triangle / bouton pour ouvrir/fermer */}
      <button
        type="button"
        className="flex h-10 w-full items-center justify-center font-mono text-sm uppercase lg:hidden"
        onClick={() => setOpenMobile((prev) => !prev)}
      >
        <div
          className={cn(
            'h-0 w-0 border-r-18 border-b-28 border-l-18',
            'border-r-transparent border-b-white border-l-transparent',
          )}
        />
      </button>

      {/* MEGA MENU PROJECTS (commun mobile + desktop) */}
      <motion.div
        className="grid grid-cols-2 gap-2 p-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : -10 }}
        transition={{ duration: 0.2 }}
        onMouseLeave={() => setOpenDesktop(false)}
      >
        <div
          className={cn(
            'flex h-30 flex-col items-center justify-center gap-2 rounded-xl',
            'border border-green-400/50 bg-green-400/20 font-sans',
          )}
        >
          <div className="rounded-full bg-green-600 px-2 py-1">
            <ComponentIcon size={28} />
          </div>
          UI Components
        </div>
        <div
          className={cn(
            'flex h-30 flex-col items-center justify-center gap-2 rounded-xl',
            'border border-yellow-400/50 bg-yellow-400/20 font-sans',
          )}
        >
          <div className="rounded-full bg-yellow-600 px-2 py-1">
            <Smartphone size={28} />
          </div>
          Calyx
        </div>
        <div
          className={cn(
            'flex h-30 flex-col items-center justify-center gap-2 rounded-xl border border-violet-400/50 bg-violet-400/20',
          )}
        >
          <div className="rounded-full bg-violet-600 px-2 py-1">
            <TerminalIcon size={28} />
          </div>
          Tools
        </div>
        <div
          className={cn(
            'flex h-30 flex-col items-center justify-center gap-2 rounded-xl border border-blue-400/50 bg-blue-400/20',
          )}
        >
          <TerminalIcon size={34} />
          Tools
        </div>
      </motion.div>
    </motion.nav>
  );
}
