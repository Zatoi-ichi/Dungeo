[README.md](https://github.com/user-attachments/files/34207484/README.md)
# ⚔️ Dungeon

Dungeon é um pequeno jogo de combate em navegador, desenvolvido com **HTML, CSS e JavaScript puro**. O jogador controla um herói que precisa derrotar um Slime, administrando vida, fadiga e recursos de cura enquanto o inimigo ataca automaticamente.

## 🎮 Sobre o jogo

A batalha acontece em uma única arena. O herói possui ações limitadas e precisa equilibrar ataque, recuperação de vida e recuperação de fadiga para sobreviver.

O projeto utiliza sprites e animações em CSS para representar as ações dos personagens e atualiza a interface conforme os eventos da batalha acontecem.

## ✨ Funcionalidades

- **Combate:** o herói causa dano ao Slime usando a ação Atacar.
- **Inimigo automático:** o Slime ataca o herói periodicamente.
- **Sistema de vida:** ambos os personagens possuem pontos de vida exibidos em barras.
- **Sistema de mana:** o herói possui uma barra de mana visível, ainda sem habilidades que a consumam.
- **Sistema de fadiga:** atacar consome fadiga. Quando ela chega a zero, o herói fica exausto e não pode atacar nem se curar.
- **Alimentação:** a ação Comida recupera fadiga.
- **Cura limitada:** o herói pode recuperar vida até três vezes durante a batalha.
- **Animações:** ações, dano, cura, alimentação, vitória e derrota possuem animações.
- **Indicadores visuais:** barras, mensagens e avisos mostram os estados dos personagens e das ações.
- **Reinício:** ao vencer ou perder, é possível iniciar uma nova batalha.

## ⚔️ Atributos e regras

| Atributo / ação | Herói | Slime |
|---|---:|---:|
| Vida inicial | 200 | 300 |
| Dano por ataque | 50 | 25 |
| Fadiga inicial | 100 | — |
| Custo de fadiga por ataque | 20 | — |
| Recuperação de vida | 40 por cura | — |
| Usos de cura | 3 | — |
| Recuperação de fadiga | 30 por comida | — |

**Regras principais:**
- O Slime tenta atacar a cada 1,8 segundo.
- Cada ação do herói possui um intervalo de aproximadamente 700 ms para evitar ações simultâneas.
- O dano e as recuperações são aplicados durante as animações.
- A batalha termina quando a vida do herói ou do Slime chega a zero.
- A fadiga não é recuperada automaticamente: é necessário utilizar a ação Comida.

## 🧰 Tecnologias utilizadas

- **HTML5:** estrutura da página e dos elementos da interface.
- **CSS3:** layout, barras de atributos, efeitos visuais e animações dos sprites.
- **JavaScript:** lógica do combate, gerenciamento dos personagens, eventos e interação com a interface.
- **Google Fonts:** fontes Cinzel e EB Garamond.

Não é necessário instalar bibliotecas ou frameworks para executar a versão atual do projeto.

## 🗂️ Estrutura de pastas

```text
dungeon/
├── index.html
├── css/
│   └── index.css
├── images/
│   ├── hero_attack1.png
│   ├── hero_death.png
│   ├── hero_hurt.png
│   ├── hero_idle.png
│   ├── slime_attack1.png
│   ├── slime_death.png
│   ├── slime_hurt.png
│   └── slime_idle.png
└── js/
    ├── Event.js
    ├── Hero.js
    ├── InterfaceManager.js
    ├── Slime.js
    └── index.js
```

## 🧩 Organização do código e padrões utilizados

O código é dividido em classes, cada uma com uma responsabilidade:

- **`Hero.js`:** controla os atributos, ações, cura, alimentação, fadiga e recebimento de dano do herói.
- **`Slime.js`:** controla a vida, os ataques e o recebimento de dano do inimigo.
- **`Event.js`:** implementa a estrutura de eventos e notifica os observadores quando algo acontece.
- **`InterfaceManager.js`:** atualiza as barras, mensagens, botões e animações da interface.
- **`index.js`:** inicializa o jogo, conecta os botões e controla os intervalos das ações.

### Padrões de projeto identificados

- **Singleton:** as classes `Hero`, `Slime` e `InterfaceManager` mantêm uma única instância durante a execução do jogo.
- **Observer:** a classe `Event` permite que os objetos interessados recebam notificações sobre acontecimentos, como dano, cura, alimentação e morte. A interface observa esses eventos para atualizar a tela.

## ▶️ Como executar

1. Baixe ou clone este repositório.
2. Extraia a pasta `dungeon`, caso tenha baixado o projeto compactado.
3. Abra a pasta do projeto no VS Code ou em outro editor.
4. Abra o arquivo `index.html` no navegador.

**Recomendado:** utilizar a extensão **Live Server** no VS Code. Com ela instalada, clique com o botão direito em `index.html` e selecione **Open with Live Server**.

> É necessário manter as pastas `css`, `images` e `js` nos caminhos indicados para que os estilos, sprites e scripts sejam carregados corretamente. A conexão com a internet é necessária para carregar as fontes do Google Fonts; sem ela, o navegador utilizará fontes alternativas.

## 🕹️ Como jogar

1. Clique em **Atacar** para causar dano ao Slime, gastando fadiga.
2. Use **Curar** quando precisar recuperar vida. A quantidade de usos é limitada.
3. Use **Comida** para recuperar fadiga e sair do estado de exaustão.
4. Continue administrando seus recursos até derrotar o Slime.
5. Se vencer ou perder, clique em **Jogar novamente** para reiniciar a batalha.

## 📌 Observações

Este README descreve o funcionamento identificado na implementação atual do projeto. A barra de mana já está presente na interface, mas ainda não participa das mecânicas de combate.

---

**Projeto:** Dungeon  
**Tecnologias:** HTML, CSS e JavaScript
