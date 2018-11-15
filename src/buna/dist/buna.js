'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _tokenType = require('./tokenType');var TokenType = _interopRequireWildcard(_tokenType);
var _lexer = require('./lexer');var _lexer2 = _interopRequireDefault(_lexer);
var _error = require('./error');
var _readline = require('./readline');var _readline2 = _interopRequireDefault(_readline);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var readFile = require('fs-readfile-promise');
var events = require('events');

var _instance = null;var

Buna = function () {
    function Buna(balnace, message, status) {var _this = this;(0, _classCallCheck3.default)(this, Buna);
        this.balance = balnace;
        this.message = message;
        this.abi = null;
        this.token = null;
        this.status = status;
        this.others = null;
        this.name = null;
        this.symbol = null;
        this.decimals = null;
        this.totalAmount = null;
        this.tag = 0;
        this.hadError = false;
        this.hadRuntimeError = false;
        process.stdin.resume();
        _instance = this;
        var myEventter = new events();
        this.myEventter = myEventter;
        this.myEventter.on('event', function (obj) {
            for (var key in obj) {
                _this[key] = obj[key];
            }
        });

    }(0, _createClass3.default)(Buna, [{ key: 'main', value: function main(

        args) {
            if (!args) {
                this.runPrompt();
            } else if (args.length == 1) {
                this.runFile(args[0]);
            } else {
                console.log("Usage: buna [script]");
                //process.exit(64);
            }
        } }, { key: 'runFile', value: function runFile(

        path) {
            var that = this;
            readFile(path).
            then(function (data) {
                that.run(data.toString());
                if (that.hadError) return; //process.exit(65);
                if (that.hadRuntimeError) return; // process.exit(70);
            }).
            catch(function (err) {
                console.log(err);
            });
        } }, { key: 'runWeb', value: function runWeb(

        path) {
            try {
                this.run(path.toString());
                if (this.hadError) return; //process.exit(65);
                if (this.hadRuntimeError) return process.exit(70);
                // process.exit(1);
            } catch (err) {
                //process.exit(1);
            }
        } }, { key: 'runPrompt', value: function runPrompt()

        {
            console.log("Buna 0.4.8 (default, Sep 28 2018, 15:04:36)");
            console.log("[GCC 4.2.1 Compatible Apple LLVM 6.0 (clang-600.0.39)] on darwin");
            console.log("Type \"help\", \"copyright\", \"credits\" or \"license\" for more information.");
            for (;;) {
                var data = _readline2.default.readline("> ");
                if (data == null) {
                    break;
                }
                this.run(data.toString());
            }
        } }, { key: 'run', value: function run(

        source) {
            var lexer = new _lexer2.default();
            lexer.runInterpreter(source, this);
        } }, { key: 'runGetToken', value: function runGetToken(

        source) {
            var lexer = new _lexer2.default();
            return lexer.runGetToken(source, this);
        } }, { key: 'runToken', value: function runToken(

        token) {
            var lexer = new _lexer2.default();
            lexer.runInterpreterToken(token, this);
        } }, { key: 'err', value: function err(









        token, message) {
            if (token.type == TokenType.EOF) {
                this.report(token.line, " at the end", message);
            } else {
                this.report(token.line, " at '" + token.lexeme + "'", message);
            }
        } }, { key: 'report', value: function report(

        line, where, message) {
            console.log("[line " + line + "] Error" + where + ": " + message);
            this.hadError = true;
        } }, { key: 'runtimeError', value: function runtimeError(

        err) {
            if (err instanceof _error.RuntimeError) {
                console.log(err.message + '\n[line', err.err.line, ']');
            }
            this.hadRuntimeError = true;
        } }], [{ key: 'getInstance', value: function getInstance() {if (_instance == null) {_instance = new Buna();}return _instance;} }]);return Buna;}();exports.default = Buna;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hLmpzIl0sIm5hbWVzIjpbIlRva2VuVHlwZSIsInJlYWRGaWxlIiwicmVxdWlyZSIsImV2ZW50cyIsIl9pbnN0YW5jZSIsIkJ1bmEiLCJiYWxuYWNlIiwibWVzc2FnZSIsInN0YXR1cyIsImJhbGFuY2UiLCJhYmkiLCJ0b2tlbiIsIm90aGVycyIsIm5hbWUiLCJzeW1ib2wiLCJkZWNpbWFscyIsInRvdGFsQW1vdW50IiwidGFnIiwiaGFkRXJyb3IiLCJoYWRSdW50aW1lRXJyb3IiLCJwcm9jZXNzIiwic3RkaW4iLCJyZXN1bWUiLCJteUV2ZW50dGVyIiwib24iLCJrZXkiLCJvYmoiLCJhcmdzIiwicnVuUHJvbXB0IiwibGVuZ3RoIiwicnVuRmlsZSIsImNvbnNvbGUiLCJsb2ciLCJwYXRoIiwidGhhdCIsInRoZW4iLCJkYXRhIiwicnVuIiwidG9TdHJpbmciLCJjYXRjaCIsImVyciIsImV4aXQiLCJyZWFkTGluZSIsInJlYWRsaW5lIiwic291cmNlIiwibGV4ZXIiLCJMZXhlciIsInJ1bkludGVycHJldGVyIiwicnVuR2V0VG9rZW4iLCJydW5JbnRlcnByZXRlclRva2VuIiwidHlwZSIsIkVPRiIsInJlcG9ydCIsImxpbmUiLCJsZXhlbWUiLCJ3aGVyZSIsIlJ1bnRpbWVFcnJvciJdLCJtYXBwaW5ncyI6IjZVQUFBLHdDLElBQVlBLFM7QUFDWixnQztBQUNBO0FBQ0Esc0M7O0FBRUEsSUFBSUMsV0FBV0MsUUFBUSxxQkFBUixDQUFmO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSxRQUFSLENBQWI7O0FBRUEsSUFBSUUsWUFBWSxJQUFoQixDOztBQUVxQkMsSTtBQUNqQixrQkFBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBOEJDLE1BQTlCLEVBQXNDO0FBQ2xDLGFBQUtDLE9BQUwsR0FBZUgsT0FBZjtBQUNBLGFBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLGFBQUtHLEdBQUwsR0FBVyxJQUFYO0FBQ0EsYUFBS0MsS0FBTCxHQUFZLElBQVo7QUFD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QSxhLEVBQU9KLE8sRUFBUztBQUNoQixnQkFBSUksTUFBTXVDLElBQU4sSUFBY2xELFVBQVVtRCxHQUE1QixFQUFpQztBQUM3QixxQkFBS0MsTUFBTCxDQUFZekMsTUFBTTBDLElBQWxCLEVBQXdCLGFBQXhCLEVBQXVDOUMsT0FBdkM7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSzZDLE1BQUwsQ0FBWXpDLE1BQU0wQyxJQUFsQixFQUF3QixVQUFVMUMsTUFBTTJDLE1BQWhCLEdBQXlCLEdBQWpELEVBQXNEL0MsT0FBdEQ7QUFDSDtBQUNKLFM7O0FBRU04QyxZLEVBQU1FLEssRUFBT2hELE8sRUFBUztBQUN6QndCLG9CQUFRQyxHQUFSLENBQVksV0FBV3FCLElBQVgsR0FBa0IsU0FBbEIsR0FBOEJFLEtBQTlCLEdBQXNDLElBQXRDLEdBQTZDaEQsT0FBekQ7QUFDQSxpQkFBS1csUUFBTCxHQUFnQixJQUFoQjtBQUNILFM7O0FBRVlzQixXLEVBQUs7QUFDZCxnQkFBSUEsZUFBZWdCLG1CQUFuQixFQUFpQztBQUM3QnpCLHdCQUFRQyxHQUFSLENBQVlRLElBQUlqQyxPQUFKLEdBQWMsU0FBMUIsRUFBcUNpQyxJQUFJQSxHQUFKLENBQVFhLElBQTdDLEVBQW1ELEdBQW5EO0FBQ0g7QUFDRCxpQkFBS2xDLGVBQUwsR0FBdUIsSUFBdkI7QUFDSCxTLDBEQXpCbUIsQ0FDaEIsSUFBSWYsYUFBYSxJQUFqQixFQUF1QixDQUNuQkEsWUFBWSxJQUFJQyxJQUFKLEVBQVosQ0FDSCxDQUNELE9BQU9ELFNBQVAsQ0FDSCxDLHVDQWhHZ0JDLEkiLCJmaWxlIjoiYnVuYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQgTGV4ZXIgZnJvbSAnLi9sZXhlcic7XG5pbXBvcnQge1J1bnRpbWVFcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcbmltcG9ydCByZWFkTGluZSBmcm9tICcuL3JlYWRsaW5lJztcblxudmFyIHJlYWRGaWxlID0gcmVxdWlyZSgnZnMtcmVhZGZpbGUtcHJvbWlzZScpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG52YXIgX2luc3RhbmNlID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVuYSB7XG4gICAgY29uc3RydWN0b3IoYmFsbmFjZSwgbWVzc2FnZSwgc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGJhbG5hY2U7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuYWJpID0gbnVsbDtcbiAgICAgICAgdGhpcy50b2tlbiA9bnVsbDtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMub3RoZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSBudWxsO1xuICAgICAgICB0aGlzLmRlY2ltYWxzID0gbnVsbDtcbiAgICAgICAgdGhpcy50b3RhbEFtb3VudCA9IG51bGw7XG4gICAgICAgIHRoaXMudGFnID0gMDtcbiAgICAgICAgdGhpcy5oYWRFcnJvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhZFJ1bnRpbWVFcnJvciA9IGZhbHNlO1xuICAgICAgICBwcm9jZXNzLnN0ZGluLnJlc3VtZSgpO1xuICAgICAgICBfaW5zdGFuY2UgPSB0aGlzO1xuICAgICAgICBsZXQgbXlFdmVudHRlciA9IG5ldyBldmVudHMoKTtcbiAgICAgICAgdGhpcy5teUV2ZW50dGVyID0gbXlFdmVudHRlclxuICAgICAgICB0aGlzLm15RXZlbnR0ZXIub24oJ2V2ZW50Jywgb2JqID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBvYmpba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgbWFpbihhcmdzKSB7XG4gICAgICAgIGlmICghYXJncykge1xuICAgICAgICAgICAgdGhpcy5ydW5Qcm9tcHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bkZpbGUoYXJnc1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzYWdlOiBidW5hIFtzY3JpcHRdXCIpO1xuICAgICAgICAgICAgLy9wcm9jZXNzLmV4aXQoNjQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcnVuRmlsZShwYXRoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgcmVhZEZpbGUocGF0aClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5ydW4oZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5oYWRFcnJvcikgcmV0dXJuIC8vcHJvY2Vzcy5leGl0KDY1KTtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5oYWRSdW50aW1lRXJyb3IpIHJldHVybiAvLyBwcm9jZXNzLmV4aXQoNzApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bldlYihwYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnJ1bihwYXRoLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFkRXJyb3IpIHJldHVybiAvL3Byb2Nlc3MuZXhpdCg2NSk7XG4gICAgICAgICAgICBpZiAodGhpcy5oYWRSdW50aW1lRXJyb3IpIHJldHVybiBwcm9jZXNzLmV4aXQoNzApO1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcnVuUHJvbXB0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJ1bmEgMC40LjggKGRlZmF1bHQsIFNlcCAyOCAyMDE4LCAxNTowNDozNilcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dDQyA0LjIuMSBDb21wYXRpYmxlIEFwcGxlIExMVk0gNi4wIChjbGFuZy02MDAuMC4zOSldIG9uIGRhcndpblwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJUeXBlIFxcXCJoZWxwXFxcIiwgXFxcImNvcHlyaWdodFxcXCIsIFxcXCJjcmVkaXRzXFxcIiBvciBcXFwibGljZW5zZVxcXCIgZm9yIG1vcmUgaW5mb3JtYXRpb24uXCIpO1xuICAgICAgICBmb3IgKDsgOykge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZWFkTGluZS5yZWFkbGluZShcIj4gXCIpO1xuICAgICAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ydW4oZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgcnVuKHNvdXJjZSkge1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgTGV4ZXIoKTtcbiAgICAgICAgbGV4ZXIucnVuSW50ZXJwcmV0ZXIoc291cmNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBydW5HZXRUb2tlbihzb3VyY2UpIHtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IExleGVyKCk7XG4gICAgICAgIHJldHVybiBsZXhlci5ydW5HZXRUb2tlbihzb3VyY2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHJ1blRva2VuKHRva2VuKXtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IExleGVyKCk7XG4gICAgICAgIGxleGVyLnJ1bkludGVycHJldGVyVG9rZW4odG9rZW4sdGhpcyk7XG4gICAgfVxuXG5cbiAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKF9pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBfaW5zdGFuY2UgPSBuZXcgQnVuYSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgZXJyKHRva2VuLCBtZXNzYWdlKSB7XG4gICAgICAgIGlmICh0b2tlbi50eXBlID09IFRva2VuVHlwZS5FT0YpIHtcbiAgICAgICAgICAgIHRoaXMucmVwb3J0KHRva2VuLmxpbmUsIFwiIGF0IHRoZSBlbmRcIiwgbWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydCh0b2tlbi5saW5lLCBcIiBhdCAnXCIgKyB0b2tlbi5sZXhlbWUgKyBcIidcIiwgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXBvcnQobGluZSwgd2hlcmUsIG1lc3NhZ2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbbGluZSBcIiArIGxpbmUgKyBcIl0gRXJyb3JcIiArIHdoZXJlICsgXCI6IFwiICsgbWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaGFkRXJyb3IgPSB0cnVlO1xuICAgIH1cblxuICAgIHJ1bnRpbWVFcnJvcihlcnIpIHtcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFJ1bnRpbWVFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UgKyAnXFxuW2xpbmUnLCBlcnIuZXJyLmxpbmUsICddJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYWRSdW50aW1lRXJyb3IgPSB0cnVlO1xuICAgIH1cbn0iXX0=