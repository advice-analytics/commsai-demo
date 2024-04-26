// Footer.tsx
import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import LogoImage from '@/public/main-logo.png';

const Footer: React.FC = () => {
  return (
    <footer id="App:Footer" className="bg-white bottom-0 w-full px-4 py-2 shadow-lg border-t-2 border-transparent">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
        <p className="text-gray-600 mb-2 lg:mb-0">&copy; {new Date().getFullYear().toString()} CommsAI</p>
        <div className="flex items-center">
          <Link href="/docs">
            <NextImage
              className="w-auto h-10 lg:w-auto lg:h-12"
              src={LogoImage}
              alt=""
              width={300}
              height={300}
            />
          </Link>
          <span className="ml-4">
            <Link href="https://adviceanalytics.com/legal/terms-of-service/" className="text-navyblue hover:text-navyblue underline">
              Disclosure of Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
