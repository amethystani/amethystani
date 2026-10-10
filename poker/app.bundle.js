var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// assert-browser.mjs
var assert_browser_exports = {};
__export(assert_browser_exports, {
  default: () => assert
});
function assert(value, message = "Assertion failed") {
  if (!value) throw new Error(message);
}
var init_assert_browser = __esm({
  "assert-browser.mjs"() {
  }
});

// node_modules/poker-ts/dist/lib/card.js
var require_card = __commonJS({
  "node_modules/poker-ts/dist/lib/card.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CardSuit = exports.CardRank = void 0;
    var CardRank;
    (function(CardRank2) {
      CardRank2[CardRank2["_2"] = 0] = "_2";
      CardRank2[CardRank2["_3"] = 1] = "_3";
      CardRank2[CardRank2["_4"] = 2] = "_4";
      CardRank2[CardRank2["_5"] = 3] = "_5";
      CardRank2[CardRank2["_6"] = 4] = "_6";
      CardRank2[CardRank2["_7"] = 5] = "_7";
      CardRank2[CardRank2["_8"] = 6] = "_8";
      CardRank2[CardRank2["_9"] = 7] = "_9";
      CardRank2[CardRank2["T"] = 8] = "T";
      CardRank2[CardRank2["J"] = 9] = "J";
      CardRank2[CardRank2["Q"] = 10] = "Q";
      CardRank2[CardRank2["K"] = 11] = "K";
      CardRank2[CardRank2["A"] = 12] = "A";
    })(CardRank = exports.CardRank || (exports.CardRank = {}));
    var CardSuit;
    (function(CardSuit2) {
      CardSuit2[CardSuit2["CLUBS"] = 0] = "CLUBS";
      CardSuit2[CardSuit2["DIAMONDS"] = 1] = "DIAMONDS";
      CardSuit2[CardSuit2["HEARTS"] = 2] = "HEARTS";
      CardSuit2[CardSuit2["SPADES"] = 3] = "SPADES";
    })(CardSuit = exports.CardSuit || (exports.CardSuit = {}));
    var Card = (
      /** @class */
      (function() {
        function Card2(rank, suit2) {
          this.rank = rank;
          this.suit = suit2;
        }
        Card2.compare = function(c1, c2) {
          var suitDiff = c2.suit - c1.suit;
          if (suitDiff !== 0) {
            return suitDiff;
          }
          return c2.rank - c1.rank;
        };
        return Card2;
      })()
    );
    exports.default = Card;
  }
});

// crypto-browser.mjs
var crypto_browser_exports = {};
__export(crypto_browser_exports, {
  randomInt: () => randomInt
});
function randomInt(max) {
  if (!Number.isSafeInteger(max) || max <= 0) throw new RangeError("max must be a positive safe integer");
  const range = 4294967296;
  const limit = Math.floor(range / max) * max;
  const word = new Uint32Array(1);
  let n;
  do {
    globalThis.crypto.getRandomValues(word);
    n = word[0];
  } while (n >= limit);
  return n % max;
}
var init_crypto_browser = __esm({
  "crypto-browser.mjs"() {
  }
});

// node_modules/poker-ts/dist/util/array.js
var require_array = __commonJS({
  "node_modules/poker-ts/dist/util/array.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findMax = exports.unique = exports.rotate = exports.nextOrWrap = exports.findIndexAdjacent = exports.shuffle = void 0;
    var crypto_1 = (init_crypto_browser(), __toCommonJS(crypto_browser_exports));
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    function shuffle(array) {
      var _a;
      for (var index = array.length - 1; index > 0; index--) {
        var newIndex = crypto_1.randomInt(index + 1);
        _a = [array[newIndex], array[index]], array[index] = _a[0], array[newIndex] = _a[1];
      }
    }
    exports.shuffle = shuffle;
    function findIndexAdjacent(array, predicate) {
      var first = array[0];
      for (var index = 1; index < array.length; index++) {
        var second = array[index];
        if (predicate(first, second)) {
          return index - 1;
        }
        first = second;
      }
      return -1;
    }
    exports.findIndexAdjacent = findIndexAdjacent;
    function nextOrWrap(array, currentIndex) {
      do {
        currentIndex++;
        if (currentIndex === array.length)
          currentIndex = 0;
      } while (array[currentIndex] === null);
      return currentIndex;
    }
    exports.nextOrWrap = nextOrWrap;
    function rotate(array, count) {
      count -= array.length * Math.floor(count / array.length);
      array.push.apply(array, array.splice(0, count));
    }
    exports.rotate = rotate;
    function unique(array, predicate) {
      if (predicate === void 0) {
        predicate = function(first, second) {
          return first !== second;
        };
      }
      if (array.length === 0) {
        return array;
      }
      return array.slice(1).reduce(function(acc, item) {
        if (predicate(acc[acc.length - 1], item)) {
          acc.push(item);
        }
        return acc;
      }, [array[0]]);
    }
    exports.unique = unique;
    function findMax(array, compare) {
      assert_1.default(array.length > 0);
      return array.sort(compare)[0];
    }
    exports.findMax = findMax;
  }
});

// node_modules/poker-ts/dist/lib/deck.js
var require_deck = __commonJS({
  "node_modules/poker-ts/dist/lib/deck.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var card_1 = __importStar(require_card());
    var array_1 = require_array();
    var Deck = (
      /** @class */
      (function(_super) {
        __extends(Deck2, _super);
        function Deck2(shuffleAlgorithm) {
          if (shuffleAlgorithm === void 0) {
            shuffleAlgorithm = array_1.shuffle;
          }
          var _this = _super.call(this) || this;
          Object.setPrototypeOf(_this, Deck2.prototype);
          var index = 0;
          for (var suit2 = card_1.CardSuit.CLUBS; suit2 <= card_1.CardSuit.SPADES; suit2++) {
            for (var rank = card_1.CardRank._2; rank <= card_1.CardRank.A; rank++) {
              _this[index++] = new card_1.default(rank, suit2);
            }
          }
          _this.shuffle = shuffleAlgorithm.bind(null, _this);
          _this._size = 52;
          _this.shuffle();
          return _this;
        }
        Deck2.prototype.fillAndShuffle = function() {
          this._size = 52;
          this.shuffle();
        };
        Deck2.prototype.draw = function() {
          assert_1.default(this._size > 0, "Cannot draw from an empty deck");
          return this[--this._size];
        };
        return Deck2;
      })(Array)
    );
    exports.default = Deck;
  }
});

// node_modules/poker-ts/dist/lib/community-cards.js
var require_community_cards = __commonJS({
  "node_modules/poker-ts/dist/lib/community-cards.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.next = exports.RoundOfBetting = void 0;
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var RoundOfBetting;
    (function(RoundOfBetting2) {
      RoundOfBetting2[RoundOfBetting2["PREFLOP"] = 0] = "PREFLOP";
      RoundOfBetting2[RoundOfBetting2["FLOP"] = 3] = "FLOP";
      RoundOfBetting2[RoundOfBetting2["TURN"] = 4] = "TURN";
      RoundOfBetting2[RoundOfBetting2["RIVER"] = 5] = "RIVER";
    })(RoundOfBetting = exports.RoundOfBetting || (exports.RoundOfBetting = {}));
    var next = function(roundOfBetting) {
      if (roundOfBetting === RoundOfBetting.PREFLOP) {
        return RoundOfBetting.FLOP;
      } else {
        return roundOfBetting + 1;
      }
    };
    exports.next = next;
    var CommunityCards = (
      /** @class */
      (function() {
        function CommunityCards2() {
          this._cards = [];
        }
        CommunityCards2.prototype.cards = function() {
          return this._cards;
        };
        CommunityCards2.prototype.deal = function(cards) {
          assert_1.default(cards.length <= 5 - this._cards.length, "Cannot deal more than there is undealt cards");
          this._cards = this._cards.concat(cards);
        };
        return CommunityCards2;
      })()
    );
    exports.default = CommunityCards;
  }
});

// node_modules/poker-ts/dist/lib/chip-range.js
var require_chip_range = __commonJS({
  "node_modules/poker-ts/dist/lib/chip-range.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChipRange = (
      /** @class */
      (function() {
        function ChipRange2(min, max) {
          this.min = min;
          this.max = max;
        }
        ChipRange2.prototype.contains = function(amount) {
          return this.min <= amount && amount <= this.max;
        };
        return ChipRange2;
      })()
    );
    exports.default = ChipRange;
  }
});

