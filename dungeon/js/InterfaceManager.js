class InterfaceManager {

    static #myself;

    constructor() {
        if(InterfaceManager.#myself) {
            return InterfaceManager.#myself;
        }
        this.heroLifeBar = document.getElementById("heroLifeBar");
        this.heroManaBar = document.getElementById("heroManaBar");
        this.heroFatigueBar = document.getElementById("heroFatigueBar");
        this.slimeLifeBar = document.getElementById("slimeLifeBar");
        this.heroSprite = document.getElementById("heroSprite");
        this.slimeSprite = document.getElementById("slimeSprite");
        this.message = document.getElementById("message");
        this.statusBanner = document.getElementById("statusBanner");
        this.exhaustedTag = document.getElementById("exhaustedTag");
        this.hitButton = document.getElementById("hitButton");
        this.healButton = document.getElementById("healButton");
        this.foodButton = document.getElementById("foodButton");
        this.hitHint = document.getElementById("hitHint");
        this.healHint = document.getElementById("healHint");
        this.foodHint = document.getElementById("foodHint");
        this.healPopup = document.getElementById("healPopup");
        this.restartButton = document.getElementById("restartButton");
        this.heroLifeText = document.getElementById("heroLifeText");
        this.heroManaText = document.getElementById("heroManaText");
        this.heroFatigueText = document.getElementById("heroFatigueText");
        this.heroFatigueRow = document.getElementById("heroFatigueRow");
        this.slimeLifeText = document.getElementById("slimeLifeText");
        this.page = document.getElementById("page");
        this.busy = false;          // true durante a animação de uma ação do herói
        this.gameOver = false;
        this.wasExhausted = false;
        InterfaceManager.#myself = this;
    }

    static instance() {
        if(!InterfaceManager.#myself) {
            return new InterfaceManager();
        }
        return InterfaceManager.#myself;
    }

    // Desenha o estado inicial da interface
    init() {
        this.renderStats();
    }

    // Barra: largura em % do máximo; a cor muda conforme o valor diminui
    updateBar(bar, text, value, max) {
        const ratio = value / max;
        bar.style.width = (ratio * 100) + "%";
        bar.classList.toggle("low", ratio <= 0.5 && ratio > 0.25);
        bar.classList.toggle("critical", ratio <= 0.25);
        text.textContent = value + " / " + max;
    }

    updateLifeBar(bar, text, life, maxLife) {
        this.updateBar(bar, text, life, maxLife);
    }

    // Redesenha as 3 barras do herói e o estado de exaustão
    renderStats() {
        const hero = Hero.instance();
        this.updateBar(this.heroLifeBar, this.heroLifeText, hero.life, hero.maxLife);
        this.updateBar(this.heroManaBar, this.heroManaText, hero.mana, hero.maxMana);
        this.updateBar(this.heroFatigueBar, this.heroFatigueText, hero.fatigue, hero.maxFatigue);

        const exhausted = hero.isExhausted && !hero.isDead && !this.gameOver;
        this.heroSprite.classList.toggle("exhausted", exhausted);
        this.heroFatigueRow.classList.toggle("empty", hero.isExhausted);
        this.exhaustedTag.hidden = !exhausted;
        this.statusBanner.hidden = !exhausted;
        this.foodButton.classList.toggle("pulse", exhausted);
        if(exhausted && !this.wasExhausted) {
            this.message.textContent = "O Herói está exausto! Coma para recuperar a Fadiga.";
        }
        this.wasExhausted = exhausted;
        this.refreshButtons();
    }

    // Define disponibilidade de cada botão e mostra o motivo quando indisponível
    refreshButtons() {
        if(this.gameOver) return;
        const hero = Hero.instance();
        const exhausted = hero.isExhausted;

        const hitReason = exhausted ? "Sem Fadiga" : null;
        const healReason = exhausted ? "Sem Fadiga"
            : hero.healCharges <= 0 ? "Sem usos"
            : hero.life >= hero.maxLife ? "Vida cheia"
            : null;
        const foodReason = hero.fatigue >= hero.maxFatigue ? "Fadiga cheia"
            : null;

        this.setAction(this.hitButton, this.hitHint, hitReason,
            hero.attackDamage + " de dano · −" + hero.attackFatigueCost + " Fadiga");
        this.setAction(this.healButton, this.healHint, healReason,
            "+" + hero.healAmount + " Vida · " + hero.healCharges + (hero.healCharges == 1 ? " uso" : " usos"));
        this.setAction(this.foodButton, this.foodHint, foodReason, "+" + hero.foodRestore + " Fadiga");

    }

    setAction(button, hint, reason, normalText) {
        button.disabled = this.busy || !!reason;
        hint.textContent = reason ? "🚫 " + reason : normalText;
        hint.classList.toggle("blocked", !!reason);
    }

    setBusy(busy) {
        this.busy = busy;
        this.refreshButtons();
    }

    // Animação curta de encerramento; retorna uma Promise resolvida ao final
    playEnding() {
        const heroWon = Slime.instance().isDead;
        this.restartButton.disabled = true;
        const sprite = this.heroSprite;
        sprite.onanimationend = null;
        if(heroWon) {
            // vitória: herói volta à pose idle e pula duas vezes
            sprite.classList.remove("idle", "attack", "hurt", "heal", "eat", "death");
            void sprite.offsetWidth;
            sprite.classList.add("victory");
        } else {
            // derrota: herói (já caído) afunda e desaparece, tela escurece em vermelho
            sprite.classList.add("defeated");
            this.page.classList.add("defeatTint");
        }
        return new Promise(resolve => {
            setTimeout(() => {
                this.page.classList.add("fadeOut");
                setTimeout(resolve, 450);
            }, heroWon ? 1300 : 1200);
        });
    }

    // Troca a animação do sprite; ao terminar uma animação "curta", volta para idle
    setSprite(sprite, state, backToIdle = true) {
        sprite.onanimationend = null; // descarta handler da animação anterior
        sprite.classList.remove("idle", "attack", "hurt", "heal", "eat", "death");
        void sprite.offsetWidth; // reinicia a animação CSS
        sprite.classList.add(state);
        if(backToIdle) {
            sprite.onanimationend = () => {
                sprite.onanimationend = null;
                sprite.classList.remove(state);
                sprite.classList.add("idle");
            };
        }
    }

    setHeroAttackSprite() {
        this.setSprite(this.heroSprite, "attack");
    }

    setHeroHealSprite() {
        this.setSprite(this.heroSprite, "heal");
    }

    setHeroEatSprite() {
        this.setSprite(this.heroSprite, "eat");
    }

    // Texto flutuante sobre o herói ("+40" de cura, "−20 Fadiga" do ataque...)
    showPopup(text, kind) {
        const popup = this.healPopup;
        popup.textContent = text;
        popup.classList.remove("show", "popupHeal", "popupFatigue", "popupFood");
        void popup.offsetWidth; // reinicia a animação CSS
        popup.classList.add(kind, "show");
    }

    setSlimeAttackSprite() {
        this.setSprite(this.slimeSprite, "attack");
    }

    endGame() {
        this.gameOver = true;
        this.hitButton.hidden = true;
        this.healButton.hidden = true;
        this.foodButton.hidden = true;
        this.restartButton.hidden = false;
    }

    receiveEvent(event) {
        switch(event.type) {
            case Event.HeroHitEvent:
                this.renderStats();
                this.setSprite(this.heroSprite, "hurt");
                break;
            case Event.HeroStatsEvent:
                this.renderStats();
                break;
            case Event.HeroHealEvent:
                this.renderStats();
                this.showPopup("+" + event.healed, "popupHeal");
                this.message.textContent = "O Herói recuperou " + event.healed + " de vida!";
                break;
            case Event.HeroEatEvent:
                this.renderStats();
                this.showPopup("+" + event.restored + " Fadiga", "popupFood");
                this.message.textContent = "O Herói comeu e recuperou " + event.restored + " de Fadiga!";
                break;
            case Event.HeroIsDeadEvent:
                this.endGame();
                this.renderStats();
                this.setSprite(this.heroSprite, "death", false);
                this.message.textContent = "GAME OVER - o Slime venceu...";
                break;
            case Event.SlimeHitEvent:
                this.updateLifeBar(this.slimeLifeBar, this.slimeLifeText, event.data, 300);
                this.setSprite(this.slimeSprite, "hurt");
                break;
            case Event.SlimeIsDeadEvent:
                this.updateLifeBar(this.slimeLifeBar, this.slimeLifeText, event.data, 300);
                this.setSprite(this.slimeSprite, "death", false);
                // some da tela quando a animação de morte termina
                this.slimeSprite.onanimationend = () => this.slimeSprite.classList.add("gone");
                this.endGame();
                this.renderStats();
                this.message.textContent = "VITÓRIA! O Slime foi derrotado!";
                break;
        }
    }

}
