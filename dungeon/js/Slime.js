class Slime {

    static #myself;

    constructor() {
        if(Slime.#myself) {
            return Slime.#myself;
        }
        this.name = "Slime";
        this.life = 300;
        this.isDead = false;
        this.slimeIsDeadEvent = new Event(Event.SlimeIsDeadEvent, this.life);
        this.slimeHitEvent = new Event(Event.SlimeHitEvent, this.life);
        this.slimeIsDeadEvent.addObserver(InterfaceManager.instance());
        this.slimeHitEvent.addObserver(InterfaceManager.instance());
        Slime.#myself = this;
    }

    static instance() {
        if(!Slime.#myself) {
            return new Slime();
        }
        return Slime.#myself;
    }

    receiveDamage(damage) {
        this.life -= damage;
        this.life = Math.max(this.life, 0);
        this.isDead = this.life == 0;
        this.slimeHitEvent.data = this.life;
        this.slimeIsDeadEvent.data = this.life;
        if(this.isDead) this.slimeIsDeadEvent.raise();
        else this.slimeHitEvent.raise();
    }

    // O Slime ataca o herói
    attack(hero) {
        if(this.isDead || hero.isDead) return;
        InterfaceManager.instance().setSlimeAttackSprite();
        // o golpe "acerta" no meio da animação
        setTimeout(() => {
            if(!this.isDead) hero.receiveDamage(25);
        }, 300);
    }

}
