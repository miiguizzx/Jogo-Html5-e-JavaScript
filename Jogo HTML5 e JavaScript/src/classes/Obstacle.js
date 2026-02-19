class Obstacle {
    constructor(position, width, height, color) {
        /* Posição do obstáculo */
        this.position = position;

        /* Dimensões */
        this.width = width;
        this.height = height;

        /* Cor */
        this.color = color;
    }

    draw(ctx) {
        /* Desenha rectângulo */
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    hit(projectile) {
        /* Determina o ponto relevante do projétil para colisão:
           - Se sobe (velocity < 0) usa o topo
           - Se desce usa a base */
        const projectilePositionY =
            projectile.velocity < 0
                ? projectile.position.y
                : projectile.position.y + projectile.height;

        /* Verifica se o projétil está dentro da área do obstáculo */
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectilePositionY >= this.position.y &&
            projectilePositionY <= this.position.y + this.height
        );
    }
}

export default Obstacle;
