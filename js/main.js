import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementList, getCurrentTurnElement ,getCellElementAtIdx,getGameStatusElement, getGameButton} from "./selectors.js";

import { checkGameStatus } from "./utils.js";
console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");
let gameStatus = GAME_STATUS.PLAYING;



function updateGameStatus(newGameStatus){
    gameStatus = newGameStatus;
    
    const gameStatusElemet = getGameStatusElement();
    if(gameStatusElemet){
        gameStatusElemet.textContent = newGameStatus;
    }
}
function showButton(){
    const replayButton = getGameButton();
    if(replayButton){
        replayButton.classList.add('show');
    }
}
function hideButton(){
    const replayButton = getGameButton();
    if(replayButton){
        replayButton.classList.remove('show');
    }
}
function highlightWinCell(winPositions){
    if(!Array.isArray(winPositions)|| winPositions.length != 3) {
        throw new Error("error");
    }
    for (const position of winPositions){
        const cell = getCellElementAtIdx(position);
        if(cell){
             cell.classList.add('win');
        }
    }
};
function handleCellClick(cell,index){
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus != GAME_STATUS.PLAYING;
    if(isClicked) return;
    cell.classList.add(currentTurn);
    cellValues[index] = currentTurn == TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
    toggleTurn();
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED:{
            updateGameStatus(game.status);
            showButton();
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:{
            updateGameStatus(game.status);
            showButton();   
            highlightWinCell(game.winPositions);
                break;
        }
        default:
            break;
    }
    console.log("click" , cell , index)

}
function toggleTurn(){
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    const curentTurnElement = getCurrentTurnElement();
    curentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS);
    curentTurnElement.classList.add(currentTurn);
    
}
function initCellElementList(){
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell , index) => {
        cell.addEventListener("click",() => handleCellClick(cell,index));
    });
}
function resetGame(){
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(()=>"");
    updateGameStatus(GAME_STATUS.PLAYING);
    currentTurn = TURN.CROSS;
    const curentTurnElement  = getCurrentTurnElement();
    if(curentTurnElement){
        curentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS);
        curentTurnElement.classList.add(TURN.CROSS);
    }
    const cellElementList = getCellElementList();
   for(const cell of cellElementList){
    cell.classList.remove(TURN.CIRCLE,TURN.CROSS);
    cell.classList.remove("win");
   }
   hideButton();
}
function initReplayButton(){
    const replayButton = getGameButton();
    if(replayButton){
        replayButton.addEventListener('click',()=>{
            resetGame();
        })
    }
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(()=>{
    initCellElementList();

    initReplayButton();
})()