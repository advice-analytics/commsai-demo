// Footer.tsx
import React from 'react';
import Link from 'next/link';

export const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer id='App:Footer' className="mx-auto px-2 sm:px-4 lg:px-8 bg-black fixed bottom-0 w-full p-4">
      <div className="flex justify-between">
        <p>&copy; {new Date().getFullYear().toString()} CommsAI</p>
        <p>
          <Link 
            href="/terms"
            className="text-white underline hover:underline">Disclosure of Terms
          </Link>{' '}
        </p>
      </div>
    </footer>
  );
};

interface FooterProps {}

export default Footer;