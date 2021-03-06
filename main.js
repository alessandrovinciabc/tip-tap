let game = (function(){
    let _currentPlayer, _playerBehaviour, _foundWinner, _isTie, players, gameBoard;

    _foundWinner = false;
    _isTie = false;

    _playerBehaviour = {
        set name(newName){
            this.nick = newName;
        },

        get name(){
            return this.nick;
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

    _currentPlayer = 1;

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
        let squares, winner, winPos;
        squares = gameBoard.getBoard();

        winner = -1;
        winPos = 0;

        //Check Rows
        for(let i = 0; i < 9; i += 3){
            let stringForm;
            if(!_foundWinner){
                stringForm = squares[i+0] + squares[i+1] + squares[i+2];

                switch(stringForm){
                    case 'XXX':
                        winner = 0;
                        _foundWinner = true;
                        winPos = (i + 3) / 3;
                        break;
                    case 'OOO':
                        winner = 1;
                        _foundWinner = true;
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
        for(let i = 0; i < 3 && !_foundWinner; ++i){
            let stringForm;
            if(!_foundWinner){
                stringForm = squares[i+0] + squares[i+3] + squares[i+6];

                switch(stringForm){
                    case 'XXX':
                        winner = 0;
                        _foundWinner = true;
                        winPos = (i + 1) + 3;
                        break;
                    case 'OOO':
                        winner = 1;
                        _foundWinner = true;
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
        if(!_foundWinner){
            let diagonals;

            diagonals = [];

            diagonals[0] = squares[0] + squares[4] + squares[8];
            diagonals[1] = squares[2] + squares[4] + squares[6];

            
            if(diagonals[0] === 'XXX'){
                winner = 0;
                _foundWinner = true;
                winPos = 7;
            }else if(diagonals[0] === 'OOO'){
                winner = 1;
                _foundWinner = true;
                winPos = 7;
            }else if(diagonals[1] === 'XXX'){
                winner = 0;
                _foundWinner = true;
                winPos = 8;

            }else if(diagonals[1] === 'OOO'){
                winner = 1;
                _foundWinner = true;
                winPos = 8;
            }
        }

        if(!_foundWinner){
            let filledSquares = squares.reduce((total, current)=>{
                if(current !== ''){
                    return total + 1;
                }
            }, 0);

            if(filledSquares === 9){
                winner = 2;
                _isTie = true;
            }
        }

        return {winner, winPos}; //winPos tells which specific row, column or diagonal has won
                                 //0 means none. 1-3 for rows, 4-6 for columns, 7-8 for diagonals
                                 //(going from top to bottom or left to right)

                                 //winner tells which player has won. 0-1 for p1 or p2, 2 for a tie
                                 //-1 for no winner
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

    function isGameOver(){
        return _foundWinner || _isTie;
    }

    return {players, gameBoard, checkWinner, togglePlayer, setCurrentPlayer, getCurrentSymbol, isGameOver};
})();

let ui = (function(){
    let DOM, screenBlocker;

    screenBlocker = document.createElement('div');

    screenBlocker.style.position = 'absolute';
    screenBlocker.style.top = '0';
    screenBlocker.style.left = '0';
    screenBlocker.style.height = '100vh';
    screenBlocker.style.width = '100vw';
    screenBlocker.style.backgroundColor = 'rgba(0,0,0,0.5)';

    DOM = {
        root: document.querySelector(':root'),
        body: document.querySelector('body'),
        board: document.querySelector('.board'),
        strike: document.querySelector('.strike'),
        screenBlocker,
        popup: document.querySelector('.popup'),
        popupBtn: document.querySelector('.popup > button'),
        setup: document.querySelector('.setup'),
        slider: document.querySelector('.slider'),
        resetBtn: document.querySelector('.reset-btn'),

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

    function setStrike(pos){
        let direction;
        DOM.strike.style.display = 'initial';

        if(pos >= 1 && pos <= 3){
            direction = 'horizontal';
        }else if(pos >= 4 && pos <= 6){
            direction = 'column';
        }else if(pos === 7 || pos === 8){
            direction = 'diagonal';
        }

        DOM.strike.classList.toggle(direction);
        DOM.strike.classList.toggle('pos' + pos);
    }

    function toggleScreenBlocker(){
        if(DOM.body.contains(screenBlocker)){
            DOM.body.removeChild(screenBlocker);
        }else{
            DOM.body.appendChild(screenBlocker);
        }
    }

    function displayPopup(text, type){

        toggleScreenBlocker();

        DOM.popup.style.display = 'flex';
        DOM.popup.children[0].textContent = text;

        if(type === 'setup'){
            DOM.setup.style.display = 'flex';
        }

    }

    function hidePopup(){
        toggleScreenBlocker();
        DOM.popup.style.display = 'none';
        DOM.setup.style.display = 'none';
        DOM.popup.children[0].textContent = '';
    }

    function getSetup(){
        let p1, p2;
        p1 = DOM.setup.querySelector('#name1').value;
        p2 = DOM.setup.querySelector('#name2').value;

        return {p1, p2};
    }

    function toggleSlider(){
        let newColor;

        DOM.slider.classList.toggle('slider');
        DOM.slider.classList.toggle('slider-x');

        newColor =  DOM.slider.classList.contains('slider-x') ? 'var(--cta)' : 'var(--primary)';

        DOM.root.style.setProperty('--slider-color', newColor);
    }

    function showResetBtn(){
        DOM.resetBtn.style.display = 'block';
    }

    return {
        DOM, setSquare, getBoard, resetBoard, setStrike, toggleScreenBlocker,
        displayPopup, hidePopup, toggleSlider, getSetup, showResetBtn
    };
})();

let controller = (function(data, view){

    function _handleClick(e){
        let isSquare, id, currentSymbol, winningPlay;

        isSquare = e.target.classList.contains('square');

        if(!data.isGameOver()){
            if(isSquare && e.target.textContent === ''){
                id = e.target.dataset.id;
                currentSymbol = data.getCurrentSymbol();
    
                ui.setSquare(e.target, currentSymbol);
                data.gameBoard.setSquare(parseInt(id), currentSymbol);
    
                data.togglePlayer();

                winningPlay = data.checkWinner();
                if(winningPlay.winner !== -1){
                    if(winningPlay.winner === 2){ //tie
                        ui.displayPopup("It's a tie!");
                    }else{
                        ui.setStrike(winningPlay.winPos);
                        ui.displayPopup(data.players[winningPlay.winner].nick + ' won!');
                    }
                }
            }
        }
    }

    function _hidePopup(e){
        let names;
        names = ui.getSetup();
        data.players[0].name = names.p1;
        data.players[1].name = names.p2;

        ui.hidePopup();

        if(data.isGameOver()){
            ui.showResetBtn();
        }
    }

    function _clickSlider(e){
        data.togglePlayer();
        ui.toggleSlider();
    }

    function _clickReset(e){
        location.reload();
    }

    function _setUpListeners(){
        ui.DOM.board.addEventListener('click', _handleClick);
        ui.DOM.popupBtn.addEventListener('click', _hidePopup);
        ui.DOM.slider.addEventListener('click', _clickSlider);
        ui.DOM.resetBtn.addEventListener('click', _clickReset);
    }

    function init(){
        _setUpListeners();
        ui.displayPopup('Settings', 'setup');
    }

    return {init};
})(game, ui);

controller.init();