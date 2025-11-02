import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import { Timer } from '@/components/game/Timer';
import sinon from 'sinon';

describe('components/game/Timer', () => {
  describe('Phase 2: Fix 2.4 - Timer Effect Dependencies', () => {
    it('should accept callback reference changes without issues', () => {
      const onTimeout1 = sinon.spy();

      const { rerender } = render(
        <Timer duration={10} onTimeout={onTimeout1} />
      );

      // Initial render should work
      expect(screen.getByText('10s')).to.exist;

      // Change onTimeout callback (simulating parent component re-render)
      const onTimeout2 = sinon.spy();
      rerender(<Timer duration={10} onTimeout={onTimeout2} />);

      // Component should still render correctly
      expect(screen.getByText('10s')).to.exist;
    });

    it('should maintain timer state when only callback changes', () => {
      const onTimeout1 = sinon.spy();

      const { rerender } = render(
        <Timer duration={10} onTimeout={onTimeout1} />
      );

      // Verify initial state
      expect(screen.getByText('10s')).to.exist;

      // Change callback multiple times
      for (let i = 0; i < 5; i++) {
        const newCallback = sinon.spy();
        rerender(<Timer duration={10} onTimeout={newCallback} />);
      }

      // Timer should still show same duration (not reset)
      expect(screen.getByText('10s')).to.exist;
    });

    it('should reset timer when duration changes', () => {
      const onTimeout = sinon.spy();

      const { rerender } = render(
        <Timer duration={10} onTimeout={onTimeout} />
      );

      expect(screen.getByText('10s')).to.exist;

      // Change duration (should reset)
      rerender(<Timer duration={15} onTimeout={onTimeout} />);
      expect(screen.getByText('15s')).to.exist;
    });
  });

  describe('Timer Rendering', () => {
    it('should render initial time correctly', () => {
      render(<Timer duration={10} onTimeout={() => {}} />);
      expect(screen.getByText('10s')).to.exist;
    });

    it('should render with different durations', () => {
      const { rerender } = render(<Timer duration={5} onTimeout={() => {}} />);
      expect(screen.getByText('5s')).to.exist;

      rerender(<Timer duration={20} onTimeout={() => {}} />);
      expect(screen.getByText('20s')).to.exist;
    });

    it('should render time left label', () => {
      render(<Timer duration={10} onTimeout={() => {}} />);
      expect(screen.getByText('Time Left')).to.exist;
    });

    it('should render progress bar', () => {
      const { container } = render(<Timer duration={10} onTimeout={() => {}} />);
      const progressBar = container.querySelector('.h-full');
      expect(progressBar).to.exist;
    });
  });
});
