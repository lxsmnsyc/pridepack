import { render, screen } from 'solid-testing-library';
import '@testing-library/jest-dom';
import Hello from '../src';

describe('Example', () => {
  it('should have the expected content', () => {
    const greeting = 'World';
    render(<Hello greeting={greeting} />);

    expect(screen.getByText(`Hello ${greeting}`)).toBeInTheDocument();
  });
});
