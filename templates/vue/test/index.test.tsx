/** @jsx h */
import { defineComponent } from 'vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import Hello from '../src';

describe('Example', () => {
  it('should have the expected content', () => {
    const greeting = 'World';

    const Component = defineComponent({
      components: {
        Hello,
      },
      template: `<hello greeting="${greeting}"></hello>`,
    });
  
    render(Component);

    expect(screen.getByText(`Hello ${greeting}`)).toBeInTheDocument();
  });
});