// node_modules/poker-ts/dist/lib/round.js
var require_round = __commonJS({
  "node_modules/poker-ts/dist/lib/round.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Action = void 0;
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var Action;
    (function(Action2) {
      Action2[Action2["LEAVE"] = 1] = "LEAVE";
      Action2[Action2["PASSIVE"] = 2] = "PASSIVE";
      Action2[Action2["AGGRESSIVE"] = 4] = "AGGRESSIVE";
    })(Action = exports.Action || (exports.Action = {}));
    var Round = (
      /** @class */
      (function() {
        function Round2(activePlayers, firstToAct) {
          this._contested = false;
          this._firstAction = true;
          this._numActivePlayers = 0;
          this._activePlayers = activePlayers;
          this._playerToAct = firstToAct;
          this._lastAggressiveActor = firstToAct;
          this._numActivePlayers = activePlayers.filter(function(player) {
            return !!player;
          }).length;
          assert_1.default(firstToAct < activePlayers.length);
        }
        Round2.prototype.activePlayers = function() {
          return this._activePlayers;
        };
        Round2.prototype.playerToAct = function() {
          return this._playerToAct;
        };
        Round2.prototype.lastAggressiveActor = function() {
          return this._lastAggressiveActor;
        };
        Round2.prototype.numActivePlayers = function() {
          return this._numActivePlayers;
        };
        Round2.prototype.inProgress = function() {
          return (this._contested || this._numActivePlayers > 1) && (this._firstAction || this._playerToAct !== this._lastAggressiveActor);
        };
        Round2.prototype.isContested = function() {
          return this._contested;
        };
        Round2.prototype.actionTaken = function(action) {
          assert_1.default(this.inProgress());
          assert_1.default(!(action & Action.PASSIVE && action & Action.AGGRESSIVE));
          if (this._firstAction) {
            this._firstAction = false;
          }
          if (action & Action.AGGRESSIVE) {
            this._lastAggressiveActor = this._playerToAct;
            this._contested = true;
          } else if (action & Action.PASSIVE) {
            this._contested = true;
          }
          if (action & Action.LEAVE) {
            this._activePlayers[this._playerToAct] = false;
            --this._numActivePlayers;
          }
          this.incrementPlayer();
        };
        Round2.prototype.incrementPlayer = function() {
          do {
            ++this._playerToAct;
            if (this._playerToAct === this._activePlayers.length)
              this._playerToAct = 0;
            if (this._playerToAct === this._lastAggressiveActor)
              break;
          } while (!this._activePlayers[this._playerToAct]);
        };
        return Round2;
      })()
    );
    exports.default = Round;
  }
});

// node_modules/poker-ts/dist/lib/betting-round.js
var require_betting_round = __commonJS({
  "node_modules/poker-ts/dist/lib/betting-round.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionRange = exports.Action = void 0;
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var chip_range_1 = __importDefault(require_chip_range());
    var round_1 = __importStar(require_round());
    var Action;
    (function(Action2) {
      Action2[Action2["LEAVE"] = 0] = "LEAVE";
      Action2[Action2["MATCH"] = 1] = "MATCH";
      Action2[Action2["RAISE"] = 2] = "RAISE";
    })(Action = exports.Action || (exports.Action = {}));
    var ActionRange = (
      /** @class */
      /* @__PURE__ */ (function() {
        function ActionRange2(canRaise, chipRange) {
          if (chipRange === void 0) {
            chipRange = new chip_range_1.default(0, 0);
          }
          this.canRaise = canRaise;
          this.chipRange = chipRange;
        }
        return ActionRange2;
      })()
    );
    exports.ActionRange = ActionRange;
    var BettingRound = (
      /** @class */
      (function() {
        function BettingRound2(players, firstToAct, minRaise, biggestBet) {
          if (biggestBet === void 0) {
            biggestBet = 0;
          }
          this._round = new round_1.default(players.map(function(player) {
            return !!player;
          }), firstToAct);
          this._players = players;
          this._biggestBet = biggestBet;
          this._minRaise = minRaise;
          assert_1.default(firstToAct < players.length, "Seat index must be in the valid range");
          assert_1.default(players[firstToAct], "First player to act must exist");
        }
        BettingRound2.prototype.inProgress = function() {
          return this._round.inProgress();
        };
        BettingRound2.prototype.isContested = function() {
          return this._round.isContested();
        };
        BettingRound2.prototype.playerToAct = function() {
          return this._round.playerToAct();
        };
        BettingRound2.prototype.biggestBet = function() {
          return this._biggestBet;
        };
        BettingRound2.prototype.minRaise = function() {
          return this._minRaise;
        };
        BettingRound2.prototype.players = function() {
          var _this = this;
          return this._round.activePlayers().map(function(isActive, index) {
            return isActive ? _this._players[index] : null;
          });
        };
        BettingRound2.prototype.activePlayers = function() {
          return this._round.activePlayers();
        };
        BettingRound2.prototype.numActivePlayers = function() {
          return this._round.numActivePlayers();
        };
        BettingRound2.prototype.legalActions = function() {
          var player = this._players[this._round.playerToAct()];
          assert_1.default(player !== null);
          var playerChips = player.totalChips();
          var canRaise = playerChips > this._biggestBet;
          if (canRaise) {
            var minBet = this._biggestBet + this._minRaise;
            var raiseRange = new chip_range_1.default(Math.min(minBet, playerChips), playerChips);
            return new ActionRange(canRaise, raiseRange);
          } else {
            return new ActionRange(canRaise);
          }
        };
        BettingRound2.prototype.actionTaken = function(action, bet) {
          if (bet === void 0) {
            bet = 0;
          }
          var player = this._players[this._round.playerToAct()];
          assert_1.default(player !== null);
          if (action === Action.RAISE) {
            assert_1.default(this.isRaiseValid(bet));
            player.bet(bet);
            this._minRaise = bet - this._biggestBet;
            this._biggestBet = bet;
            var actionFlag = round_1.Action.AGGRESSIVE;
            if (player.stack() === 0) {
              actionFlag |= round_1.Action.LEAVE;
            }
            this._round.actionTaken(actionFlag);
          } else if (action === Action.MATCH) {
            player.bet(Math.min(this._biggestBet, player.totalChips()));
            var actionFlag = round_1.Action.PASSIVE;
            if (player.stack() === 0) {
              actionFlag |= round_1.Action.LEAVE;
            }
            this._round.actionTaken(actionFlag);
          } else {
            assert_1.default(action === Action.LEAVE);
            this._round.actionTaken(round_1.Action.LEAVE);
          }
        };
        BettingRound2.prototype.isRaiseValid = function(bet) {
          var player = this._players[this._round.playerToAct()];
          assert_1.default(player !== null);
          var playerChips = player.stack() + player.betSize();
          var minBet = this._biggestBet + this._minRaise;
          if (playerChips > this._biggestBet && playerChips < minBet) {
            return bet === playerChips;
          }
          return bet >= minBet && bet <= playerChips;
        };
        return BettingRound2;
      })()
    );
    exports.default = BettingRound;
  }
});

// node_modules/poker-ts/dist/lib/pot.js
var require_pot = __commonJS({
  "node_modules/poker-ts/dist/lib/pot.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var Pot = (
      /** @class */
      (function() {
        function Pot2() {
          this._eligiblePlayers = [];
          this._size = 0;
        }
        Pot2.prototype.size = function() {
          return this._size;
        };
        Pot2.prototype.eligiblePlayers = function() {
          return this._eligiblePlayers;
        };
        Pot2.prototype.add = function(amount) {
          assert_1.default(amount >= 0, "Cannot add a negative amount to the pot");
          this._size += amount;
        };
        Pot2.prototype.collectBetsFrom = function(players) {
          var _this = this;
          var firstBetterIndex = players.findIndex(function(player) {
            var _a;
            return (_a = player === null || player === void 0 ? void 0 : player.betSize()) !== null && _a !== void 0 ? _a : false;
          });
          if (firstBetterIndex === -1) {
            this._eligiblePlayers = players.reduce(function(acc, player, index) {
              if (player !== null)
                acc.push(index);
              return acc;
            }, []);
            return 0;
          } else {
            var firstBetter = players[firstBetterIndex];
            assert_1.default(firstBetter !== null);
            var minBet_1 = players.slice(firstBetterIndex + 1).reduce(function(acc, player) {
              if (player !== null && player.betSize() !== 0 && player.betSize() < acc)
                acc = player.betSize();
              return acc;
            }, firstBetter.betSize());
            this._eligiblePlayers = [];
            players.forEach(function(player, index) {
              if (player !== null && player.betSize() !== 0) {
                player.takeFromBet(minBet_1);
                _this._size += minBet_1;
                _this._eligiblePlayers.push(index);
              }
            });
            return minBet_1;
          }
        };
        return Pot2;
      })()
    );
    exports.default = Pot;
  }
});

// node_modules/poker-ts/dist/lib/pot-manager.js
var require_pot_manager = __commonJS({
  "node_modules/poker-ts/dist/lib/pot-manager.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var pot_1 = __importDefault(require_pot());
    var PotManager = (
      /** @class */
      (function() {
        function PotManager2() {
          this._aggregateFoldedBets = 0;
          this._pots = [new pot_1.default()];
        }
        PotManager2.prototype.pots = function() {
          return this._pots;
        };
        PotManager2.prototype.betFolded = function(amount) {
          this._aggregateFoldedBets += amount;
        };
        PotManager2.prototype.collectBetsForm = function(players) {
          for (; ; ) {
            var minBet = this._pots[this._pots.length - 1].collectBetsFrom(players);
            var numberOfEligiblePlayers = this._pots[this._pots.length - 1].eligiblePlayers().length;
            var aggregateFoldedBetsConsumedAmount = Math.min(this._aggregateFoldedBets, numberOfEligiblePlayers * minBet);
            this._pots[this._pots.length - 1].add(aggregateFoldedBetsConsumedAmount);
            this._aggregateFoldedBets -= aggregateFoldedBetsConsumedAmount;
            if (players.filter(function(player) {
              return player !== null && player.betSize() !== 0;
            }).length) {
              this._pots.push(new pot_1.default());
              continue;
            } else if (this._aggregateFoldedBets !== 0) {
              this._pots[this._pots.length - 1].add(this._aggregateFoldedBets);
              this._aggregateFoldedBets = 0;
            }
            break;
          }
        };
        return PotManager2;
      })()
    );
    exports.default = PotManager;
  }
});

