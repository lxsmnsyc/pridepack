import type { JSX } from 'react';

export interface HelloProps {
  greeting: string;
}

export default function Hello({ greeting }: HelloProps): JSX.Element {
  if (process.env.NODE_ENV !== 'production') {
    console.log('This code would not appear on production builds');
  }
  return <h1>{`Hello ${greeting}`}</h1>;
}
