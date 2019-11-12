import { Component, OnInit } from '@angular/core';
import { AUTO, Game } from 'phaser-ce';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';

var game: Phaser.Game;
var database: AngularFirestore = null;
var id;
var quizTitle;
var globalRouter;
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private db: AngularFirestore, private router: Router, location: LocationStrategy
    ) {
      destroyed = false;
      location.onPopState(() => {
        if(!destroyed){
          destroyed = true;
          game.destroy();
          console.log("destroy game");
          resetVariables();
        }
      });
    if (!this.router.getCurrentNavigation().extras.queryParams) {
      this.router.navigate(['/dashboard']);
    }
    id = this.router.getCurrentNavigation().extras.queryParams.id;
    quizTitle = this.router.getCurrentNavigation().extras.queryParams.title;

    globalRouter = router;

    database = db;
    loadQuestions();
    game = new Game(window.innerWidth, window.innerHeight, AUTO, 'game', { preload: preload, create: create, update: update, render: render });
  }

  ngOnInit() {
    destroyed = false;
  }

}
var oneKey: Phaser.Key;
var twoKey: Phaser.Key;
var threeKey: Phaser.Key;
var fourKey: Phaser.Key;

var aKey: Phaser.Key;
var dKey: Phaser.Key;

var destroyed = false;

function resetVariables(){
  questionIndex = -1;
  score = 0;
}
var oneKeyIcon: Phaser.Sprite;
var twoKeyIcon: Phaser.Sprite;
var threeKeyIcon: Phaser.Sprite;
var fourKeyIcon: Phaser.Sprite;
var oneKeyText: Phaser.Text;
var twoKeyText: Phaser.Text;
var threeKeyText: Phaser.Text;
var fourKeyText: Phaser.Text;

var oneClickIcon: Phaser.Button;
var twoClickIcon: Phaser.Button;
var threeClickIcon: Phaser.Button;
var fourClickIcon: Phaser.Button;
var oneClickText: Phaser.Text;
var twoClickText: Phaser.Text;
var threeClickText: Phaser.Text;
var fourClickText: Phaser.Text;

var spaceship: Phaser.Sprite;

var questionText: Phaser.Text;
var scoreText: Phaser.Text;
var score = 0;


var starfield;
var asteroid1, asteroid2, asteroid3, asteroid4, asteroid5;

