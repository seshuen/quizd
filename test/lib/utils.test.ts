import { expect } from 'chai';
import { cn } from '@/lib/utils';

describe('lib/utils', () => {
  describe('cn() - Class Name Utility', () => {
    it('should merge single class string', () => {
      const result = cn('btn');
      expect(result).to.equal('btn');
    });

    it('should merge multiple class strings', () => {
      const result = cn('btn', 'btn-primary');
      expect(result).to.equal('btn btn-primary');
    });

    it('should handle conditional classes with true', () => {
      const isActive = true;
      const result = cn('btn', isActive && 'active');
      expect(result).to.equal('btn active');
    });

    it('should handle conditional classes with false', () => {
      const isActive = false;
      const result = cn('btn', isActive && 'active');
      expect(result).to.equal('btn');
    });

    it('should merge Tailwind classes and remove duplicates', () => {
      const result = cn('px-2 py-1', 'px-4');
      // tailwind-merge should keep the last conflicting class
      expect(result).to.equal('py-1 px-4');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).to.equal('');
    });

    it('should handle null and undefined', () => {
      const result = cn('btn', null, undefined, 'primary');
      expect(result).to.equal('btn primary');
    });

    it('should merge conflicting Tailwind classes (last wins)', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).to.equal('text-blue-500');
    });
  });
});
