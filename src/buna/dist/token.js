"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Token = function () {
    function Token(type, lexeme, literal, line) {(0, _classCallCheck3.default)(this, Token);
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }(0, _createClass3.default)(Token, [{ key: "toString", value: function toString()

        {
            return this.type + " " + this.lexeme + " " + this.literal;
        } }]);return Token;}();exports.default = Token;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi90b2tlbi5qcyJdLCJuYW1lcyI6WyJUb2tlbiIsInR5cGUiLCJsZXhlbWUiLCJsaXRlcmFsIiwibGluZSJdLCJtYXBwaW5ncyI6IjhhQUFxQkEsSztBQUNqQixtQkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEJDLE9BQTFCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNyQyxhQUFLSCxJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxhQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSCxLOztBQUVVO0FBQ1AsbUJBQU8sS0FBS0gsSUFBTCxHQUFZLEdBQVosR0FBa0IsS0FBS0MsTUFBdkIsR0FBZ0MsR0FBaEMsR0FBc0MsS0FBS0MsT0FBbEQ7QUFDSCxTLHdDQVZnQkgsSyIsImZpbGUiOiJ0b2tlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRva2VuIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBsZXhlbWUsIGxpdGVyYWwsIGxpbmUpIHtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5sZXhlbWUgPSBsZXhlbWU7XG4gICAgICAgIHRoaXMubGl0ZXJhbCA9IGxpdGVyYWw7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgKyBcIiBcIiArIHRoaXMubGV4ZW1lICsgXCIgXCIgKyB0aGlzLmxpdGVyYWw7XG4gICAgfVxufSJdfQ==