var questions = [["Press any key to start?", "", "", "", ""],
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
        if (tempQuestions[key].question.length>3) {
          formattedQuestion = [];
          formattedQuestion[0] = tempQuestions[key].question;
          formattedQuestion[1] = tempQuestions[key].answer;
          formattedQuestion[2] = tempQuestions[key].fake1;
          formattedQuestion[3] = tempQuestions[key].fake2;
          formattedQuestion[4] = tempQuestions[key].fake3;
          difficulties.push(tempQuestions[key].difficulty);
          questions.push(formattedQuestion);
        }
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

  oneClickIcon = game.add.button(game.width * 0.8, game.height * 0.2, "click");
  twoClickIcon = game.add.button(oneClickIcon.x, oneClickIcon.y + oneClickIcon.height * 1.5, "click");
  threeClickIcon = game.add.button(oneClickIcon.x, twoClickIcon.y + twoClickIcon.height * 1.5, "click");
  fourClickIcon = game.add.button(oneClickIcon.x, threeClickIcon.y + threeClickIcon.height * 1.5, "click");

  oneClickIcon.onInputDown.add(clickOne);
  twoClickIcon.onInputDown.add(clickTwo);
  threeClickIcon.onInputDown.add(clickThree);
  fourClickIcon.onInputDown.add(clickFour);


  oneClickIcon.alpha = 0.7;
  twoClickIcon.alpha = 0.7;
  threeClickIcon.alpha = 0.7;
  fourClickIcon.alpha = 0.7;

  spaceship = game.add.sprite(game.width * 0.5, game.height * 0.8, "spaceship");
  spaceship.anchor.set(0.5);
  game.physics.enable(spaceship, Phaser.Physics.ARCADE);
  spaceship.scale.set(2, 2);
  spaceship.body.gravity.y = 0;

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

  oneClickText = game.add.text(game.width * 0.8 + oneClickIcon.width, game.height * 0.2, "Yes");
  twoClickText = game.add.text(oneClickIcon.x + oneClickIcon.width, oneClickIcon.y + oneClickIcon.height * 1.5, "Yes");
  threeClickText = game.add.text(oneClickIcon.x + oneClickIcon.width, twoClickIcon.y + twoClickIcon.height * 1.5, "Yes");
  fourClickText = game.add.text(oneClickIcon.x + oneClickIcon.width, threeClickIcon.y + threeClickIcon.height * 1.5, "Yes");

  oneClickText.fill = "white";
  twoClickText.fill = "white";
  threeClickText.fill = "white";
  fourClickText.fill = "white";
  game.world.sendToBack(asteroidGroup);
  game.world.sendToBack(spaceship);
  game.world.sendToBack(starfield);

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

}
var canAnswer = true;
var isGameOver = false;
function spaceshipCollide(asteroid, space) {
  scoreText.text = `Score: ${--score}`;

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
    if (selectAns == ans) { //if ans correct
      createMissile();
      scoreText.text = `Score: ${++score}`;
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
  oneClickText.text = tempAnswers[0];
  twoClickText.text = tempAnswers[1];
  threeClickText.text = tempAnswers[2];
  fourClickText.text = tempAnswers[3];
  difficulty = difficulties[questionIndex];

}
function update() {
  asteroidGroup.forEach(function (sprite) {
    game.physics.arcade.collide(sprite, spaceship, spaceshipCollide);
  })

  if (!isGameOver) {
    if (isLeft) {
      hideRightText();
      showLeftText();
    } else {
      hideLeftText();
      showRightText();
    }
    spaceship.y = game.height * 0.5;

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
function hideLeftText() {
  oneKeyText.visible = false;
  twoKeyText.visible = false;
  threeKeyText.visible = false;
  fourKeyText.visible = false;
}
function showLeftText() {
  oneKeyText.visible = true;
  twoKeyText.visible = true;
  threeKeyText.visible = true;
  fourKeyText.visible = true;
}
function hideRightText() {
  oneClickText.visible = false;
  twoClickText.visible = false;
  threeClickText.visible = false;
  fourClickText.visible = false;
}
function showRightText() {
  oneClickText.visible = true;
  twoClickText.visible = true;
  threeClickText.visible = true;
  fourClickText.visible = true;
}
var isLeft = true;

function keyHandler(num) {
  if (isLeft) {
    isLeft = !isLeft;
    answerQuestion(num);
  }
}
function clickHandler(num) {
  if (!isLeft) {
    isLeft = !isLeft;
    answerQuestion(num);
  }
}
function clickOne() {
  clickHandler(1);
  oneClickIcon.alpha = 1.0;
  setTimeout(() => {
    oneClickIcon.alpha = 0.7;
  }, 500);
}
function clickTwo() {
  clickHandler(2);
  twoClickIcon.alpha = 1.0;
  setTimeout(() => {
    twoClickIcon.alpha = 0.7;
  }, 1000);
}
function clickThree() {
  clickHandler(3);
  threeClickIcon.alpha = 1.0;
  setTimeout(() => {
    threeClickIcon.alpha = 0.7;
  }, 1000);
}
function clickFour() {
  clickHandler(4);
  fourClickIcon.alpha = 1.0;
  setTimeout(() => {
    fourClickIcon.alpha = 0.7;
  }, 1000);

}
function gameOver() {
  isGameOver = true;
  questionText.text = `The completed the game!\nYou scored ${score}!\nThanks for playing!`;
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

  oneClickIcon.destroy();
  twoClickIcon.destroy();
  threeClickIcon.destroy();
  fourClickIcon.destroy();
  oneClickText.destroy();
  twoClickText.destroy();
  threeClickText.destroy();
  fourClickText.destroy();
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


