# API 設計

## 対戦を開始する

### 対戦を登録する

```
POST /api/games
```

## 盤面を見る

- 指定したターン数のターンを取得する

```
GET /api/games/latest/turns/{turnCount}
```

```json
{
  "turnCount": 1,
  "board": [
    [0, 0, 0],
    [0, 0, 0]
  ],
  "nextDisc": 1,
  "winnerDisc": 1
}
```

## 石を打つ

- 「ターン」を登録する

```
POST /api/games/lates/turns
```

```json
{
  "turnCount": 1,
  "move": {
    "disc": 1,
    "x": 0,
    "y": 0
  }
}
```

<!-- ## 勝敗を確認する -->

## 自分の対戦結果を表示する

- 対戦の一覧を取得する

```
GET /api/games
```

```json
{
  "games": [
    {
      "id": 1,
      "winnerDisc": 1,
      "startedAt": "YYYY-MM-DD hh:mm:ss"
    }
  ]
}
```
