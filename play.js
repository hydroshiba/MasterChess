// Firebase configuration
const firebaseConfig = {
	// Replace with your actual Firebase config
	apiKey: "AIzaSyCGv7DEPIG7ieCyv8gVl3RSAf7E1dA4Kmg",
	authDomain: "masterchess-8dfcd.firebaseapp.com",
	databaseURL: "https://masterchess-8dfcd-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "masterchess-8dfcd",
	storageBucket: "masterchess-8dfcd.appspot.com",
	messagingSenderId: "601239027759",
	appId: "1:601239027759:web:11975database1520f4b64e486da"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

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

function mixColors(color1, color2, weight1, weight2) {
    const parseRGBA = (color) => {
        const rgba = color.match(/rgba?\((\d+), (\d+), (\d+),? ?(\d?.?\d+)?\)/);
        return {
            r: parseInt(rgba[1]),
            g: parseInt(rgba[2]),
            b: parseInt(rgba[3]),
            a: rgba[4] ? parseFloat(rgba[4]) : 1
        };
    };

    const c1 = parseRGBA(color1);
    const c2 = parseRGBA(color2);

    const r = (c1.r * weight1 + c2.r * weight2) / (weight1 + weight2);
    const g = (c1.g * weight1 + c2.g * weight2) / (weight1 + weight2);
    const b = (c1.b * weight1 + c2.b * weight2) / (weight1 + weight2);
    const a = (c1.a * weight1 + c2.a * weight2) / (weight1 + weight2);

    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty');
    console.log('Selected difficulty:', difficulty);

	const board = document.getElementById('chessBoard');
	const chess = new Chess();
	const stockfish = new Worker('stockfish.js');

	const lightSquare = 'rgba(255, 255, 255, 1)'; // White with full opacity
	const darkSquare = 'rgba(234, 72, 73, 1)'; // Dark square color with full opacity
	const darkSelect = 'rgba(255, 215, 0, 1)'; // Gold yellow with 100% opacity
	const lightSelect = 'rgba(255, 215, 0, 0.7)'; // Gold yellow with 30% opacity

	let selectedSquare = null;

	function renderBoard() {
		board.innerHTML = '';
		const position = chess.board();
		for (let i = 0; i < 64; i++) {
			const square = document.createElement('div');
			square.className = 'square';
			square.style.backgroundColor =
				(Math.floor(i / 8) % 2 === 0) ? (i % 2 === 0 ? lightSquare : darkSquare) : (i % 2 === 0 ? darkSquare : lightSquare);
			const piece = position[Math.floor(i / 8)][i % 8];
			if (piece) {
				const pieceImg = document.createElement('img');
				pieceImg.src = piecesvg[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
				square.appendChild(pieceImg);
			}
			square.dataset.index = i;
			square.addEventListener('click', () => onSquareClick(i));
			board.appendChild(square);
		}
		// Highlight selected square if the square has a piece
		if (selectedSquare !== null) {
			const selectedIndex = (8 - parseInt(selectedSquare[1])) * 8 + (selectedSquare.charCodeAt(0) - 97);
			const selectedSquareElement = board.children[selectedIndex];
			if (selectedSquareElement.children.length > 0) { // If the selected square has a piece
				selectedSquareElement.style.backgroundColor = darkSelect;
				
				// Highlight possible moves
				const moves = chess.moves({ square: selectedSquare, verbose: true });
				for (const move of moves) {
					const index = (8 - parseInt(move.to[1])) * 8 + (move.to.charCodeAt(0) - 97);
					const squareElement = board.children[index];
					const squareColor = squareElement.style.backgroundColor;
					color = mixColors(darkSelect, squareColor, 1, 1);
					squareElement.style.backgroundColor = color;
				}
			}
		}
	}

	function onSquareClick(index) {
		const row = Math.floor(index / 8);
		const col = index % 8;
		const square = String.fromCharCode(97 + col) + (8 - row);

		if (selectedSquare) {
			const move = chess.move({ from: selectedSquare, to: square, promotion: 'q' }); // Default promotion to queen
			if (move) {
				if (move.flags.includes('p')) {
					// If the move is a promotion, prompt the user for the piece type
					const promotion = prompt("Promote to (q, r, b, n):", "q");
					if (promotion && ['q', 'r', 'b', 'n'].includes(promotion.toLowerCase())) {
						chess.move({ from: selectedSquare, to: square, promotion: promotion.toLowerCase() });
					}
				}
				selectedSquare = null;
				renderBoard();
				checkGameEnd();
				if (!chess.game_over()) {
					makeStockfishMove();
				}
			} else {
				selectedSquare = square;
				renderBoard();
			}
		} else {
			selectedSquare = square;
			renderBoard();
		}
	}

	function makeStockfishMove() {
        stockfish.postMessage('position fen ' + chess.fen());
        stockfish.postMessage('go depth ' + difficulty);

        stockfish.onmessage = function(event) {
            const line = event.data;
			console.log('Stockfish:', line);
            if (line.startsWith('bestmove')) {
                const move = line.split(' ')[1];
                chess.move({ from: move.substring(0, 2), to: move.substring(2, 4), promotion: 'q' });
                renderBoard();
                checkGameEnd();
            }
        };
    }

	function checkGameEnd() {
		let gameResult = null;
	
		if (chess.in_checkmate()) {
			alert('Checkmate! Game over.');
			gameResult = 'checkmate';
		} else if (chess.in_stalemate()) {
			alert('Stalemate! Game over.');
			gameResult = 'stalemate';
		} else if (chess.in_threefold_repetition()) {
			alert('Threefold repetition! Game draw.');
			gameResult = 'threefold repetition';
		} else if (chess.insufficient_material()) {
			alert('Insufficient material! Game draw.');
			gameResult = 'insufficient material';
		}
	
		if (gameResult) {
			saveGameToDatabase(gameResult);
		}
	}
	
	function saveGameToDatabase(result) {
		const user = auth.currentUser;
		if (!user) {
			console.error('No user is signed in.');
			return;
		}
	
		const gameData = {
			moves: chess.history(),
			result: result,
			fen: chess.fen(),
			pgn: chess.pgn(),
			timestamp: new Date().toISOString()
		};
	
		const userGamesRef = database.ref('users/' + user.uid + '/games').push();
		userGamesRef.set(gameData)
			.then(() => {
				console.log('Game saved successfully');
				setTimeout(() => {
					window.location.href = 'home.html';
				}, 2000);
			})
			.catch((error) => {
				console.error('Error saving game:', error);
			});
	}
	
	renderBoard();

	renderBoard();
});