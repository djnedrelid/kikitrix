/*
 *	(C)2007 Dag J Nedrelid
 *
 *	A Tetris Clone, made for real-time fun.
 */

var KTX_Speed = 600;
var KTX_boardRowSize = 14;
var KTX_boardColSize = 10;
var KTX_nextBrick = KTX_makeNewBrick();
var KTX_activeBrick;
var KTX_needNewBrick = true;
var KTX_gameRunning = true;
var KTX_PointSpdCounter = 0;
var KTX_Points = 0;
var KTX_Level = 1;
var KTX_Paused = false;

// The board. [x,y,fill_state (1 = active brick, 2 = landed brick)].
var KTX_Board = [[[0,0,0],[35,0,0],[70,0,0],[105,0,0],[140,0,0],[175,0,0],[210,0,0],[245,0,0],[280,0,0],[315,0,0]],
	[[0,35,0],[35,35,0],[70,35,0],[105,35,0],[140,35,0],[175,35,0],[210,35,0],[245,35,0],[280,35,0],[315,35,0]],
	[[0,70,0],[35,70,0],[70,70,0],[105,70,0],[140,70,0],[175,70,0],[210,70,0],[245,70,0],[280,70,0],[315,70,0]],
	[[0,105,0],[35,105,0],[70,105,0],[105,105,0],[140,105,0],[175,105,0],[210,105,0],[245,105,0],[280,105,0],[315,105,0]],
	[[0,140,0],[35,140,0],[70,140,0],[105,140,0],[140,140,0],[175,140,0],[210,140,0],[245,140,0],[280,140,0],[315,140,0]],
	[[0,175,0],[35,175,0],[70,175,0],[105,175,0],[140,175,0],[175,175,0],[210,175,0],[245,175,0],[280,175,0],[315,175,0]],
	[[0,210,0],[35,210,0],[70,210,0],[105,210,0],[140,210,0],[175,210,0],[210,210,0],[245,210,0],[280,210,0],[315,210,0]],
	[[0,245,0],[35,245,0],[70,245,0],[105,245,0],[140,245,0],[175,245,0],[210,245,0],[245,245,0],[280,245,0],[315,245,0]],
	[[0,280,0],[35,280,0],[70,280,0],[105,280,0],[140,280,0],[175,280,0],[210,280,0],[245,280,0],[280,280,0],[315,280,0]],
	[[0,315,0],[35,315,0],[70,315,0],[105,315,0],[140,315,0],[175,315,0],[210,315,0],[245,315,0],[280,315,0],[315,315,0]],
	[[0,350,0],[35,350,0],[70,350,0],[105,350,0],[140,350,0],[175,350,0],[210,350,0],[245,350,0],[280,350,0],[315,350,0]],
	[[0,385,0],[35,385,0],[70,385,0],[105,385,0],[140,385,0],[175,385,0],[210,385,0],[245,385,0],[280,385,0],[315,385,0]],
	[[0,420,0],[35,420,0],[70,420,0],[105,420,0],[140,420,0],[175,420,0],[210,420,0],[245,420,0],[280,420,0],[315,420,0]],
	[[0,455,0],[35,455,0],[70,455,0],[105,455,0],[140,455,0],[175,455,0],[210,455,0],[245,455,0],[280,455,0],[315,455,0]]];

var KTX_NextBrickBoard = [[[0,0,0],[15,0,0],[30,0,0],[45,0,0]],
		[[0,15,0],[15,15,0],[30,15,0],[45,15,0]]];	

