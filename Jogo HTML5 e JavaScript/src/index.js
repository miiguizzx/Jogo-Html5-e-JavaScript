/* Importação Das Classes Do Jogo */
import Grid from "./classes/Grid.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import SoundEffects from "./classes/SoundEffects.js";
import Star from "./classes/Star.js";

/* Constantes Globais */
import { GameState, NUMBER_STARS } from "./utils/constants.js";

/* Instância Responsável Pelos Sons */
const soundEffects = new SoundEffects();

/* Referências Aos Elementos HTML */
const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");

/* Elementos De Texto Da UI */
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");

/* Botões */
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

/* Remove O  Ecrã De Game Over No Início */
gameOverScreen.remove();

/* Canvas E Contexto De Desenho */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

/* Ajusta Tamanho Ao Ecrã */
canvas.width = innerWidth;
canvas.height = innerHeight;

/* Mantém Estilo Pixel-Art */
ctx.imageSmoothingEnabled = false;

/* Estado Inicial Do Jogo */
let currentState = GameState.START;

/* Dados Do Jogo */
const gameData = {
    score: 0, /* Pontos */
    level: 1, /* Níveis */
    high: 0, /* Recorde */
};

/* Atualiza valores visuais */
const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
};

/* Criação do jogador */
const player = new Player(canvas.width, canvas.height);

/* Matrizes de entidades */
const stars = [];
const playerProjectiles = [];
const invadersProjectiles = [];
const particles = [];
const obstacles = [];

/* Inicializa obstáculos defensivos */
const initObstacles = () => {
    const x = canvas.width / 2 - 100; /* Centro horizontal */
    const y = canvas.height - 250;    /* Parte inferior */
    const offset = canvas.width * 0.15;
    const color = "rgb(255, 255, 255)";

    /* Cria dois obstáculos */
    const obstacle1 = new Obstacle({ x: x - offset, y }, 200, 20, color);
    const obstacle2 = new Obstacle({ x: x + offset, y }, 200, 20, color);

    obstacles.push(obstacle1);
    obstacles.push(obstacle2);
};

initObstacles();

/* Cria grelha de inimigos com tamanho aleatório */
const grid = new Grid(
    Math.round(Math.random() * 9 + 1),
    Math.round(Math.random() * 9 + 1)
);

/* Controlo de teclas */
const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    },
};

/* Incrementa pontuação */
const incrementScore = (value) => {
    gameData.score += value;

    /* Actualiza recorde */
    if (gameData.score > gameData.high) {
        gameData.high = gameData.score;
    }
};

/* Incrementa nível */
const incrementLevel = () => {
    gameData.level += 1;
};

/* Gera estrelas do fundo */
const generateStars = () => {
    for (let i = 0; i < NUMBER_STARS; i += 1) {
        stars.push(new Star(canvas.width, canvas.height));
    }
};

/* Desenha as Estrelas */
const drawStars = () => {
    stars.forEach((star) => {
        star.draw(ctx);
        star.update();
    });
};

/* Desenha os Projeteis */
const drawProjectiles = () => {
    const projectiles = [...playerProjectiles, ...invadersProjectiles];

    projectiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });
};

/* Desenha as Particulas */
const drawParticles = () => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    });
};

/* Desenha os Obstáculos */
const drawObstacles = () => {
    obstacles.forEach((obstacle) => obstacle.draw(ctx));
};

/* Limpar Projeteis */
const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, i) => {
        if (projectile.position.y <= 0) {
            playerProjectiles.splice(i, 1);
        }
    });

    invadersProjectiles.forEach((projectile, i) => {
        if (projectile.position.y > canvas.height) {
            invadersProjectiles.splice(i, 1);
        }
    });
};

/* Simplar Particulas */
const clearParticles = () => {
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        }
    });
};

/* Limpar Explusões */
const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i += 1) {
        const particle = new Particle(
            {
                x: position.x,
                y: position.y,
            },
            {
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5,
            },
            2,
            color
        );

        particles.push(particle);
    }
};

/* Verificar Se o Inimigo Disparou */
const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (invader.hit(projectile)) {
                soundEffects.playHitSound();

                createExplosion(
                    {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2,
                    },
                    10,
                    "#b3b3b3"
                );

                incrementScore(10);

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);

                return;
            }
        });
    });
};

