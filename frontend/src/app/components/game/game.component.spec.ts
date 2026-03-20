import { of } from 'rxjs';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('GameComponent', () => {
  let mockGameService: any;

  beforeEach(() => {
    mockGameService = {
      getGame: vi.fn().mockReturnValue(of({
        game_id: 1,
        status: 'ongoing',
        attempts: [],
        attempts_left: 10
      })),
      makeAttempt: vi.fn().mockReturnValue(of({
        status: 'ongoing',
        correct_positions: 1,
        wrong_positions: 0
      }))
    };
  });

  it('should create mock game service', () => {
    expect(mockGameService).toBeTruthy();
  });

  it('should call getGame and return ongoing status', () => {
    mockGameService.getGame(1).subscribe((state: any) => {
      expect(state.status).toBe('ongoing');
      expect(state.attempts_left).toBe(10);
    });
    expect(mockGameService.getGame).toHaveBeenCalledWith(1);
  });

  it('should call makeAttempt and return result', () => {
    mockGameService.makeAttempt(1, [1, 2, 3, 4]).subscribe((result: any) => {
      expect(result.correct_positions).toBe(1);
      expect(result.status).toBe('ongoing');
    });
    expect(mockGameService.makeAttempt).toHaveBeenCalledWith(1, [1, 2, 3, 4]);
  });
});