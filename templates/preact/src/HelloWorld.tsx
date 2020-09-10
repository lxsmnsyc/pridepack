/* @jsx h */
import { h, VNode } from 'preact';

export default function HelloWorld(): VNode {
  if (process.env.NODE_ENV !== 'production') {
    console.log('This code would not appear on production builds');
  }
  return <h1>Hello World</h1>;
}
