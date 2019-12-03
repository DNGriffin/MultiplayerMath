import { Component, OnInit } from '@angular/core';
import { AUTO, Game } from 'phaser-ce';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';



  @Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
  })
  export class GameComponent implements OnInit {
  game: Phaser.Game;
  database: AngularFirestore = null;
  id;
  quizTitle;
  globalRouter;
  auth;
  oneKey: Phaser.Key;
  twoKey: Phaser.Key;
  threeKey: Phaser.Key;
  fourKey: Phaser.Key;
  fireKey: Phaser.Key;

  aKey: Phaser.Key;
  dKey: Phaser.Key;
  oneKeyIcon: Phaser.Sprite;
  twoKeyIcon: Phaser.Sprite;
  threeKeyIcon: Phaser.Sprite;
  fourKeyIcon: Phaser.Sprite;
  oneKeyText: Phaser.Text;
  twoKeyText: Phaser.Text;
  threeKeyText: Phaser.Text;
  fourKeyText: Phaser.Text;

  moveText: Phaser.Text;
  fireText: Phaser.Text;
  spaceship: Phaser.Sprite;
  
  questionText: Phaser.Text;
  scoreText: Phaser.Text;
  score = 0;
  ammo = 3;
  
  starfield;
  asteroid1; asteroid2; asteroid3; asteroid4; asteroid5;
  
  // stats
  numCorrect = 0;
  numWrong = 0;
  incorrectQuestionsSession = [];
  incorrectQuestionsGlobal = [];
  numPlays = 0;
  averagePercentCorrect = 0;
  highScore = 0;
  highScoreEmail = "";
  quizDocId = "";
  topScoreList = [];
  
  questions = [["Press any key to start?", "START", "START", "START", "START"],
  ["What is 6+6?", "12", "6", "4", "2"],
  ["What is 3(x+2x)", "9x", "9x^2", "6x", "9"],
  ["What is 5x-2?", "5x-2", "5x", "3x", "3"],
  ["What is (3x-3x)*3x?", "0", "9x", "27x", "9"]
  ]
  
  destroyed = false;
  difficulties = [];
  difficulty;
  asteroidGroup;
  canAnswer = true;
  isGameOver = false;
  questionIndex = -1;
  ans = "";
  isLeftTurn = true;

  constructor(private db: AngularFirestore, private router: Router, location: LocationStrategy, private af: AngularFireAuth
  ) {
    this.preload = this.preload.bind(this);
    this.asteroidCollide = this.asteroidCollide.bind(this);
    this.spaceshipCollide = this.spaceshipCollide.bind(this);


    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);

    this.auth = af;
    location.onPopState(() => {
      if (!this.destroyed) {
        this.destroyed = true;
        this.game.destroy();
        console.log("destroy game");
        this.resetVariables();
      }
    });
   
    this.globalRouter = router;

    console.log(this.id);
    this.database = db;
    this.game = new Game(window.innerWidth, window.innerHeight, AUTO, 'singleplayer', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    this.loadQuestions();

  }

  ngOnInit() {
    this.destroyed = false;
  }
  resetVariables() {
    this.questionIndex = -1;
    this.score = 0;
    this.numCorrect = 0;
    this.numWrong = 0;
    this.incorrectQuestionsSession = [];
    this.incorrectQuestionsGlobal = [];
    this.numPlays = 0;
    this.averagePercentCorrect = 0;
    this.highScore = 0;
    this.highScoreEmail = "";
    this.quizDocId = "";
    this.topScoreList = [];
  }
  
  loadQuestions() {
  }
  saveQuestions() {
  }
  preload() {
    this.game.load.spritesheet('missile', 'assets/games/missilesheet.png', 14, 4, 2);
  
    this.game.load.image("1key", "assets/games/1key.png");
    this.game.load.image("2key", "assets/games/2key.png");
    this.game.load.image("click", "assets/games/click.png");
  
    this.game.load.image("3key", "assets/games/3key.png");
    this.game.load.image("4key", "assets/games/4key.png");
    this.game.load.image('starfield', 'assets/games/starfield.png');
    this.game.load.image('spaceship', 'assets/games/spaceship.png');
    this.game.load.image('asteroid1', 'assets/games/asteroid1.png');
  }
  
  create() {
    this.destroyed = false;
    this.asteroid1 = this.game.add.sprite(this.game.world.randomX, -this.game.world.randomY, "asteroid1");
    this.asteroid2 = this.game.add.sprite(this.game.world.randomX, -this.game.world.randomY, "asteroid1");
    this.asteroid3 = this.game.add.sprite(this.game.world.randomX, -this.game.world.randomY, "asteroid1");
    this.asteroid4 = this.game.add.sprite(this.game.world.randomX, -this.game.world.randomY, "asteroid1");
    this.asteroid5 = this.game.add.sprite(this.game.world.randomX, -this.game.world.randomY, "asteroid1");
  
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 100;
  
    this.starfield = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');
  
    this.oneKeyIcon = this.game.add.sprite(this.game.width * 0.2, this.game.height * 0.2, "1key");
    this.twoKeyIcon = this.game.add.sprite(this.oneKeyIcon.x, this.oneKeyIcon.y + this.oneKeyIcon.height * 1.5, "2key");
    this.threeKeyIcon = this.game.add.sprite(this.oneKeyIcon.x, this.twoKeyIcon.y + this.twoKeyIcon.height * 1.5, "3key");
    this.fourKeyIcon = this.game.add.sprite(this.oneKeyIcon.x, this.threeKeyIcon.y + this.threeKeyIcon.height * 1.5, "4key");
  
    this.spaceship = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.8, "spaceship");
    this.spaceship.anchor.set(0.5);
    this.game.physics.enable(this.spaceship, Phaser.Physics.ARCADE);
    this.spaceship.scale.set(2, 2);
    this.spaceship.body.gravity.y = 0;
  
    this.asteroidGroup = this.game.add.group();
    this.asteroidGroup.add(this.asteroid1);
    this.asteroidGroup.add(this.asteroid2);
    this.asteroidGroup.add(this.asteroid3);
    this.asteroidGroup.add(this.asteroid4);
    this.asteroidGroup.add(this.asteroid5);
    this.asteroidGroup.forEach( (sprite) => {
      sprite.anchor.setTo(0.5);
      this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
      sprite.body.angularVelocity = Math.random() * 200;
      sprite.body.angularDrag = 3;
      sprite.body.allowGravity = true;
      var asteroidWidth = this.game.height * .10 + this.game.height * 0.15 * Math.random();
      sprite.width = asteroidWidth;
      sprite.height = asteroidWidth;
    })
  
    this.questionText = this.game.add.text(this.game.world.centerX, this.game.height * 0.15, "Are you ready to start? Press the [1] key");
    this.questionText.anchor.set(0.5);
    this.oneKeyText = this.game.add.text(this.game.width * 0.2 + this.oneKeyIcon.width, this.game.height * 0.2, "Start");
    this.twoKeyText = this.game.add.text(this.oneKeyIcon.x + this.oneKeyIcon.width, this.oneKeyIcon.y + this.oneKeyIcon.height * 1.5, "Start");
    this.threeKeyText = this.game.add.text(this.oneKeyIcon.x + this.oneKeyIcon.width, this.twoKeyIcon.y + this.twoKeyIcon.height * 1.5, "Start");
    this.fourKeyText = this.game.add.text(this.oneKeyIcon.x + this.oneKeyIcon.width, this.threeKeyIcon.y + this.threeKeyIcon.height * 1.5, "Start");
  
    this.moveText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.4, "Press A and D to Move!");
    this.moveText.anchor.set(0.5);
    this.moveText.fill = "white";

    this.fireText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.6, "Press SPACE to fire a Missile!");
    this.fireText.anchor.set(0.5);
    this.fireText.fill = "white";

    this.questionText.fill = "white";
    this.oneKeyText.fill = "white";
    this.twoKeyText.fill = "white";
    this.threeKeyText.fill = "white";
    this.fourKeyText.fill = "white";
    this.scoreText = this.game.add.text(this.game.world.centerX, this.game.height * 0.05, "Score: 0");
    this.scoreText.anchor.set(0.5);
    this.scoreText.fill = "white";
  
    this.oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.threeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.fourKey = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  
    this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  
  
    this.game.world.sendToBack(this.asteroidGroup);
    this.game.world.sendToBack(this.spaceship);
    this.game.world.sendToBack(this.starfield);
    this.ammo1 = this.createMissileAmmo();
    this.ammo2 = this.createMissileAmmo();
    this.ammo3 = this.createMissileAmmo();
    this.nextQuestion();

  
  }
  ammo1;
  ammo2;
  ammo3;
  createMissileAmmo(){
    var missile = this.game.add.sprite(this.spaceship.x, this.spaceship.y, "missile");
    missile.animations.add('fly2');
    missile.animations.play('fly2', 15, true);
    missile.anchor.setTo(0.5);
    missile.rotation = -Math.PI / 2;
    missile.width = this.game.width * .02;
    missile.height = missile.width * (2 / 7);
    return missile;
  }
  createMissile() {
    var missile = this.game.add.sprite(this.spaceship.x, this.spaceship.y, "missile");
    missile.animations.add('fly2');
    missile.animations.play('fly2', 15, true);
    missile.anchor.setTo(0.5);
    missile.rotation = -Math.PI / 2;
    missile.width = this.game.width * .02;
    missile.height = missile.width * (2 / 7);
    this.game.physics.enable(missile, Phaser.Physics.ARCADE);
  
    missile.update =  () => {
      var nearestAsteroid: Phaser.Sprite;
      var nearestDistance = 9999999999;
      this.asteroidGroup.forEach((sprite) => {
        var distanceBetween = this.distanceSQ(sprite, missile);
        if (distanceBetween < nearestDistance) {
          nearestAsteroid = sprite;
          nearestDistance = distanceBetween;
  
        };
      })
      missile.rotation = this.game.physics.arcade.angleBetween(missile, nearestAsteroid);
      missile.body.velocity.x = Math.cos(missile.rotation) * this.game.height * 0.4;
      missile.body.velocity.y = Math.sin(missile.rotation) * this.game.height * 0.4;
      this.game.physics.arcade.collide(missile, this.asteroidGroup, this.asteroidCollide);
    }
  
  }
  
  spaceshipCollide(asteroid, space) {
    if(!this.isGameOver){
      this.scoreText.text = `Score: ${--this.score}`;
    }
  
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
    asteroid.y = this.game.height * 2;
  }
  
  render() {
    // game.debug.body(spaceship);
    // asteroidGroup.forEach(function (sprite) {
    //   game.debug.body(sprite);
  
    // })
  
  }
  canFire = false;
  asteroidUpdate() {
  
    if (!this.isGameOver) {
      if(this.fireKey.isDown && this.canFire && this.ammo>0){
        this.ammo--;
        this.canFire = false;
        this.createMissile();
        this.fireText.visible = false;
      }
      if(!this.fireKey.isDown){
        this.canFire = true;
      }

      var numAsteroids = 5;
      if (this.difficulty == "easy") {
        numAsteroids = 5;
      }
      if (this.difficulty == "medium") {
        numAsteroids = 3;
      }
      if (this.difficulty == "hard") {
        numAsteroids = 1;
      }
      var numAboveBottomScreen = 0;
  
      this.asteroidGroup.forEach( (sprite) => {
  
        if (sprite.y < this.game.height) {
          numAboveBottomScreen++;
        }
      })
      this.asteroidGroup.forEach((sprite) => {
        var rand = Math.floor(Math.random() * 200);
        if (sprite.y > sprite.height + this.game.height + rand && numAboveBottomScreen < numAsteroids) {
          numAboveBottomScreen++;
          sprite.y = -sprite.height;
          sprite.body.angularVelocity = Math.random() * 200 - Math.random() * 200;
          sprite.x = this.game.world.randomX;
          var asteroidWidth = this.game.height * .10 + this.game.height * 0.15 * Math.random();
          sprite.width = asteroidWidth;
          sprite.height = asteroidWidth;
        }
        if (sprite.body.velocity.y > 200) {
          sprite.body.velocity.y = 200;
        }
        console.log(this.questionIndex);
        if (this.questionIndex == 0) {
          sprite.body.velocity.y = 0;
        }
      })
    }
  }
  distanceSQ(object, target) {
    var xDif = object.x - target.x;
    var yDif = object.y - target.y;
    return (xDif * xDif) + (yDif * yDif);

  };
  asteroidCollide(missile, asteroid) {
    missile.kill();
    asteroid.y = this.game.height * 2;
  }
  answerQuestion(index) {
    if (this.canAnswer) {
      var selectAns;
      if (index == 1) {
        selectAns = this.oneKeyText.text;
      } if (index == 2) {
        selectAns = this.twoKeyText.text;
      } if (index == 3) {
        selectAns = this.threeKeyText.text;
      } if (index == 4) {
        selectAns = this.fourKeyText.text;
      }
      if (selectAns == this.ans) { //if ans correct
        this.createMissile();
        this.scoreText.text = `Score: ${++this.score}`;
        this.numCorrect++;
        this.ammo++;
        if(this.ammo>3){
          this.ammo = 3;
        }
      } else {
        if (this.questionIndex >= 0 && this.questionIndex < this.questions.length) {
          this.incorrectQuestionsSession[this.questionIndex]++;
          this.numWrong++;
        }
      }
      this.nextQuestion();
      this.canAnswer = false;
      setTimeout(() => {
        this.canAnswer = true;
      }, 400);
    }
  }
  
  
  nextQuestion() {
    
    this.questionIndex++;
    if (this.questionIndex >= this.questions.length) {
      console.log(`question index: ${this.questionIndex}`);
      console.log(`question length: ${this.questions.length}`);
  
      this.gameOver();
      return;
    }
    // questionIndex = questionIndex % questions.length;
    this.questionText.text = this.questions[this.questionIndex][0];
    this.ans = this.questions[this.questionIndex][1];
    var tempAnswers = [];
    for (var i = 1; i < this.questions[this.questionIndex].length; i++) {
      tempAnswers.push(this.questions[this.questionIndex][i]);
    }
    tempAnswers = tempAnswers.sort(() => Math.random() - 0.5);
    this.oneKeyText.text = tempAnswers[0];
    this.twoKeyText.text = tempAnswers[1];
    this.threeKeyText.text = tempAnswers[2];
    this.fourKeyText.text = tempAnswers[3];
    this.difficulty = this.difficulties[this.questionIndex];
  }
  update() {
    this.ammo1.y = this.spaceship.y-this.spaceship.height;
    this.ammo1.x = this.spaceship.x-this.ammo1.width;
    this.ammo2.y = this.spaceship.y-this.spaceship.height;
    this.ammo2.x = this.spaceship.x;
    this.ammo3.y = this.spaceship.y-this.spaceship.height;
    this.ammo3.x = this.spaceship.x+this.ammo1.width;

      this.ammo1.alpha = 0.1;
      this.ammo2.alpha = 0.1;
      this.ammo3.alpha = 0.1;

    if(this.ammo > 0){
      this.ammo1.alpha = 1;
    }
    if(this.ammo > 1){
      this.ammo2.alpha = 1;
    }
    if(this.ammo == 3){
      this.ammo3.alpha = 1;
    }
    
    if(this.spaceship.x<0){
      this.spaceship.x = this.game.width;
    }
    if(this.spaceship.x>this.game.width){
      this.spaceship.x = 0;
    }
    this.asteroidGroup.forEach((sprite) => {
      this.game.physics.arcade.collide(sprite, this.spaceship, this.spaceshipCollide);
    })
  
    if (!this.isGameOver) {
  
      this.spaceship.y = this.game.height * 0.5;
  
      this.asteroidUpdate();
      this.starfield.tilePosition.y += 1;
      if (this.oneKey.isDown) {
        this.oneKeyIcon.alpha = 1;
        this.keyHandler(1);
      } else {
        this.oneKeyIcon.alpha = 0.7;
      }
      if (this.twoKey.isDown) {
        this.twoKeyIcon.alpha = 1;
        this.keyHandler(2);
      } else {
        this.twoKeyIcon.alpha = 0.7;
      }
      if (this.threeKey.isDown) {
        this.keyHandler(3);
        this.threeKeyIcon.alpha = 1;
      } else {
        this.threeKeyIcon.alpha = 0.7;
      }
      if (this.fourKey.isDown) {
        this.keyHandler(4);
        this.fourKeyIcon.alpha = 1;
      } else {
        this.fourKeyIcon.alpha = 0.7;
      }
      if (this.aKey.isDown) {
        this.spaceship.body.velocity.x = -this.game.width * 0.3;
        this.moveText.visible = false;
      }
      if (this.dKey.isDown) {
        this.spaceship.body.velocity.x = +this.game.width * 0.3;
        this.moveText.visible = false;

      }
      if (!this.aKey.isDown && !this.dKey.isDown) {
        this.spaceship.body.velocity.x = 0;
      }
    }
  }
  
  
  keyHandler(num) {
    this.answerQuestion(num);
  }
  
  
  gameOver() {
    this.isGameOver = true;
    this.questionText.text = `The completed the game!\nYou scored ${this.score}!\nRegister to get started!`;
    this.questionText.fontSize = this.fontSizer(this.questionText, this.game) * 0.7;
    this.questionText.y = this.game.world.centerY;
    this.saveQuestions();
    this.oneKeyIcon.destroy();
    this.twoKeyIcon.destroy();
    this.threeKeyIcon.destroy();
    this.fourKeyIcon.destroy();
    this.oneKeyText.destroy();
    this.twoKeyText.destroy();
    this.threeKeyText.destroy();
    this.fourKeyText.destroy();
    setTimeout(() => {
      this.globalRouter.navigate(['/register']);
      this.resetVariables();
      this.isGameOver = false;
      this.game.destroy();
      this.questionIndex = -1;
    }, 3000);
  }
  fontSizer(text, frame) {
    var fontSize = 80;
    text.fontSize = fontSize;
    while (text.width > frame.width) {
      fontSize -= 1;
      text.fontSize = fontSize;
    }
    text.fontSize = fontSize * 0.98;
    return fontSize * 0.98;
  
  }

}





