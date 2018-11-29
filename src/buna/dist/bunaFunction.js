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
            balancee = args[2];
            this.balance[args[1]] = balancee.toString();
            // this.balance["balancing"] = args[2]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hRnVuY3Rpb24uanMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwicmVxdWlyZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb24iLCJpbnRlcnByZXRlciIsImFyZ3MiLCJEYXRlIiwiZ2V0VGltZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25CYWxhbmNlIiwiYmFsYW5jZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2ciLCJtZXNzYWdlIiwiRGVmYXVsdEJ1bmFGdW5jdGlvblN0YXR1cyIsInN0YXR1cyIsIkRlZmF1bHRCdW5GdW5jdGlvbkdldCIsInZhbCIsIkpTT04iLCJwYXJzZSIsImtleSIsIkRlZmF1bHRGdW5jdGlvblNldE9iamVjdCIsIm15RW1pdHRlciIsIm9uIiwib2JqIiwibXlFdmVudHRlciIsImVtaXQiLCJuYW1lIiwic3ltYm9sIiwiZGVjaW1hbHMiLCJ0b3RhbEFtb3VudCIsIm90aGVycyIsIkRlZmF1bHRGdW5jdGlvblNldEJhbGFuY2UiLCJiYWxhbmNlZSIsInRvU3RyaW5nIiwidGFnIiwiRGVmYXVsdEZ1bmN0aW9uU2V0U3RhdHVzIiwiQnVuYUZ1bmN0aW9uIiwiZGVjbGFyYXRpb24iLCJjbG9zdXJlIiwiaXNJbml0aWFsaXplciIsInBhcmFtcyIsImxlbmd0aCIsImVudmlyb25tZW50IiwiRW52aXJvbm1lbnQiLCJmb3JFYWNoIiwicGFyYW0iLCJpbmRleCIsImRlZmluZSIsImxleGVtZSIsImV4ZWN1dGVCbG9jayIsImJvZHkiLCJlIiwiUmV0dXJucyIsImdldEF0IiwidmFsdWUiLCJpbnN0YW5jZSJdLCJtYXBwaW5ncyI6InN2QkFBQSw0QztBQUNBO0FBQ0EseUM7O0FBRUEsSUFBTUEsZUFBZUMsUUFBUSxRQUFSLENBQXJCLEM7O0FBRU1DLG1CO0FBQ0YsbUNBQWM7QUFDYixLOztBQUVPO0FBQ0osbUJBQU8sQ0FBUDtBQUNILFM7O0FBRUlDLG1CLEVBQWFDLEksRUFBTTtBQUNwQixtQkFBTyxJQUFJQyxJQUFKLEdBQVdDLE9B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QUFMLENBQWFlLEtBQWIsQ0FBbUIsQ0FBbkIsRUFBc0IsTUFBdEIsQ0FBUDtBQUNIOztBQUVELG1CQUFPLElBQVA7QUFDSCxTOztBQUVJRSxnQixFQUFVO0FBQ1gsZ0JBQUliLGNBQWMsSUFBSUMscUJBQUosQ0FBZ0IsS0FBS0wsT0FBckIsQ0FBbEI7QUFDQUksd0JBQVlLLE1BQVosQ0FBbUIsTUFBbkIsRUFBMkJRLFFBQTNCO0FBQ0EsbUJBQU8sSUFBSW5CLFlBQUosQ0FBaUIsS0FBS0MsV0FBdEIsRUFBbUNLLFdBQW5DLEVBQWdELEtBQUtILGFBQXJELENBQVA7QUFDSCxTOztBQUVVO0FBQ1AsbUJBQU8sU0FBUyxLQUFLRixXQUFMLENBQWlCWCxJQUFqQixDQUFzQnNCLE1BQS9CLEdBQXdDLEdBQS9DO0FBQ0gsUzs7OztBQUlENUMsbUIsR0FBQUEsbUI7QUFDQWdDLFksR0FBQUEsWTtBQUNBM0IsMEIsR0FBQUEsMEI7QUFDQUUsc0IsR0FBQUEsc0I7QUFDQUUseUIsR0FBQUEseUI7QUFDQUUscUIsR0FBQUEscUI7QUFDQUssd0IsR0FBQUEsd0I7QUFDQVcseUIsR0FBQUEseUI7QUFDQUksd0IsR0FBQUEsd0IiLCJmaWxlIjoiYnVuYUZ1bmN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVudmlyb25tZW50IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHtSZXR1cm5zfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7QmlnTnVtYmVyfSBmcm9tICdiaWdudW1iZXIuanMnXG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG5jbGFzcyBEZWZhdWx0QnVuYUZ1bmN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBhcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY2FsbChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIjxuYXRpdmUgZm4+XCI7XG4gICAgfVxufVxuXG5jbGFzcyBEZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZSB7XG4gICAgY29uc3RydWN0b3IoYXJncykge1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBhcmdzLmJhbGFuY2VcbiAgICB9XG5cbiAgICBhcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY2FsbChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5iYWxhbmNlKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiPG5hdGl2ZSBmbj5cIjtcbiAgICB9XG59XG5cbmNsYXNzIERlZmF1bHRCdW5hRnVuY3Rpb25Nc2cge1xuICAgIGNvbnN0cnVjdG9yKGFyZ3MpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gYXJncy5tZXNzYWdlXG4gICAgfVxuXG4gICAgYXJpdHkoKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMubWVzc2FnZSlcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiPG5hdGl2ZSBmbj5cIjtcbiAgICB9XG59XG5cbmNsYXNzIERlZmF1bHRCdW5hRnVuY3Rpb25TdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKGFyZ3MpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBhcmdzLnN0YXR1c1xuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjYWxsKGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXR1cylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiPG5hdGl2ZSBmbj5cIjtcbiAgICB9XG59XG5cbmNsYXNzIERlZmF1bHRCdW5GdW5jdGlvbkdldCB7XG4gICAgY29uc3RydWN0b3IoYXJncykge1xuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG5cbiAgICBjYWxsKGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgICAgIGxldCB2YWwgPSBKU09OLnBhcnNlKGFyZ3NbMF0pXG4gICAgICAgIGxldCBrZXkgPSBhcmdzWzFdXG4gICAgICAgIHJldHVybiB2YWxba2V5XVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8bmF0aXZlIGZuPlwiO1xuICAgIH1cbn1cblxuY2xhc3MgRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgICAgIGxldCBteUVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMubXlFbWl0dGVyID0gbXlFbWl0dGVyXG4gICAgICAgIHRoaXMubXlFbWl0dGVyLm9uKFwiY2hhbmdlZFwiLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICBhcmdzLm15RXZlbnR0ZXIuZW1pdCgnZXZlbnQnLCBvYmopXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXJpdHkoKSB7XG4gICAgICAgIHJldHVybiA1O1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgbGV0IG9iaiA9IHt9XG4gICAgICAgIG9iai5uYW1lID0gYXJnc1swXVxuICAgICAgICBvYmouc3ltYm9sID0gYXJnc1sxXVxuICAgICAgICBvYmouZGVjaW1hbHMgPSBhcmdzWzJdXG4gICAgICAgIG9iai50b3RhbEFtb3VudCA9IGFyZ3NbM11cbiAgICAgICAgb2JqLm90aGVycyA9IGFyZ3NbNF1cbiAgICAgICAgdGhpcy5teUVtaXR0ZXIuZW1pdChcImNoYW5nZWRcIiwgb2JqKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCI8bmF0aXZlIGZuPlwiO1xuICAgIH1cbn1cblxuY2xhc3MgRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZSB7XG4gICAgY29uc3RydWN0b3IoYXJncykge1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBhcmdzLmJhbGFuY2VcbiAgICAgICAgbGV0IG15RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5teUVtaXR0ZXIgPSBteUVtaXR0ZXJcbiAgICAgICAgdGhpcy5teUVtaXR0ZXIub24oXCJjaGFuZ2VkXCIsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIGFyZ3MubXlFdmVudHRlci5lbWl0KCdldmVudCcsIG9iailcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhcml0eSgpIHtcbiAgICAgICAgcmV0dXJuIDM7XG4gICAgfVxuXG4gICAgY2FsbChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBKU09OLnBhcnNlKGFyZ3NbMF0pXG4gICAgICAgIGxldCBiYWxhbmNlZSA9IHRoaXMuYmFsYW5jZVthcmdzWzFdXVxuICAgICAgICBiYWxhbmNlZSA9IGFyZ3NbMl1cbiAgICAgICAgdGhpcy5iYWxhbmNlW2FyZ3NbMV1dID0gYmFsYW5jZWUudG9TdHJpbmcoKVxuICAgICAgICAvLyB0aGlzLmJhbGFuY2VbXCJiYWxhbmNpbmdcIl0gPSBhcmdzWzJdXG4gICAgICAgIHRoaXMubXlFbWl0dGVyLmVtaXQoXCJjaGFuZ2VkXCIsIHtiYWxhbmNlOiB0aGlzLmJhbGFuY2UsIHRhZzogMX0pXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmJhbGFuY2UpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIjxuYXRpdmUgZm4+XCI7XG4gICAgfVxufVxuXG5jbGFzcyBEZWZhdWx0RnVuY3Rpb25TZXRTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKGFyZ3MpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBhcmdzLnN0YXR1c1xuICAgICAgICBsZXQgbXlFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLm15RW1pdHRlciA9IG15RW1pdHRlclxuICAgICAgICB0aGlzLm15RW1pdHRlci5vbihcImNoYW5nZWRcIiwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgYXJncy5teUV2ZW50dGVyLmVtaXQoJ2V2ZW50Jywgb2JqKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgYXJpdHkoKSB7XG4gICAgICAgIHJldHVybiA0O1xuICAgIH1cblxuICAgIGNhbGwoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBKU09OLnBhcnNlKGFyZ3NbMF0pXG4gICAgICAgIHRoaXMuc3RhdHVzW2FyZ3NbMV1dW2FyZ3NbMl1dID0gYXJnc1szXVxuICAgICAgICB0aGlzLm15RW1pdHRlci5lbWl0KFwiY2hhbmdlZFwiLCB7c3RhdHVzOiB0aGlzLnN0YXR1c30pXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXR1cylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiPG5hdGl2ZSBmbj5cIjtcbiAgICB9XG59XG5cblxuY2xhc3MgQnVuYUZ1bmN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihkZWNsYXJhdGlvbiwgY2xvc3VyZSwgaXNJbml0aWFsaXplcikge1xuICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gZGVjbGFyYXRpb247XG4gICAgICAgIHRoaXMuY2xvc3VyZSA9IGNsb3N1cmU7XG4gICAgICAgIHRoaXMuaXNJbml0aWFsaXplciA9IGlzSW5pdGlhbGl6ZXI7XG4gICAgfVxuXG4gICAgYXJpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnBhcmFtcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgY2FsbChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICBsZXQgZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQodGhpcy5jbG9zdXJlKTtcblxuICAgICAgICB0aGlzLmRlY2xhcmF0aW9uLnBhcmFtcy5mb3JFYWNoKChwYXJhbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGVudmlyb25tZW50LmRlZmluZShwYXJhbS5sZXhlbWUsIGFyZ3NbaW5kZXhdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGludGVycHJldGVyLmV4ZWN1dGVCbG9jayh0aGlzLmRlY2xhcmF0aW9uLmJvZHksIGVudmlyb25tZW50KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBSZXR1cm5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zdXJlLmdldEF0KDAsIFwidGhpc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc3VyZS5nZXRBdCgwLCBcInRoaXNcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBiaW5kKGluc3RhbmNlKSB7XG4gICAgICAgIGxldCBlbnZpcm9ubWVudCA9IG5ldyBFbnZpcm9ubWVudCh0aGlzLmNsb3N1cmUpO1xuICAgICAgICBlbnZpcm9ubWVudC5kZWZpbmUoXCJ0aGlzXCIsIGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCdW5hRnVuY3Rpb24odGhpcy5kZWNsYXJhdGlvbiwgZW52aXJvbm1lbnQsIHRoaXMuaXNJbml0aWFsaXplcik7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIjxmbiBcIiArIHRoaXMuZGVjbGFyYXRpb24ubmFtZS5sZXhlbWUgKyBcIj5cIjtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgRGVmYXVsdEJ1bmFGdW5jdGlvbixcbiAgICBCdW5hRnVuY3Rpb24sXG4gICAgRGVmYXVsdEJ1bmFGdW5jdGlvbkJhbGFuY2UsXG4gICAgRGVmYXVsdEJ1bmFGdW5jdGlvbk1zZyxcbiAgICBEZWZhdWx0QnVuYUZ1bmN0aW9uU3RhdHVzLFxuICAgIERlZmF1bHRCdW5GdW5jdGlvbkdldCxcbiAgICBEZWZhdWx0RnVuY3Rpb25TZXRPYmplY3QsXG4gICAgRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZSxcbiAgICBEZWZhdWx0RnVuY3Rpb25TZXRTdGF0dXNcblxufSJdfQ==