class Projectile {
    constructor(position, velocity) {
        /* Posição actual do projétil */
        this.position = position;

        /* Dimensões do projétil */
        this.width = 2;
        this.height = 20;

        /* Velocidade vertical (negativa = sobe, positiva = desce) */
        this.velocity = velocity;
    }

    draw(ctx) {
        /* Define a cor do projétil */
        ctx.fillStyle = "white";

        /* Desenha um rectângulo simples */
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        /* Move o projétil no eixo Y */
        this.position.y += this.velocity;
    }
}

export default Projectile;