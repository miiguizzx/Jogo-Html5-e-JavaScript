/* Importa constantes necessárias */
import {
    INITIAL_FRAMES,     /* Controla a animação */
    PATH_NAVE_IMAGE,    /* Caminho da imagem da nave */
} from "../utils/constants.js";

/* Importa classe dos projéteis */
import Projectile from "./Projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        /* Indica se o jogador está vivo */
        this.alive = true;

        /* Tamanho da nave (escala da imagem base 48x48) */
        this.width = 48 * 1.5;
        this.height = 48 * 1.5;

        /* Velocidade de movimento lateral */
        this.velocity = 6;

        /* Posição inicial (centrado horizontalmente) */
        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        /* Carrega a imagem da nave */
        this.image = this.getImage(PATH_NAVE_IMAGE);

        /* Variáveis de animação */
        this.sx = 0; /* Offset horizontal do sprite */
        this.framesCounter = INITIAL_FRAMES; /* Contador de frames */
    }

    moveLeft() {
        /* Move a nave para a esquerda */
        this.position.x -= this.velocity;
    }

    moveRight() {
        /* Move a nave para a direita */
        this.position.x += this.velocity;
    }

    getImage(path) {
        /* Cria e devolve uma imagem */
        const image = new Image();
        image = path;
        return image;
    }

    draw(ctx) {
        /* Desenha a nave no canvas */
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        /* Actualiza a animação */
        this.update();
    }

    update() {
        /* Controla a troca de frames do sprite */
        if (this.framesCounter === 0) {
            /* Alterna entre frames do sprite */
            this.sx = this.sx === 96 ? 0 : this.sx + 48;

            /* Reinicia contador */
            this.framesCounter = INITIAL_FRAMES;
        }

        /* Decrementa contador */
        this.framesCounter--;
    }

    shoot(projectiles) {
        /* Cria um novo projétil */
        const p = new Projectile(
            {
                /* Centro da nave */
                x: this.position.x + this.width / 2 - 2,
                y: this.position.y + 2,
            },
            -10 /* Velocidade negativa = sobe */
        );

        /* Adiciona à lista de projéteis */
        projectiles.push(p);
    }

    hit(projectile) {
        /* Verifica colisão entre nave e projétil inimigo */
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            projectile.position.y + projectile.height >= this.position.y + 22 &&
            projectile.position.y + projectile.height <=
                this.position.y + 22 + this.height - 34
        );
    }
}

export default Player;
