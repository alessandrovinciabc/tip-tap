let game = (function(){
    let _currentPlayer, _playerBehaviour, players, gameBoard;

    _playerBehaviour = {
        set name(newName){
            this.name = newName;
        },

        get name(){
            return this.name;
        },

        get symbol(){
            return this.sym;
        }
    };

    function _createPlayer(name = '', symbol = ''){
        let player = Object.create(_playerBehaviour);
        player.nick = name;
        player.sym = symbol;
        return player;
    }

    players = [_createPlayer('P1', 'X'), _createPlayer('P2', 'O')];

    _currentPlayer = 0;

    gameBoard = (function(){
        let _squares;
        
        _squares = [];
        for(let i=0; i < 9; ++i){
            _squares.push('');
        }
        
        function log(){
            let result = '';
            for(let i = 0; i < 9; i += 3){
                result += _squares[i] + _squares[i+1] + _squares[i+2] + '\n';
            }
            return result;
        }

        function getBoard(){
            return [..._squares];
        }

        function setSquare(pos, value){
            let normalized, result;

            normalized = value.toUpperCase();

            if(pos >= 0 && pos < _squares.length){
                switch(normalized){
                    case 'X':
                        _squares[pos] = value;
                        result = true;
                        break;
                    case 'O':
                        _squares[pos] = value;
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
            }

            return result;
        }

        return {log, getBoard, setSquare};
    })();

    function checkWinner(){
        let squares, winner, foundWinner, winPos;
        squares = gameBoard.getBoard();

        winner = -1;
        winPos = 0;
        foundWinner = false;

        //Check Rows
        for(let i = 0; i < 9; i += 3){
            let stringForm;
            if(!foundWinner){
                stringForm = squares[i+0] + squares[i+1] + squares[i+2];

                switch(stringForm){
                    case 'XXX':
                        winner = 0;
                        foundWinner = true;
                        winPos = (i + 3) / 3;
                        break;
                    case 'OOO':
                        winner = 1;
                        foundWinner = true;
                        winPos = (i + 3) / 3;
                        break;
                    default:
                        //no winner found in this row
                        break;
                }
            }else{
                //stop the loop if a winner was found
                break;
            }
        }

        //Check Columns
        for(let i = 0; i < 3 && !foundWinner; ++i){
            let stringForm;
            if(!foundWinner){
                stringForm = squares[i+0] + squares[i+3] + squares[i+6];

                switch(stringForm){
                    case 'XXX':
                        winner = 0;
                        foundWinner = true;
                        winPos = (i + 1) + 3;
                        break;
                    case 'OOO':
                        winner = 1;
                        foundWinner = true;
                        winPos = (i + 1) + 3;
                        break;
                    default:
                        //no winner found in this row
                        break;
                }
            }else{
                //stop the loop if a winner was found
                break;
            }
        }

        //Check Diagonals
        if(!foundWinner){
            let diagonals, checks;

            diagonals = [];

            diagonals[0] = squares[0] + squares[4] + squares[8];
            diagonals[1] = squares[2] + squares[4] + squares[6];

            
            if(diagonals[0] === 'XXX'){
                winner = 0;
                foundWinner = true;
                winPos = 7;
            }else if(diagonals[0] === 'OOO'){
                winner = 1;
                foundWinner = true;
                winPos = 7;
            }else if(diagonals[1] === 'XXX'){
                winner = 0;
                foundWinner = true;
                winPos = 8;

            }else if(diagonals[1] === 'OOO'){
                winner = 1;
                foundWinner = true;
                winPos = 8;
            }
        }

        return {winner, winPos}; //winPos tells which specific row, column or diagonal has won
                                 //0 means none. 1-3 for rows, 4-6 for columns, 7-8 for diagonals
                                 //(going from top to bottom or left to right)
    }

    function togglePlayer(){
        _currentPlayer = _currentPlayer === 0 ? 1 : 0;
        return _currentPlayer;
    }

    function setCurrentPlayer(value){
        let int, output;
        int = parseInt(value);
        output = -1;
        if(int >= 0 && int <= 1){
            output = _currentPlayer = int;
        }
        return output;
    }

    function getCurrentSymbol(){
        return players[_currentPlayer].symbol;
    }

    return {players, gameBoard, checkWinner, togglePlayer, setCurrentPlayer, getCurrentSymbol};
})();

let ui = (function(){
    let DOM;

    DOM = {
        board: document.querySelector('.board'),
    };

    function setSquare(square, symbol){
        square.textContent = symbol;
    }

    function getBoard(){
        let squares = DOM.board.querySelectorAll('.square');
        squares = [...squares];
        return squares.map((square)=>square.textContent);
    }

    function resetBoard(){
        let squares = DOM.board.querySelectorAll('.square');
        for(let i = 0; i < 9; ++i){
            squares[i].textContent = '';
        }
    }

    return {DOM, setSquare, getBoard, resetBoard};
})();

let controller = (function(data, view){

    function _handleClick(e){
        let isSquare, id, currentSymbol;

        isSquare = e.target.classList.contains('square');

        if(isSquare && e.target.textContent === ''){
            id = e.target.dataset.id;
            currentSymbol = data.getCurrentSymbol();

            ui.setSquare(e.target, currentSymbol);
            data.gameBoard.setSquare(parseInt(id), currentSymbol);

            data.togglePlayer();
        }
    }

    function _setUpListeners(){
        ui.DOM.board.addEventListener('click', _handleClick);
    }

    function init(){
        _setUpListeners();
    }

    return {init};
})(game, ui);

controller.init();