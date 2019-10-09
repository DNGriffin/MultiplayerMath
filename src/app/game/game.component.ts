import { Component, OnInit } from '@angular/core';
import { AUTO, Game } from 'phaser-ce';
var game: Phaser.Game;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor() {
    game = new Game(window.innerWidth, window.innerHeight, AUTO, 'game', { preload: preload, create: create, update: update });
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

var spaceship: Phaser.Sprite;


var questionText: Phaser.Text;

var oneKeyText: Phaser.Text;
var twoKeyText: Phaser.Text;
var threeKeyText: Phaser.Text;
var fourKeyText: Phaser.Text;
var starfield;
var asteroid1, asteroid2, asteroid3, asteroid4, asteroid5;

var questions = [["What is 3x*3?", "9x", "6x", "9", "6"],
["What is 6x/6?", "x", "6", "1", "0"],
["What is 3(x+2x)", "9x", "9x^2", "6x", "9"],
["What is 5x-2?", "5x-2", "5x", "3x", "3"],
["What is (3x-3x)*3x?", "0", "9x", "27x", "9"]
  // ["", "", "", "", ""],



]

function preload() {
  game.load.image("1key", "assets/games/1key.png");
  game.load.image("2key", "assets/games/2key.png");
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
  questionText = game.add.text(game.world.centerX, game.height * 0.15, "What is 3x * 3?");
  questionText.anchor.set(0.5);
  oneKeyText = game.add.text(game.width * 0.2 + oneKeyIcon.width, game.height * 0.2, "9x");
  twoKeyText = game.add.text(oneKeyIcon.x + oneKeyIcon.width, oneKeyIcon.y + oneKeyIcon.height * 1.5, "3x");
  threeKeyText = game.add.text(oneKeyIcon.x + oneKeyIcon.width, twoKeyIcon.y + twoKeyIcon.height * 1.5, "4x");
  fourKeyText = game.add.text(oneKeyIcon.x + oneKeyIcon.width, threeKeyIcon.y + threeKeyIcon.height * 1.5, "9");

  questionText.fill = "white";
  oneKeyText.fill = "white";
  twoKeyText.fill = "white";
  threeKeyText.fill = "white";
  fourKeyText.fill = "white";

  oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
  twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
  threeKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  fourKey = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);

  aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

}
var canAnswer = true;
function asteroidUpdate() {
  asteroidGroup.forEach(function (sprite) {
    if (sprite.y > sprite.height + game.height) {
      sprite.y = -sprite.height;
      sprite.body.angularVelocity = Math.random() * 200 - Math.random() * 200;
      sprite.x = game.world.randomX;
      var asteroidWidth = game.height * .10 + game.height * 0.15 * Math.random();
      sprite.width = asteroidWidth;
      sprite.height = asteroidWidth;
      // createMissile();
    }
    if (sprite.body.velocity.y > 200) {
      sprite.body.velocity.y = 200;
    }
  })
}
function answerQuestion(index) {
  if (canAnswer) {
    nextQuestion();
    canAnswer = false;
    setTimeout(() => {
      canAnswer = true;
    }, 2000);
  }
}

var questionIndex = 0;
var ans = "";
var isLeftTurn = true;
function nextQuestion() {
  questionIndex++;
  questionIndex = questionIndex % questions.length;
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

}
function update() {
  spaceship.y = game.height * 0.5;

  asteroidUpdate();
  starfield.tilePosition.y += 1;
  if (oneKey.isDown) {
    oneKeyIcon.alpha = 1;
    answerQuestion(1);
  } else {
    oneKeyIcon.alpha = 0.7;
  }
  if (twoKey.isDown) {
    twoKeyIcon.alpha = 1;
    answerQuestion(2);

  } else {
    twoKeyIcon.alpha = 0.7;
  }
  if (threeKey.isDown) {
    answerQuestion(3);

    threeKeyIcon.alpha = 1;
  } else {
    threeKeyIcon.alpha = 0.7;
  }
  if (fourKey.isDown) {
    answerQuestion(4);

    fourKeyIcon.alpha = 1;
  } else {
    fourKeyIcon.alpha = 0.7;
  }
  if(aKey.isDown){
    spaceship.body.velocity.x = -game.width * 0.3;
  }
  if(dKey.isDown){
    spaceship.body.velocity.x = +game.width * 0.3;
  }
  if(!aKey.isDown && !dKey.isDown){
    spaceship.body.velocity.x = 0;
  }

}
