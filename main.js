let game = (function(){
    let playerBehaviour, players, currentPlayer, gameBoard;

    playerBehaviour = {
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

    function createPlayer(name = '', symbol = ''){
        let player = Object.create(playerBehaviour);
        player.nick = name;
        player.sym = symbol;
        return player;
    }

    players = [createPlayer('P1', 'X'), createPlayer('P2', 'O')];

    _currentPlayer = 0;

    gameBoard = (function(){
        let _squares;
        
        _squares = [];
        for(let i=0; i < 9; ++i){
            _squares.push('');
        }
        _squares = [
            'X', 'O', 'X',
            'O', 'X', 'O',
            ' ', 'O', 'X'
        ];
        
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

    return {gameBoard, togglePlayer, setCurrentPlayer, getCurrentSymbol};
})();

let ui = (function(){
    let DOM;

    DOM = {
        board: document.querySelector('.board'),
    };

    

    return {DOM};
})();

let controller = (function(data, view){

    function _handleClick(e){
        let isSquare;

        isSquare = e.target.classList.contains('square');

        if(isSquare && e.target.textContent === ''){
            e.target.textContent = data.getCurrentSymbol();
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