// node_modules/poker-ts/dist/lib/hand.js
var require_hand = __commonJS({
  "node_modules/poker-ts/dist/lib/hand.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandRanking = void 0;
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var card_1 = __importStar(require_card());
    var array_1 = require_array();
    var HandRanking;
    (function(HandRanking2) {
      HandRanking2[HandRanking2["HIGH_CARD"] = 0] = "HIGH_CARD";
      HandRanking2[HandRanking2["PAIR"] = 1] = "PAIR";
      HandRanking2[HandRanking2["TWO_PAIR"] = 2] = "TWO_PAIR";
      HandRanking2[HandRanking2["THREE_OF_A_KIND"] = 3] = "THREE_OF_A_KIND";
      HandRanking2[HandRanking2["STRAIGHT"] = 4] = "STRAIGHT";
      HandRanking2[HandRanking2["FLUSH"] = 5] = "FLUSH";
      HandRanking2[HandRanking2["FULL_HOUSE"] = 6] = "FULL_HOUSE";
      HandRanking2[HandRanking2["FOUR_OF_A_KIND"] = 7] = "FOUR_OF_A_KIND";
      HandRanking2[HandRanking2["STRAIGHT_FLUSH"] = 8] = "STRAIGHT_FLUSH";
      HandRanking2[HandRanking2["ROYAL_FLUSH"] = 9] = "ROYAL_FLUSH";
    })(HandRanking = exports.HandRanking || (exports.HandRanking = {}));
    var Hand = (
      /** @class */
      (function() {
        function Hand2(ranking, strength, cards) {
          assert_1.default(cards.length === 5);
          this._cards = cards;
          this._ranking = ranking;
          this._strength = strength;
        }
        Hand2.create = function(holeCards, communityCards) {
          assert_1.default(communityCards.cards().length === 5, "All community cards must be dealt");
          var cards = __spreadArray(__spreadArray([], holeCards), communityCards.cards());
          return Hand2.of(cards);
        };
        Hand2.of = function(cards) {
          assert_1.default(cards.length === 7);
          var hand1 = Hand2._highLowHandEval(cards);
          var hand2 = Hand2._straightFlushEval(cards);
          if (hand2 !== null) {
            return array_1.findMax([hand1, hand2], Hand2.compare);
          }
          return hand1;
        };
        Hand2.compare = function(h1, h2) {
          var rankingDiff = h2.ranking() - h1.ranking();
          if (rankingDiff !== 0) {
            return rankingDiff;
          }
          return h2.strength() - h1.strength();
        };
        Hand2.nextRank = function(cards) {
          assert_1.default(cards.length !== 0);
          var firstRank = cards[0].rank;
          var secondRankIndex = cards.findIndex(function(card2) {
            return card2.rank !== firstRank;
          });
          return {
            rank: firstRank,
            count: secondRankIndex !== -1 ? secondRankIndex : cards.length
          };
        };
        Hand2.getStrength = function(cards) {
          assert_1.default(cards.length === 5);
          var sum = 0;
          var multiplier = Math.pow(13, 4);
          for (; ; ) {
            var _a = this.nextRank(cards), rank = _a.rank, count = _a.count;
            sum += multiplier * rank;
            cards = cards.slice(count);
            if (cards.length !== 0) {
              multiplier /= 13;
            } else {
              break;
            }
          }
          return sum;
        };
        Hand2.getSuitedCards = function(cards) {
          assert_1.default(cards.length === 7);
          cards.sort(card_1.default.compare);
          var first = 0;
          for (; ; ) {
            var last = cards.slice(first + 1).findIndex(function(card2) {
              return card2.suit !== cards[first].suit;
            });
            if (last === -1) {
              last = cards.length;
            } else {
              last += first + 1;
            }
            if (last - first >= 5) {
              return cards.slice(first, last);
            } else if (last === cards.length) {
              return null;
            }
            first = last;
          }
        };
        Hand2.getStraightCards = function(cards) {
          assert_1.default(cards.length >= 5);
          var first = 0;
          for (; ; ) {
            var last = array_1.findIndexAdjacent(cards.slice(first), function(c1, c2) {
              return c1.rank !== c2.rank + 1;
            });
            if (last === -1) {
              last = cards.length;
            } else {
              last += first + 1;
            }
            if (last - first >= 5) {
              return cards.slice(first, first + 5);
            } else if (last - first === 4) {
              if (cards[first].rank === card_1.CardRank._5 && cards[0].rank === card_1.CardRank.A) {
                array_1.rotate(cards, first);
                return cards.slice(0, 5);
              }
            } else if (cards.length - last < 4) {
              return null;
            }
            first = last;
          }
        };
        Hand2._highLowHandEval = function(cards) {
          assert_1.default(cards.length === 7);
          cards = __spreadArray([], cards);
          var rankOccurrences = new Array(13).fill(0);
          for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
            var card2 = cards_1[_i];
            rankOccurrences[card2.rank] += 1;
          }
          cards.sort(function(c1, c2) {
            if (rankOccurrences[c1.rank] === rankOccurrences[c2.rank]) {
              return c2.rank - c1.rank;
            }
            return rankOccurrences[c2.rank] - rankOccurrences[c1.rank];
          });
          var ranking;
          var count = Hand2.nextRank(cards).count;
          if (count === 4) {
            cards = __spreadArray(__spreadArray([], cards.slice(0, 4)), cards.slice(5).sort(function(c1, c2) {
              return c2.rank - c1.rank;
            }));
            ranking = HandRanking.FOUR_OF_A_KIND;
          } else if (count === 3) {
            var tmp = Hand2.nextRank(cards.slice(-4));
            if (tmp.count === 2) {
              ranking = HandRanking.FULL_HOUSE;
            } else {
              ranking = HandRanking.THREE_OF_A_KIND;
            }
          } else if (count === 2) {
            var tmp = Hand2.nextRank(cards.slice(-5));
            if (tmp.count === 2) {
              ranking = HandRanking.TWO_PAIR;
              var firstPair = cards.slice(0, count);
              var secondPair = cards.slice(count, count + tmp.count);
              var remainingCards = cards.slice(count + tmp.count).sort(function(c1, c2) {
                return c2.rank - c1.rank;
              });
              var kicker = remainingCards[0];
              cards = __spreadArray(__spreadArray(__spreadArray([], firstPair), secondPair), [kicker]);
            } else {
              ranking = HandRanking.PAIR;
            }
          } else {
            ranking = HandRanking.HIGH_CARD;
          }
          var handCards = cards.slice(0, 5);
          var strength = Hand2.getStrength(handCards);
          return new Hand2(ranking, strength, handCards);
        };
        Hand2._straightFlushEval = function(cards) {
          assert_1.default(cards.length === 7);
          cards = __spreadArray([], cards);
          var suitedCards = Hand2.getSuitedCards(cards);
          if (suitedCards !== null) {
            var straightCards = this.getStraightCards(suitedCards);
            if (straightCards !== null) {
              var ranking = void 0;
              var strength = void 0;
              if (straightCards[0].rank === card_1.CardRank.A) {
                ranking = HandRanking.ROYAL_FLUSH;
                strength = 0;
              } else {
                ranking = HandRanking.STRAIGHT_FLUSH;
                strength = straightCards[0].rank;
              }
              var handCards = straightCards.slice(0, 5);
              return new Hand2(ranking, strength, handCards);
            } else {
              var ranking = HandRanking.FLUSH;
              var handCards = suitedCards.slice(0, 5);
              var strength = this.getStrength(handCards);
              return new Hand2(ranking, strength, handCards);
            }
          } else {
            cards.sort(function(c1, c2) {
              return c2.rank - c1.rank;
            });
            cards = array_1.unique(cards, function(c1, c2) {
              return c1.rank !== c2.rank;
            });
            if (cards.length < 5) {
              return null;
            } else {
              var straightCards = this.getStraightCards(cards);
              if (straightCards !== null) {
                var ranking = HandRanking.STRAIGHT;
                var strength = straightCards[0].rank;
                return new Hand2(ranking, strength, straightCards);
              }
            }
          }
          return null;
        };
        Hand2.prototype.ranking = function() {
          return this._ranking;
        };
        Hand2.prototype.strength = function() {
          return this._strength;
        };
        Hand2.prototype.cards = function() {
          return this._cards;
        };
        return Hand2;
      })()
    );
    exports.default = Hand;
  }
});

