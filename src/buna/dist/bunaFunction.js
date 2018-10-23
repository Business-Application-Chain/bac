'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.BunaFunction = exports.DefaultBunaFunction = undefined;var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _environment = require('./environment');var _environment2 = _interopRequireDefault(_environment);
var _error = require('./error');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

DefaultBunaFunction = function () {
    function DefaultBunaFunction() {(0, _classCallCheck3.default)(this, DefaultBunaFunction);

    }(0, _createClass3.default)(DefaultBunaFunction, [{ key: 'arity', value: function arity()

        {
            return 0;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            return "0x2a7e5bdeb35fca94a6ac0027d1360b1012e56f9d";
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultBunaFunction;}();var


BunaFunction = function () {
    function BunaFunction(declaration, closure, isInitializer) {(0, _classCallCheck3.default)(this, BunaFunction);
        this.declaration = declaration;
        this.closure = closure;
        this.isInitializer = isInitializer;
    }(0, _createClass3.default)(BunaFunction, [{ key: 'arity', value: function arity()

        {
            return this.declaration.params.length;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            var environment = new _environment2.default(this.closure);

            this.declaration.params.forEach(function (param, index) {
                environment.define(param.lexeme, args[index]);
            });

            try {
                interpreter.executeBlock(this.declaration.body, environment);
            } catch (e) {
                if (e instanceof _error.Returns) {
                    if (this.isInitializer) {
                        return this.closure.getAt(0, "this");
                    }
                    return e.value;
                } else {
                    throw e;
                }
            }
            if (this.isInitializer) {
                return this.closure.getAt(0, "this");
            }

            return null;
        } }, { key: 'bind', value: function bind(

        instance) {
            var environment = new _environment2.default(this.closure);
            environment.define("this", instance);
            return new BunaFunction(this.declaration, environment, this.isInitializer);
        } }, { key: 'toString', value: function toString()

        {
            return "<fn " + this.declaration.name.lexeme + ">";
        } }]);return BunaFunction;}();exports.


DefaultBunaFunction = DefaultBunaFunction;exports.BunaFunction = BunaFunction;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hRnVuY3Rpb24uanMiXSwibmFtZXMiOlsiRGVmYXVsdEJ1bmFGdW5jdGlvbiIsImludGVycHJldGVyIiwiYXJncyIsIkJ1bmFGdW5jdGlvbiIsImRlY2xhcmF0aW9uIiwiY2xvc3VyZSIsImlzSW5pdGlhbGl6ZXIiLCJwYXJhbXMiLCJsZW5ndGgiLCJlbnZpcm9ubWVudCIsIkVudmlyb25tZW50IiwiZm9yRWFjaCIsInBhcmFtIiwiaW5kZXgiLCJkZWZpbmUiLCJsZXhlbWUiLCJleGVjdXRlQmxvY2siLCJib2R5IiwiZSIsIlJldHVybnMiLCJnZXRBdCIsInZhbHVlIiwiaW5zdGFuY2UiLCJuYW1lIl0sIm1hcHBpbmdzIjoiNFlBQUEsNEM7QUFDQSxnQzs7QUFFTUEsbUI7QUFDRixtQ0FBYzs7QUFFYixLOztBQUVPO0FBQ0osbUJBQU8sQ0FBUDtBQUNILFM7O0FBRUlDLG1CLEVBQWFDLEksRUFBTTtBQUNwQixtQkFBTyw0Q0FBUDtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxhQUFQO0FBQ0gsUzs7O0FBR0NDLFk7QUFDRiwwQkFBWUMsV0FBWixFQUF5QkMsT0FBekIsRUFBa0NDLGFBQWxDLEVBQWlEO0FBQzdDLGFBQUtGLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsYUFBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsYUFBS0MsYUFBTCxHQUFxQkEsYUFBckI7QUFDSCxLOztBQUVPO0FBQ0osbUJBQU8sS0FBS0YsV0FBTCxDQUFpQkcsTUFBakIsQ0FBd0JDLE1BQS9CO0FBQ0gsUzs7QUFFSVAsbUIsRUFBYUMsSSxFQUFNO0FBQ3BCLGdCQUFJTyxjQUFjLElBQUlDLHFCQUFKLENBQWdCLEtBQUtMLE9BQXJCLENBQWxCOztBQUVBLGlCQUFLRCxXQUFMLENBQWlCRyxNQUFqQixDQUF3QkksT0FBeEIsQ0FBZ0MsVUFBQ0MsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQzlDSiw0QkFBWUssTUFBWixDQUFtQkYsTUFBTUcsTUFBekIsRUFBaUNiLEtBQUtXLEtBQUwsQ0FBakM7QUFDSCxhQUZEOztBQUlBLGdCQUFJO0FBQ0FaLDRCQUFZZSxZQUFaLENBQXlCLEtBQUtaLFdBQUwsQ0FBaUJhLElBQTFDLEVBQWdEUixXQUFoRDtBQUNILGFBRkQsQ0FFRSxPQUFPUyxDQUFQLEVBQVU7QUFDUixvQkFBSUEsYUFBYUMsY0FBakIsRUFBMEI7QUFDdEIsd0JBQUksS0FBS2IsYUFBVCxFQUF3QjtBQUNwQiwrQkFBTyxLQUFLRCxPQUFMLENBQWFlLEtBQWIsQ0FBbUIsQ0FBbkIsRUFBc0IsTUFBdEIsQ0FBUDtBQUNIO0FBQ0QsMkJBQU9GLEVBQUVHLEtBQVQ7QUFDSCxpQkFMRCxNQUtPO0FBQ0gsMEJBQU1ILENBQU47QUFDSDtBQUNKO0FBQ0QsZ0JBQUksS0FBS1osYUFBVCxFQUF3QjtBQUNwQix1QkFBTyxLQUFLRCxPQUFMLENBQWFlLEtBQWIsQ0FBbUIsQ0FBbkIsRUFBc0IsTUFBdEIsQ0FBUDtBQUNIOztBQUVELG1CQUFPLElBQVA7QUFDSCxTOztBQUVJRSxnQixFQUFVO0FBQ1gsZ0JBQUliLGNBQWMsSUFBSUMscUJBQUosQ0FBZ0IsS0FBS0wsT0FBckIsQ0FBbEI7QUFDQUksd0JBQVlLLE1BQVosQ0FBbUIsTUFBbkIsRUFBMkJRLFFBQTNCO0FBQ0EsbUJBQU8sSUFBSW5CLFlBQUosQ0FBaUIsS0FBS0MsV0FBdEIsRUFBbUNLLFdBQW5DLEVBQWdELEtBQUtILGFBQXJELENBQVA7QUFDSCxTOztBQUVVO0FBQ1AsbUJBQU8sU0FBUyxLQUFLRixXQUFMLENBQWlCbUIsSUFBakIsQ0FBc0JSLE1BQS9CLEdBQXdDLEdBQS9DO0FBQ0gsUzs7O0FBR0lmLG1CLEdBQUFBLG1CLFNBQXFCRyxZLEdBQUFBLFkiLCJmaWxlIjoiYnVuYUZ1bmN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVudmlyb25tZW50IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHtSZXR1cm5zfSBmcm9tICcuL2Vycm9yJztcblxuY2xhc3MgRGVmYXVsdEJ1bmFGdW5jdGlvbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBhcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY2FsbChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICByZXR1cm4gXCIweDJhN2U1YmRlYjM1ZmNhOTRhNmFjMDAyN2QxMzYwYjEwMTJlNTZmOWRcIjtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiPG5hdGl2ZSBmbj5cIjtcbiAgICB9XG59XG5cbmNsYXNzIEJ1bmFGdW5jdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVjbGFyYXRpb24sIGNsb3N1cmUsIGlzSW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IGRlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLmNsb3N1cmUgPSBjbG9zdXJlO1xuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZXIgPSBpc0luaXRpYWxpemVyO1xuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5wYXJhbXMubGVuZ3RoO1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgbGV0IGVudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHRoaXMuY2xvc3VyZSk7XG5cbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbi5wYXJhbXMuZm9yRWFjaCgocGFyYW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBlbnZpcm9ubWVudC5kZWZpbmUocGFyYW0ubGV4ZW1lLCBhcmdzW2luZGV4XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5leGVjdXRlQmxvY2sodGhpcy5kZWNsYXJhdGlvbi5ib2R5LCBlbnZpcm9ubWVudCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgUmV0dXJucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc3VyZS5nZXRBdCgwLCBcInRoaXNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBlLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3N1cmUuZ2V0QXQoMCwgXCJ0aGlzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYmluZChpbnN0YW5jZSkge1xuICAgICAgICBsZXQgZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQodGhpcy5jbG9zdXJlKTtcbiAgICAgICAgZW52aXJvbm1lbnQuZGVmaW5lKFwidGhpc1wiLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBuZXcgQnVuYUZ1bmN0aW9uKHRoaXMuZGVjbGFyYXRpb24sIGVudmlyb25tZW50LCB0aGlzLmlzSW5pdGlhbGl6ZXIpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8Zm4gXCIgKyB0aGlzLmRlY2xhcmF0aW9uLm5hbWUubGV4ZW1lICsgXCI+XCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBEZWZhdWx0QnVuYUZ1bmN0aW9uLCBCdW5hRnVuY3Rpb24gfSJdfQ==