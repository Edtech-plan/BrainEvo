import React from 'react';
import type { NextPage } from 'next';

const ServerError: NextPage = () => {
  return (
    <div>
      <h1>500 - Server Error</h1>
      <p>Something went wrong on our end.</p>
    </div>
  );
};

export default ServerError;
