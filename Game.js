class Game {
    constructor(selector){
        this.ROWS = 6;
        this.COLS = 7;
        this.selector = selector;
        this.player = 'red';
        this.onPlayersTurn = function (){};
        this.createGrid();
        this.setEventListeners();
    }

    createGrid(){
        const $board = $(this.selector);
        $board.empty();
        for(let row = 0 ; row<this.ROWS ; row++){
            const $row = $('<div>').addClass('row');
            for (let col = 0 ; col<this.COLS ; col++){
                const $col = $('<div>').addClass('col empty').attr('data-col',col).attr('data-row',row);
                $row.append($col);
            }
            $board.append($row);
        }
    }

    setEventListeners(){
        const $board = $(this.selector);
        const that = this;

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }

        $board.on('mouseenter','.col.empty',function () {
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);
        });

        $board.on('mouseleave','.col',function () {
            $('.col').removeClass(`next-${that.player}`);
        });

        $board.on('click','.col.empty',function () {
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(`${that.player}`);
            $lastEmptyCell.data('player',that.player);
            const result = checkForGameStatus($lastEmptyCell);
            if(result){
                alert(`Congrats!, ${that.player} has won!`);
                that.restart();
                return;
            }
            that.player = (that.player === 'red')? 'yellow': 'red';
            that.onPlayersTurn();
            $(this).trigger('mouseenter');
        })

        function checkForGameStatus(cell){
            const col = cell.data('col');
            const row = cell.data('row');

            function checkIfFour(direction) {
                let i = row + direction.i;
                let j = col + direction.j;
                let total = 0;
                let $next = $getNextCell(i,j);
                console.log(`${$next.data('player')}`);
                while (i>=0 && i<that.COLS && j>=0 && j<that.ROWS && $next.data('player') === that.player){
                    total++;
                    i+=direction.i;
                    j+=direction.j;
                    $next = $getNextCell(i,j);
                }
                return total;
            }

            function $getNextCell(i,j) {
                return $(`.col[data-row='${i}'][data-col='${j}']`);
            }

            function checkIfGameOver(directionOne,directionTwo){
                let total = 1 + checkIfFour(directionOne)+checkIfFour(directionTwo);
                if(total >= 4){
                    return that.player;
                }
                else return null;
            }

            function checkVertical() {
                return checkIfGameOver({i:1,j:0}, {i:-1,j:0});
            }

            function checkHorizontal() {
                return checkIfGameOver({i:0,j:1},{i:0,j:-1});
            }

            function checkDiagonalLeftToRight() {
                return checkIfGameOver({i: 1, j: -1}, {i: -1, j: 1});
            }

            function checkDiagonalRightToLeft() {
                return checkIfGameOver({i: 1, j: 1}, {i: -1, j: -1});
            }

            return checkVertical() || checkHorizontal() || checkDiagonalLeftToRight() || checkDiagonalRightToLeft();
        }

    }

    restart(){
        this.createGrid();
        this.player = 'red';
        this.onPlayersTurn();
    }
}