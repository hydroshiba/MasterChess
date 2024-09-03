const piecesvg = {
	'K': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
	'Q': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
	'R': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
	'B': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
	'N': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
	'P': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
	'k': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
	'q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
	'r': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
	'b': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
	'n': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
	'p': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
};

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chessBoard');
    const darkSquare = '#ea4849';
    const lightSquare = '#fff';
    const pieces = [
		'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
		'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
		'', '', '', '', '', '', '', '',
		'', '', '', '', '', '', '', '',
		'', '', '', '', '', '', '', '',
		'', '', '', '', '', '', '', '',
		'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
		'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
    ];

    let selectedSquare = null;

    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.className = 'square';
        square.style.backgroundColor =
            (Math.floor(i / 8) % 2 === 0) ? (i % 2 === 0 ? lightSquare : darkSquare) : (i % 2 === 0 ? darkSquare : lightSquare);
        if (pieces[i]) {
			const piece = document.createElement('img');
			piece.src = piecesvg[pieces[i]];
			square.appendChild(piece);
        }
        // square.addEventListener('click', () => {
        //     if (selectedSquare) {
        //         // Move piece to the new square
        //         square.innerHTML = selectedSquare.innerHTML;
        //         selectedSquare.innerHTML = '';
        //         selectedSquare = null;
        //     } else if (square.innerHTML) {
        //         // Select the square
        //         selectedSquare = square;
        //     }
        // });
        board.appendChild(square);
    }
});