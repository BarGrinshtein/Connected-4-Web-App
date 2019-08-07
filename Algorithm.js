$(document).ready(function () {
    const game = new Game('#board');
    $('#reset').click(function () {
        game.restart();
    })
    game.onPlayersTurn = function () {
        $('#player').text(game.player);
    }
})