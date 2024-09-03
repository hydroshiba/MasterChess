const chessboard = document.getElementById('chessboard');

// Create the chessboard squares
for (let i = 0; i < 64; i++) {
 const square = document.createElement('div');
 square.classList.add('square');
 chessboard.appendChild(square);
}

// Initialize pieces on the board (basic example)
const pieces = {
 white: ['♔', '♕', '♖', '♗', '♘', '♙'],
 black: ['♚', '♛', '♜', '♝', '♞', '♟']
};

// Assign pieces to their initial positions
const initialBoardSetup = [
 '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖',
 '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
 '', '', '', '', '', '', '', '',
 '', '', '', '', '', '', '', '',
 '', '', '', '', '', '', '', '',
 '', '', '', '', '', '', '', '',
 '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
 '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'
];

// Place pieces on the board
document.querySelectorAll('.square').forEach((square, index) => {
 square.textContent = initialBoardSetup[index];
});

// Handle piece movement (simplified example)
let selectedPiece = null;

chessboard.addEventListener('click', function(event) {
 const targetSquare = event.target;

 if (selectedPiece) {
     // Move the piece
     targetSquare.textContent = selectedPiece.textContent;
     selectedPiece.textContent = '';
     selectedPiece = null;
 } else if (targetSquare.textContent) {
     // Select the piece
     selectedPiece = targetSquare;
 }
});
