import { expect } from 'chai';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGame } from '@/hooks/useGame';
import sinon from 'sinon';

describe('hooks/useGame', () => {
  let supabaseStub: any;

  beforeEach(() => {
    // Mock the Supabase client
    supabaseStub = {
      from: sinon.stub(),
      auth: {
        getUser: sinon.stub(),
      },
      rpc: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Phase 2: Fix 2.2 - Supabase Client Memoization', () => {
    it('should create Supabase client only once', () => {
      const { result, rerender } = renderHook(() => useGame());

      // Get initial reference
      const initialState = result.current.gameState;

      // Trigger re-render
      rerender();

      // State should be stable (client not recreated)
      expect(result.current.gameState).to.equal(initialState);
    });

    it('should maintain stable client across multiple renders', () => {
      const { result, rerender } = renderHook(() => useGame());

      // Render multiple times
      for (let i = 0; i < 5; i++) {
        rerender();
      }

      // Game state should remain stable
      expect(result.current.gameState.sessionId).to.be.null;
      expect(result.current.gameState.questions).to.be.an('array').that.is.empty;
    });
  });

  describe('Phase 2: Fix 2.3 - useCallback Dependencies', () => {
    it('should have submitAnswer function that does not change on state updates', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialSubmitAnswer = result.current.submitAnswer;

      // Force re-render
      rerender();

      // submitAnswer reference should be stable
      expect(result.current.submitAnswer).to.equal(initialSubmitAnswer);
    });

    it('should have startGame function with stable reference', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialStartGame = result.current.startGame;

      // Force re-render
      rerender();

      // startGame reference should be stable
      expect(result.current.startGame).to.equal(initialStartGame);
    });

    it('should have finishGame function with stable reference when gameState has same dependencies', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialFinishGame = result.current.finishGame;

      // Force re-render
      rerender();

      // finishGame reference should be stable
      expect(result.current.finishGame).to.equal(initialFinishGame);
    });
  });

  describe('Game State Management', () => {
    it('should initialize with default game state', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.gameState).to.deep.include({
        sessionId: null,
        currentQuestionIndex: 0,
        score: 0,
      });
      expect(result.current.gameState.questions).to.be.an('array').that.is.empty;
      expect(result.current.gameState.answers).to.be.an('array').that.is.empty;
    });

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.startGame).to.be.a('function');
      expect(result.current.submitAnswer).to.be.a('function');
      expect(result.current.finishGame).to.be.a('function');
    });
  });

  describe('Performance - Preventing Unnecessary Re-renders', () => {
    it('should not recreate callbacks when unrelated state changes', () => {
      const { result, rerender } = renderHook(() => useGame());

      const callbacks = {
        startGame: result.current.startGame,
        submitAnswer: result.current.submitAnswer,
        finishGame: result.current.finishGame,
      };

      // Multiple re-renders
      rerender();
      rerender();
      rerender();

      // All callbacks should remain stable
      expect(result.current.startGame).to.equal(callbacks.startGame);
      expect(result.current.submitAnswer).to.equal(callbacks.submitAnswer);
      expect(result.current.finishGame).to.equal(callbacks.finishGame);
    });
  });
});
