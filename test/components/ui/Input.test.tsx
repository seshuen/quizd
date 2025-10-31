import { expect } from 'chai';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('components/ui/Input', () => {
  describe('Input Component', () => {
    it('should render input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).to.exist;
    });

    it('should have text type by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.type).to.equal('text');
    });

    it('should render with specified type', () => {
      const { container } = render(<Input type="password" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('password');
    });

    it('should render with label when provided', () => {
      render(<Input label="Email" />);
      const label = screen.getByText('Email');
      expect(label).to.exist;
      expect(label.tagName).to.equal('LABEL');
    });

    it('should not render label when not provided', () => {
      const { container } = render(<Input />);
      const label = container.querySelector('label');
      expect(label).to.be.null;
    });

    it('should render error message when error prop provided', () => {
      render(<Input error="This field is required" id="test" />);
      const error = screen.getByText('This field is required');
      expect(error).to.exist;
      expect(error.getAttribute('role')).to.equal('alert');
    });

    it('should apply error styling when error exists', () => {
      render(<Input error="Error" id="test" />);
      const input = screen.getByRole('textbox');
      expect(input.className).to.include('border-red-500');
    });

    it('should set aria-invalid to true when error exists', () => {
      render(<Input error="Error" id="test" />);
      const input = screen.getByRole('textbox');
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('should set aria-invalid to false when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.getAttribute('aria-invalid')).to.equal('false');
    });

    it('should accept placeholder prop', () => {
      render(<Input placeholder="Enter email" />);
      const input = screen.getByPlaceholderText('Enter email');
      expect(input).to.exist;
    });

    it('should accept custom className', () => {
      render(<Input className="custom" />);
      const input = screen.getByRole('textbox');
      expect(input.className).to.include('custom');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).to.exist;
      expect(ref.current?.tagName).to.equal('INPUT');
    });

    it('should have correct displayName', () => {
      expect(Input.displayName).to.equal('Input');
    });

    it('should link error message with aria-describedby', () => {
      render(<Input error="Error message" id="test-input" />);
      const input = screen.getByRole('textbox');
      expect(input.getAttribute('aria-describedby')).to.equal('test-input-error');
    });
  });
});
