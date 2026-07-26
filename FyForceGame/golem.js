// Combat rules for a single fighter. This file knows nothing about the
// network, rounds, or the other player's identity — it only knows how to
// react to an opponent's move and how to take damage. server.js is the
// only place that wires two Fighters together into a match.

const LIGHT_DMG = 10;
const HEAVY_DMG = 20;          // 2x light, unblocked
const HEAVY_BLOCKED_DMG = 15;  // 1.5x light, guard broken

class Fighter {
  constructor(hp) {
    this.hp = hp;
    this.maxHp = hp;
    this.charge = 0; // 0 or 1 — max charge stock is 1
  }

  receive(amount) {
    const damage = Math.max(0, amount);
    this.hp = Math.max(0, this.hp - damage);
    return damage;
  }

  canHeavyAttack() {
    return this.charge >= 1;
  }

  // Resolves this fighter's chosen move against the opponent's chosen move,
  // applying any resulting damage straight to `opponent`. Returns a small
  // result object so the server can build a readable log line.
  act(move, opponentMove, opponent) {
    if (move === 'charge') {
      this.charge = 1; // charging again while already charged is a no-op
      return { move, result: 'charged' };
    }

    if (move === 'block') {
      return { move, result: 'blocking' };
    }

    if (move === 'light') {
      if (opponentMove === 'block') {
        return { move, result: 'blocked', damage: 0 };
      }
      const damage = opponent.receive(LIGHT_DMG);
      return { move, result: 'hit', damage };
    }

    if (move === 'heavy') {
      if (!this.canHeavyAttack()) {
        return { move, result: 'fizzled', damage: 0 };
      }
      this.charge = 0; // spent whether or not it actually lands
      if (opponentMove === 'light') {
        // a light attack is fast enough to interrupt a heavy swing entirely
        return { move, result: 'nullified', damage: 0 };
      }
      if (opponentMove === 'block') {
        // too strong to fully block — it breaks the guard for reduced damage
        const damage = opponent.receive(HEAVY_BLOCKED_DMG);
        return { move, result: 'guard_broken', damage };
      }
      const damage = opponent.receive(HEAVY_DMG);
      return { move, result: 'hit', damage };
    }

    return { move, result: 'none', damage: 0 };
  }
}

Fighter.LIGHT_DMG = LIGHT_DMG;
Fighter.HEAVY_DMG = HEAVY_DMG;
Fighter.HEAVY_BLOCKED_DMG = HEAVY_BLOCKED_DMG;

module.exports = Fighter;
