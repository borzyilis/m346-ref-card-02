import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Architecture Ref. Card 2 heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Architecture Ref. Card 2/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders react app message', () => {
  render(<App />);
  const messageElement = screen.getByText(/react app ... up and running/i);
  expect(messageElement).toBeInTheDocument();
});
