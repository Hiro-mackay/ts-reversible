import { db } from "../db";
import { BLACK, EMPTY, INITIAL_BOARD, WHITE } from "../consts/game";
import { GameGateway } from "../dataaccess/game-gateway";
import { TurnGateway } from "../dataaccess/turn-gateway";
import { MoveGateway } from "../dataaccess/move-gateway";
import { SquareGateway } from "../dataaccess/square-gateway";

// base path id "/api/games/latest"
const gameGateway = new GameGateway();
const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

export class TurnService {
  async findLatestTurn(turnCount: number) {
    const gameRecord = await gameGateway.findLatest(db);

    if (!gameRecord) {
      throw new Error("Latest game not found");
    }

    const turnRecord = await turnGateway.fondByIdAndTurnCount(
      db,
      gameRecord.id,
      turnCount
    );

    if (!turnRecord) {
      throw new Error("Specified turn not found");
    }

    const squareRecord = await squareGateway.findByTurnId(db, turnRecord.id);

    if (!squareRecord) {
      throw new Error("Squares not found");
    }

    const board = INITIAL_BOARD.map((line, y) => line.map((_, x) => EMPTY));
    squareRecord.forEach((square) => {
      board[square.y][square.x] = square.disc;
    });

    return {
      turnCount,
      board,
      winner: null,
      nextDisc: turnRecord.nextDisc,
    };
  }

  async registerTurn(turnCount: number, disc: number, x: number, y: number) {
    const previousTurnCount = turnCount - 1;

    // 前の盤面を取得
    const gameRecord = await gameGateway.findLatest(db);

    if (!gameRecord) {
      throw new Error("Latest game not found");
    }
    const gameId = gameRecord.id;

    const previousTurnRecord = await turnGateway.fondByIdAndTurnCount(
      db,
      gameId,
      previousTurnCount
    );

    if (!previousTurnRecord) {
      throw new Error("Previous turn not found");
    }

    const squareRecord = await squareGateway.findByTurnId(
      db,
      previousTurnRecord.id
    );

    if (!squareRecord) {
      throw new Error("Squares not found");
    }

    const board = INITIAL_BOARD.map((line, y) => line.map((_, x) => EMPTY));
    squareRecord.forEach((square) => {
      board[square.y][square.x] = square.disc;
    });

    // 石を置く
    board[y][x] = disc;

    // ターンを保存
    const now = new Date();
    const nextDisc = disc === BLACK ? WHITE : BLACK;

    const turnRecord = await turnGateway.insert(
      db,
      gameId,
      turnCount,
      nextDisc,
      now
    );

    await squareGateway.insertAll(db, turnRecord.id, board);

    await moveGateway.insert(db, turnRecord.id, disc, x, y);
  }
}
