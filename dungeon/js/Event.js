class Event {
    static HeroIsDeadEvent = "HeroIsDeadEvent";
    static HeroHitEvent = "HeroHitEvent";
    static HeroHealEvent = "HeroHealEvent";
    static HeroStatsEvent = "HeroStatsEvent";   // Fadiga/Mana mudaram
    static HeroEatEvent = "HeroEatEvent";       // herói comeu um alimento
    static SlimeIsDeadEvent = "SlimeIsDeadEvent";
    static SlimeHitEvent = "SlimeHitEvent";
    constructor(type, data) {
        this.type = type;
        this.data = data;
        this.observers = [];
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    raise() {
        for(let observer of this.observers) {
            observer.receiveEvent(this);
        }
    }
}
