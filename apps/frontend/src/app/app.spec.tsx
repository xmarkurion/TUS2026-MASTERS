import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Welcome to TUS2026 Masters/gi)).toBeTruthy();
  });
});