// node_modules/poker-ts/dist/lib/dealer.js
var require_dealer = __commonJS({
  "node_modules/poker-ts/dist/lib/dealer.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Action = exports.ActionRange = void 0;
    var community_cards_1 = require_community_cards();
    var betting_round_1 = __importStar(require_betting_round());
    var pot_manager_1 = __importDefault(require_pot_manager());
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var hand_1 = __importDefault(require_hand());
    var array_1 = require_array();
    var ActionRange = (
      /** @class */
      (function() {
        function ActionRange2(chipRange) {
          this.action = Action.FOLD;
          this.chipRange = chipRange;
        }
        ActionRange2.prototype.contains = function(action, bet) {
          var _a, _b;
          if (bet === void 0) {
            bet = 0;
          }
          assert_1.default(Dealer.isValid(action), "The action representation must be valid");
          return action && Dealer.isAggressive(action) ? (_b = (_a = this.chipRange) === null || _a === void 0 ? void 0 : _a.contains(bet)) !== null && _b !== void 0 ? _b : false : true;
        };
        return ActionRange2;
      })()
    );
    exports.ActionRange = ActionRange;
    var Action;
    (function(Action2) {
      Action2[Action2["FOLD"] = 1] = "FOLD";
      Action2[Action2["CHECK"] = 2] = "CHECK";
      Action2[Action2["CALL"] = 4] = "CALL";
      Action2[Action2["BET"] = 8] = "BET";
      Action2[Action2["RAISE"] = 16] = "RAISE";
    })(Action = exports.Action || (exports.Action = {}));
    var Dealer = (
      /** @class */
      (function() {
        function Dealer2(players, button, forcedBets, deck, communityCards, numSeats) {
          if (numSeats === void 0) {
            numSeats = 9;
          }
          this._button = 0;
          this._bettingRound = null;
          this._handInProgress = false;
          this._roundOfBetting = community_cards_1.RoundOfBetting.PREFLOP;
          this._bettingRoundsCompleted = false;
          this._players = players;
          this._button = button;
          this._forcedBets = forcedBets;
          this._deck = deck;
          this._communityCards = communityCards;
          this._potManager = new pot_manager_1.default();
          this._holeCards = new Array(numSeats).fill(null);
          this._winners = [];
          assert_1.default(deck.length === 52, "Deck must be whole");
          assert_1.default(communityCards.cards().length === 0, "No community cards should have been dealt");
        }
        Dealer2.isValid = function(action) {
          action = action - (action >> 1 & 1431655765);
          action = (action & 858993459) + (action >> 2 & 858993459);
          var bitCount = (action + (action >> 4) & 252645135) * 16843009 >> 24;
          return bitCount === 1;
        };
        Dealer2.isAggressive = function(action) {
          return !!(action & Action.BET) || !!(action & Action.RAISE);
        };
        Dealer2.prototype.handInProgress = function() {
          return this._handInProgress;
        };
        Dealer2.prototype.bettingRoundsCompleted = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          return this._bettingRoundsCompleted;
        };
        Dealer2.prototype.playerToAct = function() {
          assert_1.default(this.bettingRoundInProgress(), "Betting round must be in progress");
          assert_1.default(this._bettingRound !== null);
          return this._bettingRound.playerToAct();
        };
        Dealer2.prototype.players = function() {
          var _a, _b;
          return (_b = (_a = this._bettingRound) === null || _a === void 0 ? void 0 : _a.players()) !== null && _b !== void 0 ? _b : [];
        };
        Dealer2.prototype.bettingRoundPlayers = function() {
          return this._players;
        };
        Dealer2.prototype.roundOfBetting = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          return this._roundOfBetting;
        };
        Dealer2.prototype.numActivePlayers = function() {
          var _a, _b;
          return (_b = (_a = this._bettingRound) === null || _a === void 0 ? void 0 : _a.numActivePlayers()) !== null && _b !== void 0 ? _b : 0;
        };
        Dealer2.prototype.biggestBet = function() {
          var _a, _b;
          return (_b = (_a = this._bettingRound) === null || _a === void 0 ? void 0 : _a.biggestBet()) !== null && _b !== void 0 ? _b : 0;
        };
        Dealer2.prototype.bettingRoundInProgress = function() {
          var _a, _b;
          return (_b = (_a = this._bettingRound) === null || _a === void 0 ? void 0 : _a.inProgress()) !== null && _b !== void 0 ? _b : false;
        };
        Dealer2.prototype.isContested = function() {
          var _a, _b;
          return (_b = (_a = this._bettingRound) === null || _a === void 0 ? void 0 : _a.isContested()) !== null && _b !== void 0 ? _b : false;
        };
        Dealer2.prototype.legalActions = function() {
          assert_1.default(this.bettingRoundInProgress(), "Betting round must be in progress");
          assert_1.default(this._bettingRound !== null);
          var player = this._players[this._bettingRound.playerToAct()];
          var actions = this._bettingRound.legalActions();
          var actionRange = new ActionRange(actions.chipRange);
          assert_1.default(player !== null);
          if (this._bettingRound.biggestBet() - player.betSize() === 0) {
            actionRange.action |= Action.CHECK;
            if (actions.canRaise) {
              if (player.betSize() > 0) {
                actionRange.action |= Action.RAISE;
              } else {
                actionRange.action |= Action.BET;
              }
            }
          } else {
            actionRange.action |= Action.CALL;
            if (actions.canRaise) {
              actionRange.action |= Action.RAISE;
            }
          }
          return actionRange;
        };
        Dealer2.prototype.pots = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          return this._potManager.pots();
        };
        Dealer2.prototype.button = function() {
          return this._button;
        };
        Dealer2.prototype.holeCards = function() {
          assert_1.default(this.handInProgress() || this.bettingRoundInProgress(), "Hand must be in progress or showdown must have ended");
          return this._holeCards;
        };
        Dealer2.prototype.startHand = function() {
          assert_1.default(!this.handInProgress(), "Hand must not be in progress");
          this._bettingRoundsCompleted = false;
          this._roundOfBetting = community_cards_1.RoundOfBetting.PREFLOP;
          this._winners = [];
          this.collectAnte();
          var bigBlindSeat = this.postBlinds();
          var firstAction = this.nextOrWrap(bigBlindSeat);
          this.dealHoleCards();
          if (this._players.filter(function(player, seat) {
            return player !== null && (player.stack() !== 0 || seat === bigBlindSeat);
          }).length > 1) {
            this._bettingRound = new betting_round_1.default(__spreadArray([], this._players), firstAction, this._forcedBets.blinds.big, this._forcedBets.blinds.big);
          }
          this._handInProgress = true;
        };
        Dealer2.prototype.actionTaken = function(action, bet) {
          assert_1.default(this.bettingRoundInProgress(), "Betting round must be in progress");
          assert_1.default(this.legalActions().contains(action, bet), "Action must be legal");
          assert_1.default(this._bettingRound !== null);
          if (action & Action.CHECK || action & Action.CALL) {
            this._bettingRound.actionTaken(betting_round_1.Action.MATCH);
          } else if (action & Action.BET || action & Action.RAISE) {
            this._bettingRound.actionTaken(betting_round_1.Action.RAISE, bet);
          } else {
            assert_1.default(action & Action.FOLD);
            var foldingPlayer = this._players[this.playerToAct()];
            assert_1.default(foldingPlayer !== null);
            this._potManager.betFolded(foldingPlayer.betSize());
            foldingPlayer.takeFromBet(foldingPlayer.betSize());
            this._players[this.playerToAct()] = null;
            this._bettingRound.actionTaken(betting_round_1.Action.LEAVE);
          }
        };
        Dealer2.prototype.endBettingRound = function() {
          var _a, _b, _c, _d;
          assert_1.default(!this._bettingRoundsCompleted, "Betting rounds must not be completed");
          assert_1.default(!this.bettingRoundInProgress(), "Betting round must not be in progress");
          this._potManager.collectBetsForm(this._players);
          if (((_b = (_a = this._bettingRound) === null || _a === void 0 ? void 0 : _a.numActivePlayers()) !== null && _b !== void 0 ? _b : 0) <= 1) {
            this._roundOfBetting = community_cards_1.RoundOfBetting.RIVER;
            if (this._potManager.pots().length === 1 && this._potManager.pots()[0].eligiblePlayers().length === 1) {
            } else {
              this.dealCommunityCards();
            }
            this._bettingRoundsCompleted = true;
          } else if (this._roundOfBetting < community_cards_1.RoundOfBetting.RIVER) {
            this._roundOfBetting = community_cards_1.next(this._roundOfBetting);
            this._players = (_d = (_c = this._bettingRound) === null || _c === void 0 ? void 0 : _c.players()) !== null && _d !== void 0 ? _d : [];
            this._bettingRound = new betting_round_1.default(__spreadArray([], this._players), this.nextOrWrap(this._button), this._forcedBets.blinds.big);
            this.dealCommunityCards();
            assert_1.default(!this._bettingRoundsCompleted);
          } else {
            assert_1.default(this._roundOfBetting === community_cards_1.RoundOfBetting.RIVER);
            this._bettingRoundsCompleted = true;
          }
        };
        Dealer2.prototype.winners = function() {
          assert_1.default(!this.handInProgress(), "Hand must not be in progress");
          return this._winners;
        };
        Dealer2.prototype.showdown = function() {
          var _this = this;
          assert_1.default(this._roundOfBetting === community_cards_1.RoundOfBetting.RIVER, "Round of betting must be river");
          assert_1.default(!this.bettingRoundInProgress(), "Betting round must not be in progress");
          assert_1.default(this.bettingRoundsCompleted(), "Betting rounds must be completed");
          this._handInProgress = false;
          if (this._potManager.pots().length === 1 && this._potManager.pots()[0].eligiblePlayers().length === 1) {
            var index = this._potManager.pots()[0].eligiblePlayers()[0];
            var player = this._players[index];
            assert_1.default(player !== null);
            player.addToStack(this._potManager.pots()[0].size());
            return;
          }
          var _loop_1 = function(pot2) {
            var playerResults = pot2.eligiblePlayers().map(function(seatIndex) {
              return [seatIndex, hand_1.default.create(_this._holeCards[seatIndex], _this._communityCards)];
            });
            playerResults.sort(function(_a2, _b) {
              var first = _a2[1];
              var second = _b[1];
              return hand_1.default.compare(first, second);
            });
            var lastWinnerIndex = array_1.findIndexAdjacent(playerResults, function(_a2, _b) {
              var first = _a2[1];
              var second = _b[1];
              return hand_1.default.compare(first, second) !== 0;
            });
            var numberOfWinners = lastWinnerIndex === -1 ? playerResults.length : lastWinnerIndex + 1;
            var oddChips = pot2.size() % numberOfWinners;
            var payout = (pot2.size() - oddChips) / numberOfWinners;
            var winningPlayerResults = playerResults.slice(0, numberOfWinners);
            winningPlayerResults.forEach(function(playerResult) {
              var _a2;
              var seatIndex = playerResult[0];
              (_a2 = _this._players[seatIndex]) === null || _a2 === void 0 ? void 0 : _a2.addToStack(payout);
            });
            this_1._winners.push(winningPlayerResults.map(function(playerResult) {
              var seatIndex = playerResult[0];
              var holeCards = _this._holeCards[seatIndex];
              return __spreadArray(__spreadArray([], playerResult), [holeCards]);
            }));
            if (oddChips !== 0) {
              var winners_1 = new Array(this_1._players.length).fill(null);
              winningPlayerResults.forEach(function(playerResult) {
                var seatIndex = playerResult[0];
                winners_1[seatIndex] = _this._players[seatIndex];
              });
              var seat = this_1._button;
              while (oddChips !== 0) {
                seat = array_1.nextOrWrap(winners_1, seat);
                var winner = winners_1[seat];
                assert_1.default(winner !== null);
                winner.addToStack(1);
                oddChips--;
              }
            }
          };
          var this_1 = this;
          for (var _i = 0, _a = this._potManager.pots(); _i < _a.length; _i++) {
            var pot = _a[_i];
            _loop_1(pot);
          }
        };
        Dealer2.prototype.nextOrWrap = function(seat) {
          return array_1.nextOrWrap(this._players, seat);
        };
        Dealer2.prototype.collectAnte = function() {
          if (this._forcedBets.ante === void 0) {
            return;
          }
          var total = 0;
          for (var _i = 0, _a = this._players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player !== null) {
              var ante = Math.min(this._forcedBets.ante, player.totalChips());
              player.takeFromStack(ante);
              total += ante;
            }
          }
          this._potManager.pots()[0].add(total);
        };
        Dealer2.prototype.postBlinds = function() {
          var seat = this._button;
          var numPlayers = this._players.filter(function(player) {
            return player !== null;
          }).length;
          if (numPlayers !== 2) {
            seat = this.nextOrWrap(seat);
          }
          var smallBlind = this._players[seat];
          assert_1.default(smallBlind !== null);
          smallBlind.bet(Math.min(this._forcedBets.blinds.small, smallBlind.totalChips()));
          seat = this.nextOrWrap(seat);
          var bigBlind = this._players[seat];
          assert_1.default(bigBlind !== null);
          bigBlind.bet(Math.min(this._forcedBets.blinds.big, bigBlind.totalChips()));
          return seat;
        };
        Dealer2.prototype.dealHoleCards = function() {
          var _this = this;
          this._players.forEach(function(player, index) {
            if (player !== null) {
              _this._holeCards[index] = [_this._deck.draw(), _this._deck.draw()];
            }
          });
        };
        Dealer2.prototype.dealCommunityCards = function() {
          var cards = [];
          var numCardsToDeal = this._roundOfBetting - this._communityCards.cards().length;
          for (var index = 0; index < numCardsToDeal; index++) {
            cards.push(this._deck.draw());
          }
          this._communityCards.deal(cards);
        };
        return Dealer2;
      })()
    );
    exports.default = Dealer;
  }
});

