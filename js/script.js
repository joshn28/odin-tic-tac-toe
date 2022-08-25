const gameBoard = (() => {
    'strict mode';

    const _board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
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
    const _threeInADiag = (mark) => {
        if (_board[0][2] === mark &&
            _board[1][1] === mark &&
            _board[2][0] === mark) {
                return true;
        } else if (
            _board[0][0] === mark &&
            _board[1][1] === mark &&
            _board[2][2] === mark) {
                return true;
        }

        return false;
    };
    const getBoard = () => _board;
    const checkWin = () => {
        if (_threeInARow('X')) {
            return true;
        } else if (_threeInACol('X')) {
            return true;
        } else if (_threeInADiag('X')) {
            return true;
        } else if (_threeInARow('O')) {
            return true;
        } else if (_threeInACol('O')) {
            return true;
        } else if (_threeInADiag('O')) {
            return true;
        }

        return false;
    };
    const checkTie = () => {
        let tie = true;

        _board.forEach(row => {
            if (row.some(mark => mark === '') ||
                _threeInARow('X') || _threeInARow('O') ||
                _threeInACol('X') || _threeInACol('O') ||
                _threeInADiag('X') || _threeInADiag('O')) {
                tie = false;
                return;
            }
        });

        return tie;
    };

    return {
        getBoard,
        checkWin,
        checkTie
    };
})();

const displayController = (() => {
    'strict mode';

    const renderBoard = (board) => {
        const displayBoard = document.querySelector('.board');

        for (let i = 0; i < displayBoard.children.length; i++) {
            const spot = displayBoard.children[i];
    
            board.forEach((row, rowIndex) => {
                row.forEach((char, colIndex) => {
                    if (rowIndex === +spot.dataset.row &&
                        colIndex === +spot.dataset.column) {
                            spot.textContent = char;

                            if (char === 'X') {
                                spot.style.color = 'red';
                            } else if (char === 'O') {
                                spot.style.color = 'blue';
                            }
                    } 
                });
            });
        }
    };
    const renderMessage = (player, state) => {
        const message = document.querySelector('.display-msg');

        if (state === 'w') {
            const displayMsg = player.getName() + ' wins!';
            message.textContent = displayMsg;
        } else if (state === 't') {
            const displayMsg = 'Tie!';
            message.textContent = displayMsg;
        } else {
            const displayMsg = `${player.getName()}'s turn`;
            message.textContent = displayMsg;
        }
    };
    const renderScore = (firstPlayer, secondPlayer) => {
        const numberOfWins = {};
        numberOfWins[firstPlayer.getMarker()] = firstPlayer.getNumberOfWins();
        numberOfWins[secondPlayer.getMarker()] = secondPlayer.getNumberOfWins();

        const xScore = document.querySelector('.x-wins');
        const oScore = document.querySelector('.o-wins');

        while (xScore.firstChild) {
            xScore.removeChild(xScore.firstChild);
        }

        while (oScore.firstChild) {
            oScore.removeChild(oScore.firstChild);
        }

        const xWins = document.createElement('span');
        xWins.classList.toggle('x-red');
        xWins.textContent = "X";

        const oWins = document.createElement('span');
        oWins.classList.toggle('o-blue');
        oWins.textContent = "O";

        xScore.appendChild(xWins);
        xScore.innerHTML += ': ' + numberOfWins['X'];
        oScore.appendChild(oWins);
        oScore.innerHTML += ': ' + numberOfWins['O'];
    };

    return {
        renderBoard,
        renderScore,
        renderMessage
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

const game = (() => {
    let _playerTurn;
    const _setPlayerTurn = (player) => {
        if (!_playerTurn) {
            _playerTurn = player;
        }
    };
    const _checkGameState = (board, display, firstPlayer, secondPlayer) => {
        if (board.checkWin()) {
            _playerTurn.addWin();

            display.renderMessage(_playerTurn, 'w');
            display.renderScore(firstPlayer, secondPlayer);

            return 'w';
        } else if (board.checkTie()) {
            display.renderMessage(_playerTurn, 't');
            display.renderScore(firstPlayer, secondPlayer);

            return 't';
        }
    };
    const _restart = (board, display) => {
        const restartBtn = document.querySelector('.restart-btn');

        restartBtn.addEventListener('click', () => {
            board.forEach(row => {
                row.forEach((mark, i) => {
                    row[i] = '';
                });
            });
            
            display.renderMessage(_playerTurn, '');
            display.renderBoard(board);
        });
    };
    const start = (board, display) => {
        const player1Name = document.querySelector('#name1').value;
        const player2Name = document.querySelector('#name2').value;
        const dropdown = document.querySelector('#marker');
        const player1Marker = dropdown.options[dropdown.selectedIndex].text;

        document.querySelector('.players').classList.toggle('hidden');
        document.querySelector('.container').classList.toggle('hidden');

        let player1 = player(player1Name, player1Marker); 
        let player2;

        if (player1Marker === 'X') {
            player2 = player(player2Name, 'O');
        } else {
            player2 = player(player2Name, 'X');
        }

        _setPlayerTurn(player1);

        display.renderMessage(_playerTurn, '');

        document.addEventListener('click', (e) => {
            if (!e.target.textContent && !board.checkTie() && !board.checkWin()) {
                const rowNumber = e.target.dataset.row;
                const colNumber = e.target.dataset.column;
                
                board.getBoard()[rowNumber][colNumber] = _playerTurn.getMarker();

                if (!_checkGameState(board, display, player1, player2)) {
                    if (_playerTurn.getMarker() === player1.getMarker()) {
                        _playerTurn = player2;
                    } else {
                        _playerTurn = player1;
                    }
                    display.renderMessage(_playerTurn, '');
                }

                display.renderBoard(board.getBoard());
            }
        });

        _restart(board.getBoard(), display);
    };

    return {
        start
    };
})();

const startBtn = document.querySelector('.game-start');
startBtn.addEventListener('click', () => {
    const player1 = document.querySelector('#name1');
    const player2 = document.querySelector('#name2');

    if (player1.value && player2.value) {
        game.start(gameBoard, displayController)
    } else {
        const spans = document.querySelectorAll('.error.not-visible');

        function checkPlayerName(player, i) {
            if (!player.value) {
                player.classList.add('error');
                spans[i].classList.remove('not-visible');
    
                player.addEventListener('input', (e) => {
                    const input = e.target.value;
    
                    if (input) {
                        player.classList.remove('error');
                        spans[i].classList.add('not-visible');
                    }
                });
            }
        }
        
        checkPlayerName(player1, 0);
        checkPlayerName(player2, 1);
    }
});