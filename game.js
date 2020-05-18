const gameBoard = (() => {
    // The divs that are our positions, put into a 2d array for easy indexing.
    const _squares = (() => {
        let squareDivs = Array.from(document.querySelectorAll('.square'));
        let arr = [];
        while (squareDivs.length) {
            arr.push(squareDivs.splice(0,3));
        }
        return arr;
    })();
    const winText = document.querySelector('.winner');
    let _isEmpty = true;
    let _board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];
    const readBoard = () => {
        return _board;
    };
    const resetBoard = () => {
        _board = [
        ['','',''],
        ['','',''],
        ['','','']
        ];
        _isEmpty = true;

        _squares.forEach(row => {
            row.forEach(square => {
                square.classList.remove('hidden');
            })
        })

        winText.classList.add('hidden');

    };
    const checkWinner = () => {
        if(_isEmpty)
            return null;
        const x = 'X';
        const o = 'O';

        const squareComparison = (pos1, pos2, pos3) => {
            return pos1 === pos2 && pos2 === pos3 && pos1 != '';
        }

        //all horizontal possibilities
        for (let i = 0; i < _board.length; i++) {
            if (squareComparison(_board[i][0], _board[i][1], _board[i][2])) {
                return _board[i][0];
            } 
        }

        //all vertical possibilites
        for (let i = 0; i < _board.length; i++) {
            if (squareComparison(_board[0][i], _board[1][i], _board[2][i])) {
                return _board[0][i];
            }
        }

        //our two diagonal conditions
        if (squareComparison(_board[0][0], _board[1][1], _board[2][2])) {
            return _board[0][0];
        }
        if (squareComparison(_board[0][2], _board[1][1], _board[2][0])) {
            return _board[0][2];
        }

        let openPositions = 0;
        for (let i = 0; i < _board.length; i++) {
            for (let j = 0; j < _board.length; j++) {
                if (_board[i][j] === '')
                    openPositions++;
            }
            
        }
        if(openPositions === 0)
            return 'tie'; //tie

        return null;
    }

    //! For debugging
    const clgBoard = () => {
        console.table(_board);
        console.table(_squares);
    }

    const isTaken = (row, col) => {
        if (_board[row][col] === '')
            return false;
        return true;
    }

    const addToBoard = (row, col, char) => {
        const square = _board[row][col];
        if (square === '') {
            _board[row][col] = char;
            _isEmpty = false;
        }
        render();
        return checkWinner();
    }
    const _scores = {
        X: -10,
        O: 10,
        tie: 0

    };
    const aiMove = () => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (_board[i][j] === '') {
                    _board[i][j] = 'O';
                    let score = minimax(_board, 0, false);
                    _board[i][j] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        move = {i, j};
                    }
                }
            } 
        }
        addToBoard(move.i, move.j, 'O');
        //_board[move.i][move.j] = 'O';
        gameBoard.render();
        return checkWinner();
    }

    const minimax = (board, depth, isMaximizer) => {
        let result = checkWinner();
        if (result !== null) {
            return _scores[result];
        }
        if (isMaximizer)  {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if(board[i][j] === '') {
                        board[i][j] = 'O';
                        let score = minimax(board, depth + 1, false);
                        board[i][j] = '';
                        bestScore = Math.max(score, bestScore);
                    } 
                } 
            }
            return bestScore;
        }
        else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if(board[i][j] === '') {
                        board[i][j] = 'X';
                        let score = minimax(board, depth + 1, true);
                        board[i][j] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    const render = () => {
        _board.forEach((row, i) => {
            row.forEach((square, j)=> {
                const squareDiv = _squares[i][j];
                const boardText = _board[i][j];
                if (boardText !== squareDiv.innerText) {
                    squareDiv.innerText = boardText;
                    if(_isEmpty) {
                       squareDiv.classList.remove('X', 'O');
                       squareDiv.classList.remove('match');
                    }
                    else
                        squareDiv.classList.add(boardText);
                }
            });
        });
    }

    const addWinner = (status) => {
        console.log(winText.textContent, status);
        if (status === 'computer') {
            winText.textContent = 'Computer wins!';
        }
        else if (status === 'player') {
            winText.textContent = 'You win!';
        }

        winText.classList.remove('hidden');
        _squares.forEach(row => {
            row.forEach(square => {
                square.classList.add('hidden');
            })
        })
    }
    return { readBoard, resetBoard, clgBoard, addToBoard, render, isTaken, checkWinner, aiMove, addWinner };
    
})();

const game = (() => {
    const btnStart = document.getElementById('start');
    const btnRestart = document.getElementById('restart');
    let _inGame = false;
    let _playerTurn = true;


    const _startGame = () => {
        _inGame = true;

    }
    btnStart.addEventListener('click', _startGame);

    btnRestart.addEventListener('click', () => {
        gameBoard.resetBoard();
        gameBoard.render();
        _inGame = false;
        _playerTurn = true;
    })

    let squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        const indexI = square.id.split('')[0];
        const indexJ = square.id.split('')[1];
        square.addEventListener('click', () => {
            if (_inGame && !gameBoard.isTaken(indexI, indexJ)) {
                if(_playerTurn) {
                    _playerTurn = false;
                    gameBoard.addToBoard(indexI,indexJ,'X');
                    if (gameBoard.checkWinner()) {
                        setTimeout(gameBoard.addWinner.bind(null, 'player'), 1250);
                        _inGame = false;
                        return;
                    };
                    gameBoard.aiMove();
                    if (gameBoard.checkWinner()) {
                        setTimeout(gameBoard.addWinner.bind(null, 'computer'), 1250);
                        _inGame = false;
                    }
                    _playerTurn = true;
                }
            }
        })
    })

    return {};
})();




