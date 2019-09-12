// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        starPreFab:{
          default: null,
          type: cc.Prefab
        },

        maxStarDuration: 0,
        minStarDuration: 0,

        ground: {
          default: null,
          type: cc.Node
        },

        player: {
          default: null,
          type: cc.Node
        },

        scoreDisplay: {
          default: null,
          type: cc.Label
        },

        btn_play: {
          default: null,
          type: cc.Node
        },

        scoreAudio: {
          default: null,
          type: cc.AudioClip
        },

        progressBar: {
          default: null,
          type: cc.ProgressBar
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      this.score = 0;

      this.progressBar.progress = 1;

      this.timer = 0;
      this.starDuration = 0;

      this.currentStar = null;
      this.running = true;

      this.btn_play.x = 3000;

      this.spawnNewStar();
    },

    start () {

    },

    getNewStarPosition () {
      var max = this.player.getComponent('player').jumpHeight;
      var min = this.ground._position.y;

      var randY = Math.floor(Math.random() * max + min);

      var maxX = this.node.width / 2;
      var randX = ((Math.random() - 0.5) * 2) * maxX;

      return cc.v2(randX, randY);
    },

    spawnNewStar () {
      var newStar = cc.instantiate(this.starPreFab);

      this.node.addChild(newStar);

      newStar.setPosition(this.getNewStarPosition());
      newStar.getComponent('star').game = this;

      this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
      this.timer = 0;

      this.currentStar = newStar;
    },

    gainScore () {
      this.score += 1;

      this.scoreDisplay.string = 'Score: ' + this.score.toString();

      cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver () {
      this.player.active = false;
      this.currentStar.destroy();
      this.running = false;
      this.btn_play.x = 0;
      this.player.stopAllActions();
      //cc.director.loadScene('game');
    },

    update (dt) {
      if (!this.running) {
        return;
      }

      if (this.timer > this.starDuration) {
        this.gameOver();
        return;
      }

      this.timer += dt;

      if (this.score > 100) {

      }
    }
});
