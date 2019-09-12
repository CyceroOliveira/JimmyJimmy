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
      jumpHeight: 0,
      jumpDuration: 0,
      squashDuration: 0,
      maxMoveSpeed: 0,
      accel: 0,

      jumpAudio: {
        default: null,
        type: cc.AudioClip
      }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      this.jumpAction = this.setJumpAction();
      this.node.runAction(this.jumpAction);

      this.accLeft = false;
      this.accRight = false;

      this.xSpeed = 0;

      this.minPosX = (-this.node.parent.width / 2) + 39;
      this.maxPosX = (this.node.parent.width / 2) - 39;

      this.setInputControl();
    },

    playJumpAudio () {
      cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    setJumpAction () {
      var deltaPos = cc.v2(0, this.jumpHeight);
      var easeObj = cc.easeCubicActionOut();
      var jumpUp = cc.moveBy(this.jumpDuration, deltaPos).easing(easeObj);

      deltaPos = cc.v2(0, -this.jumpHeight);
      easeObj = cc.easeCubicActionIn();
      var jumpDown = cc.moveBy(this.jumpDuration, deltaPos).easing(easeObj);

      var callback = cc.callFunc(this.playJumpAudio, this);

      var squash = cc.scaleTo(this.squashDuration, 1, 0.6);
      var stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
      var scaleBack = cc.scaleTo(this.squashDuration, 1, 1);

      var action = cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback);
      return cc.repeatForever(action);
    },

    setInputControl () {
      var self = this;

      cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,

        onKeyPressed (keyCode, event) {
          switch (keyCode) {
            case cc.macro.KEY.a:
              self.accLeft = true;
              self.accRight = false;
              break;
            case cc.macro.KEY.d:
              self.accRight = true;
              self.accLeft = false;
              break;
          }
        },
        onKeyReleased (keyCode, event) {
          switch (keyCode) {
            case cc.macro.KEY.a:
              self.accLeft = false;
              break;
            case cc.macro.KEY.d:
              self.accRight = false;
              break;
          }
        }
      }, self.node);

      cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,

        onTouchBegan (touch, event) {
          var touchLoc = touch.getLocation();

          if (touchLoc.x >= cc.winSize.width / 2) {
            self.accRight = true;
            self.accLeft = false;
          } else {
            self.accLeft = true;
            self.accRight = false;
          }
        },

        ouTouchEnded (touch, event) {
          self.accLeft = false;
          self.accRight = false;
        }
      }, self.node);
    },

    start () {

    },

    update (dt) {
      if (this.accLeft) {
        this.xSpeed -= this.accel * dt;
      } else if (this.accRight) {
        this.xSpeed += this.accel * dt;
      }

      if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
        this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
      }

      this.node.x += this.xSpeed * dt;

      if (this.node.x > this.maxPosX) {
        this.node.x = this.maxPosX;
        this.xSpeed = 0;
      } else if (this.node.x < this.minPosX) {
        this.node.x = this.minPosX;
        this.xSpeed = 0;
      }
    },
});
