'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 text-center">
      <div className="container mx-auto max-w-6xl">
        <div className="text-xs text-gray-600 space-x-2">
          <Link href="/" className="fb-link">Home</Link>
          <span>•</span>
          <Link href="/friends" className="fb-link">Friends</Link>
          <span>•</span>
          <Link href="#" className="fb-link">Privacy</Link>
          <span>•</span>
          <Link href="#" className="fb-link">Terms</Link>
          <span>•</span>
          <Link href="#" className="fb-link">About</Link>
          <span>•</span>
          <Link href="#" className="fb-link">Help</Link>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Facebook © 2024
        </div>
      </div>
    </footer>
  );
}
