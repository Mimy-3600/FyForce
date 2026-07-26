class Golem {
  constructor(hp, def, atk) {
    this.hp = hp;
    this.maxHp = hp;
    this.def = def;
    this.atk = atk;
    // NOTE: in the original file these were `let` variables inside the
    // constructor, so they were local to the function and never actually
    // attached to the object. this.is_dodging / this.can_attack fixes that.
    this.is_dodging = false;
    this.can_attack = false;
  }

  receive(amount) {
    const damage = Math.max(0, amount - this.def);
    this.hp -= damage;
    if (this.hp < 0) this.hp = 0;
    return damage;
  }

  // returns a small result object so the server can build a log message
  attack(enemy) {
    if (!this.can_attack) {
      return { result: "not_ready", message: "hasn't reloaded yet — attack fizzles." };
    }
    // reload is a one-shot charge: you must reload again before you can attack again
    this.can_attack = false;

    if (enemy.is_dodging) {
      return { result: "dodged", message: "attack was dodged!" };
    }
    const damage = enemy.receive(this.atk);
    return { result: "hit", damage, message: `attack lands for ${damage} damage.` };
  }

  reload() {
    this.can_attack = true;
  }

  dodge() {
    this.is_dodging = true;
  }
}

module.exports = Golem;
