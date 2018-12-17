'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _tokenType = require('./tokenType');var TokenType = _interopRequireWildcard(_tokenType);
var _lexer = require('./lexer');var _lexer2 = _interopRequireDefault(_lexer);
var _error = require('./error');
var _readline = require('./readline');var _readline2 = _interopRequireDefault(_readline);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var readFile = require('fs-readfile-promise');
var events = require('events');

var _instance = null;var

Buna = function () {
    function Buna(balnace, message, status, gasMount) {var _this = this;(0, _classCallCheck3.default)(this, Buna);
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
        this.gasMount = gasMount;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hLmpzIl0sIm5hbWVzIjpbIlRva2VuVHlwZSIsInJlYWRGaWxlIiwicmVxdWlyZSIsImV2ZW50cyIsIl9pbnN0YW5jZSIsIkJ1bmEiLCJiYWxuYWNlIiwibWVzc2FnZSIsInN0YXR1cyIsImdhc01vdW50IiwiYmFsYW5jZSIsImFiaSIsInRva2VuIiwib3RoZXJzIiwibmFtZSIsInN5bWJvbCIsImRlY2ltYWxzIiwidG90YWxBbW91bnQiLCJ0YWciLCJoYWRFcnJvciIsImhhZFJ1bnRpbWVFcnJvciIsInByb2Nlc3MiLCJzdGRpbiIsInJlc3VtZSIsIm15RXZlbnR0ZXIiLCJvbiIsImtleSIsIm9iaiIsImFyZ3MiLCJydW5Qcm9tcHQiLCJsZW5ndGgiLCJydW5GaWxlIiwiY29uc29sZSIsImxvZyIsInBhdGgiLCJ0aGF0IiwidGhlbiIsImRhdGEiLCJydW4iLCJ0b1N0cmluZyIsImNhdGNoIiwiZXJyIiwiZXhpdCIsInJlYWRMaW5lIiwicmVhZGxpbmUiLCJzb3VyY2UiLCJsZXhlciIsIkxleGVyIiwicnVuSW50ZXJwcmV0ZXIiLCJydW5HZXRUb2tlbiIsInJ1bkludGVycHJldGVyVG9rZW4iLCJ0eXBlIiwiRU9GIiwicmVwb3J0IiwibGluZSIsImxleGVtZSIsIndoZXJlIiwiUnVudGltZUVycm9yIl0sIm1hcHBpbmdzIjoiNlVBQUEsd0MsSUFBWUEsUztBQUNaLGdDO0FBQ0E7QUFDQSxzQzs7QUFFQSxJQUFJQyxXQUFXQyxRQUFRLHFCQUFSLENBQWY7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLFFBQVIsQ0FBYjs7QUFFQSxJQUFJRSxZQUFZLElBQWhCLEM7O0FBRXFCQyxJO0FBQ2pCLGtCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsTUFBOUIsRUFBc0NDLFFBQXRDLEVBQWdEO0FBQzVDLGFBQUtDLE9BQUwsR0FBZUosT0FBZjtBQUNBLGFBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLGFBQUtJLEdBQUwsR0FBVyxJQUFYO0FBQ0Es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LG1CQUFOLENBQTBCdEMsS0FBMUIsRUFBZ0MsSUFBaEM7QUFDSCxTOzs7Ozs7Ozs7O0FBVUdBLGEsRUFBT0wsTyxFQUFTO0FBQ2hCLGdCQUFJSyxNQUFNdUMsSUFBTixJQUFjbkQsVUFBVW9ELEdBQTVCLEVBQWlDO0FBQzdCLHFCQUFLQyxNQUFMLENBQVl6QyxNQUFNMEMsSUFBbEIsRUFBd0IsYUFBeEIsRUFBdUMvQyxPQUF2QztBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLOEMsTUFBTCxDQUFZekMsTUFBTTBDLElBQWxCLEVBQXdCLFVBQVUxQyxNQUFNMkMsTUFBaEIsR0FBeUIsR0FBakQsRUFBc0RoRCxPQUF0RDtBQUNIO0FBQ0osUzs7QUFFTStDLFksRUFBTUUsSyxFQUFPakQsTyxFQUFTO0FBQ3pCeUIsb0JBQVFDLEdBQVIsQ0FBWSxXQUFXcUIsSUFBWCxHQUFrQixTQUFsQixHQUE4QkUsS0FBOUIsR0FBc0MsSUFBdEMsR0FBNkNqRCxPQUF6RDtBQUNBLGlCQUFLWSxRQUFMLEdBQWdCLElBQWhCO0FBQ0gsUzs7QUFFWXNCLFcsRUFBSztBQUNkLGdCQUFJQSxlQUFlZ0IsbUJBQW5CLEVBQWlDO0FBQzdCekIsd0JBQVFDLEdBQVIsQ0FBWVEsSUFBSWxDLE9BQUosR0FBYyxTQUExQixFQUFxQ2tDLElBQUlBLEdBQUosQ0FBUWEsSUFBN0MsRUFBbUQsR0FBbkQ7QUFDSDtBQUNELGlCQUFLbEMsZUFBTCxHQUF1QixJQUF2QjtBQUNILFMsMERBekJtQixDQUNoQixJQUFJaEIsYUFBYSxJQUFqQixFQUF1QixDQUNuQkEsWUFBWSxJQUFJQyxJQUFKLEVBQVosQ0FDSCxDQUNELE9BQU9ELFNBQVAsQ0FDSCxDLHVDQWpHZ0JDLEkiLCJmaWxlIjoiYnVuYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQgTGV4ZXIgZnJvbSAnLi9sZXhlcic7XG5pbXBvcnQge1J1bnRpbWVFcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcbmltcG9ydCByZWFkTGluZSBmcm9tICcuL3JlYWRsaW5lJztcblxudmFyIHJlYWRGaWxlID0gcmVxdWlyZSgnZnMtcmVhZGZpbGUtcHJvbWlzZScpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG52YXIgX2luc3RhbmNlID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVuYSB7XG4gICAgY29uc3RydWN0b3IoYmFsbmFjZSwgbWVzc2FnZSwgc3RhdHVzLCBnYXNNb3VudCkge1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBiYWxuYWNlO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLmFiaSA9IG51bGw7XG4gICAgICAgIHRoaXMudG9rZW4gPW51bGw7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLm90aGVycyA9IG51bGw7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3ltYm9sID0gbnVsbDtcbiAgICAgICAgdGhpcy5kZWNpbWFscyA9IG51bGw7XG4gICAgICAgIHRoaXMudG90YWxBbW91bnQgPSBudWxsO1xuICAgICAgICB0aGlzLnRhZyA9IDA7XG4gICAgICAgIHRoaXMuaGFkRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYWRSdW50aW1lRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nYXNNb3VudCA9IGdhc01vdW50O1xuICAgICAgICBwcm9jZXNzLnN0ZGluLnJlc3VtZSgpO1xuICAgICAgICBfaW5zdGFuY2UgPSB0aGlzO1xuICAgICAgICBsZXQgbXlFdmVudHRlciA9IG5ldyBldmVudHMoKTtcbiAgICAgICAgdGhpcy5teUV2ZW50dGVyID0gbXlFdmVudHRlclxuICAgICAgICB0aGlzLm15RXZlbnR0ZXIub24oJ2V2ZW50Jywgb2JqID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBvYmpba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgbWFpbihhcmdzKSB7XG4gICAgICAgIGlmICghYXJncykge1xuICAgICAgICAgICAgdGhpcy5ydW5Qcm9tcHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bkZpbGUoYXJnc1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzYWdlOiBidW5hIFtzY3JpcHRdXCIpO1xuICAgICAgICAgICAgLy9wcm9jZXNzLmV4aXQoNjQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcnVuRmlsZShwYXRoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgcmVhZEZpbGUocGF0aClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5ydW4oZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5oYWRFcnJvcikgcmV0dXJuIC8vcHJvY2Vzcy5leGl0KDY1KTtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5oYWRSdW50aW1lRXJyb3IpIHJldHVybiAvLyBwcm9jZXNzLmV4aXQoNzApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bldlYihwYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnJ1bihwYXRoLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFkRXJyb3IpIHJldHVybiAvL3Byb2Nlc3MuZXhpdCg2NSk7XG4gICAgICAgICAgICBpZiAodGhpcy5oYWRSdW50aW1lRXJyb3IpIHJldHVybiBwcm9jZXNzLmV4aXQoNzApO1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcnVuUHJvbXB0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJ1bmEgMC40LjggKGRlZmF1bHQsIFNlcCAyOCAyMDE4LCAxNTowNDozNilcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dDQyA0LjIuMSBDb21wYXRpYmxlIEFwcGxlIExMVk0gNi4wIChjbGFuZy02MDAuMC4zOSldIG9uIGRhcndpblwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJUeXBlIFxcXCJoZWxwXFxcIiwgXFxcImNvcHlyaWdodFxcXCIsIFxcXCJjcmVkaXRzXFxcIiBvciBcXFwibGljZW5zZVxcXCIgZm9yIG1vcmUgaW5mb3JtYXRpb24uXCIpO1xuICAgICAgICBmb3IgKDsgOykge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZWFkTGluZS5yZWFkbGluZShcIj4gXCIpO1xuICAgICAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ydW4oZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgcnVuKHNvdXJjZSkge1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgTGV4ZXIoKTtcbiAgICAgICAgbGV4ZXIucnVuSW50ZXJwcmV0ZXIoc291cmNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBydW5HZXRUb2tlbihzb3VyY2UpIHtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IExleGVyKCk7XG4gICAgICAgIHJldHVybiBsZXhlci5ydW5HZXRUb2tlbihzb3VyY2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHJ1blRva2VuKHRva2VuKXtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IExleGVyKCk7XG4gICAgICAgIGxleGVyLnJ1bkludGVycHJldGVyVG9rZW4odG9rZW4sdGhpcyk7XG4gICAgfVxuXG5cbiAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKF9pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBfaW5zdGFuY2UgPSBuZXcgQnVuYSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgZXJyKHRva2VuLCBtZXNzYWdlKSB7XG4gICAgICAgIGlmICh0b2tlbi50eXBlID09IFRva2VuVHlwZS5FT0YpIHtcbiAgICAgICAgICAgIHRoaXMucmVwb3J0KHRva2VuLmxpbmUsIFwiIGF0IHRoZSBlbmRcIiwgbWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydCh0b2tlbi5saW5lLCBcIiBhdCAnXCIgKyB0b2tlbi5sZXhlbWUgKyBcIidcIiwgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXBvcnQobGluZSwgd2hlcmUsIG1lc3NhZ2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbbGluZSBcIiArIGxpbmUgKyBcIl0gRXJyb3JcIiArIHdoZXJlICsgXCI6IFwiICsgbWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaGFkRXJyb3IgPSB0cnVlO1xuICAgIH1cblxuICAgIHJ1bnRpbWVFcnJvcihlcnIpIHtcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFJ1bnRpbWVFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UgKyAnXFxuW2xpbmUnLCBlcnIuZXJyLmxpbmUsICddJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYWRSdW50aW1lRXJyb3IgPSB0cnVlO1xuICAgIH1cbn0iXX0=