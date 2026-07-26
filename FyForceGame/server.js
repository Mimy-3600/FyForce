const WebSocket = require('ws');
const Golem = require('./golem');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
console.log(`Golem battle server listening on ws://localhost:${PORT}`);

// --- single-match state (one game at a time, simplest possible version) ---
let players = [];   // [{ ws, id: 1|2, move: null|'attack'|'dodge'|'reload' }]
let golems = {};    // { 1: Golem, 2: Golem }
let round = 1;

function resetMatch() {
  golems = {
    1: new Golem(1000, 20, 50),
    2: new Golem(800, 40, 40),
  };
  round = 1;
  players.forEach(p => (p.move = null));
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
    p1Connected: !!p1,
    p2Connected: !!p2,
    p1: {
      hp: golems[1].hp, maxHp: golems[1].maxHp,
      canAttack: golems[1].can_attack, dodging: golems[1].is_dodging,
      locked: !!(p1 && p1.move),
    },
    p2: {
      hp: golems[2].hp, maxHp: golems[2].maxHp,
      canAttack: golems[2].can_attack, dodging: golems[2].is_dodging,
      locked: !!(p2 && p2.move),
    },
    log: log || [],
    // present only on the message that actually resolves a round — this is
    // what tells the client "both moves are in, play the clash animation"
    actions: actions || null,
  };
}

// THE KEY REQUIREMENT: nothing here runs until BOTH players have a move set.
function tryResolveRound() {
  const p1 = players.find(p => p.id === 1);
  const p2 = players.find(p => p.id === 2);
  if (!p1 || !p2) return;          // need two connected players
  if (!p1.move || !p2.move) return; // need BOTH moves locked in

  const log = [];
  const g1 = golems[1];
  const g2 = golems[2];
  const actions = {
    p1: { move: p1.move },
    p2: { move: p2.move },
  };

  // dodge state is recomputed fresh each round from this round's choices
  g1.is_dodging = false;
  g2.is_dodging = false;
  if (p1.move === 'dodge') g1.dodge();
  if (p2.move === 'dodge') g2.dodge();
  if (p1.move === 'reload') g1.reload();
  if (p2.move === 'reload') g2.reload();

  // attacks are resolved against the dodge/reload state set above,
  // so it doesn't matter who "goes first"
  if (p1.move === 'attack') {
    const r = g1.attack(g2);
    actions.p1.result = r.result;
    actions.p1.damage = r.damage || 0;
    log.push(`Player 1: ${r.message}`);
  }
  if (p2.move === 'attack') {
    const r = g2.attack(g1);
    actions.p2.result = r.result;
    actions.p2.damage = r.damage || 0;
    log.push(`Player 2: ${r.message}`);
  }
  if (p1.move === 'reload') log.push('Player 1 reloads.');
  if (p2.move === 'reload') log.push('Player 2 reloads.');
  if (p1.move === 'dodge') log.push('Player 1 braces to dodge.');
  if (p2.move === 'dodge') log.push('Player 2 braces to dodge.');

  if (g1.hp <= 0 || g2.hp <= 0) {
    log.push(
      g1.hp <= 0 && g2.hp <= 0 ? "Both golems fall — it's a draw!"
      : g1.hp <= 0 ? 'Player 2 wins!'
      : 'Player 1 wins!'
    );
    broadcast(stateSnapshot(log, actions));
    broadcast({ type: 'game_over' });
    resetMatch();
    return;
  }

  round += 1;
  p1.move = null;
  p2.move = null;
  broadcast(stateSnapshot(log, actions));
}

wss.on('connection', (ws) => {
  if (players.length >= 2) {
    ws.send(JSON.stringify({ type: 'full' }));
    ws.close();
    return;
  }

  const id = players.some(p => p.id === 1) ? 2 : 1;
  const player = { ws, id, move: null };
  players.push(player);

  ws.send(JSON.stringify({ type: 'assigned', id }));
  broadcast(stateSnapshot([`Player ${id} connected.`]));

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'move') {
      if (!['attack', 'dodge', 'reload'].includes(msg.move)) return;
      if (player.move) return; // already locked in for this round, ignore
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
