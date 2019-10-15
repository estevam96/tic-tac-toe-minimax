var originalBoard;
const humano = 'O';
const ia = 'X';

//condições de vitoria
const combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
]

const cells = document.querySelectorAll('.cell');

startGame();
//Iniciando Jogo adicionando evento na tabela
function startGame() {
  document.querySelector('.endgame').style.display = 'none';
  originalBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(quadro) {
  if (typeof originalBoard[quadro.target.id] == 'number') {
    turn(quadro.target.id, humano);
    if (!verificarEmpate()) {
      turn(bestSpot(), ia);
    }
  }
}

/*
* @Param (int) quadroId => posição onde houve a jogadas
* @Param (char) player => jogador 'X' caso ia ou 'O' caso humano
*/
function turn(quadroId, player) {
  originalBoard[quadroId] = player;
  //imprimindo X ou O
  document.getElementById(quadroId).innerText = player;
  //Verificando se o jogador ganhou
  let gameWon = verificaVencendor(originalBoard, player);
  if (gameWon) {
    fimJogo(gameWon)
  }
}

//Verificando quem ganhou a partida
function verificaVencendor(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of combos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon
}

/*
* @Param (Object) gameWon => jogador com um indice
*/
// destaca quadros onde houve vitoria, e remove eventos
function fimJogo(gameWon) {
  //Destaca Linha onde houve a vitoria
  for (let index of combos[gameWon.index]) {
    document.getElementById(index).style.background =
      gameWon.player == humano ? "green" : "red"
  }

  //remove o evento de cada celula do tabuleiro
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declaraVencendor(gameWon.player == humano ? "Você Ganhou!" : "Você perdeu!")
}

/*
* @Parem (String) result => resultado do jogo
*
* Imprime o resultado da partida
*/
function declaraVencendor(result) {
  document.querySelector('.endgame').style.display = "block";
  document.querySelector(".endgame .text").innerText = result;
}

//Veriica se ainda há quadros disponiveis para jogadas
function emptySquares() {
  return originalBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
  return minimax(originalBoard, ia).index;
}

// Verifica se houve Empate, retona verdadeiro caiso haja
// empate e falso caso contrario.
function verificarEmpate() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.background = "blue";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declaraVencendor("Empate");
    return true;
  }
  return false;
}

/*
* @Param (Matrix int) newBoard=> matrax que representa o tabuleiro
* @Parem ( cha ) player => Jogador ia ou humano
*
*/
function minimax(newBoard, player) {
  //obtem quadros disponiveis
  var availSpots = emptySquares();

  // se o jogador ganha retorna -10
  if (verificaVencendor(newBoard, humano)) {
    return { score: -10 };
  }
  //se a ia ganhar retorna 10
  else if (verificaVencendor(newBoard, ia)) {
    return { score: 10 };
  }
  //caso seja impate retorna 0
  else if (availSpots.length === 0) {
    return { score: 0 };
  }
  // vetor para armazena a pontuação dos quadros
  var moves = [];
  //percorre todos os lugares vazios e obtendo sua pontuação
  for (var i = 0; i < availSpots.length; i++) {
    //objeto para armazenar cada um o indices de cada quadro vazio
    var move = {};
    //definindo um indece para o quadro vazio
    move.index = newBoard[availSpots[i]];
    //definindo nova jagada no quadro vazio
    newBoard[availSpots[i]] = player

    if (player == ia) {
      //chama minimax para o jogador humano
      var result = minimax(newBoard, humano);
      //armazena a pontuação no objeto move
      move.score = result.score;
    } else {
      //análogo aos passos anteriores, porem chama minimax para a ia
      var result = minimax(newBoard, ia);
      move.score = result.score;
    }

    /*
    *  os passos acima se repetem até encontra chegar na condição de parada
    *  que é quadro retorna -10,0,10.
    */
    //redifinindo a newBoard
    newBoard[availSpots[i]] = move.index;
    //adiciona move ao vetor moves
    moves.push(move);
  }

  //melhor jogada
  var bestMove;
  //caso a jogada seja da ia percorre todos os movimentos com a maior pontuação
  if (player == ia) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i
      }
    }

  }

  // caso o jogador seja humano percorre o movimento com a pontiação mais baixa
  else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i
      }
    }
  }

  // retorna jogada escolhida
  return moves[bestMove];
}