// node_modules/poker-ts/dist/util/bit.js
var require_bit = __commonJS({
  "node_modules/poker-ts/dist/util/bit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bitCount = void 0;
    function bitCount(n) {
      n = n - (n >> 1 & 1431655765);
      n = (n & 858993459) + (n >> 2 & 858993459);
      return (n + (n >> 4) & 252645135) * 16843009 >> 24;
    }
    exports.bitCount = bitCount;
  }
});

// node_modules/poker-ts/dist/type-guards/chips.js
var require_chips = __commonJS({
  "node_modules/poker-ts/dist/type-guards/chips.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isChips = void 0;
    function isChips(chips) {
      return typeof chips === "number";
    }
    exports.isChips = isChips;
  }
});

// node_modules/poker-ts/dist/lib/player.js
var require_player = __commonJS({
  "node_modules/poker-ts/dist/lib/player.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var chips_1 = require_chips();
    var Player = (
      /** @class */
      (function() {
        function Player2(arg) {
          this._total = 0;
          this._betSize = 0;
          if (chips_1.isChips(arg)) {
            this._total = arg;
          } else if (arg instanceof Player2) {
            this._total = arg._total;
            this._betSize = arg._betSize;
          } else {
            throw new Error("Invalid argument");
          }
        }
        Player2.prototype.stack = function() {
          return this._total - this._betSize;
        };
        Player2.prototype.betSize = function() {
          return this._betSize;
        };
        Player2.prototype.totalChips = function() {
          return this._total;
        };
        Player2.prototype.addToStack = function(amount) {
          this._total += amount;
        };
        Player2.prototype.takeFromStack = function(amount) {
          this._total -= amount;
        };
        Player2.prototype.bet = function(amount) {
          assert_1.default(amount <= this._total, "Player cannot bet more than he/she has");
          assert_1.default(amount >= this._betSize, "Player must bet more than he/she has previously");
          this._betSize = amount;
        };
        Player2.prototype.takeFromBet = function(amount) {
          assert_1.default(amount <= this._betSize, "Cannot take from bet more than is there");
          this._total -= amount;
          this._betSize -= amount;
        };
        return Player2;
      })()
    );
    exports.default = Player;
  }
});

