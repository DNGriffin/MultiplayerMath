import { Component, OnInit } from '@angular/core';
import { AUTO, Game } from 'phaser-ce';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';

var url = 'http://47.24.182.243:3000';
var socket;
var game: Phaser.Game;
var database: AngularFirestore = null;
var id;
var quizTitle;
var globalRouter;
@Component({
  selector: 'app-networked',
  templateUrl: './networked.component.html',
  styleUrls: ['./networked.component.scss']
})
export class NetworkedComponent implements OnInit {

  constructor(private db: AngularFirestore, private router: Router
  ) {
    socket = io(url);

    if (!this.router.getCurrentNavigation().extras.queryParams) {
      this.router.navigate(['/dashboard']);
    }
    id = this.router.getCurrentNavigation().extras.queryParams.id;
    quizTitle = this.router.getCurrentNavigation().extras.queryParams.title;
    socket.emit("changeRoom", id);
    console.log(quizTitle);
    globalRouter = router;

    console.log(id);
    database = db;
    loadQuestions();
    game = new Game(window.innerWidth, window.innerHeight, AUTO, 'singleplayer', { preload: preload, create: create, update: update, render: render });
  }

  ngOnInit() {
  }

}
var oneKey: Phaser.Key;
var twoKey: Phaser.Key;
var threeKey: Phaser.Key;
var fourKey: Phaser.Key;

var aKey: Phaser.Key;
var dKey: Phaser.Key;


var oneKeyIcon: Phaser.Sprite;
var twoKeyIcon: Phaser.Sprite;
var threeKeyIcon: Phaser.Sprite;
var fourKeyIcon: Phaser.Sprite;
var oneKeyText: Phaser.Text;
var twoKeyText: Phaser.Text;
var threeKeyText: Phaser.Text;
var fourKeyText: Phaser.Text;

var spaceship: Phaser.Sprite;
var spaceship_networked: Phaser.Sprite;


var questionText: Phaser.Text;
var scoreText: Phaser.Text;
var score = 0;


var starfield;
var asteroid1, asteroid2, asteroid3, asteroid4, asteroid5;

var questions = [["Press any key to start", "", "", "", ""],
["What is 6x/6?", "x", "6", "1", "0"],
["What is 3(x+2x)", "9x", "9x^2", "6x", "9"],
["What is 5x-2?", "5x-2", "5x", "3x", "3"],
["What is (3x-3x)*3x?", "0", "9x", "27x", "9"]
]
var difficulties = [];
var difficulty;
function loadQuestions() {
  console.log("load quesitons");

  // globalData = database.collection('quizes', ref => ref.where('title', '==', quizTitle).limit(1)).snapshotChanges();
  var globalData;
  globalData = database.collection('quizes', ref => ref.where('title', '==', quizTitle)).snapshotChanges();
  globalData.subscribe(
    (res) => {
      var data = res[0].payload.doc.data();
      var tempQuestions = data.questions;
      var formattedQuestion = [];
      questions = [];
      for (var key in tempQuestions) {
        formattedQuestion = [];
        formattedQuestion[0] = tempQuestions[key].question;
        formattedQuestion[1] = tempQuestions[key].answer;
        formattedQuestion[2] = tempQuestions[key].fake1;
        formattedQuestion[3] = tempQuestions[key].fake2;
        formattedQuestion[4] = tempQuestions[key].fake3;
        difficulties.push(tempQuestions[key].difficulty);
        questions.push(formattedQuestion);
      }
    },
    (err) => console.log(err),
    () => nextQuestion()
  );
}

function preload() {
  game.load.spritesheet('missile', 'assets/games/missilesheet.png', 14, 4, 2);

  game.load.image("1key", "assets/games/1key.png");
  game.load.image("2key", "assets/games/2key.png");
  game.load.image("click", "assets/games/click.png");

  game.load.image("3key", "assets/games/3key.png");
  game.load.image("4key", "assets/games/4key.png");
  game.load.image('starfield', 'assets/games/starfield.png');
  game.load.image('spaceship', 'assets/games/spaceship.png');
  game.load.image('asteroid1', 'assets/games/asteroid1.png');
}
var asteroidGroup;

