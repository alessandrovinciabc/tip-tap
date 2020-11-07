let game = (function(){
    let playerBehaviour, gameBoard;

    playerBehaviour = {
        set name(newName){
            this.name = newName;
            return this.name;
        },

        get name(){
            return this.name;
        }
    };

    function createPlayer(name = ''){
        let player = Object.create(playerBehaviour);
        player.name = name;
        return player;
    }

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

    return {gameBoard};
})();

let ui = (function(){
    let _DOM, _playerSymbol;

    _DOM = {
        board: document.querySelector('.board'),
    };

    _playerSymbol = 'X';

    function _validateInput(input){
        let normalized;
        normalized = input.toUpperCase();

        switch(normalized){
            case 'X':
            case 'O':
                break;
            default:
                return false;
        }

        return normalized;
    }

    function _handleClick(e){
        let isSquare;

        isSquare = e.target.classList.contains('square');

        if(isSquare && e.target.textContent === ''){
            e.target.textContent = _playerSymbol;
            toggleSymbol();
        }
    }

    function toggleSymbol(){
        return _playerSymbol = _playerSymbol === 'X' ? 'O' : 'X';
    }

    function setSymbol(character){
        let validated;

        validated = _validateInput(character);
        if(validated){
            _playerSymbol = validated;
        }
    }

    function setUpListeners(){
        _DOM.board.addEventListener('click', _handleClick);
    }

    return {setUpListeners, toggleSymbol, setSymbol};
})();

let controller = (function(data, view){

    function init(){
        view.setUpListeners();
    }

    return {init};
})(game, ui);

controller.init();