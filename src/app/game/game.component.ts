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

var oneKeyIcon: Phaser.Sprite;
var twoKeyIcon: Phaser.Sprite;
var threeKeyIcon: Phaser.Sprite;
var fourKeyIcon: Phaser.Sprite;

var questionText: Phaser.Text;

var oneKeyText: Phaser.Text;
var twoKeyText: Phaser.Text;
var threeKeyText: Phaser.Text;
var fourKeyText: Phaser.Text;
var starfield;

function preload() {
  game.load.image("1key", "assets/games/1key.png");
  game.load.image("2key", "assets/games/2key.png");
  game.load.image("3key", "assets/games/3key.png");
  game.load.image("4key", "assets/games/4key.png");
  game.load.image('starfield', 'assets/games/starfield.png');

}
function create() {
  starfield = game.add.tileSprite(0, 0, game.width, game.height, 'starfield');

  oneKeyIcon = game.add.sprite(game.width * 0.2, game.height * 0.2, "1key");
  twoKeyIcon = game.add.sprite(oneKeyIcon.x, oneKeyIcon.y + oneKeyIcon.height * 1.5, "2key");
  threeKeyIcon = game.add.sprite(oneKeyIcon.x, twoKeyIcon.y + twoKeyIcon.height * 1.5, "3key");
  fourKeyIcon = game.add.sprite(oneKeyIcon.x, threeKeyIcon.y + threeKeyIcon.height * 1.5, "4key");

  questionText = game.add.text(game.world.centerX, game.height * 0.15, "What is 3x * 3?");
  questionText.anchor.set(0.5);
  oneKeyText = game.add.text(game.width * 0.2+oneKeyIcon.width, game.height * 0.2, "9x");
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

}
function update() {
  starfield.tilePosition.y += 1;
  if(oneKey.isDown){
    oneKeyIcon.alpha = 1;
  }else{
    oneKeyIcon.alpha = 0.7;
  }
  if(twoKey.isDown){
    twoKeyIcon.alpha = 1;
  }else{
    twoKeyIcon.alpha = 0.7;
  }
  if(threeKey.isDown){
    threeKeyIcon.alpha = 1;
  }else{
    threeKeyIcon.alpha = 0.7;
  }
  if(fourKey.isDown){
    fourKeyIcon.alpha = 1;
  }else{
    fourKeyIcon.alpha = 0.7;
  }

}
