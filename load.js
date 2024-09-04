// Firebase configuration
const firebaseConfig = {
	// Replace with your actual Firebase config
	apiKey: "AIzaSyCGv7DEPIG7ieCyv8gVl3RSAf7E1dA4Kmg",
	authDomain: "masterchess-8dfcd.firebaseapp.com",
	databaseURL: "https://masterchess-8dfcd-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "masterchess-8dfcd",
	storageBucket: "masterchess-8dfcd.appspot.com",
	messagingSenderId: "601239027759",
	appId: "1:601239027759:web:11975db1520f4b64e486da"
};

// Initialize Firebase
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

function isValidPGN(pgn) {
	const chess = new Chess();
	return chess.load_pgn(pgn);
}

document.addEventListener('DOMContentLoaded', () => {

	// Dropdown for selecting games

	const gamesDropdown = document.getElementById('gamesDropdown');

	auth.onAuthStateChanged(user => {
		if (user) {
			const userGamesRef = database.ref('users/' + user.uid + '/games');
			userGamesRef.once('value', snapshot => {
				gamesDropdown.innerHTML = ''; // Clear the dropdown
				if (snapshot.exists()) {
					snapshot.forEach(gameSnapshot => {
						const gameData = gameSnapshot.val();
						const option = document.createElement('option');
						option.value = gameSnapshot.key;
						option.textContent = `${gameData.type} game on ${new Date(gameData.timestamp).toLocaleString()}`;
						gamesDropdown.appendChild(option);
					});
				} else {
					const option = document.createElement('option');
					option.value = '';
					option.textContent = 'No games found';
					gamesDropdown.appendChild(option);
				}
			});
		} else {
			gamesDropdown.innerHTML = '<option value="">No user signed in</option>';
		}
	});

	// PGN input

	function saveGameToDatabase(chess) {
		const user = auth.currentUser;
		if (!user) {
			console.error('No user is signed in.');
			return;
		}
	
		const gameData = {
			moves: chess.history(),
			type: 'Imported',
			result: chess.in_checkmate() ? (chess.turn() === 'w' ? '0-1' : '1-0') : '1/2-1/2',
			fen: chess.fen(),
			pgn: chess.pgn(),
			timestamp: new Date().toISOString()
		};
	
		const userGamesRef = database.ref('users/' + user.uid + '/games').push();
		userGamesRef.set(gameData)
			.then(() => {
				console.log('Game saved successfully');
				alert('Game imported successfully!');
				window.location.href = 'load.html';
			})
			.catch((error) => {
				console.error('Error saving game:', error);
				alert('Error saving game. Please try again.');
			});
	}

	document.getElementById('importButton').addEventListener('click', function() {
		const pgnInput = document.getElementById('pgnInput').value;
		if (!isValidPGN(pgnInput)) {
			alert('Invalid PGN format. Please check your input.');
		} else {
			// Proceed with loading the PGN
			console.log('Valid PGN:', pgnInput);

			// Add this to the database
			game = new Chess();
			game.load_pgn(pgnInput);
			saveGameToDatabase(game);
		}
	});

	// Chessboard showing

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