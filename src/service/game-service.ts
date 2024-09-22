import { GameGateway } from "../dataaccess/game-gateway";
import { db } from "../db";
import { TurnGateway } from "../dataaccess/turn-gateway";
import { BLACK, INITIAL_BOARD, INITIAL_TURN_COUNT } from "../consts/game";
import { SquareGateway } from "../dataaccess/square-gateway";

const gameGateway = new GameGateway();
const turnGateway = new TurnGateway();
const squareGateway = new SquareGateway();

export class GameService {
  async startGame() {
    const now = new Date();

    const gameRecord = await gameGateway.insert(db, now);

    const gameId = gameRecord?.id;

    const turnRecord = await turnGateway.insert(
      db,
      gameId,
      INITIAL_TURN_COUNT,
      BLACK,
      now
    );

    await squareGateway.insertAll(db, turnRecord.id, INITIAL_BOARD);
  }
}
