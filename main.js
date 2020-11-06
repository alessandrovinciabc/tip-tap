let game = (function(){
    let playerBehaviour, gameBoard;

    playerBehaviour = {
        resetScore(){
            return this.score = 0;
        },

        incrementScore(){
            return ++this.score;
        },

        get score(){
            return this.score;
        }
    };

    function createPlayer(){
        let player = Object.create(playerBehaviour);
        score = 0;
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

        return {log};
    })();

    console.log(gameBoard.log());
})();

let ui = (function(){

})();

let controller = (function(){

})();