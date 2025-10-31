import { expect } from 'chai';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('components/ui/Button', () => {
  describe('Button Component', () => {
    it('should render button element', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).to.exist;
    });

    it('should render button text', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).to.exist;
    });

    it('should have primary variant by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('bg-blue-600');
    });

    it('should render with secondary variant', () => {
      render(<Button variant="secondary">Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('bg-gray-600');
    });

    it('should render with outline variant', () => {
      render(<Button variant="outline">Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('border');
      expect(button.className).to.include('bg-white');
    });

    it('should render with ghost variant', () => {
      render(<Button variant="ghost">Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('text-gray-700');
    });

    it('should have medium size by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('h-10');
    });

    it('should render with small size', () => {
      render(<Button size="sm">Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('h-8');
    });

    it('should render with large size', () => {
      render(<Button size="lg">Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('h-12');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Button</Button>);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.disabled).to.be.true;
    });

    it('should accept custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button.className).to.include('custom-class');
    });

    it('should accept type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.type).to.equal('submit');
    });

    it('should have correct displayName', () => {
      expect(Button.displayName).to.equal('Button');
    });

    it('should handle onClick event', () => {
      let clicked = false;
      render(<Button onClick={() => { clicked = true; }}>Button</Button>);
      const button = screen.getByRole('button');
      button.click();
      expect(clicked).to.be.true;
    });
  });
});