function KTX_KTrix() {
	if (KTX_gameRunning == true && KTX_Paused == false) {
		document.getElementById('KTX_trixcmd').focus();

		// Create a new brick if needed.
		if (KTX_needNewBrick) {
			KTX_activeBrick = KTX_nextBrick;
			KTX_nextBrick = KTX_makeNewBrick();
			KTX_needNewBrick = false;
			
			// Update point panel.
			KTX_updatePointpanel();
		}
	
		// Update board.
		KTX_updateBoard();
	
		// Set up brick for next round's fall.
		KTX_brickMustFall();
		
		// Check for game over.
		KTX_isGameOver();
		
		// Check if we have completed the game.
		KTX_winCheck();

		// Loop.
		setTimeout('KTX_KTrix()',KTX_Speed);
		
	} else if (KTX_Paused == true && KTX_gameRunning == true) {
		// Do nothing, except wait for un-pause.
		setTimeout('KTX_KTrix()',KTX_Speed);
	}
}

function KTX_doMove(e) {
	if (!KTX_gameRunning)
		return;
	
	var keynum, loop_a, loop_b;
	keynum = e.keyCode || e.which; 
	
	// 37 = left, 39 = right, 38 = up, 40 = down, 80 = P for pause.
	if ((KTX_Paused == false && keynum == 37 && 
		KTX_activeBrick[0][1] > 0 && KTX_activeBrick[1][1] > 0 && 
		KTX_activeBrick[2][1] > 0 && KTX_activeBrick[3][1] > 0) && (
		KTX_Board[KTX_activeBrick[0][0]][KTX_activeBrick[0][1]-1][2] != 2 && 
		KTX_Board[KTX_activeBrick[1][0]][KTX_activeBrick[1][1]-1][2] != 2 && 
		KTX_Board[KTX_activeBrick[2][0]][KTX_activeBrick[2][1]-1][2] != 2 && 
		KTX_Board[KTX_activeBrick[3][0]][KTX_activeBrick[3][1]-1][2] != 2)) {
			 	 	
		// No collision, move brick left.
		for (loop_a = 0; loop_a <= 15; loop_a++) {
			KTX_activeBrick[loop_a][1] -= 1;
		} 
		KTX_updateBoard();
		
	} else if ((KTX_Paused == false && keynum == 39 && 
		KTX_activeBrick[0][1] < KTX_boardColSize-1 && 
		KTX_activeBrick[1][1] < KTX_boardColSize-1 && 
		KTX_activeBrick[2][1] < KTX_boardColSize-1 && 
		KTX_activeBrick[3][1] < KTX_boardColSize-1) && (
		KTX_Board[KTX_activeBrick[0][0]][KTX_activeBrick[0][1]+1][2] != 2 && 
		KTX_Board[KTX_activeBrick[1][0]][KTX_activeBrick[1][1]+1][2] != 2 && 
		KTX_Board[KTX_activeBrick[2][0]][KTX_activeBrick[2][1]+1][2] != 2 && 
		KTX_Board[KTX_activeBrick[3][0]][KTX_activeBrick[3][1]+1][2] != 2)) {
					
		// No collision, move brick right.
		for (loop_a = 0; loop_a <= 15; loop_a++) {
			KTX_activeBrick[loop_a][1] += 1;
		}
		KTX_updateBoard();
					
	} else if ((KTX_Paused == false && keynum == 40 && 
		KTX_activeBrick[0][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[1][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[2][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[3][0] < KTX_boardRowSize-1) && (
		KTX_Board[KTX_activeBrick[0][0]+1][KTX_activeBrick[0][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[1][0]+1][KTX_activeBrick[1][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[2][0]+1][KTX_activeBrick[2][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[3][0]+1][KTX_activeBrick[3][1]][2] != 2)) {
					
		// No collision, move brick down.
		for (loop_a = 0; loop_a <= 15; loop_a++) {
			KTX_activeBrick[loop_a][0] += 1;
		}
		KTX_updateBoard();
					
	} else if ((KTX_Paused == false && keynum == 38 && 
		KTX_activeBrick[4][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[5][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[6][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[7][0] < KTX_boardRowSize-1) && (
		KTX_activeBrick[4][1] >= 0 && KTX_activeBrick[5][1] >= 0 && 
		KTX_activeBrick[6][1] >= 0 && KTX_activeBrick[7][1] >= 0) && (
		KTX_activeBrick[4][1] < KTX_boardColSize && 
		KTX_activeBrick[5][1] < KTX_boardColSize && 
		KTX_activeBrick[6][1] < KTX_boardColSize && 
		KTX_activeBrick[7][1] < KTX_boardColSize) && (
		KTX_Board[KTX_activeBrick[4][0]][KTX_activeBrick[4][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[5][0]][KTX_activeBrick[5][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[6][0]][KTX_activeBrick[6][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[7][0]][KTX_activeBrick[7][1]][2] != 2)) {
		
		// After checking if the next shape in line won't 
		// crash in any walls, roof, ground or other landed 
		// bricks, we can transform the brick.
					
		// Make copy of active brick.
		var tmpBrick = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
				[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
		
		for (loop_a = 0; loop_a <= 15; loop_a++) {
			for (loop_b = 0; loop_b <= 1; loop_b++) {
				tmpBrick[loop_a][loop_b] = KTX_activeBrick[loop_a][loop_b];
			}
		}
					
		// Move first brick shape out of play down  
		// to fourth position in transform line.
		KTX_activeBrick[12][0] = tmpBrick[0][0];
		KTX_activeBrick[13][0] = tmpBrick[1][0];
		KTX_activeBrick[14][0] = tmpBrick[2][0];
		KTX_activeBrick[15][0] = tmpBrick[3][0];
		KTX_activeBrick[12][1] = tmpBrick[0][1];
		KTX_activeBrick[13][1] = tmpBrick[1][1];
		KTX_activeBrick[14][1] = tmpBrick[2][1];
		KTX_activeBrick[15][1] = tmpBrick[3][1];
					
		// Move second shape in line into play.
		KTX_activeBrick[0][0] = tmpBrick[4][0];
		KTX_activeBrick[1][0] = tmpBrick[5][0];
		KTX_activeBrick[2][0] = tmpBrick[6][0];
		KTX_activeBrick[3][0] = tmpBrick[7][0];
		KTX_activeBrick[0][1] = tmpBrick[4][1];
		KTX_activeBrick[1][1] = tmpBrick[5][1];
		KTX_activeBrick[2][1] = tmpBrick[6][1];
		KTX_activeBrick[3][1] = tmpBrick[7][1];
					
		// Move that which was third, 
		// into second place for next transform.
		KTX_activeBrick[4][0] = tmpBrick[8][0];
		KTX_activeBrick[5][0] = tmpBrick[9][0];
		KTX_activeBrick[6][0] = tmpBrick[10][0];
		KTX_activeBrick[7][0] = tmpBrick[11][0];
					
		KTX_activeBrick[4][1] = tmpBrick[8][1];
		KTX_activeBrick[5][1] = tmpBrick[9][1];
		KTX_activeBrick[6][1] = tmpBrick[10][1];
		KTX_activeBrick[7][1] = tmpBrick[11][1];
					
		// Move that which was fourth, 
		// into third place for next transform.
		KTX_activeBrick[8][0] = tmpBrick[12][0];
		KTX_activeBrick[9][0] = tmpBrick[13][0];
		KTX_activeBrick[10][0] = tmpBrick[14][0];
		KTX_activeBrick[11][0] = tmpBrick[15][0];
					
		KTX_activeBrick[8][1] = tmpBrick[12][1];
		KTX_activeBrick[9][1] = tmpBrick[13][1];
		KTX_activeBrick[10][1] = tmpBrick[14][1];
		KTX_activeBrick[11][1] = tmpBrick[15][1];
		
		KTX_updateBoard();
					
	} else if (keynum == 80) {
		
		if (KTX_Paused) {
			KTX_Paused = false;
			KTX_updatePointpanel();
		} else {
			KTX_Paused = true;
			document.getElementById('KTX_Pointpanel').innerHTML = ''
			+ '<br><br><br><br>'
			+ 'PAUSE!<br><br>'
			+ 'Trykk P for å fortsette.';
		}
	}
	
	return false;
}

function KTX_makeNewBrick() {
	/*
		Every brick will contain 4 shapes for rotation/transformation
		(Sub-array 0-3 = shape1, 4-7 = shape2, 8-11 = shape3, 12-15 = shape4).
		3rd and 4th shape is repeated with the first two for proper rotation 
		if a 3rd and 4th brick shape should not exist naturally for the brick.
	*/
	
	// ####
	var Brick1 = [[0,3],[0,4],[0,5],[0,6],
			[0,5],[1,5],[2,5],[3,5],
			[0,3],[0,4],[0,5],[0,6],
			[0,5],[1,5],[2,5],[3,5]];
	
	// ##
	// ##
	var Brick2 = [[0,4],[0,5],[1,4],[1,5],
			[0,4],[0,5],[1,4],[1,5],
			[0,4],[0,5],[1,4],[1,5],
			[0,4],[0,5],[1,4],[1,5]];
	
	// ##
	//  ##
	var Brick3 = [[0,4],[0,5],[1,5],[1,6],
			[0,6],[1,6],[1,5],[2,5],
			[0,4],[0,5],[1,5],[1,6],
			[0,6],[1,6],[1,5],[2,5]];
	
	//  ##
	// ##
	var Brick4 = [[0,5],[0,6],[1,4],[1,5],
			[0,4],[1,4],[1,5],[2,5],
			[0,5],[0,6],[1,4],[1,5],
			[0,4],[1,4],[1,5],[2,5]];
	
	// #
	// ###
	var Brick5 = [[0,4],[1,4],[1,5],[1,6],
			[0,4],[0,5],[1,4],[2,4],
			[0,4],[0,5],[0,6],[1,6],
			[0,6],[1,6],[2,6],[2,5]];
	
	//   #
	// ###
	var Brick6 = [[0,6],[1,4],[1,5],[1,6],
			[0,4],[1,4],[2,4],[2,5],
			[0,4],[0,5],[0,6],[1,4],
			[0,5],[0,6],[1,6],[2,6]];
	
	//  #
	// ###
	var Brick7 = [[0,5],[1,4],[1,5],[1,6],
			[0,5],[1,5],[1,6],[2,5],
			[0,4],[0,5],[0,6],[1,5],
			[0,5],[1,4],[1,5],[2,5]];
	
	// Collect bricks.
	var Bricklist = [Brick1,Brick2,Brick3,Brick4,Brick5,Brick6,Brick7];
	
	// Choose a random brick.
	return Bricklist[Math.round(Math.random()*6)];
}

function KTX_getNextShape() {
	var loop_a, loop_b, loop_c;
	
	// Make copy of next brick.
	var tmpBrick = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
			[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
	
	for (loop_a = 0; loop_a <= 15; loop_a++) {
		for (loop_b = 0; loop_b <= 1; loop_b++) {
			tmpBrick[loop_a][loop_b] = KTX_nextBrick[loop_a][loop_b];
		}
	}
	
	// Adapt shape for brick view (move left for smaller board).
	for (loop_a = 0; loop_a <= 3; loop_a++) {
		tmpBrick[loop_a][1] -= 3;
	}
	
	// Reset and update NextBrickBoard.
	for (loop_a = 0; loop_a <= 1; loop_a++) {
		for (loop_b = 0; loop_b <= 3; loop_b++) {
			KTX_NextBrickBoard[loop_a][loop_b][2] = 0;
		}
	}
	
	// Put next brick (first shape) on NextBrickBoard.
	for (loop_a = 0; loop_a <= 1; loop_a++) {
		for (loop_b = 0; loop_b <= 3; loop_b++) {
			for (loop_c = 0; loop_c <= 3; loop_c++) {
				if (tmpBrick[loop_c][0] == loop_a && 
					tmpBrick[loop_c][1] == loop_b) {
					
					KTX_NextBrickBoard[loop_a][loop_b][2] = 1;	
				}
			}
		}
	}
	
	// Update NextBrickView.
	var whatBrick = 1;
	for (loop_a = 0; loop_a <= 1; loop_a++) {
		for (loop_b = 0; loop_b <= 3; loop_b++) {
			if (KTX_NextBrickBoard[loop_a][loop_b][2] == 1) {
				document.getElementById('KTX_MiniBrick'+whatBrick).style.left = KTX_NextBrickBoard[loop_a][loop_b][0] +'px';
				document.getElementById('KTX_MiniBrick'+whatBrick).style.top = KTX_NextBrickBoard[loop_a][loop_b][1] +'px';
				document.getElementById('KTX_MiniBrick'+whatBrick).style.visibility = 'visible';
				whatBrick += 1;
			}
		}
	}
}

function KTX_brickMustFall() {
	var loop_a;
		
	if ((KTX_activeBrick[0][0] < KTX_boardRowSize-1 &&
		KTX_activeBrick[1][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[2][0] < KTX_boardRowSize-1 && 
		KTX_activeBrick[3][0] < KTX_boardRowSize-1) && (
		KTX_Board[KTX_activeBrick[0][0]+1][KTX_activeBrick[0][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[1][0]+1][KTX_activeBrick[1][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[2][0]+1][KTX_activeBrick[2][1]][2] != 2 && 
		KTX_Board[KTX_activeBrick[3][0]+1][KTX_activeBrick[3][1]][2] != 2)) {
			
		// If the brick isn't gonna hit another landed brick or 
		// the bottom, we can continue with another fall.
		
		for (loop_a = 0; loop_a <= 15; loop_a++) {
			KTX_activeBrick[loop_a][0] += 1;
		}
		
	} else { 
		// If the brick is going to hit other bricks or the 
		// bottom of the board, we register it as landed in 
		// the board array and draw it.
		
		for (loop_a = 0; loop_a <= 3; loop_a++) {
			KTX_Board[KTX_activeBrick[loop_a][0]][KTX_activeBrick[loop_a][1]][2] = 2;
		}
		
		for (loop_a = 0; loop_a <= 3; loop_a++) {
			document.getElementById('KTX_container').innerHTML += ''
			+ '<div style="width:35px; height:35px; position:absolute; left:'
			+ KTX_Board[KTX_activeBrick[loop_a][0]][KTX_activeBrick[loop_a][1]][0] +'px; top:'
			+ KTX_Board[KTX_activeBrick[loop_a][0]][KTX_activeBrick[loop_a][1]][1] 
			+ 'px; background-image:url(\'firkant.gif\')">&nbsp;</div>';
		}
		
		// Turn on the switch for a new brick spawn.
		KTX_needNewBrick = true; 
	}
}

function KTX_updateBoard() {
	var loop_a, loop_b, loop_c;
	
	// Remove all 1 values (bricks in action) 
	// and update with new brick values.
	
	for (loop_a = 0; loop_a < KTX_boardRowSize; loop_a++) {
		for (loop_b = 0; loop_b < KTX_boardColSize; loop_b++) {
			
			// Remove existing value.
			if (KTX_Board[loop_a][loop_b][2] == 1)
				KTX_Board[loop_a][loop_b][2] = 0;
			
			// Track brick and update its new position on board.
			for (loop_c = 0; loop_c <= 3; loop_c++) {
				if (loop_a == KTX_activeBrick[loop_c][0] && 
					loop_b == KTX_activeBrick[loop_c][1]) { 
					
					KTX_Board[loop_a][loop_b][2] = 1; 
				}
			}
		}
	}
	
	// Draw board with new active brick values.
	var whatBrick = 1;
	for (loop_a = 0; loop_a < KTX_boardRowSize; loop_a++) {
		for (loop_b = 0; loop_b < KTX_boardColSize; loop_b++) {
			if (KTX_Board[loop_a][loop_b][2] == 1) {
				document.getElementById('KTX_Brick'+whatBrick).style.left = KTX_Board[loop_a][loop_b][0] +'px';
				document.getElementById('KTX_Brick'+whatBrick).style.top = KTX_Board[loop_a][loop_b][1] +'px';
				document.getElementById('KTX_Brick'+whatBrick).style.visibility = 'visible';
				whatBrick += 1;
			}
		}
	}
	
	// Check for completed rows with landed brick's. 
	// Delete them if found and give player points.
	var colCounter;
	for (loop_a = 0; loop_a < KTX_boardRowSize; loop_a++) {
		
		colCounter = 0;
		for (loop_b = 0; loop_b < KTX_boardColSize; loop_b++) {
			if (KTX_Board[loop_a][loop_b][2] == 2)
				colCounter += 1;
		}
		
		if (colCounter == KTX_boardColSize) {
			
			// Delete row if it was full of bricks
			for (loop_b = 0; loop_b < KTX_boardColSize; loop_b++) {
				KTX_Board[loop_a][loop_b][2] = 0;
			}
			
			// Move all status-2 brick that was 
			// above the removed row 1 step down.
			KTX_gravitateBoard(loop_a);
			
			// Give points for 1 row removed.
			// Every row is worth 100 points.
			KTX_Points += 100;
			KTX_PointSpdCounter += 1;
			
			// For every 1000 points the 
			// speed goes up 50 nanoseconds.
			if (KTX_PointSpdCounter == 10) {
				KTX_Speed -= (KTX_Speed != 0 ? 50 : 0);
				KTX_PointSpdCounter = 0;
				KTX_Level += 1;
			}
			
			// Update point panel.
			KTX_updatePointpanel();
		}
	}
}

function KTX_gravitateBoard(rowRemoved) {
	var loop_a, loop_b;
	
	// Move status-2 (landed) bricks above 
	// removed row 1 step down and and redraw.
	
	for (loop_a = rowRemoved-1; loop_a > 0; loop_a--) {
		for (loop_b = 0; loop_b < KTX_boardColSize; loop_b++) {
			if (KTX_Board[loop_a][loop_b][2] == 2) {
				KTX_Board[loop_a][loop_b][2] = 0;
				KTX_Board[loop_a+1][loop_b][2] = 2;
			}
		}
	}
	
	document.getElementById('KTX_container').innerHTML = '';
	for (loop_a = 0; loop_a < KTX_boardRowSize; loop_a++) {
		for (loop_b = 0; loop_b < KTX_boardColSize; loop_b++) {
			if (KTX_Board[loop_a][loop_b][2] == 2) {
				document.getElementById('KTX_container').innerHTML += ''
				+ '<div style="width:35px; height:35px; position:absolute; left:'
				+ KTX_Board[loop_a][loop_b][0] +'px; top:'
				+ KTX_Board[loop_a][loop_b][1] 
				+ 'px; background-image:url(\'firkant.gif\')">&nbsp;</div>';
			}
		}
	}
}

function KTX_updatePointpanel() {
	document.getElementById('KTX_Pointpanel').innerHTML = ''
	+ '<div align="center" id="KTX_PointpanelLive">'
	+ '<span class="header">Poengpanel</span>'
	+ '</div><br>'
	+ 'Poeng: ' + KTX_Points + '<br><br>'
	+ 'Nivå: ' + KTX_Level + '<br>'
	+ (KTX_Level == 1 ? 'Trix Noob<br><br>' : '')
	+ (KTX_Level == 2 ? 'Trix Trainee<br><br>' : '')
	+ (KTX_Level == 3 ? 'Trix Wannabe<br><br>' : '')
	+ (KTX_Level == 4 ? 'Trix Amateur<br><br>' : '')
	+ (KTX_Level == 5 ? 'Trix Average<br><br>' : '')
	+ (KTX_Level == 6 ? 'Trix Trained<br><br>' : '')
	+ (KTX_Level == 7 ? 'Trix Pro<br><br>':'')
	+ (KTX_Level == 8 ? 'Trix Elite<br><br>':'')
	+ (KTX_Level == 9 ? 'Trix Prodigy<br><br>':'')
	+ (KTX_Level == 10 ? 'Trix Master<br><br>':'')
	+ 'Neste brikke: <br>'
	+ '<div id="KTX_NextBrickView">'
	+ '<div id="KTX_MiniBrick1"></div>'
	+ '<div id="KTX_MiniBrick2"></div>'
	+ '<div id="KTX_MiniBrick3"></div>'
	+ '<div id="KTX_MiniBrick4"></div>'
	+ '</div><br>'
	+ 'Brikkeforsinkelse: ' + KTX_Speed + '<br>'
	+ '(Nanosekunder)<br><br>'
	+ '<div align="center">Trenger du pause?<br>'
	+ 'Trykk på P tasten.</div><br>';
	KTX_getNextShape();
}

function KTX_isGameOver() {
	var loop_a;
	
	// Check if there are status-2 bricks on 
	// the top row spawn area on our board
	
	for (loop_a = 3; loop_a < 8; loop_a++) {
		if (KTX_Board[0][loop_a][2] == 2) { 
			
			// Game is over
			document.getElementById('KTX_Pointpanel').innerHTML = ''
				+ '<br><br><br>Points: '
				+ KTX_Points + '<br><br>'
				+ 'GAME OVER' + '<br><br>'
				+ '<a href="javascript:location.reload()">Last inn på nytt</a><br> for å spille igjen.' + '<br>';
			
			// Stop the game
			KTX_gameRunning = false; 
			
			/* if (KTX_Points > 0) 
				KTX_CheckHighscore(); */
			return;	
		}
	}
}

/*
function KTX_CheckHighscore() {
	var xmlHttp;

	if(window.XMLHttpRequest) {
		xmlHttp=new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	} else {
		return false;
	}

	xmlHttp.open("GET", "Highscorelist.php?CheckScore="+KTX_Points, true);
	xmlHttp.onreadystatechange=function() {
		if(xmlHttp.readyState==4) {
			if (xmlHttp.responseText == "NewScore!") {
				var HSname = prompt("Du har den beste skåringen! Hva er navnet ditt?");
				if (HSname != null)
					KTX_RegisterNewHighscore(encodeURIComponent(HSname), KTX_Points);
				else
					alert("Du velger å være anonym, det er OK. Gratulerer likevel! =)");
			}
  		}
	}
	xmlHttp.send(null);
}

function KTX_GetHighScoreList() {
	var xmlHttp;

	if(window.XMLHttpRequest) {
		xmlHttp=new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	} else {
		return false;
	}

	xmlHttp.open("GET", "Highscorelist.php?GetHighscoreList=1", true);
	xmlHttp.onreadystatechange=function() {
		if(xmlHttp.readyState==4) {
			document.getElementById('KTX_HighScores').innerHTML = xmlHttp.responseText;
  		}
	}
	xmlHttp.send(null);
}


function KTX_RegisterNewHighscore(name, score) {
	var xmlHttp;

	if(window.XMLHttpRequest) {
		xmlHttp=new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	} else {
		alert("Your browser does not support AJAX, aborting!");
		return false;
	}

	xmlHttp.open("GET", "Highscorelist.php?CheckScore="+score+"&ScoreName="+name, true);
	xmlHttp.onreadystatechange=function() {
		if(xmlHttp.readyState==4) {
			if (xmlHttp.responseText == "REGISTER_OK") {
				location.reload(true);
			} else {
				alert("Kunne ikke registrere skåring pga en databasefeil, beklager!");
			}
  		}
	}
	xmlHttp.send(null);
}*/

function KTX_winCheck() {
	
	// Check if we have reached level 11.
	
	if (KTX_Level == 11) {
		document.getElementById('KTX_Pointpanel').innerHTML = ''
			+ '<br><br>Poeng: '
			+ KTX_Points + '<br><br>'
			+ 'SPILLET ER FERDIG!<br>'
			+ 'Du beseiret nivå 10!<br>';
			
		KTX_gameRunning = false;
		
		/* if (KTX_Points > 0) 
			KTX_CheckHighscore(); */
	}
}