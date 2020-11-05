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
        let squares;
        
        squares = [];
        for(let i=0; i < 9; ++i){
            squares.push('');
        }
        squares = [
            'X', 'O', 'X',
            'O', 'X', 'O',
            ' ', 'O', 'X'
        ];
        
        function log(){
            let result = '';
            for(let i = 0; i < 9; i += 3){
                result += squares[i] + squares[i+1] + squares[i+2] + '\n';
            }
            return result;
        }

        return {log};
    })();

    console.log(gameBoard.log());
})();