class Hero {

    static #myself;

    constructor() {
        if(Hero.#myself) {
            return Hero.#myself;
        }
        this.name = "Herói";
        this.maxLife = 200;
        this.life = this.maxLife;
        this.healAmount = 40;   // vida recuperada por cura
        this.healCharges = 3;   // quantas curas o herói tem na batalha

        // Mana: barra monitorável (ainda sem habilidades que a consumam)
        this.maxMana = 100;
        this.mana = this.maxMana;

        // Fadiga: o ataque consome; zerada = herói exausto (sem atacar nem curar)
        this.maxFatigue = 100;
        this.fatigue = this.maxFatigue;
        this.attackDamage = 50;
        this.attackFatigueCost = 20;

        this.foodRestore = 30;  // Fadiga recuperada ao comer

        this.isDead = false;
        this.heroIsDeadEvent = new Event(Event.HeroIsDeadEvent, this.life);
        this.heroHitEvent = new Event(Event.HeroHitEvent, this.life);
        this.heroHealEvent = new Event(Event.HeroHealEvent, this.life);
        this.heroStatsEvent = new Event(Event.HeroStatsEvent, null);
        this.heroEatEvent = new Event(Event.HeroEatEvent, null);
        this.heroIsDeadEvent.addObserver(InterfaceManager.instance());
        this.heroHitEvent.addObserver(InterfaceManager.instance());
        this.heroHealEvent.addObserver(InterfaceManager.instance());
        this.heroStatsEvent.addObserver(InterfaceManager.instance());
        this.heroEatEvent.addObserver(InterfaceManager.instance());
        Hero.#myself = this;
    }

    static instance() {
        if(!Hero.#myself) {
            return new Hero();
        }
        return Hero.#myself;
    }

    // Exausto: Fadiga zerada
    get isExhausted() {
        return this.fatigue <= 0;
    }

    // Só pode realizar ações físicas (atacar/curar) se estiver vivo e com Fadiga
    canAct() {
        return !this.isDead && !this.isExhausted;
    }

    receiveDamage(damage) {
        this.life -= damage;
        this.life = Math.max(this.life, 0);
        this.isDead = this.life == 0;
        this.heroHitEvent.data = this.life;
        this.heroIsDeadEvent.data = this.life;
        if(this.isDead) this.heroIsDeadEvent.raise();
        else this.heroHitEvent.raise();
    }

    // O herói pula e se cura; retorna false se não puder curar agora
    heal() {
        if(!this.canAct() || this.healCharges <= 0 || this.life >= this.maxLife) return false;
        this.healCharges--;
        InterfaceManager.instance().setHeroHealSprite();
        // a vida sobe no ponto mais alto do pulo (meio da animação)
        setTimeout(() => {
            if(this.isDead) return;
            const before = this.life;
            this.life = Math.min(this.life + this.healAmount, this.maxLife);
            this.heroHealEvent.data = this.life;
            this.heroHealEvent.healed = this.life - before;
            this.heroHealEvent.raise();
        }, 300);
        return true;
    }

    // O herói come e recupera Fadiga; retorna false se não puder
    eat() {
        if(this.isDead || this.fatigue >= this.maxFatigue) return false;
        InterfaceManager.instance().setHeroEatSprite();
        // a Fadiga sobe no ponto mais alto do pulo (meio da animação)
        setTimeout(() => {
            if(this.isDead) return;
            const before = this.fatigue;
            this.fatigue = Math.min(this.fatigue + this.foodRestore, this.maxFatigue);
            this.heroEatEvent.data = this.fatigue;
            this.heroEatEvent.restored = this.fatigue - before;
            this.heroEatEvent.raise();
        }, 300);
        return true;
    }

    // O herói ataca o Slime. Consome Fadiga; retorna false se não puder atacar
    attack(slime) {
        if(!this.canAct() || slime.isDead) return false;
        // se restar menos Fadiga que o custo, gasta só o que tem (e fica exausto)
        const spent = Math.min(this.attackFatigueCost, this.fatigue);
        this.fatigue -= spent;
        this.heroStatsEvent.raise();
        InterfaceManager.instance().showPopup("−" + spent + " Fadiga", "popupFatigue");
        InterfaceManager.instance().setHeroAttackSprite();
        // o golpe "acerta" quando a espada desce (meio da animação)
        setTimeout(() => {
            if(!this.isDead) slime.receiveDamage(this.attackDamage);
        }, 300);
        return true;
    }

}