// node_modules/poker-ts/dist/lib/table.js
var require_table = __commonJS({
  "node_modules/poker-ts/dist/lib/table.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AutomaticAction = void 0;
    var deck_1 = __importDefault(require_deck());
    var community_cards_1 = __importDefault(require_community_cards());
    var dealer_1 = __importStar(require_dealer());
    var assert_1 = __importDefault((init_assert_browser(), __toCommonJS(assert_browser_exports)));
    var bit_1 = require_bit();
    var player_1 = __importDefault(require_player());
    var AutomaticAction;
    (function(AutomaticAction2) {
      AutomaticAction2[AutomaticAction2["FOLD"] = 1] = "FOLD";
      AutomaticAction2[AutomaticAction2["CHECK_FOLD"] = 2] = "CHECK_FOLD";
      AutomaticAction2[AutomaticAction2["CHECK"] = 4] = "CHECK";
      AutomaticAction2[AutomaticAction2["CALL"] = 8] = "CALL";
      AutomaticAction2[AutomaticAction2["CALL_ANY"] = 16] = "CALL_ANY";
      AutomaticAction2[AutomaticAction2["ALL_IN"] = 32] = "ALL_IN";
    })(AutomaticAction = exports.AutomaticAction || (exports.AutomaticAction = {}));
    var Table = (
      /** @class */
      (function() {
        function Table2(forcedBets, numSeats) {
          if (numSeats === void 0) {
            numSeats = 9;
          }
          this._firstTimeButton = true;
          this._buttonSetManually = false;
          this._button = 0;
          assert_1.default(numSeats <= 23, "Maximum 23 players");
          this._numSeats = numSeats;
          this._forcedBets = forcedBets;
          this._tablePlayers = new Array(numSeats).fill(null);
          this._staged = new Array(numSeats).fill(false);
          this._deck = new deck_1.default();
        }
        Table2.prototype.playerToAct = function() {
          assert_1.default(this.bettingRoundInProgress(), "Betting round must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.playerToAct();
        };
        Table2.prototype.button = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.button();
        };
        Table2.prototype.seats = function() {
          return this._tablePlayers;
        };
        Table2.prototype.handPlayers = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.players();
        };
        Table2.prototype.numActivePlayers = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.numActivePlayers();
        };
        Table2.prototype.pots = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.pots();
        };
        Table2.prototype.forcedBets = function() {
          return this._forcedBets;
        };
        Table2.prototype.setForcedBets = function(forcedBets) {
          assert_1.default(!this.handInProgress(), "Hand must not be in progress");
          this._forcedBets = forcedBets;
        };
        Table2.prototype.numSeats = function() {
          return this._numSeats;
        };
        Table2.prototype.startHand = function(seat) {
          assert_1.default(!this.handInProgress(), "Hand must not be in progress");
          assert_1.default(this._tablePlayers.filter(function(player) {
            return player !== null;
          }).length >= 2, "There must be at least 2 players at the table");
          if (seat !== void 0) {
            this._button = seat;
            this._buttonSetManually = true;
          }
          this._staged = new Array(this._numSeats).fill(false);
          this._automaticActions = new Array(this._numSeats).fill(null);
          this._handPlayers = this._tablePlayers.map(function(player) {
            return player ? new player_1.default(player) : null;
          });
          this.incrementButton();
          this._deck.fillAndShuffle();
          this._communityCards = new community_cards_1.default();
          this._dealer = new dealer_1.default(this._handPlayers, this._button, this._forcedBets, this._deck, this._communityCards);
          this._dealer.startHand();
          this.updateTablePlayers();
        };
        Table2.prototype.handInProgress = function() {
          var _a, _b;
          return (_b = (_a = this._dealer) === null || _a === void 0 ? void 0 : _a.handInProgress()) !== null && _b !== void 0 ? _b : false;
        };
        Table2.prototype.bettingRoundInProgress = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.bettingRoundInProgress();
        };
        Table2.prototype.bettingRoundsCompleted = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.bettingRoundsCompleted();
        };
        Table2.prototype.roundOfBetting = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.roundOfBetting();
        };
        Table2.prototype.communityCards = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._communityCards !== void 0);
          return this._communityCards;
        };
        Table2.prototype.legalActions = function() {
          assert_1.default(this.bettingRoundInProgress(), "Betting round must be in progress");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.legalActions();
        };
        Table2.prototype.holeCards = function() {
          assert_1.default(this.handInProgress() || this.bettingRoundsCompleted(), "Hand must be in progress or showdown must have ended");
          assert_1.default(this._dealer !== void 0);
          return this._dealer.holeCards();
        };
        Table2.prototype.actionTaken = function(action, bet) {
          assert_1.default(this.bettingRoundInProgress(), "Betting round must be in progress");
          assert_1.default(this._dealer !== void 0);
          assert_1.default(this._automaticActions !== void 0);
          this._dealer.actionTaken(action, bet);
          while (this._dealer.bettingRoundInProgress()) {
            this.amendAutomaticActions();
            var playerToAct = this.playerToAct();
            var automaticAction = this._automaticActions[playerToAct];
            if (automaticAction !== null) {
              this.takeAutomaticAction(automaticAction);
              this._automaticActions[playerToAct] = null;
            } else {
              break;
            }
          }
          if (this.bettingRoundInProgress() && this.singleActivePlayerRemaining()) {
            this.actPassively();
          }
          this.updateTablePlayers();
        };
        Table2.prototype.endBettingRound = function() {
          assert_1.default(!this.bettingRoundInProgress(), "Betting round must not be in progress");
          assert_1.default(!this.bettingRoundsCompleted(), "Betting rounds must not be completed");
          assert_1.default(this._dealer !== void 0);
          this._dealer.endBettingRound();
          this.amendAutomaticActions();
          this.updateTablePlayers();
          this.clearFoldedBets();
        };
        Table2.prototype.showdown = function() {
          assert_1.default(!this.bettingRoundInProgress(), "Betting round must not be in progress");
          assert_1.default(this.bettingRoundsCompleted(), "Betting rounds must be completed");
          assert_1.default(this._dealer !== void 0);
          this._dealer.showdown();
          this.updateTablePlayers();
          this.standUpBustedPlayers();
        };
        Table2.prototype.winners = function() {
          var _a, _b;
          assert_1.default(!this.handInProgress(), "Hand must not be in progress");
          return (_b = (_a = this._dealer) === null || _a === void 0 ? void 0 : _a.winners()) !== null && _b !== void 0 ? _b : [];
        };
        Table2.prototype.automaticActions = function() {
          assert_1.default(this.handInProgress(), "Hand must be in progress");
          assert_1.default(this._automaticActions !== void 0);
          return this._automaticActions;
        };
        Table2.prototype.canSetAutomaticAction = function(seat) {
          assert_1.default(this.bettingRoundInProgress(), "Betting round must be in progress");
          assert_1.default(this._staged !== void 0);
          return !this._staged[seat] && this._tablePlayers[seat] !== null;
        };
        Table2.prototype.legalAutomaticActions = function(seat) {
          assert_1.default(this.canSetAutomaticAction(seat), "Player must be allowed to set automatic actions");
          assert_1.default(this._dealer !== void 0);
          var biggestBet = this._dealer.biggestBet();
          var player = this._tablePlayers[seat];
          assert_1.default(player !== null);
          var betSize = player.betSize();
          var totalChips = player.totalChips();
          var legalActions = AutomaticAction.FOLD | AutomaticAction.ALL_IN;
          var canCheck = biggestBet - betSize === 0;
          if (canCheck) {
            legalActions |= AutomaticAction.CHECK_FOLD | AutomaticAction.CHECK;
          } else {
            legalActions |= AutomaticAction.CALL;
          }
          if (biggestBet < totalChips) {
            legalActions |= AutomaticAction.CALL_ANY;
          }
          return legalActions;
        };
        Table2.prototype.setAutomaticAction = function(seat, action) {
          assert_1.default(this.canSetAutomaticAction(seat), "Player must be allowed to set automatic actions");
          assert_1.default(seat !== this.playerToAct(), "Player must not be the player to act");
          assert_1.default(action === null || bit_1.bitCount(action) === 1, "Player must pick one automatic action or null");
          assert_1.default(action === null || action & this.legalAutomaticActions(seat), "Given automatic action must be legal");
          assert_1.default(this._automaticActions !== void 0);
          this._automaticActions[seat] = action;
        };
        Table2.prototype.sitDown = function(seat, buyIn) {
          assert_1.default(seat < this._numSeats && seat >= 0, "Given seat index must be valid");
          assert_1.default(this._tablePlayers[seat] === null, "Given seat must not be occupied");
          this._tablePlayers[seat] = new player_1.default(buyIn);
          this._staged[seat] = true;
        };
        Table2.prototype.standUp = function(seat) {
          assert_1.default(seat < this._numSeats && seat >= 0, "Given seat index must be valid");
          assert_1.default(this._tablePlayers[seat] !== null, "Given seat must be occupied");
          if (this.handInProgress()) {
            assert_1.default(this.bettingRoundInProgress());
            assert_1.default(this._handPlayers !== void 0);
            if (seat === this.playerToAct()) {
              this.actionTaken(dealer_1.Action.FOLD);
              this._tablePlayers[seat] = null;
              this._staged[seat] = true;
            } else if (this._handPlayers[seat] !== null) {
              this.setAutomaticAction(seat, AutomaticAction.FOLD);
              this._tablePlayers[seat] = null;
              this._staged[seat] = true;
              if (this.singleActivePlayerRemaining()) {
                this.actPassively();
              }
            }
          } else {
            this._tablePlayers[seat] = null;
          }
        };
        Table2.prototype.takeAutomaticAction = function(automaticAction) {
          assert_1.default(this._dealer !== void 0);
          assert_1.default(this._handPlayers !== void 0);
          var player = this._handPlayers[this._dealer.playerToAct()];
          assert_1.default(player !== null);
          var biggestBet = this._dealer.biggestBet();
          var betGap = biggestBet - player.betSize();
          var totalChips = player.totalChips();
          switch (automaticAction) {
            case AutomaticAction.FOLD:
              return this._dealer.actionTaken(dealer_1.Action.FOLD);
            case AutomaticAction.CHECK_FOLD:
              return this._dealer.actionTaken(betGap === 0 ? dealer_1.Action.CHECK : dealer_1.Action.FOLD);
            case AutomaticAction.CHECK:
              return this._dealer.actionTaken(dealer_1.Action.CHECK);
            case AutomaticAction.CALL:
              return this._dealer.actionTaken(dealer_1.Action.CALL);
            case AutomaticAction.CALL_ANY:
              return this._dealer.actionTaken(betGap === 0 ? dealer_1.Action.CHECK : dealer_1.Action.CALL);
            case AutomaticAction.ALL_IN:
              if (totalChips < biggestBet) {
                return this._dealer.actionTaken(dealer_1.Action.CALL);
              }
              return this._dealer.actionTaken(dealer_1.Action.RAISE, totalChips);
            default:
              assert_1.default(false);
          }
        };
        Table2.prototype.amendAutomaticActions = function() {
          assert_1.default(this._dealer !== void 0);
          assert_1.default(this._automaticActions !== void 0);
          assert_1.default(this._handPlayers !== void 0);
          var biggestBet = this._dealer.biggestBet();
          for (var s = 0; s < this._numSeats; s++) {
            var automaticAction = this._automaticActions[s];
            if (automaticAction !== null) {
              var player = this._handPlayers[s];
              assert_1.default(player !== null);
              var isContested = this._dealer.isContested();
              var betGap = biggestBet - player.betSize();
              var totalChips = player.totalChips();
              if (automaticAction & AutomaticAction.CHECK_FOLD && betGap > 0) {
                this._automaticActions[s] = AutomaticAction.FOLD;
              } else if (automaticAction & AutomaticAction.CHECK && betGap > 0) {
                this._automaticActions[s] = null;
              } else if (automaticAction & AutomaticAction.CALL_ANY && biggestBet >= totalChips) {
                this._automaticActions[s] = AutomaticAction.CALL;
              }
            }
          }
        };
        Table2.prototype.actPassively = function() {
          assert_1.default(this._dealer !== void 0);
          var legalActions = this._dealer.legalActions();
          if (legalActions.action & dealer_1.Action.BET) {
            this.actionTaken(dealer_1.Action.CHECK);
          } else {
            assert_1.default(legalActions.action & dealer_1.Action.CALL);
            this.actionTaken(dealer_1.Action.CALL);
          }
        };
        Table2.prototype.incrementButton = function() {
          assert_1.default(this._handPlayers !== void 0);
          if (this._buttonSetManually) {
            this._buttonSetManually = false;
            this._firstTimeButton = false;
            this._button = this._handPlayers[this._button] ? this._button : this._handPlayers.findIndex(function(player) {
              return player !== null;
            });
            assert_1.default(this._button !== -1);
          } else if (this._firstTimeButton) {
            var seat = this._handPlayers.findIndex(function(player) {
              return player !== null;
            });
            assert_1.default(seat !== -1);
            this._button = seat;
            this._firstTimeButton = false;
          } else {
            var offset = this._button + 1;
            var seat = this._handPlayers.slice(offset).findIndex(function(player) {
              return player !== null;
            });
            this._button = seat !== -1 ? seat + offset : this._handPlayers.findIndex(function(player) {
              return player !== null;
            });
          }
        };
        Table2.prototype.clearFoldedBets = function() {
          assert_1.default(this._handPlayers !== void 0);
          for (var s = 0; s < this._numSeats; s++) {
            var handPlayer = this._handPlayers[s];
            var tablePlayer = this._tablePlayers[s];
            if (!this._staged[s] && handPlayer === null && tablePlayer !== null && tablePlayer.betSize() > 0) {
              assert_1.default(this._tablePlayers[s] !== null);
              this._tablePlayers[s] = new player_1.default(tablePlayer.stack());
            }
          }
        };
        Table2.prototype.updateTablePlayers = function() {
          assert_1.default(this._handPlayers !== void 0);
          for (var s = 0; s < this._numSeats; s++) {
            var handPlayer = this._handPlayers[s];
            if (!this._staged[s] && handPlayer !== null) {
              assert_1.default(this._tablePlayers[s] !== null);
              this._tablePlayers[s] = new player_1.default(handPlayer);
            }
          }
        };
        Table2.prototype.singleActivePlayerRemaining = function() {
          var _this = this;
          assert_1.default(this.bettingRoundInProgress());
          assert_1.default(this._dealer !== void 0);
          var bettingRoundPlayers = this._dealer.bettingRoundPlayers();
          var activePlayers = bettingRoundPlayers.filter(function(player, index) {
            return player !== null && !_this._staged[index];
          });
          return activePlayers.length === 1;
        };
        Table2.prototype.standUpBustedPlayers = function() {
          assert_1.default(!this.handInProgress());
          for (var s = 0; s < this._numSeats; s++) {
            var player = this._tablePlayers[s];
            if (player !== null && player.totalChips() === 0) {
              this._tablePlayers[s] = null;
            }
          }
        };
        return Table2;
      })()
    );
    exports.default = Table;
  }
});

