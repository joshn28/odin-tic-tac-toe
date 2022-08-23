const displayBoard = document.querySelector('.board');

const gameBoard = (() => {
    'strict mode';

    const _board = [
        ['X', 'O', 'X'],
        ['X', 'O', 'X'],
        ['X', 'O', 'X']
    ];
    const getBoard = () => _board;

    return {
        getBoard
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

const player = (name, mark) => {
    let wins = 0;
    const getName = () => name;
    const getNumberOfWins = () => wins;
    const getMark = () => mark;
    const addWin = () => ++wins;

    return {
        getName,
        getNumberOfWins,
        getMark,
        addWin
    };
};

displayController.renderDisplay(gameBoard.getBoard());