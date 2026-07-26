const WebSocket = require('ws');
const Fighter = require('./golem');

const PORT = 8080;
const HP_MAX = 60;
const ROUND_TIME_MS = 30000; // players must lock in within 30s
const DEFAULT_MOVE = 'block'; // auto-chosen if a player runs out of time

const wss = new WebSocket.Server({ port: PORT });
console.log(`Fight server listening on ws://localhost:${PORT}`);

// --- single-match state (one game at a time, simplest possible version) ---
let players = [];   // [{ ws, id: 1|2, move: null|'light'|'heavy'|'block'|'charge', autoMove: bool }]
let fighters = {};  // { 1: Fighter, 2: Fighter }
let round = 1;
let roundTimer = null;
let roundDeadline = null; // epoch ms — sent to clients so they can show a countdown

function clearRoundTimer() {
  if (roundTimer) { clearTimeout(roundTimer); roundTimer = null; }
  roundDeadline = null;
}

function scheduleRoundTimer() {
  clearRoundTimer();
  if (players.length < 2) return; // no point running the clock solo
  roundDeadline = Date.now() + ROUND_TIME_MS;
  roundTimer = setTimeout(forceResolveRound, ROUND_TIME_MS);
}

function forceResolveRound() {
  const p1 = players.find(p => p.id === 1);
  const p2 = players.find(p => p.id === 2);
  if (!p1 || !p2) return;
  if (!p1.move) { p1.move = DEFAULT_MOVE; p1.autoMove = true; }
  if (!p2.move) { p2.move = DEFAULT_MOVE; p2.autoMove = true; }
  tryResolveRound();
}

function resetMatch() {
  fighters = {
    1: new Fighter(HP_MAX),
    2: new Fighter(HP_MAX),
  };
  round = 1;
  players.forEach(p => { p.move = null; p.autoMove = false; });
  scheduleRoundTimer();
}
resetMatch();

function broadcast(msg) {
  const data = JSON.stringify(msg);
  players.forEach(p => {
    if (p.ws.readyState === WebSocket.OPEN) p.ws.send(data);
  });
}

function stateSnapshot(log, actions) {
  const p1 = players.find(p => p.id === 1);
  const p2 = players.find(p => p.id === 2);
  return {
    type: 'state',
    round,
    deadline: roundDeadline,
    p1Connected: !!p1,
    p2Connected: !!p2,
    p1: {
      hp: fighters[1].hp, maxHp: fighters[1].maxHp,
      charge: fighters[1].charge,
      locked: !!(p1 && p1.move),
    },
    p2: {
      hp: fighters[2].hp, maxHp: fighters[2].maxHp,
      charge: fighters[2].charge,
      locked: !!(p2 && p2.move),
    },
    log: log || [],
    // present only on the message that actually resolves a round — this is
    // what tells the client "both moves are in, play the clash animation"
    actions: actions || null,
  };
}

function describe(playerLabel, action, autoMove) {
  const suffix = autoMove ? ' (ran out of time and defaults to block)' : '';
  switch (action.result) {
    case 'charged': return `${playerLabel} charges up.`;
    case 'blocking': return `${playerLabel} braces to block.${suffix}`;
    case 'hit':
      if (action.move === 'heavy') return `${playerLabel}'s heavy attack crashes down for ${action.damage} damage!`;
      return `${playerLabel}'s light attack lands for ${action.damage} damage.`;
    case 'blocked': return `${playerLabel}'s light attack is blocked.`;
    case 'guard_broken': return `${playerLabel}'s heavy attack breaks the guard for ${action.damage} damage!`;
    case 'nullified': return `${playerLabel}'s heavy attack is nullified by a faster strike!`;
    case 'fizzled': return `${playerLabel} isn't charged and the heavy attack fizzles.`;
    default: return `${playerLabel} does nothing.`;
  }
}

// THE KEY REQUIREMENT: nothing here runs until BOTH players have a move set.
function tryResolveRound() {
  const p1 = players.find(p => p.id === 1);
  const p2 = players.find(p => p.id === 2);
  if (!p1 || !p2) return;          // need two connected players
  if (!p1.move || !p2.move) return; // need BOTH moves locked in

  clearRoundTimer(); // both moves are in — the clock for this round is done

  const f1 = fighters[1];
  const f2 = fighters[2];

  // each fighter resolves against the other's move; order doesn't matter
  // since a move only reacts to the *opponent's move string*, never their hp
  const action1 = f1.act(p1.move, p2.move, f2);
  const action2 = f2.act(p2.move, p1.move, f1);

  const log = [
    describe('Player 1', action1, p1.autoMove),
    describe('Player 2', action2, p2.autoMove),
  ];
  const actions = { p1: action1, p2: action2 };

  if (f1.hp <= 0 || f2.hp <= 0) {
    log.push(
      f1.hp <= 0 && f2.hp <= 0 ? "Both fighters fall — it's a draw!"
      : f1.hp <= 0 ? 'Player 2 wins!'
      : 'Player 1 wins!'
    );
    broadcast(stateSnapshot(log, actions));
    broadcast({ type: 'game_over' });
    resetMatch();
    return;
  }

  round += 1;
  p1.move = null; p1.autoMove = false;
  p2.move = null; p2.autoMove = false;
  broadcast(stateSnapshot(log, actions));
  scheduleRoundTimer();
}

wss.on('connection', (ws) => {
  if (players.length >= 2) {
    ws.send(JSON.stringify({ type: 'full' }));
    ws.close();
    return;
  }

  const id = players.some(p => p.id === 1) ? 2 : 1;
  const player = { ws, id, move: null, autoMove: false };
  players.push(player);

  ws.send(JSON.stringify({ type: 'assigned', id }));
  broadcast(stateSnapshot([`Player ${id} connected.`]));
  if (players.length === 2) scheduleRoundTimer();

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'move') {
      if (!['light', 'heavy', 'block', 'charge'].includes(msg.move)) return;
      if (player.move) return; // already locked in for this round, ignore
      if (msg.move === 'heavy' && !fighters[id].canHeavyAttack()) return; // must be charged
      player.move = msg.move;
      broadcast(stateSnapshot([`Player ${id} locked in a move.`]));
      tryResolveRound(); // no-op until the other player has also locked in
    }
  });

  ws.on('close', () => {
    players = players.filter(p => p !== player);
    broadcast({ type: 'opponent_left' });
    resetMatch();
    broadcast(stateSnapshot([`Player ${id} disconnected.`]));
  });
});
