import Image from 'next/image';
import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Image
        src="/comingsoon.gif"
        alt="Coming Soon"
        layout="responsive"
        width={300}
        height={300}
      />
    </div>
  );
};

export default ComingSoon;
