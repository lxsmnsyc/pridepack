import React from 'react';

export default function HelloWorld(): JSX.Element {
  if (process.env.NODE_ENV !== 'production') {
    console.log('This code would not appear on production builds');
  }
  return <h1>Hello World</h1>;
}
