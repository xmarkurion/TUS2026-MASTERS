import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import App from './app';

describe('App (Jest)', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Welcome to TUS2026 Masters/i)).toBeInTheDocument();
  });

  it('should display monorepo description', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Monorepo with Nx, Spring Boot, React, and Storybook/i)).toBeInTheDocument();
  });
});