// node_modules/poker-ts/dist/facade/poker.js
var require_poker = __commonJS({
  "node_modules/poker-ts/dist/facade/poker.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var table_1 = __importStar(require_table());
    var community_cards_1 = require_community_cards();
    var card_1 = require_card();
    var dealer_1 = require_dealer();
    var cardMapper = function(card2) {
      return {
        // @ts-ignore
        rank: card_1.CardRank[card2.rank].replace(/^_/, ""),
        // @ts-ignore
        suit: card_1.CardSuit[card2.suit].toLowerCase()
      };
    };
    var seatArrayMapper = function(player) {
      return player === null ? null : {
        totalChips: player.totalChips(),
        stack: player.stack(),
        betSize: player.betSize()
      };
    };
    var actionFlagToStringArray = function(actionFlag) {
      var actions = [];
      if (actionFlag & dealer_1.Action.FOLD)
        actions.push("fold");
      if (actionFlag & dealer_1.Action.CHECK)
        actions.push("check");
      if (actionFlag & dealer_1.Action.CALL)
        actions.push("call");
      if (actionFlag & dealer_1.Action.BET)
        actions.push("bet");
      if (actionFlag & dealer_1.Action.RAISE)
        actions.push("raise");
      return actions;
    };
    var automaticActionFlagToStringArray = function(automaticActionFlag) {
      var automaticActions = [];
      if (automaticActionFlag & table_1.AutomaticAction.FOLD)
        automaticActions.push("fold");
      if (automaticActionFlag & table_1.AutomaticAction.CHECK_FOLD)
        automaticActions.push("check/fold");
      if (automaticActionFlag & table_1.AutomaticAction.CHECK)
        automaticActions.push("check");
      if (automaticActionFlag & table_1.AutomaticAction.CALL)
        automaticActions.push("call");
      if (automaticActionFlag & table_1.AutomaticAction.CALL_ANY)
        automaticActions.push("call any");
      if (automaticActionFlag & table_1.AutomaticAction.ALL_IN)
        automaticActions.push("all-in");
      return automaticActions;
    };
    var stringToAutomaticActionFlag = function(automaticAction) {
      switch (automaticAction) {
        case "fold":
          return table_1.AutomaticAction.FOLD;
        case "check/fold":
          return table_1.AutomaticAction.CHECK_FOLD;
        case "check":
          return table_1.AutomaticAction.CHECK;
        case "call":
          return table_1.AutomaticAction.CALL;
        case "call any":
          return table_1.AutomaticAction.CALL_ANY;
        case "all-in":
          return table_1.AutomaticAction.ALL_IN;
      }
    };
    var Poker2 = (
      /** @class */
      (function() {
        function Poker3(forcedBets, numSeats) {
          var ante = forcedBets.ante, big = forcedBets.bigBlind, small = forcedBets.smallBlind;
          this._table = new table_1.default({ ante, blinds: { big, small } }, numSeats);
        }
        Poker3.prototype.playerToAct = function() {
          return this._table.playerToAct();
        };
        Poker3.prototype.button = function() {
          return this._table.button();
        };
        Poker3.prototype.seats = function() {
          return this._table.seats().map(seatArrayMapper);
        };
        Poker3.prototype.handPlayers = function() {
          return this._table.handPlayers().map(seatArrayMapper);
        };
        Poker3.prototype.numActivePlayers = function() {
          return this._table.numActivePlayers();
        };
        Poker3.prototype.pots = function() {
          return this._table.pots().map(function(pot) {
            return {
              size: pot.size(),
              eligiblePlayers: pot.eligiblePlayers()
            };
          });
        };
        Poker3.prototype.forcedBets = function() {
          var _a = this._table.forcedBets(), _b = _a.ante, ante = _b === void 0 ? 0 : _b, _c = _a.blinds, bigBlind = _c.big, smallBlind = _c.small;
          return {
            ante,
            smallBlind,
            bigBlind
          };
        };
        Poker3.prototype.setForcedBets = function(forcedBets) {
          var ante = forcedBets.ante, big = forcedBets.bigBlind, small = forcedBets.smallBlind;
          this._table.setForcedBets({ ante, blinds: { small, big } });
        };
        Poker3.prototype.numSeats = function() {
          return this._table.numSeats();
        };
        Poker3.prototype.startHand = function(seat) {
          this._table.startHand(seat);
        };
        Poker3.prototype.isHandInProgress = function() {
          return this._table.handInProgress();
        };
        Poker3.prototype.isBettingRoundInProgress = function() {
          return this._table.bettingRoundInProgress();
        };
        Poker3.prototype.areBettingRoundsCompleted = function() {
          return this._table.bettingRoundsCompleted();
        };
        Poker3.prototype.roundOfBetting = function() {
          var rob = this._table.roundOfBetting();
          return community_cards_1.RoundOfBetting[rob].toLowerCase();
        };
        Poker3.prototype.communityCards = function() {
          return this._table.communityCards().cards().map(cardMapper);
        };
        Poker3.prototype.legalActions = function() {
          var _a = this._table.legalActions(), action = _a.action, chipRange = _a.chipRange;
          return {
            actions: actionFlagToStringArray(action),
            chipRange
          };
        };
        Poker3.prototype.holeCards = function() {
          return this._table.holeCards().map(function(cards) {
            return cards === null ? null : cards.map(cardMapper);
          });
        };
        Poker3.prototype.actionTaken = function(action, betSize) {
          this._table.actionTaken(dealer_1.Action[action.toUpperCase()], betSize);
        };
        Poker3.prototype.endBettingRound = function() {
          this._table.endBettingRound();
        };
        Poker3.prototype.showdown = function() {
          this._table.showdown();
        };
        Poker3.prototype.winners = function() {
          return this._table.winners().map(function(potWinners) {
            return potWinners.map(function(winner) {
              var seatIndex = winner[0], hand2 = winner[1], holeCards = winner[2];
              return [
                seatIndex,
                {
                  cards: hand2.cards().map(cardMapper),
                  ranking: hand2.ranking(),
                  strength: hand2.strength()
                },
                holeCards.map(cardMapper)
              ];
            });
          });
        };
        Poker3.prototype.automaticActions = function() {
          return this._table.automaticActions().map(function(action) {
            return action === null ? null : automaticActionFlagToStringArray(action)[0];
          });
        };
        Poker3.prototype.canSetAutomaticActions = function(seatIndex) {
          return this._table.canSetAutomaticAction(seatIndex);
        };
        Poker3.prototype.legalAutomaticActions = function(seatIndex) {
          var automaticActionFlag = this._table.legalAutomaticActions(seatIndex);
          return automaticActionFlagToStringArray(automaticActionFlag);
        };
        Poker3.prototype.setAutomaticAction = function(seatIndex, action) {
          var automaticAction = action === null ? action : stringToAutomaticActionFlag(action);
          this._table.setAutomaticAction(seatIndex, automaticAction);
        };
        Poker3.prototype.sitDown = function(seatIndex, buyIn) {
          this._table.sitDown(seatIndex, buyIn);
        };
        Poker3.prototype.standUp = function(seatIndex) {
          this._table.standUp(seatIndex);
        };
        return Poker3;
      })()
    );
    exports.default = Poker2;
  }
});

// node_modules/poker-ts/dist/index.js
var require_dist = __commonJS({
  "node_modules/poker-ts/dist/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Table = void 0;
    var poker_1 = __importDefault(require_poker());
    exports.Table = poker_1.default;
  }
});

