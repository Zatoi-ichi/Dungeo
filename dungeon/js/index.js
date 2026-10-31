const ATTACK_COOLDOWN = 700;   // ms: tempo da animação de ataque/cura/refeição do herói
const SLIME_ATTACK_INTERVAL = 1800; // ms entre ataques do Slime

// Trava todas as ações durante a animação do herói; depois a interface
// reavalia sozinha o que está disponível (Fadiga, usos de cura, comida...)
function lockButtons() {
    InterfaceManager.instance().setBusy(true);
    setTimeout(() => InterfaceManager.instance().setBusy(false), ATTACK_COOLDOWN);
}

function hitSlime() {
    if(Hero.instance().attack(Slime.instance())) lockButtons();
}

function healHero() {
    if(Hero.instance().heal()) lockButtons();
}

function eatFood() {
    if(Hero.instance().eat()) lockButtons();
}

// Estado inicial da interface (barras e botões)
InterfaceManager.instance().init();

// O Slime ataca sozinho de tempos em tempos enquanto os dois estiverem vivos
setInterval(() => {
    Slime.instance().attack(Hero.instance());
}, SLIME_ATTACK_INTERVAL);

hitButton.onclick = hitSlime;
healButton.onclick = healHero;
foodButton.onclick = eatFood;
restartButton.onclick = () => {
    InterfaceManager.instance().playEnding().then(() => location.reload());
};
