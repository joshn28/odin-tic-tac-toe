const displayBoard = document.querySelector('.board');

const gameBoard = (() => {
    'strict mode';

    const _board = [
        ['X', 'X', 'X'],
        ['X', '', 'X'],
        ['X', 'O', 'X']
    ];
    const _threeInARow = (mark) => {
        let win = false;

        _board.forEach(row => {

            if (row.every(el => mark === el)) {
                win = true;
                return;
            }
        });

        return win;
    };
    const _threeInACol = (mark) => {
        for (let i = 0; i < _board.length; i++) {
            if (_board[0][i] === mark &&
                _board[1][i] === mark &&
                _board[2][i] === mark) {
                    return true;
            }
        }

        return false;
    };
    let playerTurn = "X";
    const getBoard = () => _board;
    const checkWin = (mark) => {
        if (_threeInARow(mark)) {
            return true;
        } else if (_threeInACol(mark)) {
            return true;
        }
    }

    document.addEventListener('click', function(e) {
        if (!e.target.textContent) {
            const rowNumber = e.target.dataset.row;
            const colNumber = e.target.dataset.column;

            _board[rowNumber][colNumber] = playerTurn;

            e.target.textContent = playerTurn;

            if (playerTurn === "X") {
                playerTurn = "O";
            } else {
                playerTurn = "X";
            }
        }
    });

    return {
        getBoard,
        checkWin
    };
})();

const displayController = (() => {
    'strict mode';

    const renderDisplay = (board) => {
        for (let i = 0; i < displayBoard.children.length; i++) {
            const spot = displayBoard.children[i];
    
            board.forEach((row, rowIndex) => {
                row.forEach((char, colIndex) => {
                    if (rowIndex === +spot.dataset.row &&
                        colIndex === +spot.dataset.column) {
                            spot.textContent = char;
                    } 
                });
            });
        }
    };

    return {
        renderDisplay
    };
})();

const player = (name, marker) => {
    let wins = 0;
    const getName = () => name;
    const getNumberOfWins = () => wins;
    const getMarker = () => marker;
    const addWin = () => ++wins;

    return {
        getName,
        getNumberOfWins,
        addWin,
        getMarker
    };
};

const player1 = player('A', 'X');
const player2 = player('B', 'O');

console.log(gameBoard.checkWin(player1.getMarker()));
displayController.renderDisplay(gameBoard.getBoard());