/* Mostrar a Tela de Fim de Jogo */
const showGameOverScreen = () => {
    document.body.append(gameOverScreen);
    gameOverScreen.classList.add("zoom-animation");
};

/* Instância Fim de Jogo */
const gameOver = () => {
    /* Criar Explusão 1 */
    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        10,
        "rgb(95, 95, 95)"
    );

    /* Criar Explusão 2 */
    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        "#8a8a8a"
    );

    /* Criar Explusão 3 */
    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        "rgb(10, 10, 10)"
    );

    player.alive = false;
    currentState = GameState.GAME_OVER;
    showGameOverScreen();
};

/* Verificar se o Jogador Disparou */
const checkShootPlayer = () => {
    invadersProjectiles.some((projectile, index) => {
        if (player.hit(projectile)) {
            soundEffects.playExplosionSound();
            invadersProjectiles.splice(index, 1);

            gameOver();
        }
    });
};

/* Verificar se o Tiro Atingiu o Obstáculo */
const checkShootObstacles = () => {
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((projectile, index) => {
            if (obstacle.hit(projectile)) {
                playerProjectiles.splice(index, 1);
                return;
            }
        });

        invadersProjectiles.some((projectile, index) => {
            if (obstacle.hit(projectile)) {
                invadersProjectiles.splice(index, 1);
                return;
            }
        });
    });
};

/* Verificar o Inimigo Colidiu com os Obstáculos */
const checkInvadersCollidedObstacles = () => {
    obstacles.forEach((obstacle, i) => {
        grid.invaders.some((invader) => {
            if (invader.collided(obstacle)) {
                obstacles.splice(i, 1);
            }
        });
    });
};

/* Verificar o Jogador Colidiu com o Inimigo */
const checkPlayerCollidedInvaders = () => {
    grid.invaders.some((invader) => {
        if (
            invader.position.x >= player.position.x &&
            invader.position.x <= player.position.x + player.width &&
            invader.position.y >= player.position.y
        ) {
            gameOver();
        }
    });
};

/* Criar Grade */
const spawnGrid = () => {
    if (grid.invaders.length === 0) {
        soundEffects.playNextLevelSound();

        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);
        grid.restart();

        incrementLevel();

        if (obstacles.length === 0) {
            initObstacles();
        }
    }
};

/* Instância de Repetição do Jogo*/
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStars();

    if (currentState === GameState.PLAYING) {
        showGameData();
        spawnGrid();

        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        checkShootInvaders();
        checkShootPlayer();
        checkShootObstacles();
        checkInvadersCollidedObstacles();
        checkPlayerCollidedInvaders();

        grid.draw(ctx);
        grid.update(player.alive);

        ctx.save();

        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );

        if (keys.shoot.pressed && keys.shoot.released) {
            soundEffects.playShootSound();
            player.shoot(playerProjectiles);
            keys.shoot.released = false;
        }

        if (keys.left && player.position.x >= 0) {
            player.moveLeft();
            ctx.rotate(-0.15);
        }

        if (keys.right && player.position.x <= canvas.width - player.width) {
            player.moveRight();
            ctx.rotate(0.15);
        }

        ctx.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        );

        player.draw(ctx);
        ctx.restore();
    }

    if (currentState === GameState.GAME_OVER) {
        checkShootObstacles();

        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        grid.draw(ctx);
        grid.update(player.alive);
    }

    requestAnimationFrame(gameLoop);
};

/* Instância de Recomeçar Jogo */
const restartGame = () => {
    currentState = GameState.PLAYING;

    player.alive = true;

    player.position.x = 900;

    grid.invaders.length = 0;
    grid.invadersVelocity = 3;

    invadersProjectiles.length = 0;
    gameData.score = 0;
    gameData.level = 0;

    gameOverScreen.remove();
};

/* Moniturar Ações quando acionadas */
addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
    if (key === "enter") keys.shoot.pressed = true;
});

/* Moniturar Ações quando não acionadas */
addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
    if (key === "enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

/* Botão de Começar Jogo */
buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    setInterval(() => {
        const invader = grid.getRandomInvader();

        if (invader) {
            invader.shoot(invadersProjectiles);
        }
    }, 1000);
});

/* Botão de Recomeçar Jogo */
buttonRestart.addEventListener("click", restartGame);

generateStars();
gameLoop();