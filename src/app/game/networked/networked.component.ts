import { Component, OnInit, OnDestroy } from '@angular/core';
import { AUTO, Game } from 'phaser-ce';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { LocationStrategy } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { SubscriptionService } from 'src/app/subscriptions/subscription.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-networked',
  templateUrl: './networked.component.html',
  styleUrls: ['./networked.component.scss']
})
export class NetworkedComponent implements OnInit, OnDestroy {
  url = 'http://ec2-3-136-112-3.us-east-2.compute.amazonaws.com:3000';
  socket;
  game: Phaser.Game;
  database: AngularFirestore = null;
  id;
  globalRouter;
  showGame = false;
  friends = [];
  quizId;
  quizTitle;
  invites = [];
  room = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  ammo = 3;
  constructor(private db: AngularFirestore, location: LocationStrategy, private router: Router,
    public fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private afAuth: AngularFireAuth,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    this.preload = this.preload.bind(this);
    this.asteroidCollide = this.asteroidCollide.bind(this);
    this.spaceshipCollide = this.spaceshipCollide.bind(this);


    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    location.onPopState(() => {
      if (!this.destroyed) {
        this.destroyed = true;
        this.game.destroy();
        console.log("destroy game");
        this.resetVariables();
      }
    });
    this.socket = io(this.url);
    afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.getData();
      } else {
      }
    });
    if (!this.router.getCurrentNavigation().extras.queryParams) {
      this.router.navigate(['/dashboard']);
    }
    this.id = this.router.getCurrentNavigation().extras.queryParams.id;
    if (this.router.getCurrentNavigation().extras.queryParams.room) {
      console.log("joined special room");
      this.socket.emit("joinRoom", this.router.getCurrentNavigation().extras.queryParams.room);
    } else {
      this.socket.emit("joinRoom", this.room);
    }
    this.quizId = this.id;
    this.quizTitle = this.router.getCurrentNavigation().extras.queryParams.title;
    // socket.emit("joinRoom", this.room);

    console.log(this.quizTitle);
    this.globalRouter = router;

    console.log(this.id);
    this.database = db;
    this.loadQuestions();

  }
  autoFill() {
    this.socket.emit("changeRoom", this.quizId);
    this.showGame = true;
  }
  ngOnDestroy() {
    this.socket.emit("leave", "null");

  }
  ngOnInit() {
    let config = {
      width: window.innerWidth,
      height: window.innerHeight,
      renderer: AUTO,
      parent: 'networked',
      enableDebug: false,
      state: {
        preload: this.preload,
        create: this.create,
        update: this.update,
        render: this.render
      }
    };
    this.game = new Phaser.Game(config);
    this.destroyed = false;
  }
  joinFromInvite(index) {
    var invite = this.invites.slice().reverse()[index];
    console.log(invite);

    this.router.navigate(['play/online'], { queryParams: { id: invite.quizId, title: invite.title, room: invite.room } });

  }
  getData() {
    var globalData;
    globalData = this.db.collection('users', ref => ref.where('id', '==', this.afAuth.auth.currentUser.uid)).snapshotChanges();
    globalData.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        if (data.friends) {
          this.friends = data.friends;

        }
        if (data.invites) {
          this.invites = data.invites;
          // this.invites.reverse();
        }
      },
      (err) => console.log(err),
      () => console.log("")
    );
  }
  inviteFriendHelper(friend) {
    this.getFriendIdToInvite(friend);
  }
  getFriendIdToInvite(email) {
    var globalData;
    globalData = this.db.collection('users', ref => ref.where('email', '==', email)).snapshotChanges();
    globalData.pipe(take(1)).subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        var id = res[0].payload.doc.id;
        var invites = [];
        if (data.invites) {
          invites = data.invites;
        }
        this.sendInvite(id, invites);
      },
      (err) => console.log(err),
      () => console.log("got sub emails")
    );
  }
  sendInvite(id, invites) {
    var invite = { quizId: this.quizId, title: this.quizTitle, email: this.afAuth.auth.currentUser.email, room: this.room }
    invites.push(invite);
    this.db.doc(`users/${id}`).update({
      invites: invites
    });

  }
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
  spaceship_networked: Phaser.Sprite;


  questionText: Phaser.Text;
  scoreText: Phaser.Text;
  score = 0;

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

  starfield;
  asteroid1; asteroid2; asteroid3; asteroid4; asteroid5;
  destroyed = false;
  questions = [["Press any key to start", "", "", "", ""],
  ["What is 6x/6?", "x", "6", "1", "0"],
  ["What is 3(x+2x)", "9x", "9x^2", "6x", "9"],
  ["What is 5x-2?", "5x-2", "5x", "3x", "3"],
  ["What is (3x-3x)*3x?", "0", "9x", "27x", "9"]
  ]
  difficulties = [];
  difficulty;
  asteroidGroup;
  canAnswer = true;
  isGameOver = false;
  questionIndex = -1;
  ans = "";
  isLeftTurn = true;
  canUpdateQuestion = true;
  teammateHasConnected = false;
  canUpdateScore = true;


  resetVariables() {
    this.questionIndex = -1;
    this.score = 0;
    this.teammateHasConnected = false;
    this.game.destroy();
    this.socket.disconnect();
  }

  loadQuestions() {
    console.log("load quesitons");
    // globalData = database.collection('quizes', ref => ref.where('title', '==', quizTitle).limit(1)).snapshotChanges();
    var globalData;
    globalData = this.database.collection('quizes', ref => ref.where('title', '==', this.quizTitle)).snapshotChanges();
    globalData.subscribe(
      (res) => {
        var data = res[0].payload.doc.data();
        this.quizDocId = res[0].payload.doc.id;
        var tempQuestions = data.questions;
        var shouldInitStats
        if (data.highScore) {
          this.incorrectQuestionsGlobal = data.incorrectQuestionsGlobal;
          this.numPlays = data.numPlays;
          this.averagePercentCorrect = data.averagePercentCorrect;
          this.highScore = data.highScore;
          this.highScoreEmail = data.highScoreEmail;
          this.topScoreList = data.topScoreList;
        } else {
          shouldInitStats = true;
        }
  
        var formattedQuestion = [];
        this.questions = [];
        var isInTopScore = false;
        for (var i = 0; i < this.topScoreList.length; i++) {
          if (this.topScoreList[i].email == this.afAuth.auth.currentUser.email) {
            isInTopScore = true;
          }
        }
  
        if (!isInTopScore) {
          var topScore = { email: this.afAuth.auth.currentUser.email, score: 0 };
          this.topScoreList.push(topScore);
        }
        console.log(`tempQuestions length: ${tempQuestions.length}`);
        for (var key in tempQuestions) {
          console.log(`question length key: ${tempQuestions[key].question.length}`);
  
          if (tempQuestions[key].question.length > 1) {
            formattedQuestion = [];
            formattedQuestion[0] = tempQuestions[key].question;
            formattedQuestion[1] = tempQuestions[key].answer;
            formattedQuestion[2] = tempQuestions[key].fake1;
            formattedQuestion[3] = tempQuestions[key].fake2;
            formattedQuestion[4] = tempQuestions[key].fake3;
            if (shouldInitStats) {
              this.incorrectQuestionsGlobal.push(0);
            }
            this.incorrectQuestionsSession.push(0);
            this.difficulties.push(tempQuestions[key].difficulty);
            this.questions.push(formattedQuestion);
  
          }
        }
        console.log(`questions length: ${this.questions.length}`);
  
      },
      (err) => console.log(err),
      () => this.nextQuestion()
    );
  }
  saveQuestions() {
    for (var i = 0; i < this.topScoreList.length; i++) {
      if (this.topScoreList[i].email == this.afAuth.auth.currentUser.email && this.score > this.topScoreList[i].score) {
        this.topScoreList[i].score = this.score;
      }
    }
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreEmail = this.afAuth.auth.currentUser.email;
    }
    if(this.numWrong+this.numCorrect == 0){
      this.numWrong = 1;
    }
    var percentCorrect = this.numCorrect / (this.numWrong + this.numCorrect);
    this.averagePercentCorrect = (percentCorrect + this.averagePercentCorrect * this.numPlays) / (this.numPlays + 1);
    
    console.log(this.incorrectQuestionsGlobal);
    console.log("global^ session v");
    console.log(this.incorrectQuestionsSession);
  
    for (var i = 0; i < this.incorrectQuestionsSession.length; i++) {
      if (i >= this.incorrectQuestionsGlobal.length) {
        this.incorrectQuestionsGlobal.push(0);
      }
      this.incorrectQuestionsGlobal[i] += this.incorrectQuestionsSession[i];
    }
    console.log(this.incorrectQuestionsGlobal);
    console.log("global^ session v");
    console.log(this.incorrectQuestionsSession);
    this.topScoreList = this.topScoreList.sort((a, b) => parseInt(b.score) - parseInt(a.score));
  
    this.database.doc(`quizes/${this.quizDocId}`).update(
      {
        highScore: this.highScore,
        highScoreEmail: this.highScoreEmail,
        numPlays: this.numPlays+2,
        averagePercentCorrect: this.averagePercentCorrect,
        incorrectQuestionsGlobal: this.incorrectQuestionsGlobal,
        topScoreList: this.topScoreList
  
      });
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

    this.spaceship_networked = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.8, "spaceship");
    this.spaceship_networked.anchor.set(0.5);
    this.spaceship_networked.visible = false;
    this.game.physics.enable(this.spaceship_networked, Phaser.Physics.ARCADE);
    this.spaceship_networked.scale.set(2, 2);
    this.spaceship_networked.body.gravity.y = 0;

    this.asteroidGroup = this.game.add.group();
    this.asteroidGroup.add(this.asteroid1);
    this.asteroidGroup.add(this.asteroid2);
    this.asteroidGroup.add(this.asteroid3);
    this.asteroidGroup.add(this.asteroid4);
    this.asteroidGroup.add(this.asteroid5);
    this.asteroidGroup.forEach((sprite) => {
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
    this.questionText.text = "Waiting for teammate to connect.";

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
    this.game.world.sendToBack(this.spaceship_networked);

    this.game.world.sendToBack(this.starfield);
    this.moveTeammate();
    this.getNetworkData();
    this.tween = this.game.add.tween(this.spaceship_networked).to( { x: 0 * this.game.width }, 500, "Linear", true);
    this.ammo1 = this.createMissileAmmo();
    this.ammo2 = this.createMissileAmmo();
    this.ammo3 = this.createMissileAmmo();
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

    missile.update = () => {
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
    return missile;
  }

  spaceshipCollide(asteroid, space) {
    if(!this.isGameOver){
      this.scoreText.text = `Score: ${--this.score}`;
    }    this.socket.emit("changeScore", -1);


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
  asteroidUpdate() {

    if (!this.isGameOver) {
      var numAsteroids = 0;
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

      this.asteroidGroup.forEach((sprite) => {

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
        if (!this.teammateHasConnected || this.questionIndex == -1) {
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
    if (this.questionIndex >= this.questions.length) {
      this.questionText.text = "Waiting for Teammate to complete game."
      this.oneKeyText.text = "";
      this.twoKeyText.text = "";
      this.threeKeyText.text = "";
      this.fourKeyText.text = "";
      return;
    }
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
      if (selectAns == this.ans || this.questionIndex == -1) { //if ans correct
        this.numCorrect++;
        this.ammo++;
        if(this.ammo>3){
          this.ammo = 3;
        }
        this.socket.emit("answerQuestion", true);
        this.createMissile();
        this.scoreText.text = `Score: ${++this.score}`;
      } else {
        this.numWrong++;
        this.scoreText.text = `Score: ${--this.score}`;
        this.socket.emit("answerQuestion", false);

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

  canFire = true;
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

    if (!this.isGameOver && this.questionIndex >= this.questions.length && !this.teammateHasConnected || !this.isGameOver && this.questionIndex >= this.questions.length && this.teammateQuestionIndex >= this.questions.length) {
      this.gameOver();
    }
    if(this.spaceship.x<0){
      this.spaceship.x = this.game.width;
    }
    if(this.spaceship.x>this.game.width){
      this.spaceship.x = 0;
    }

    this.framesWithoutTeammate++;
    if (this.framesWithoutTeammate > 300) {
      this.socket.emit('cleanRoom', this.quizId);
      if(this.questionIndex>1){
        this.gameOver();
      }

      this.teammateHasConnected = false;
      this.framesWithoutTeammate = 0;
    }
    this.sendPosition(this.spaceship.x);
    this.asteroidGroup.forEach((sprite) => {
      this.game.physics.arcade.collide(sprite, this.spaceship, this.spaceshipCollide);
    })

    if (!this.isGameOver) {
      this.spaceship.y = this.game.height * 0.5;
      this.spaceship_networked.y = this.game.height * 0.5;

      if(this.fireKey.isDown && this.canFire && this.ammo>0){
        this.ammo--;
        this.canFire = false;
        this.createMissile();
        this.fireText.visible = false;
      }
      if(!this.fireKey.isDown){
        this.canFire = true;
      }
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
        this.moveText.visible = false;

        this.spaceship.body.velocity.x = -this.game.width * 0.3;
      }
      if (this.dKey.isDown) {
        this.moveText.visible = false;

        this.spaceship.body.velocity.x = +this.game.width * 0.3;
      }
      if (!this.aKey.isDown && !this.dKey.isDown) {
        this.spaceship.body.velocity.x = 0;
      }
    }
  }


  keyHandler(num) {
    if (this.teammateHasConnected) {
      this.answerQuestion(num);
    }

  }
  moveTeammate() {
    // var tween = this.game.add.tween(this.spaceship_networked).to({ x: this.game.world.randomX }, 4000, "Quart.easeOut");
    
  }
  


  gameOver() {
    console.log("gameOver");
    this.isGameOver = true;
    this.questionText.text = `You completed the game!\nYou scored ${this.score}!\nThanks for playing!`;
    this.questionText.fontSize = this.fontSizer(this.questionText, this.game) * 0.7;
    this.questionText.y = this.game.world.centerY;
    this.fireText.visible = false;
    this.moveText.visible = false;
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
      this.resetVariables();
      this.globalRouter.navigate(['/dashboard']);
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
  sendPosition(x) {
    this.socket.emit('sendPosition', x / this.game.width);
  }

  teamateConnected() {
    this.spaceship_networked.visible = true;
    this.questionText.text = "Press [1] to start."
  }
  framesWithoutTeammate = 0;
  tween;
  
  getNetworkData() {
    this.socket.on('updateCords', (xPos) => {
      this.framesWithoutTeammate = 0;
      if (!this.teammateHasConnected) {
        this.teamateConnected();
      }
      this.teammateHasConnected = true;
      this.showGame = true;
      if(!this.tween.isRunning){
        this.tween = this.game.add.tween(this.spaceship_networked).to( { x: xPos * this.game.width }, 100, "Linear", true);

      }

    });
    this.socket.on('updateScore', (delta) => {
      if(delta < 0){
        setTimeout(() => {
          this.spaceship_networked.visible = true;
          setTimeout(() => {
            this.spaceship_networked.visible = false;
            setTimeout(() => {
              this.spaceship_networked.visible = true;
              setTimeout(() => {
                this.spaceship_networked.visible = false;
                setTimeout(() => {
                  this.spaceship_networked.visible = true;
                }, 100);
              }, 100);
            }, 100);
          }, 100);
        }, 100);
      }
      if (this.canUpdateScore) {
        this.canUpdateScore = false;
        console.log("update score");
        this.score += delta;
        this.scoreText.text = `Score: ${this.score}`;
        setTimeout(() => {
          this.canUpdateScore = true;
        }, 500);
      }

    });
    this.socket.on('updateQuestion', (wasCorrect) => {
      if (this.canUpdateQuestion) {
        this.canUpdateQuestion = false;
        setTimeout(() => {
          this.canUpdateQuestion = true;
        }, 1000);
        if (wasCorrect) { //if ans correct
          var missile = this.createMissile();
          missile.x = this.spaceship_networked.x;
          missile.y = this.spaceship_networked.y;
          this.scoreText.text = `Score: ${++this.score}`;
        } else {
          this.scoreText.text = `Score: ${--this.score}`;
        }
        this.teammateQuestionIndex++;
        if(this.teammateQuestionIndex == 1){
          this.nextQuestion();
        }
      }
    });

  }
  teammateQuestionIndex = 0;
}


