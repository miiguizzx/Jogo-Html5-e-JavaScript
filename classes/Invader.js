/* Caminho da imagem do inimigo */
import { PATH_INIMIGO_IMAGE } from "../utils/constants.js";

/* Classe de projéteis */
import Projectile from "./Projectile.js";

class Invader {
    constructor(position, velocity) {
        /* Posição do inimigo */
        this.position = position;

        /* Escala da imagem */
        this.scale = 0.8;

        /* Dimensões ajustadas */
        this.width = 50 * this.scale;
        this.height = 37 * this.scale;

        /* Velocidade horizontal */
        this.velocity = velocity;

        /* Carrega imagem */
        this.image = this.getImage(PATH_INIMIGO_IMAGE);
    }

    moveRight() {
        /* Move para a direita */
        this.position.x += this.velocity;
    }

    moveLeft() {
        /* Move para a esquerda */
        this.position.x -= this.velocity;
    }

    moveDown() {
        /* Move para baixo (um passo vertical) */
        this.position.y += this.height;
    }

    incrementVelocity(boost) {
        /* Aumenta velocidade (dificuldade progressiva) */
        this.velocity += boost;
    }

    getImage(path) {
        /* Cria imagem */
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx) {
        /* Desenha inimigo */
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    shoot(projectiles) {
        /* Cria projétil que desce */
        const p = new Projectile(
            {
                x: this.position.x + this.width / 2 - 2,
                y: this.position.y + this.height,
            },
            10 /* Velocidade positiva = desce */
        );

        projectiles.push(p);
    }

    hit(projectile) {
        /* Colisão simples rectangular */
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }

    collided(obstacle) {
        /* Verifica colisão entre inimigo e obstáculo */
        return (
            (obstacle.position.x >= this.position.x &&
                obstacle.position.x <= this.position.x + this.width &&
                obstacle.position.y >= this.position.y &&
                obstacle.position.y <= this.position.y + this.height) ||
            (obstacle.position.x + obstacle.width >= this.position.x &&
                obstacle.position.x <= this.position.x &&
                obstacle.position.y >= this.position.y &&
                obstacle.position.y <= this.position.y + this.height)
        );
    }
}

export default Invader;