function create() {
  asteroid1 = game.add.sprite(game.world.randomX, -game.world.randomY, "asteroid1");
  asteroid2 = game.add.sprite(game.world.randomX, -game.world.randomY, "asteroid1");
  asteroid3 = game.add.sprite(game.world.randomX, -game.world.randomY, "asteroid1");
  asteroid4 = game.add.sprite(game.world.randomX, -game.world.randomY, "asteroid1");
  asteroid5 = game.add.sprite(game.world.randomX, -game.world.randomY, "asteroid1");

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 100;

  starfield = game.add.tileSprite(0, 0, game.width, game.height, 'starfield');

  oneKeyIcon = game.add.sprite(game.width * 0.2, game.height * 0.2, "1key");
  twoKeyIcon = game.add.sprite(oneKeyIcon.x, oneKeyIcon.y + oneKeyIcon.height * 1.5, "2key");
  threeKeyIcon = game.add.sprite(oneKeyIcon.x, twoKeyIcon.y + twoKeyIcon.height * 1.5, "3key");
  fourKeyIcon = game.add.sprite(oneKeyIcon.x, threeKeyIcon.y + threeKeyIcon.height * 1.5, "4key");

  spaceship = game.add.sprite(game.width * 0.5, game.height * 0.8, "spaceship");
  spaceship.anchor.set(0.5);
  game.physics.enable(spaceship, Phaser.Physics.ARCADE);
  spaceship.scale.set(2, 2);
  spaceship.body.gravity.y = 0;

  spaceship_networked = game.add.sprite(game.width * 0.5, game.height * 0.8, "spaceship");
  spaceship_networked.anchor.set(0.5);
  spaceship_networked.visible = false;
  game.physics.enable(spaceship_networked, Phaser.Physics.ARCADE);
  spaceship_networked.scale.set(2, 2);
  spaceship_networked.body.gravity.y = 0;

  asteroidGroup = game.add.group();
  asteroidGroup.add(asteroid1);
  asteroidGroup.add(asteroid2);
  asteroidGroup.add(asteroid3);
  asteroidGroup.add(asteroid4);
  asteroidGroup.add(asteroid5);
  asteroidGroup.forEach(function (sprite) {
    sprite.anchor.setTo(0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.angularVelocity = Math.random() * 200;
    sprite.body.angularDrag = 3;
    sprite.body.allowGravity = true;
    var asteroidWidth = game.height * .10 + game.height * 0.15 * Math.random();
    sprite.width = asteroidWidth;
    sprite.height = asteroidWidth;
  })
  questionText = game.add.text(game.world.centerX, game.height * 0.15, "Are you ready to start? Press the [1] key");
  questionText.text = "Waiting for teammate to connect.";

  questionText.anchor.set(0.5);
  oneKeyText = game.add.text(game.width * 0.2 + oneKeyIcon.width, game.height * 0.2, "Start");
  twoKeyText = game.add.text(oneKeyIcon.x + oneKeyIcon.width, oneKeyIcon.y + oneKeyIcon.height * 1.5, "Start");
  threeKeyText = game.add.text(oneKeyIcon.x + oneKeyIcon.width, twoKeyIcon.y + twoKeyIcon.height * 1.5, "Start");
  fourKeyText = game.add.text(oneKeyIcon.x + oneKeyIcon.width, threeKeyIcon.y + threeKeyIcon.height * 1.5, "Start");

  questionText.fill = "white";
  oneKeyText.fill = "white";
  twoKeyText.fill = "white";
  threeKeyText.fill = "white";
  fourKeyText.fill = "white";
  scoreText = game.add.text(game.world.centerX, game.height * 0.05, "Score: 0");
  scoreText.anchor.set(0.5);
  scoreText.fill = "white";

  oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
  twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
  threeKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  fourKey = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);

  aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);


  game.world.sendToBack(asteroidGroup);
  game.world.sendToBack(spaceship);
  game.world.sendToBack(spaceship_networked);

  game.world.sendToBack(starfield);
  moveTeammate();
}
function createMissile() {
  var missile = game.add.sprite(spaceship.x, spaceship.y, "missile");

  missile.animations.add('fly2');
  missile.animations.play('fly2', 15, true);
  missile.anchor.setTo(0.5);
  missile.rotation = -Math.PI / 2;
  missile.width = game.width * .02;
  missile.height = missile.width * (2 / 7);
  game.physics.enable(missile, Phaser.Physics.ARCADE);

  missile.update = function () {
    var nearestAsteroid: Phaser.Sprite;
    var nearestDistance = 9999999999;
    asteroidGroup.forEach(function (sprite) {
      var distanceBetween = distanceSQ(sprite, missile);
      if (distanceBetween < nearestDistance) {
        nearestAsteroid = sprite;
        nearestDistance = distanceBetween;
      };
    })
    missile.rotation = game.physics.arcade.angleBetween(missile, nearestAsteroid);
    missile.body.velocity.x = Math.cos(missile.rotation) * game.height * 0.4;
    missile.body.velocity.y = Math.sin(missile.rotation) * game.height * 0.4;
    game.physics.arcade.collide(missile, asteroidGroup, asteroidCollide);
  }
  return missile;
}
var canAnswer = true;
var isGameOver = false;
function spaceshipCollide(asteroid, space) {
  scoreText.text = `Score: ${--score}`;
  socket.emit("changeScore", -1);


  setTimeout(() => {
    space.visible = true;
    setTimeout(() => {
      space.visible = false;
      setTimeout(() => {
        space.visible = true;
        setTimeout(() => {
          space.visible = false;
          setTimeout(() => {
            space.visible = true;
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  }, 100);
  space.visible = false;
  asteroid.y = game.height * 2;
}

function render() {
  // game.debug.body(spaceship);
  // asteroidGroup.forEach(function (sprite) {
  //   game.debug.body(sprite);

  // })

}
function asteroidUpdate() {

  if (!isGameOver) {
    var numAsteroids = 0;
    if (difficulty == "easy") {
      numAsteroids = 5;
    }
    if (difficulty == "medium") {
      numAsteroids = 3;
    }
    if (difficulty == "hard") {
      numAsteroids = 1;
    }
    var numAboveBottomScreen = 0;

    asteroidGroup.forEach(function (sprite) {

      if (sprite.y < game.height) {
        numAboveBottomScreen++;
      }
    })
    asteroidGroup.forEach(function (sprite) {
      var rand = Math.floor(Math.random() * 200);
      if (sprite.y > sprite.height + game.height + rand && numAboveBottomScreen < numAsteroids) {
        numAboveBottomScreen++;
        sprite.y = -sprite.height;
        sprite.body.angularVelocity = Math.random() * 200 - Math.random() * 200;
        sprite.x = game.world.randomX;
        var asteroidWidth = game.height * .10 + game.height * 0.15 * Math.random();
        sprite.width = asteroidWidth;
        sprite.height = asteroidWidth;
      }
      if (sprite.body.velocity.y > 200) {
        sprite.body.velocity.y = 200;
      }
      if (!teammateHasConnected) {
        sprite.body.velocity.y = 0;
      }
    })
  }
}
function distanceSQ(object, target) {
  var xDif = object.x - target.x;
  var yDif = object.y - target.y;
  return (xDif * xDif) + (yDif * yDif);

};
function asteroidCollide(missile, asteroid) {
  missile.kill();
  asteroid.y = game.height * 2;
}
function answerQuestion(index) {
  if (canAnswer) {
    var selectAns;
    if (index == 1) {
      selectAns = oneKeyText.text;
    } if (index == 2) {
      selectAns = twoKeyText.text;
    } if (index == 3) {
      selectAns = threeKeyText.text;
    } if (index == 4) {
      selectAns = fourKeyText.text;
    }
    if (selectAns == ans || questionIndex == -1) { //if ans correct
      socket.emit("answerQuestion", true);
      createMissile();
      scoreText.text = `Score: ${++score}`;
    } else {
      scoreText.text = `Score: ${--score}`;
      socket.emit("answerQuestion", false);

    }
    nextQuestion();
    canAnswer = false;
    setTimeout(() => {
      canAnswer = true;
    }, 2000);
  }
}

var questionIndex = -1;
var ans = "";
var isLeftTurn = true;
function nextQuestion() {
  questionIndex++;
  if (questionIndex >= questions.length) {
    gameOver();
    return;
  }
  // questionIndex = questionIndex % questions.length;
  questionText.text = questions[questionIndex][0];
  ans = questions[questionIndex][1];
  var tempAnswers = [];
  for (var i = 1; i < questions[questionIndex].length; i++) {
    tempAnswers.push(questions[questionIndex][i]);
  }
  tempAnswers = tempAnswers.sort(() => Math.random() - 0.5);
  oneKeyText.text = tempAnswers[0];
  twoKeyText.text = tempAnswers[1];
  threeKeyText.text = tempAnswers[2];
  fourKeyText.text = tempAnswers[3];
  difficulty = difficulties[questionIndex];

}


function update() {
  getNetworkData();
  sendPosition(spaceship.x);
  asteroidGroup.forEach(function (sprite) {
    game.physics.arcade.collide(sprite, spaceship, spaceshipCollide);
  })

  if (!isGameOver) {
    spaceship.y = game.height * 0.5;
    spaceship_networked.y = game.height * 0.5;


    asteroidUpdate();
    starfield.tilePosition.y += 1;
    if (oneKey.isDown) {
      oneKeyIcon.alpha = 1;
      keyHandler(1);
    } else {
      oneKeyIcon.alpha = 0.7;
    }
    if (twoKey.isDown) {
      twoKeyIcon.alpha = 1;
      keyHandler(2);
    } else {
      twoKeyIcon.alpha = 0.7;
    }
    if (threeKey.isDown) {
      keyHandler(3);
      threeKeyIcon.alpha = 1;
    } else {
      threeKeyIcon.alpha = 0.7;
    }
    if (fourKey.isDown) {
      keyHandler(4);
      fourKeyIcon.alpha = 1;
    } else {
      fourKeyIcon.alpha = 0.7;
    }
    if (aKey.isDown) {
      spaceship.body.velocity.x = -game.width * 0.3;
    }
    if (dKey.isDown) {
      spaceship.body.velocity.x = +game.width * 0.3;
    }
    if (!aKey.isDown && !dKey.isDown) {
      spaceship.body.velocity.x = 0;
    }
  }
}


function keyHandler(num) {
  if (teammateHasConnected) {
    answerQuestion(num);
  }

}
function moveTeammate() {
  var tween = game.add.tween(spaceship_networked).to({ x: game.world.randomX }, 4000, "Quart.easeOut");
  // tweenB = game.add.tween(spriteB).to( { x: 600 }, 2000, "Quart.easeOut");
  // tween.start();
  var mis = createMissile();
  mis.x = spaceship_networked.x;
  // tween.onComplete.addOnce(()=>{moveTeammate()});
}



function gameOver() {
  isGameOver = true;
  questionText.text = `You completed the game!\nYou scored ${score}!\nThanks for playing!`;
  questionText.fontSize = fontSizer(questionText, game) * 0.7;
  questionText.y = game.world.centerY;

  oneKeyIcon.destroy();
  twoKeyIcon.destroy();
  threeKeyIcon.destroy();
  fourKeyIcon.destroy();
  oneKeyText.destroy();
  twoKeyText.destroy();
  threeKeyText.destroy();
  fourKeyText.destroy();
  setTimeout(() => {
    globalRouter.navigate(['/dashboard']);
    isGameOver = false;
    game.destroy();
    questionIndex = -1;
  }, 3000);
}
function fontSizer(text, frame) {
  var fontSize = 80;
  text.fontSize = fontSize;
  while (text.width > frame.width) {
    fontSize -= 1;
    text.fontSize = fontSize;
  }
  text.fontSize = fontSize * 0.98;
  return fontSize * 0.98;

}
function sendPosition(x) {
  socket.emit('sendPosition', x / game.width);
}
var canUpdateQuestion = true;
var teammateHasConnected = false;
var canUpdateScore = true;
function teamateConnected() {
  spaceship_networked.visible = true;
  questionText.text = "Press [1] to start."
}
function getNetworkData() {
  socket.on('updateCords', function (x) {
    if (!teammateHasConnected) {
      teamateConnected();
    }
    teammateHasConnected = true;
    spaceship_networked.x = x * game.width;
  });
  socket.on('updateScore', function (delta) {
    if (canUpdateScore) {
      canUpdateScore = false;
      console.log("update score");
      score += delta;
      scoreText.text = `Score: ${score}`;
      setTimeout(() => {
        canUpdateScore = true;
      }, 500);
    }

  });
  socket.on('updateQuestion', function (wasCorrect) {
    console.log("update question");
    if (canUpdateQuestion) {
      canUpdateQuestion = false;
      setTimeout(() => {
        canUpdateQuestion = true;
      }, 1000);
      if (wasCorrect) { //if ans correct
        var missile = createMissile();
        missile.x = spaceship_networked.x;
        missile.y = spaceship_networked.y;
        scoreText.text = `Score: ${++score}`;
      } else {
        scoreText.text = `Score: ${--score}`;
      }
      nextQuestion();
    }
  });

}

