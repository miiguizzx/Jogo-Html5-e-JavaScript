import Invader from "./Invader.js";

class Grid {
    constructor(rows, cols) {
        /* Número de linhas e colunas */
        this.rows = rows;
        this.cols = cols;

        /* Direcção actual do movimento */
        this.direction = "right";

        /* Flag para descer */
        this.moveDown = false;

        /* Aumento gradual de velocidade */
        this.boost = 0.1;

        /* Velocidade inicial */
        this.invadersVelocity = 3;

        /* Cria inimigos */
        this.invaders = this.init();
    }

    init() {
        const array = [];

        /* Cria matriz de inimigos */
        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                const invader = new Invader(
                    {
                        x: col * 50 + 20,  /* Espaçamento horizontal */
                        y: row * 37 + 120, /* Espaçamento vertical */
                    },
                    this.invadersVelocity
                );

                array.push(invader);
            }
        }

        return array;
    }

    draw(ctx) {
        /* Desenha todos os inimigos */
        this.invaders.forEach((invader) => invader.draw(ctx));
    }

    update(playerStatus) {
        /* Se atingir limites do ecrã muda direcção */
        if (this.reachedRightBoundary()) {
            this.direction = "left";
            this.moveDown = true;
        } else if (this.reachedLeftBoundary()) {
            this.direction = "right";
            this.moveDown = true;
        }

        /* Se jogador morreu, não descem */
        if (!playerStatus) this.moveDown = false;

        this.invaders.forEach((invader) => {
            if (this.moveDown) {
                /* Movimento vertical + aumento de velocidade */
                invader.moveDown();
                invader.incrementVelocity(this.boost);

                /* Guarda nova velocidade */
                this.invadersVelocity = invader.velocity;
            }

            /* Movimento horizontal */
            if (this.direction === "right") invader.moveRight();
            if (this.direction === "left") invader.moveLeft();
        });

        /* Reset da flag */
        this.moveDown = false;
    }

    reachedRightBoundary() {
        /* Verifica se algum inimigo tocou no limite direito */
        return this.invaders.some(
            (invader) => invader.position.x + invader.width >= innerWidth
        );
    }

    reachedLeftBoundary() {
        /* Verifica limite esquerdo */
        return this.invaders.some((invader) => invader.position.x <= 0);
    }

    getRandomInvader() {
        /* Escolhe inimigo aleatório */
        const index = Math.floor(Math.random() * this.invaders.length);
        return this.invaders[index];
    }

    restart() {
        /* Recria grelha */
        this.invaders = this.init();

        /* Direcção inicial */
        this.direction = "right";
    }
}

export default Grid;