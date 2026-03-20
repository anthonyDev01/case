import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GameService } from './game.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createGame via POST /games', () => {
    service.createGame().subscribe(res => {
      expect(res.game_id).toBe(1);
      expect(res.max_attempts).toBe(10);
    });

    const req = httpMock.expectOne('http://localhost:5000/games');
    expect(req.request.method).toBe('POST');
    req.flush({ game_id: 1, max_attempts: 10 });
  });

  it('should send makeAttempt and return feedback', () => {
    const attemptResponse = {
      attempt_number: 1,
      correct_positions: 4,
      wrong_positions: 0,
      status: 'won',
      attempts_left: 9
    };

    service.makeAttempt(1, [1, 2, 3, 4]).subscribe(res => {
      expect(res.status).toBe('won');
      expect(res.correct_positions).toBe(4);
    });

    const req = httpMock.expectOne('http://localhost:5000/games/1/attempt');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ digits: [1, 2, 3, 4] });
    req.flush(attemptResponse);
  });
});
