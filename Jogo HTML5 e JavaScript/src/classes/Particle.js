class Particle {
    constructor(position, velocity, radius, color) {
        /* Posição actual da partícula */
        this.position = position;

        /* Velocidade nos eixos X e Y */
        this.velocity = velocity;

        /* Tamanho da partícula */
        this.radius = radius;

        /* Cor da partícula */
        this.color = color;

        /* Opacidade (usada para fade-out) */
        this.opacity = 1;
    }

    draw(ctx) {
        /* Guarda o estado actual do contexto */
        ctx.save();

        ctx.beginPath();

        /* Define transparência */
        ctx.globalAlpha = this.opacity;

        /* Desenha círculo */
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.closePath();

        /* Restaura estado anterior */
        ctx.restore();
    }

    update() {
        /* Move a partícula */
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        /* Reduz opacidade gradualmente (efeito de desaparecimento) */
        this.opacity = this.opacity - 0.008 <= 0 ? 0 : this.opacity - 0.008;
    }
}

export default Particle;