/* Caminho para a imagem da nave do jogador */
export const PATH_NAVE_IMAGE = "src/assets/images/nave.png";

/* Caminho para a imagem dos inimigos */
export const PATH_INIMIGO_IMAGE = "src/assets/images/inimigo.png";

/* Número de estrelas desenhadas no fundo */
export const NUMBER_STARS = 100;

/* Número de frames entre mudanças de animação */
export const INITIAL_FRAMES = 8;

/* Estados possíveis do jogo */
export const GameState = {
    START: "start",       /* Ecrã inicial */
    PLAYING: "playing",   /* Jogo em execução */
    GAME_OVER: "gameOver" /* Fim do jogo */
};