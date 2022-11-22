const MissionUtils = require("@woowacourse/mission-utils");
const { makeBridge } = require("./BridgeMaker");
const { generate } = require("./BridgeRandomNumberGenerator");
const InputView = require("./InputView");
const { formatMap } = require("./lib/bridge");
const { FLAG } = require("./lib/constants");
const OutputView = require("./OutputView");

class GameController {
  constructor({ game }) {
    this.game = game;
  }

  play() {
    OutputView.printIntro();

    this.setUpBridge();
  }

  setUpBridge() {
    InputView.readBridgeSize((size) => {
      const bridge = makeBridge(size, generate);

      this.game.setBridge(bridge);
      this.crossBridge();
    });
  }

  crossBridge() {
    InputView.readMoving((direction) => {
      const moved = this.game.move(direction);
      const arrived = this.game.bridge.length === this.game.step;

      OutputView.printMap(formatMap(this.game.map));

      if (moved) arrived ? this.quit() : this.crossBridge();
      if (!moved) this.checkRetry();
    });
  }

  checkRetry() {
    InputView.readGameCommand((command) => {
      if (command === FLAG.RETRY) this.game.retry(this.crossBridge.bind(this));
      if (command === FLAG.QUIT) this.quit();
    });
  }

  quit() {
    MissionUtils.Console.close();
  }
}

module.exports = GameController;
