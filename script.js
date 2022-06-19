import worlds from "./worlds.js";
import ghosts from "./ghosts.js";

//pacman ordinates
let pacman = {
  x: 1,
  y: 1,
};

//pacman initial position in px
let x = 94;
let y = 425;

//helpers
//generate random number
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//checks if all coins/cherrys are all collected
function gameCompleteChecker(world) {
  let count = 0;
  for (let row = 0; row < world.length; row++) {
    for (let col = 0; col < world[row].length; col++) {
      if (world[row][col] == 1) {
        count++;
      }
    }
  }
  if (!count) return 1;
}

//display world
function displayWorld(world) {
  let output = "";
  for (let row = 0; row < world.length; row++) {
    output += "\n<div class='row'>\n";
    for (let col = 0; col < world[row].length; col++) {
      if (world[row][col] == 2) {
        output += "<div class='brick'></div>";
      } else if (world[row][col] == 1) {
        output += "<div class='coin'></div>";
      } else if (world[row][col] == 0) {
        output += "<div class='empty'></div>";
      } else if (world[row][col] == 3) {
        output += "<div class='cherry'></div>";
      }
    }
    output += "</div>";
  }

  document.getElementById("world").innerHTML = output;
}

//start the game
function startGame(world, ghost, score) {
  displayWorld(world);

  createGhost(world, ghost[0], "ghost1");
  createGhost(world, ghost[1], "ghost2");
  createGhost(world, ghost[2], "ghost3");

  document.onkeydown = function (e) {
    if (e.keyCode == 40 && world[pacman.x + 1][pacman.y] != 2) {
      //BOTTOM
      document.getElementById("pacman").style.top = x + 20 + "px";
      document.getElementById("pacman").style.backgroundImage =
        "url(/img/pacman-down.gif)";
      x += 20;
      pacman.x += 1;
    } else if (e.keyCode == 38 && world[pacman.x - 1][pacman.y] != 2) {
      //TOP
      document.getElementById("pacman").style.top = x - 20 + "px";
      document.getElementById("pacman").style.backgroundImage =
        "url(/img/pacman-up.gif)";
      x -= 20;
      pacman.x -= 1;
    } else if (e.keyCode == 39 && world[pacman.x][pacman.y + 1] != 2) {
      //RIGHT
      document.getElementById("pacman").style.left = y + 20 + "px";
      document.getElementById("pacman").style.backgroundImage =
        "url(/img/pacman-right.gif)";
      y += 20;
      pacman.y += 1;
    } else if (e.keyCode == 37 && world[pacman.x][pacman.y - 1] != 2) {
      //LEFT
      document.getElementById("pacman").style.left = y - 20 + "px";
      document.getElementById("pacman").style.backgroundImage =
        "url(/img/pacman-left.gif)";
      y -= 20;
      pacman.y -= 1;
    }

    //if collision happens in coins & cherries
    if (world[pacman.x][pacman.y] == 1) {
      world[pacman.x][pacman.y] = 0;
      score += 10;
      document.getElementById("points").innerHTML = score;

      displayWorld(world);
    } else if (world[pacman.x][pacman.y] == 3) {
      world[pacman.x][pacman.y] = 0;
      score += 20;
      document.getElementById("points").innerHTML = score;

      displayWorld(world);
    }

    if (gameCompleteChecker(world)) {
      localStorage.setItem("score", score);
      location.reload();
    }
  };
}

//create a ghost
//world array, ghost array, ghost id
function createGhost(world, ghostt, ghostId) {
  //implementing ghost

  document.getElementById(ghostId).style.top = ghostt[3] + "px";
  document.getElementById(ghostId).style.left = ghostt[2] + "px";

  let ghost = {
    x: ghostt[0],
    y: ghostt[1],
  };

  let ghostx = ghostt[2];
  let ghosty = ghostt[3];

  let ghostMove = setInterval(function () {
    let move = Math.floor(Math.random() * 3) - 1;

    //choose direction to move x or y
    //if dir = 1, move y, else move x
    let dir = Math.floor(Math.random() * 2);

    if (dir) {
      //direction is y
      if (move == 1 && world[ghost.x + 1][ghost.y] != 2) {
        document.getElementById(ghostId).style.top = ghosty + 20 + "px";
        ghosty += 20;
        ghost.x += 1;
      } else if (move == -1 && world[ghost.x - 1][ghost.y] != 2) {
        document.getElementById(ghostId).style.top = ghosty - 20 + "px";
        ghosty -= 20;
        ghost.x -= 1;
      }
    } else {
      // if directions is x
      if (move == 1 && world[ghost.x][ghost.y + 1] != 2) {
        document.getElementById(ghostId).style.left = ghostx + 20 + "px";
        ghostx += 20;
        ghost.y += 1;
      } else if (move == -1 && world[ghost.x][ghost.y - 1] != 2) {
        document.getElementById(ghostId).style.left = ghostx - 20 + "px";
        ghostx -= 20;
        ghost.y -= 1;
      }
    }

    //if collision happens against pacman and ghost
    if (pacman.x == ghost.x && pacman.y == ghost.y) {
      document.getElementById("gameover").style.display = "block";
      document.getElementById("again").style.display = "block";

      let yes = document
        .getElementById("yes")
        .addEventListener("click", function () {
          localStorage.setItem("score", 0);
          location.reload();
        });

      document.onkeydown = null;
    }
  }, 250);
}

//generate random number for world
let randomWorld = randomInteger(0, 4);
startGame(
  worlds[randomWorld],
  ghosts[randomWorld],
  localStorage.score ? parseInt(localStorage.score) : 0
);