// simulation.mjs
var import_poker_ts = __toESM(require_dist(), 1);
var names = ["ANIMESH", "ATLAS", "NOVA", "EMBER"];
var ranks = ["High card", "Pair", "Two pair", "Three of a kind", "Straight", "Flush", "Full house", "Four of a kind", "Straight flush", "Royal flush"];
var cardCode = (c) => c.rank + c.suit[0].toUpperCase();
function createTable() {
  const t = new import_poker_ts.default.Table({ smallBlind: 5, bigBlind: 10 }, 4);
  for (let i = 0; i < 4; i++) t.sitDown(i, 1e3);
  return t;
}
function playHand(table2, number, random = Math.random) {
  const refills = [];
  table2.seats().forEach((p, i) => {
    if (!p || p.stack < 1e3) {
      if (p) table2.standUp(i);
      table2.sitDown(i, 1e3);
      refills.push(names[i]);
    }
  });
  const startingTotal = table2.seats().reduce((s, p) => s + (p?.stack || 0), 0);
  table2.startHand((number - 1) % 4);
  const hole = table2.holeCards().slice(0, 4).map((cards) => (cards || []).map(cardCode));
  const dealer = table2.button();
  let statuses = ["", "", "", ""];
  const folded = /* @__PURE__ */ new Set();
  let frames = [];
  let count = 0;
  let streetRaises = 0;
  let street = table2.roundOfBetting();
  function snapshot(message, kind = "action", winnerSeats = []) {
    const inHand = table2.isHandInProgress();
    const seats2 = table2.seats().map((p, i) => ({ ...p, name: names[i], cards: hole[i], folded: folded.has(i), status: statuses[i] }));
    const board2 = inHand ? table2.communityCards().map(cardCode) : frames.at(-1)?.board || [];
    const pots = inHand ? table2.pots() : [];
    const pot = inHand ? pots.reduce((s, p) => s + p.size, 0) + seats2.reduce((s, p) => s + (p.betSize || 0), 0) : frames.at(-1)?.pot || 0;
    const duration = kind === "result" ? 7800 : kind === "street" ? 4700 : 2600 + Math.floor(random() * 1e3);
    frames.push({ hand: number, dealer, board: board2, seats: seats2, pot, message, kind, winners: winnerSeats, street: inHand ? table2.roundOfBetting() : "result", active: inHand && table2.isBettingRoundInProgress() ? table2.playerToAct() : -1, duration, startingTotal });
  }
  snapshot(refills.length ? `${refills.join(", ")} rebuy \xB7 1,000 chips` : "Cards dealt \xB7 blinds 5 / 10", "street");
  while (table2.isHandInProgress()) {
    while (table2.isBettingRoundInProgress()) {
      if (++count > 160) throw Error("Betting failed to terminate");
      const seat = table2.playerToAct(), legal = table2.legalActions(), p = table2.seats()[seat], r = random();
      const biggestBet = table2._table._dealer._bettingRound._biggestBet;
      const callGap = Math.max(0, biggestBet - p.betSize);
      const cards = hole[seat], strong = cards?.length === 2 && (cards[0][0] === cards[1][0] || cards.every((c) => "TJQKA".includes(c[0])));
      let action = legal.actions.includes("check") ? "check" : "call", amount;
      if (legal.actions.includes("fold") && !legal.actions.includes("check") && (p.stack <= callGap || r < (strong ? 0.04 : 0.18))) {
        action = "fold";
        folded.add(seat);
      } else if (legal.chipRange && streetRaises < 2 && r > (strong ? 0.55 : 0.78)) {
        const { min, max } = legal.chipRange;
        const safeMax = p.stack + p.betSize - 1;
        if (min <= safeMax) {
          action = legal.actions.includes("raise") ? "raise" : legal.actions.includes("bet") ? "bet" : action;
          if (action === "raise" || action === "bet") {
            amount = Math.min(max, safeMax, Math.max(min, Math.ceil((min + random() * 60) / 5) * 5));
            streetRaises++;
          }
        }
      }
      if (!legal.actions.includes(action)) action = legal.actions[0];
      const before = p.stack;
      table2.actionTaken(action, amount);
      const after = table2.seats()[seat];
      const paid = before - after.stack;
      statuses[seat] = !after.stack ? "ALL-IN" : action.toUpperCase() + (paid ? ` ${paid}` : "");
      snapshot(`${names[seat]} ${statuses[seat].toLowerCase()}`);
    }
    table2.endBettingRound();
    if (table2.areBettingRoundsCompleted()) {
      const pots = table2.pots();
      snapshot(pots.every((p) => p.eligiblePlayers.length === 1) ? "Everyone else folded" : "Showdown \xB7 best five-card hand wins", "street");
      table2.showdown();
      const wins = table2.winners();
      const winners = [...new Set(wins.length ? wins.flat().map((w) => w[0]) : pots.flatMap((p) => p.eligiblePlayers))];
      const labels = wins.length ? [...new Set(wins.flat().map((w) => ranks[w[1].ranking]))].join(" / ") : "Uncontested";
      statuses = statuses.map((s, i) => winners.includes(i) ? "WINNER" : s);
      snapshot(`${winners.map((i) => names[i]).join(" + ")} ${winners.length > 1 ? "split the pot" : "takes the pot"} \xB7 ${labels}`, "result", winners);
    } else {
      const next = table2.roundOfBetting();
      if (next !== street) {
        street = next;
        streetRaises = 0;
        statuses = statuses.map((s, i) => folded.has(i) ? "FOLDED" : "");
        snapshot(`${street.toUpperCase()} \xB7 betting resumes`, "street");
      }
    }
  }
  const endTotal = table2.seats().reduce((s, p) => s + (p?.stack || 0), 0);
  if (endTotal !== startingTotal) throw Error(`Chip conservation: ${startingTotal} -> ${endTotal}`);
  return frames;
}

// table.mjs
var table = createTable();
var hand = 0;
var speed = 1;
var timer = 0;
var paused = false;
var sequence = 0;
var current = null;
var $ = (s) => document.querySelector(s);
var seats = $("#seats");
var board = $("#board");
var feed = $("#feed");
var toast = $("#toast");
var esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var suit = (s) => ({ S: "\u2660", H: "\u2665", D: "\u2666", C: "\u2663" })[s] || "";
var red = (c) => c.endsWith("H") || c.endsWith("D");
function card(code, down = false) {
  if (down) return '<div class="card back-card" aria-label="Face down card"></div>';
  return `<div class="card" aria-label="${esc(code)}"><img src="../assets/cards/${encodeURIComponent(code)}.svg" alt="${esc(code)}" onerror="this.parentElement.innerHTML='<b style=&quot;color:${red(code) ? "#bf402d" : "#20251e"}&quot;>${esc(code.slice(0, -1))}<br>${suit(code.slice(-1))}</b>'"></div>`;
}
function render(f) {
  $("#hand-id").textContent = `HAND ${String(f.hand).padStart(3, "0")}`;
  $("#round-label").textContent = `${f.street === "result" ? "SHOWDOWN" : f.street.toUpperCase()} \xB7 BLINDS 5 / 10`;
  $("#pot").textContent = f.pot.toLocaleString("en-US");
  board.innerHTML = Array.from({ length: 5 }, (_, i) => f.board[i] ? card(f.board[i]) : '<div class="empty-card"></div>').join("");
  const spot = ["seat-bottom", "seat-left", "seat-top", "seat-right"];
  seats.innerHTML = f.seats.map((p, i) => `<article class="seat ${spot[i]} ${i === f.active ? "active" : ""} ${f.winners.includes(i) ? "winner" : ""}" data-seat="${i}"><div class="seat-head"><b class="seat-name">${p.name}</b><span class="seat-stack">${(p?.stack ?? 0).toLocaleString()} \u25C9</span></div><div class="seat-sub">${esc(p.status || (i === f.dealer ? "DEALER BUTTON" : "AT THE TABLE"))}</div><div class="seat-cards">${(p.cards || []).slice(0, 2).map((c) => card(c, p.folded || f.street !== "result")).join("")}</div></article>`).join("");
  const pos = ["bottom", "left", "top", "right"][f.dealer];
  $("#dealer-track").innerHTML = `<div class="button-chip seat-${pos}" aria-label="Dealer button">D</div>`;
  toast.textContent = f.message.toUpperCase();
  toast.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove("show"), f.kind === "result" ? 5200 : f.kind === "street" ? 3800 : 2400);
  feed.innerHTML = `<span>H${String(f.hand).padStart(3, "0")}</span> &nbsp;\xB7&nbsp; ${esc(f.message)} &nbsp;\xB7&nbsp; ${f.seats.map((p) => `${p.name} ${p.stack}`).join(" / ")}`;
}
function runHand() {
  if (paused) return;
  hand++;
  current = playHand(table, hand);
  sequence = 0;
  step();
}
function step() {
  if (paused) return;
  const frames = current;
  if (!frames || sequence >= frames.length) {
    setTimeout(runHand, 2200 / speed);
    return;
  }
  const f = frames[sequence++];
  render(f);
  setTimeout(step, f.duration / speed);
}
$("#speed").addEventListener("click", () => {
  speed = speed === 1 ? 0.7 : 1;
  $("#speed b").textContent = speed === 1 ? "1\xD7" : "0.7\xD7";
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    paused = true;
  } else if (paused) {
    paused = false;
    step();
  }
});
runHand();
