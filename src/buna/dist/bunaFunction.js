'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.DefaultFunctionSetStatus = exports.DefaultFunctionSetBalance = exports.DefaultFunctionSetObject = exports.DefaultBunFunctionGet = exports.DefaultBunaFunctionStatus = exports.DefaultBunaFunctionMsg = exports.DefaultBunaFunctionBalance = exports.BunaFunction = exports.DefaultBunaFunction = undefined;var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _environment = require('./environment');var _environment2 = _interopRequireDefault(_environment);
var _error = require('./error');
var _bignumber = require('bignumber.js');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var EventEmitter = require('events');var

DefaultBunaFunction = function () {
    function DefaultBunaFunction() {(0, _classCallCheck3.default)(this, DefaultBunaFunction);
    }(0, _createClass3.default)(DefaultBunaFunction, [{ key: 'arity', value: function arity()

        {
            return 0;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            return new Date().getTime();
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultBunaFunction;}();var


DefaultBunaFunctionBalance = function () {
    function DefaultBunaFunctionBalance(args) {(0, _classCallCheck3.default)(this, DefaultBunaFunctionBalance);
        this.balance = args.balance;
    }(0, _createClass3.default)(DefaultBunaFunctionBalance, [{ key: 'arity', value: function arity()

        {
            return 0;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            return (0, _stringify2.default)(this.balance);
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultBunaFunctionBalance;}();var


DefaultBunaFunctionMsg = function () {
    function DefaultBunaFunctionMsg(args) {(0, _classCallCheck3.default)(this, DefaultBunaFunctionMsg);
        this.message = args.message;
    }(0, _createClass3.default)(DefaultBunaFunctionMsg, [{ key: 'arity', value: function arity()

        {
            return 0;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            return (0, _stringify2.default)(this.message);
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultBunaFunctionMsg;}();var


DefaultBunaFunctionStatus = function () {
    function DefaultBunaFunctionStatus(args) {(0, _classCallCheck3.default)(this, DefaultBunaFunctionStatus);
        this.status = args.status;
    }(0, _createClass3.default)(DefaultBunaFunctionStatus, [{ key: 'arity', value: function arity()

        {
            return 0;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            return (0, _stringify2.default)(this.status);
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultBunaFunctionStatus;}();var


DefaultBunFunctionGet = function () {
    function DefaultBunFunctionGet(args) {(0, _classCallCheck3.default)(this, DefaultBunFunctionGet);
    }(0, _createClass3.default)(DefaultBunFunctionGet, [{ key: 'arity', value: function arity()

        {
            return 2;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            var val = JSON.parse(args[0]);
            var key = args[1];
            return val[key];
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultBunFunctionGet;}();var


DefaultFunctionSetObject = function () {
    function DefaultFunctionSetObject(args) {(0, _classCallCheck3.default)(this, DefaultFunctionSetObject);
        var myEmitter = new EventEmitter();
        this.myEmitter = myEmitter;
        this.myEmitter.on("changed", function (obj) {
            args.myEventter.emit('event', obj);
        });
    }(0, _createClass3.default)(DefaultFunctionSetObject, [{ key: 'arity', value: function arity()

        {
            return 5;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            var obj = {};
            obj.name = args[0];
            obj.symbol = args[1];
            obj.decimals = args[2];
            obj.totalAmount = args[3];
            obj.others = args[4];
            this.myEmitter.emit("changed", obj);
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultFunctionSetObject;}();var


DefaultFunctionSetBalance = function () {
    function DefaultFunctionSetBalance(args) {(0, _classCallCheck3.default)(this, DefaultFunctionSetBalance);
        this.balance = args.balance;
        var myEmitter = new EventEmitter();
        this.myEmitter = myEmitter;
        this.myEmitter.on("changed", function (obj) {
            args.myEventter.emit('event', obj);
        });
    }(0, _createClass3.default)(DefaultFunctionSetBalance, [{ key: 'arity', value: function arity()

        {
            return 3;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            this.balance = JSON.parse(args[0]);
            var balancee = this.balance[args[1]];
            balancee = args[2] > 0 ? new _bignumber.BigNumber(balancee).plus(args[2]) : new _bignumber.BigNumber(balancee).minus(-args[2]);
            this.balance[args[1]] = balancee.toString();
            this.myEmitter.emit("changed", { balance: this.balance, tag: 1 });
            return (0, _stringify2.default)(this.balance);
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultFunctionSetBalance;}();var


DefaultFunctionSetStatus = function () {
    function DefaultFunctionSetStatus(args) {(0, _classCallCheck3.default)(this, DefaultFunctionSetStatus);
        this.status = args.status;
        var myEmitter = new EventEmitter();
        this.myEmitter = myEmitter;
        this.myEmitter.on("changed", function (obj) {
            args.myEventter.emit('event', obj);
        });

    }(0, _createClass3.default)(DefaultFunctionSetStatus, [{ key: 'arity', value: function arity()

        {
            return 4;
        } }, { key: 'call', value: function call(

        interpreter, args) {
            this.status = JSON.parse(args[0]);
            this.status[args[1]][args[2]] = args[3];
            this.myEmitter.emit("changed", { status: this.status });
            return (0, _stringify2.default)(this.status);
        } }, { key: 'toString', value: function toString()

        {
            return "<native fn>";
        } }]);return DefaultFunctionSetStatus;}();var



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



DefaultBunaFunction = DefaultBunaFunction;exports.
BunaFunction = BunaFunction;exports.
DefaultBunaFunctionBalance = DefaultBunaFunctionBalance;exports.
DefaultBunaFunctionMsg = DefaultBunaFunctionMsg;exports.
DefaultBunaFunctionStatus = DefaultBunaFunctionStatus;exports.
DefaultBunFunctionGet = DefaultBunFunctionGet;exports.
DefaultFunctionSetObject = DefaultFunctionSetObject;exports.
DefaultFunctionSetBalance = DefaultFunctionSetBalance;exports.
DefaultFunctionSetStatus = DefaultFunctionSetStatus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hRnVuY3Rpb24uanMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwicmVxdWlyZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb24iLCJpbnRlcnByZXRlciIsImFyZ3MiLCJEYXRlIiwiZ2V0VGltZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25CYWxhbmNlIiwiYmFsYW5jZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2ciLCJtZXNzYWdlIiwiRGVmYXVsdEJ1bmFGdW5jdGlvblN0YXR1cyIsInN0YXR1cyIsIkRlZmF1bHRCdW5GdW5jdGlvbkdldCIsInZhbCIsIkpTT04iLCJwYXJzZSIsImtleSIsIkRlZmF1bHRGdW5jdGlvblNldE9iamVjdCIsIm15RW1pdHRlciIsIm9uIiwib2JqIiwibXlFdmVudHRlciIsImVtaXQiLCJuYW1lIiwic3ltYm9sIiwiZGVjaW1hbHMiLCJ0b3RhbEFtb3VudCIsIm90aGVycyIsIkRlZmF1bHRGdW5jdGlvblNldEJhbGFuY2UiLCJiYWxhbmNlZSIsIkJpZ051bWJlciIsInBsdXMiLCJtaW51cyIsInRvU3RyaW5nIiwidGFnIiwiRGVmYXVsdEZ1bmN0aW9uU2V0U3RhdHVzIiwiQnVuYUZ1bmN0aW9uIiwiZGVjbGFyYXRpb24iLCJjbG9zdXJlIiwiaXNJbml0aWFsaXplciIsInBhcmFtcyIsImxlbmd0aCIsImVudmlyb25tZW50IiwiRW52aXJvbm1lbnQiLCJmb3JFYWNoIiwicGFyYW0iLCJpbmRleCIsImRlZmluZSIsImxleGVtZSIsImV4ZWN1dGVCbG9jayIsImJvZHkiLCJlIiwiUmV0dXJucyIsImdldEF0IiwidmFsdWUiLCJpbnN0YW5jZSJdLCJtYXBwaW5ncyI6InN2QkFBQSw0QztBQUNBO0FBQ0EseUM7O0FBRUEsSUFBTUEsZUFBZUMsUUFBUSxRQUFSLENBQXJCLEM7O0FBRU1DLG1CO0FBQ0YsbUNBQWM7QUFDYixLOztBQUVPO0FBQ0osbUJBQU8sQ0FBUDtBQUNILFM7O0FBRUlDLG1CLEVBQWFDLEksRUFBTTtBQUNwQixtQkFBUSxJQUFJQyxJQUFKLEdBQVdDLE9BQVgsRUFBUjtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxhQUFQO0FBQ0gsUzs7O0FBR0NDLDBCO0FBQ0Ysd0NBQVlILElBQVosRUFBa0I7QUFDZCxhQUFLSSxPQUFMLEdBQWVKLEtBQUtJLE9BQXBCO0FBQ0gsSzs7QUFFTztBQUNKLG1CQUFPLENBQVA7QUFDSCxTOztBQUVJTCxtQixFQUFhQyxJLEVBQU07QUFDcEIsbUJBQU8seUJBQWUsS0FBS0ksT0FBcEIsQ0FBUDtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxhQUFQO0FBQ0gsUzs7O0FBR0NDLHNCO0FBQ0Ysb0NBQVlMLElBQVosRUFBa0I7QUFDZCxhQUFLTSxPQUFMLEdBQWVOLEtBQUtNLE9BQXBCO0FBQ0gsSzs7QUFFTztBQUNKLG1CQUFPLENBQVA7QUFDSCxTOztBQUVJUCxtQixFQUFhQyxJLEVBQU07QUFDcEIsbUJBQU8seUJBQWUsS0FBS00sT0FBcEIsQ0FBUDtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxhQUFQO0FBQ0gsUzs7O0FBR0NDLHlCO0FBQ0YsdUNBQVlQLElBQVosRUFBa0I7QUFDZCxhQUFLUSxNQUFMLEdBQWNSLEtBQUtRLE1BQW5CO0FBQ0gsSzs7QUFFTztBQUNKLG1CQUFPLENBQVA7QUFDSCxTOztBQUVJVCxtQixFQUFhQyxJLEVBQU07QUFDcEIsbUJBQU8seUJBQWUsS0FBS1EsTUFBcEIsQ0FBUDtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxhQUFQO0FBQ0gsUzs7O0FBR0NDLHFCO0FBQ0YsbUNBQVlULElBQVosRUFBa0I7QUFDakIsSzs7QUFFTztBQUNKLG1CQUFPLENBQVA7QUFDSCxTOztBQUVJRCxtQixFQUFhQyxJLEVBQU07QUFDcEIsZ0JBQUlVLE1BQU1DLEtBQUtDLEtBQUwsQ0FBV1osS0FBSyxDQUFMLENBQVgsQ0FBVjtBQUNBLGdCQUFJYSxNQUFNYixLQUFLLENBQUwsQ0FBVjtBQUNBLG1CQUFPVSxJQUFJRyxHQUFKLENBQVA7QUFDSCxTOztBQUVVO0FBQ1AsbUJBQU8sYUFBUDtBQUNILFM7OztBQUdDQyx3QjtBQUNGLHNDQUFZZCxJQUFaLEVBQWtCO0FBQ2QsWUFBSWUsWUFBWSxJQUFJbkIsWUFBSixFQUFoQjtBQUNBLGFBQUttQixTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLGFBQUtBLFNBQUwsQ0FBZUMsRUFBZixDQUFrQixTQUFsQixFQUE2QixVQUFVQyxHQUFWLEVBQWU7QUFDeENqQixpQkFBS2tCLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCLE9BQXJCLEVBQThCRixHQUE5QjtBQUNILFNBRkQ7QUFHSCxLOztBQUVPO0FBQ0osbUJBQU8sQ0FBUDtBQUNILFM7O0FBRUlsQixtQixFQUFhQyxJLEVBQU07QUFDcEIsZ0JBQUlpQixNQUFNLEVBQVY7QUFDQUEsZ0JBQUlHLElBQUosR0FBV3BCLEtBQUssQ0FBTCxDQUFYO0FBQ0FpQixnQkFBSUksTUFBSixHQUFhckIsS0FBSyxDQUFMLENBQWI7QUFDQWlCLGdCQUFJSyxRQUFKLEdBQWV0QixLQUFLLENBQUwsQ0FBZjtBQUNBaUIsZ0JBQUlNLFdBQUosR0FBa0J2QixLQUFLLENBQUwsQ0FBbEI7QUFDQWlCLGdCQUFJTyxNQUFKLEdBQWF4QixLQUFLLENBQUwsQ0FBYjtBQUNBLGlCQUFLZSxTQUFMLENBQWVJLElBQWYsQ0FBb0IsU0FBcEIsRUFBK0JGLEdBQS9CO0FBQ0gsUzs7QUFFVTtBQUNQLG1CQUFPLGFBQVA7QUFDSCxTOzs7QUFHQ1EseUI7QUFDRix1Q0FBWXpCLElBQVosRUFBa0I7QUFDZCxhQUFLSSxPQUFMLEdBQWVKLEtBQUtJLE9BQXBCO0FBQ0EsWUFBSVcsWUFBWSxJQUFJbkIsWUFBSixFQUFoQjtBQUNBLGFBQUttQixTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLGFBQUtBLFNBQUwsQ0FBZUMsRUFBZixDQUFrQixTQUFsQixFQUE2QixVQUFVQyxHQUFWLEVBQWU7QUFDeENqQixpQkFBS2tCLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCLE9BQXJCLEVBQThCRixHQUE5QjtBQUNILFNBRkQ7QUFHSCxLOztBQUVPO0FBQ0osbUJBQU8sQ0FBUDtBQUNILFM7O0FBRUlsQixtQixFQUFhQyxJLEVBQU07QUFDcEIsaUJBQUtJLE9BQUwsR0FBZU8sS0FBS0MsS0FBTCxDQUFXWixLQUFLLENBQUwsQ0FBWCxDQUFmO0FBQ0EsZ0JBQUkwQixXQUFXLEtBQUt0QixPQUFMLENBQWFKLEtBQUssQ0FBTCxDQUFiLENBQWY7QUFDQTBCLHVCQUFZMUIsS0FBSyxDQUFMLElBQVUsQ0FBWCxHQUFnQixJQUFJMkIsb0JBQUosQ0FBY0QsUUFBZCxFQUF3QkUsSUFBeEIsQ0FBNkI1QixLQUFLLENBQUwsQ0FBN0IsQ0FBaEIsR0FBd0QsSUFBSTJCLG9CQUFKLENBQWNELFFBQWQsRUFBd0JHLEtBQXhCLENBQThCLENBQUM3QixLQUFLLENBQUwsQ0FBL0IsQ0FBbkU7QUFDQSxpQkFBS0ksT0FBTCxDQUFhSixLQUFLLENBQUwsQ0FBYixJQUF3QjBCLFNBQVNJLFFBQVQsRUFBeEI7QUFDQSxpQkFBS2YsU0FBTCxDQUFlSSxJQUFmLENBQW9CLFNBQXBCLEVBQStCLEVBQUNmLFNBQVMsS0FBS0EsT0FBZixFQUF3QjJCLEtBQUssQ0FBN0IsRUFBL0I7QUFDQSxtQkFBTyx5QkFBZSxLQUFLM0IsT0FBcEIsQ0FBUDtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxhQUFQO0FBQ0gsUzs7O0FBR0M0Qix3QjtBQUNGLHNDQUFZaEMsSUFBWixFQUFrQjtBQUNkLGFBQUtRLE1BQUwsR0FBY1IsS0FBS1EsTUFBbkI7QUFDQSxZQUFJTyxZQUFZLElBQUluQixZQUFKLEVBQWhCO0FBQ0EsYUFBS21CLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsYUFBS0EsU0FBTCxDQUFlQyxFQUFmLENBQWtCLFNBQWxCLEVBQTZCLFVBQVVDLEdBQVYsRUFBZTtBQUN4Q2pCLGlCQUFLa0IsVUFBTCxDQUFnQkMsSUFBaEIsQ0FBcUIsT0FBckIsRUFBOEJGLEdBQTlCO0FBQ0gsU0FGRDs7QUFJSCxLOztBQUVPO0FBQ0osbUJBQU8sQ0FBUDtBQUNILFM7O0FBRUlsQixtQixFQUFhQyxJLEVBQU07QUFDcEIsaUJBQUtRLE1BQUwsR0FBY0csS0FBS0MsS0FBTCxDQUFXWixLQUFLLENBQUwsQ0FBWCxDQUFkO0FBQ0EsaUJBQUtRLE1BQUwsQ0FBWVIsS0FBSyxDQUFMLENBQVosRUFBcUJBLEtBQUssQ0FBTCxDQUFyQixJQUFnQ0EsS0FBSyxDQUFMLENBQWhDO0FBQ0EsaUJBQUtlLFNBQUwsQ0FBZUksSUFBZixDQUFvQixTQUFwQixFQUErQixFQUFDWCxRQUFRLEtBQUtBLE1BQWQsRUFBL0I7QUFDQSxtQkFBTyx5QkFBZSxLQUFLQSxNQUFwQixDQUFQO0FBQ0gsUzs7QUFFVTtBQUNQLG1CQUFPLGFBQVA7QUFDSCxTOzs7O0FBSUN5QixZO0FBQ0YsMEJBQVlDLFdBQVosRUFBeUJDLE9BQXpCLEVBQWtDQyxhQUFsQyxFQUFpRDtBQUM3QyxhQUFLRixXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLGFBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLGFBQUtDLGFBQUwsR0FBcUJBLGFBQXJCO0FBQ0gsSzs7QUFFTztBQUNKLG1CQUFPLEtBQUtGLFdBQUwsQ0FBaUJHLE1BQWpCLENBQXdCQyxNQUEvQjtBQUNILFM7O0FBRUl2QyxtQixFQUFhQyxJLEVBQU07QUFDcEIsZ0JBQUl1QyxjQUFjLElBQUlDLHFCQUFKLENBQWdCLEtBQUtMLE9BQXJCLENBQWxCOztBQUVBLGlCQUFLRCxXQUFMLENBQWlCRyxNQUFqQixDQUF3QkksT0FBeEIsQ0FBZ0MsVUFBQ0MsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQzlDSiw0QkFBWUssTUFBWixDQUFtQkYsTUFBTUcsTUFBekIsRUFBaUM3QyxLQUFLMkMsS0FBTCxDQUFqQztBQUNILGFBRkQ7O0FBSUEsZ0JBQUk7QUFDQTVDLDRCQUFZK0MsWUFBWixDQUF5QixLQUFLWixXQUFMLENBQWlCYSxJQUExQyxFQUFnRFIsV0FBaEQ7QUFDSCxhQUZELENBRUUsT0FBT1MsQ0FBUCxFQUFVO0FBQ1Isb0JBQUlBLGFBQWFDLGNBQWpCLEVBQTBCO0FBQ3RCLHdCQUFJLEtBQUtiLGFBQVQsRUFBd0I7QUFDcEIsK0JBQU8sS0FBS0QsT0FBTCxDQUFhZSxLQUFiLENBQW1CLENBQW5CLEVBQXNCLE1BQXRCLENBQVA7QUFDSDtBQUNELDJCQUFPRixFQUFFRyxLQUFUO0FBQ0gsaUJBTEQsTUFLTztBQUNILDBCQUFNSCxDQUFOO0FBQ0g7QUFDSjtBQUNELGdCQUFJLEtBQUtaLGFBQVQsRUFBd0I7QUFDcEIsdUJBQU8sS0FBS0QsT0FBTCxDQUFhZSxLQUFiLENBQW1CLENBQW5CLEVBQXNCLE1BQXRCLENBQVA7QUFDSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0gsUzs7QUFFSUUsZ0IsRUFBVTtBQUNYLGdCQUFJYixjQUFjLElBQUlDLHFCQUFKLENBQWdCLEtBQUtMLE9BQXJCLENBQWxCO0FBQ0FJLHdCQUFZSyxNQUFaLENBQW1CLE1BQW5CLEVBQTJCUSxRQUEzQjtBQUNBLG1CQUFPLElBQUluQixZQUFKLENBQWlCLEtBQUtDLFdBQXRCLEVBQW1DSyxXQUFuQyxFQUFnRCxLQUFLSCxhQUFyRCxDQUFQO0FBQ0gsUzs7QUFFVTtBQUNQLG1CQUFPLFNBQVMsS0FBS0YsV0FBTCxDQUFpQmQsSUFBakIsQ0FBc0J5QixNQUEvQixHQUF3QyxHQUEvQztBQUNILFM7Ozs7QUFJRC9DLG1CLEdBQUFBLG1CO0FBQ0FtQyxZLEdBQUFBLFk7QUFDQTlCLDBCLEdBQUFBLDBCO0FBQ0FFLHNCLEdBQUFBLHNCO0FBQ0FFLHlCLEdBQUFBLHlCO0FBQ0FFLHFCLEdBQUFBLHFCO0FBQ0FLLHdCLEdBQUFBLHdCO0FBQ0FXLHlCLEdBQUFBLHlCO0FBQ0FPLHdCLEdBQUFBLHdCIiwiZmlsZSI6ImJ1bmFGdW5jdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbnZpcm9ubWVudCBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCB7UmV0dXJuc30gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge0JpZ051bWJlcn0gZnJvbSAnYmlnbnVtYmVyLmpzJ1xuXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcblxuY2xhc3MgRGVmYXVsdEJ1bmFGdW5jdGlvbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgYXJpdHkoKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuICBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiPG5hdGl2ZSBmbj5cIjtcbiAgICB9XG59XG5cbmNsYXNzIERlZmF1bHRCdW5hRnVuY3Rpb25CYWxhbmNlIHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGFyZ3MuYmFsYW5jZVxuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjYWxsKGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmJhbGFuY2UpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8bmF0aXZlIGZuPlwiO1xuICAgIH1cbn1cblxuY2xhc3MgRGVmYXVsdEJ1bmFGdW5jdGlvbk1zZyB7XG4gICAgY29uc3RydWN0b3IoYXJncykge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBhcmdzLm1lc3NhZ2VcbiAgICB9XG5cbiAgICBhcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY2FsbChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5tZXNzYWdlKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8bmF0aXZlIGZuPlwiO1xuICAgIH1cbn1cblxuY2xhc3MgRGVmYXVsdEJ1bmFGdW5jdGlvblN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoYXJncykge1xuICAgICAgICB0aGlzLnN0YXR1cyA9IGFyZ3Muc3RhdHVzXG4gICAgfVxuXG4gICAgYXJpdHkoKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdHVzKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8bmF0aXZlIGZuPlwiO1xuICAgIH1cbn1cblxuY2xhc3MgRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0IHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgfVxuXG4gICAgYXJpdHkoKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgbGV0IHZhbCA9IEpTT04ucGFyc2UoYXJnc1swXSlcbiAgICAgICAgbGV0IGtleSA9IGFyZ3NbMV1cbiAgICAgICAgcmV0dXJuIHZhbFtrZXldXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIjxuYXRpdmUgZm4+XCI7XG4gICAgfVxufVxuXG5jbGFzcyBEZWZhdWx0RnVuY3Rpb25TZXRPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKGFyZ3MpIHtcbiAgICAgICAgbGV0IG15RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5teUVtaXR0ZXIgPSBteUVtaXR0ZXJcbiAgICAgICAgdGhpcy5teUVtaXR0ZXIub24oXCJjaGFuZ2VkXCIsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIGFyZ3MubXlFdmVudHRlci5lbWl0KCdldmVudCcsIG9iailcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDU7XG4gICAgfVxuXG4gICAgY2FsbChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICBsZXQgb2JqID0ge31cbiAgICAgICAgb2JqLm5hbWUgPSBhcmdzWzBdXG4gICAgICAgIG9iai5zeW1ib2wgPSBhcmdzWzFdXG4gICAgICAgIG9iai5kZWNpbWFscyA9IGFyZ3NbMl1cbiAgICAgICAgb2JqLnRvdGFsQW1vdW50ID0gYXJnc1szXVxuICAgICAgICBvYmoub3RoZXJzID0gYXJnc1s0XVxuICAgICAgICB0aGlzLm15RW1pdHRlci5lbWl0KFwiY2hhbmdlZFwiLCBvYmopXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIjxuYXRpdmUgZm4+XCI7XG4gICAgfVxufVxuXG5jbGFzcyBEZWZhdWx0RnVuY3Rpb25TZXRCYWxhbmNlIHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGFyZ3MuYmFsYW5jZVxuICAgICAgICBsZXQgbXlFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLm15RW1pdHRlciA9IG15RW1pdHRlclxuICAgICAgICB0aGlzLm15RW1pdHRlci5vbihcImNoYW5nZWRcIiwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgYXJncy5teUV2ZW50dGVyLmVtaXQoJ2V2ZW50Jywgb2JqKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICByZXR1cm4gMztcbiAgICB9XG5cbiAgICBjYWxsKGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IEpTT04ucGFyc2UoYXJnc1swXSlcbiAgICAgICAgbGV0IGJhbGFuY2VlID0gdGhpcy5iYWxhbmNlW2FyZ3NbMV1dXG4gICAgICAgIGJhbGFuY2VlID0gKGFyZ3NbMl0gPiAwKSA/IG5ldyBCaWdOdW1iZXIoYmFsYW5jZWUpLnBsdXMoYXJnc1syXSkgOiBuZXcgQmlnTnVtYmVyKGJhbGFuY2VlKS5taW51cygtYXJnc1syXSlcbiAgICAgICAgdGhpcy5iYWxhbmNlW2FyZ3NbMV1dID0gYmFsYW5jZWUudG9TdHJpbmcoKVxuICAgICAgICB0aGlzLm15RW1pdHRlci5lbWl0KFwiY2hhbmdlZFwiLCB7YmFsYW5jZTogdGhpcy5iYWxhbmNlLCB0YWc6IDF9KVxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5iYWxhbmNlKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8bmF0aXZlIGZuPlwiO1xuICAgIH1cbn1cblxuY2xhc3MgRGVmYXVsdEZ1bmN0aW9uU2V0U3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gYXJncy5zdGF0dXNcbiAgICAgICAgbGV0IG15RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5teUVtaXR0ZXIgPSBteUVtaXR0ZXJcbiAgICAgICAgdGhpcy5teUVtaXR0ZXIub24oXCJjaGFuZ2VkXCIsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIGFyZ3MubXlFdmVudHRlci5lbWl0KCdldmVudCcsIG9iailcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICByZXR1cm4gNDtcbiAgICB9XG5cbiAgICBjYWxsKGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gSlNPTi5wYXJzZShhcmdzWzBdKVxuICAgICAgICB0aGlzLnN0YXR1c1thcmdzWzFdXVthcmdzWzJdXSA9IGFyZ3NbM11cbiAgICAgICAgdGhpcy5teUVtaXR0ZXIuZW1pdChcImNoYW5nZWRcIiwge3N0YXR1czogdGhpcy5zdGF0dXN9KVxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0dXMpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIjxuYXRpdmUgZm4+XCI7XG4gICAgfVxufVxuXG5cbmNsYXNzIEJ1bmFGdW5jdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVjbGFyYXRpb24sIGNsb3N1cmUsIGlzSW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IGRlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLmNsb3N1cmUgPSBjbG9zdXJlO1xuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZXIgPSBpc0luaXRpYWxpemVyO1xuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5wYXJhbXMubGVuZ3RoO1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgbGV0IGVudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHRoaXMuY2xvc3VyZSk7XG5cbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbi5wYXJhbXMuZm9yRWFjaCgocGFyYW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBlbnZpcm9ubWVudC5kZWZpbmUocGFyYW0ubGV4ZW1lLCBhcmdzW2luZGV4XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5leGVjdXRlQmxvY2sodGhpcy5kZWNsYXJhdGlvbi5ib2R5LCBlbnZpcm9ubWVudCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgUmV0dXJucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc3VyZS5nZXRBdCgwLCBcInRoaXNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBlLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3N1cmUuZ2V0QXQoMCwgXCJ0aGlzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYmluZChpbnN0YW5jZSkge1xuICAgICAgICBsZXQgZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQodGhpcy5jbG9zdXJlKTtcbiAgICAgICAgZW52aXJvbm1lbnQuZGVmaW5lKFwidGhpc1wiLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBuZXcgQnVuYUZ1bmN0aW9uKHRoaXMuZGVjbGFyYXRpb24sIGVudmlyb25tZW50LCB0aGlzLmlzSW5pdGlhbGl6ZXIpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8Zm4gXCIgKyB0aGlzLmRlY2xhcmF0aW9uLm5hbWUubGV4ZW1lICsgXCI+XCI7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIERlZmF1bHRCdW5hRnVuY3Rpb24sXG4gICAgQnVuYUZ1bmN0aW9uLFxuICAgIERlZmF1bHRCdW5hRnVuY3Rpb25CYWxhbmNlLFxuICAgIERlZmF1bHRCdW5hRnVuY3Rpb25Nc2csXG4gICAgRGVmYXVsdEJ1bmFGdW5jdGlvblN0YXR1cyxcbiAgICBEZWZhdWx0QnVuRnVuY3Rpb25HZXQsXG4gICAgRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0LFxuICAgIERlZmF1bHRGdW5jdGlvblNldEJhbGFuY2UsXG4gICAgRGVmYXVsdEZ1bmN0aW9uU2V0U3RhdHVzXG5cbn0iXX0=