'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _tokenType = require('./tokenType');var TokenType = _interopRequireWildcard(_tokenType);
var _lexer = require('./lexer');var _lexer2 = _interopRequireDefault(_lexer);
var _error = require('./error');
var _readline = require('./readline');var _readline2 = _interopRequireDefault(_readline);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var readFile = require('fs-readfile-promise');

var _instance = null;var

Buna = function () {
    function Buna() {(0, _classCallCheck3.default)(this, Buna);
        this.hadError = false;
        this.hadRuntimeError = false;
        process.stdin.resume();
        _instance = this;
    }(0, _createClass3.default)(Buna, [{ key: 'runWeb', value: function runWeb(

























        path) {
            try {
                this.run(path.toString());
                if (this.hadError) process.exit(65);
                if (this.hadRuntimeError) process.exit(70);
                process.exit(1);
            } catch (err) {
                process.exit(1);
            }
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
        } }], [{ key: 'main', value: function main(args) {if (!args) {this.runPrompt();} else if (args.length == 1) {this.runFile(args[0]);} else {console.log("Usage: buna [script]");process.exit(64);}} }, { key: 'runFile', value: function runFile(path) {var that = this;readFile(path).then(function (data) {that.run(data.toString());if (that.hadError) process.exit(65);if (that.hadRuntimeError) process.exit(70);}).catch(function (err) {console.log(err);});} }, { key: 'runPrompt', value: function runPrompt() {console.log("Buna 0.4.8 (default, Sep 28 2018, 15:04:36)");console.log("[GCC 4.2.1 Compatible Apple LLVM 6.0 (clang-600.0.39)] on darwin");console.log("Type \"help\", \"copyright\", \"credits\" or \"license\" for more information.");for (;;) {var data = _readline2.default.readline("> ");if (data == null) {break;}this.run(data.toString());}} }, { key: 'run', value: function run(source) {var lexer = new _lexer2.default(); //lexer.run(source);
            //lexer.runParser(source);
            lexer.runInterpreter(source);} }, { key: 'getInstance', value: function getInstance() {if (_instance == null) {_instance = new Buna();}return _instance;} }]);return Buna;}();exports.default = Buna;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hLmpzIl0sIm5hbWVzIjpbIlRva2VuVHlwZSIsInJlYWRGaWxlIiwicmVxdWlyZSIsIl9pbnN0YW5jZSIsIkJ1bmEiLCJoYWRFcnJvciIsImhhZFJ1bnRpbWVFcnJvciIsInByb2Nlc3MiLCJzdGRpbiIsInJlc3VtZSIsInBhdGgiLCJydW4iLCJ0b1N0cmluZyIsImV4aXQiLCJlcnIiLCJ0b2tlbiIsIm1lc3NhZ2UiLCJ0eXBlIiwiRU9GIiwicmVwb3J0IiwibGluZSIsImxleGVtZSIsIndoZXJlIiwiY29uc29sZSIsImxvZyIsIlJ1bnRpbWVFcnJvciIsImFyZ3MiLCJydW5Qcm9tcHQiLCJsZW5ndGgiLCJydW5GaWxlIiwidGhhdCIsInRoZW4iLCJkYXRhIiwiY2F0Y2giLCJyZWFkTGluZSIsInJlYWRsaW5lIiwic291cmNlIiwibGV4ZXIiLCJMZXhlciIsInJ1bkludGVycHJldGVyIl0sIm1hcHBpbmdzIjoiNlVBQUEsd0MsSUFBWUEsUztBQUNaLGdDO0FBQ0E7QUFDQSxzQzs7QUFFQSxJQUFJQyxXQUFXQyxRQUFRLHFCQUFSLENBQWY7O0FBRUEsSUFBSUMsWUFBWSxJQUFoQixDOztBQUVxQkMsSTtBQUNqQixvQkFBYztBQUNWLGFBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxhQUFLQyxlQUFMLEdBQXVCLEtBQXZCO0FBQ0FDLGdCQUFRQyxLQUFSLENBQWNDLE1BQWQ7QUFDQU4sb0JBQVksSUFBWjtBQUNILEs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJNTyxZLEVBQU07QUFDVCxnQkFBRztBQUNDLHFCQUFLQyxHQUFMLENBQVNELEtBQUtFLFFBQUwsRUFBVDtBQUNBLG9CQUFJLEtBQUtQLFFBQVQsRUFBbUJFLFFBQVFNLElBQVIsQ0FBYSxFQUFiO0FBQ25CLG9CQUFJLEtBQUtQLGVBQVQsRUFBMEJDLFFBQVFNLElBQVIsQ0FBYSxFQUFiO0FBQzFCTix3QkFBUU0sSUFBUixDQUFhLENBQWI7QUFDSCxhQUxELENBS0MsT0FBTUMsR0FBTixFQUFVO0FBQ1BQLHdCQUFRTSxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0osUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkdFLGEsRUFBT0MsTyxFQUFTO0FBQ2hCLGdCQUFJRCxNQUFNRSxJQUFOLElBQWNqQixVQUFVa0IsR0FBNUIsRUFBaUM7QUFDN0IscUJBQUtDLE1BQUwsQ0FBWUosTUFBTUssSUFBbEIsRUFBd0IsYUFBeEIsRUFBdUNKLE9BQXZDO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUtHLE1BQUwsQ0FBWUosTUFBTUssSUFBbEIsRUFBd0IsVUFBVUwsTUFBTU0sTUFBaEIsR0FBeUIsR0FBakQsRUFBc0RMLE9BQXREO0FBQ0g7QUFDSixTOztBQUVNSSxZLEVBQU1FLEssRUFBT04sTyxFQUFTO0FBQ3pCTyxvQkFBUUMsR0FBUixDQUFZLFdBQVdKLElBQVgsR0FBa0IsU0FBbEIsR0FBOEJFLEtBQTlCLEdBQXNDLElBQXRDLEdBQTZDTixPQUF6RDtBQUNBLGlCQUFLWCxRQUFMLEdBQWdCLElBQWhCO0FBQ0gsUzs7QUFFWVMsVyxFQUFLO0FBQ2QsZ0JBQUdBLGVBQWVXLG1CQUFsQixFQUFnQztBQUM1QkYsd0JBQVFDLEdBQVIsQ0FBWVYsSUFBSUUsT0FBSixHQUFjLFNBQTFCLEVBQXFDRixJQUFJQSxHQUFKLENBQVFNLElBQTdDLEVBQW1ELEdBQW5EO0FBQ0g7QUFDRCxpQkFBS2QsZUFBTCxHQUF1QixJQUF2QjtBQUNILFMsMENBaEZXb0IsSSxFQUFNLENBQ2QsSUFBSSxDQUFDQSxJQUFMLEVBQVcsQ0FDUCxLQUFLQyxTQUFMLEdBQ0gsQ0FGRCxNQUVPLElBQUlELEtBQUtFLE1BQUwsSUFBZSxDQUFuQixFQUFzQixDQUN6QixLQUFLQyxPQUFMLENBQWFILEtBQUssQ0FBTCxDQUFiLEVBQ0gsQ0FGTSxNQUVBLENBQ0hILFFBQVFDLEdBQVIsQ0FBWSxzQkFBWixFQUNBakIsUUFBUU0sSUFBUixDQUFhLEVBQWIsRUFDSCxDQUNKLEMsOENBRWNILEksRUFBTSxDQUNqQixJQUFJb0IsT0FBTyxJQUFYLENBQ0E3QixTQUFTUyxJQUFULEVBQ0txQixJQURMLENBQ1UsVUFBU0MsSUFBVCxFQUFlLENBQ2pCRixLQUFLbkIsR0FBTCxDQUFTcUIsS0FBS3BCLFFBQUwsRUFBVCxFQUNKLElBQUlrQixLQUFLekIsUUFBVCxFQUFtQkUsUUFBUU0sSUFBUixDQUFhLEVBQWIsRUFDbkIsSUFBSWlCLEtBQUt4QixlQUFULEVBQTBCQyxRQUFRTSxJQUFSLENBQWEsRUFBYixFQUN6QixDQUxMLEVBTUtvQixLQU5MLENBTVcsVUFBU25CLEdBQVQsRUFBYyxDQUNqQlMsUUFBUUMsR0FBUixDQUFZVixHQUFaLEVBQ0gsQ0FSTCxFQVNILEMsb0RBYWtCLENBQ2ZTLFFBQVFDLEdBQVIsQ0FBWSw2Q0FBWixFQUNBRCxRQUFRQyxHQUFSLENBQVksa0VBQVosRUFDQUQsUUFBUUMsR0FBUixDQUFZLGdGQUFaLEVBQ0EsU0FBUyxDQUNMLElBQUlRLE9BQU9FLG1CQUFTQyxRQUFULENBQWtCLElBQWxCLENBQVgsQ0FDQSxJQUFJSCxRQUFRLElBQVosRUFBa0IsQ0FDZCxNQUNILENBQ0QsS0FBS3JCLEdBQUwsQ0FBU3FCLEtBQUtwQixRQUFMLEVBQVQsRUFDSCxDQUNKLEMsc0NBRVN3QixNLEVBQVEsQ0FDZCxJQUFJQyxRQUFRLElBQUlDLGVBQUosRUFBWixDQURjLENBRWQ7QUFDQTtBQUNBRCxrQkFBTUUsY0FBTixDQUFxQkgsTUFBckIsRUFDSCxDLHdEQUVvQixDQUNqQixJQUFJakMsYUFBYSxJQUFqQixFQUF1QixDQUNuQkEsWUFBWSxJQUFJQyxJQUFKLEVBQVosQ0FDSCxDQUNELE9BQU9ELFNBQVAsQ0FDSCxDLHVDQXBFZ0JDLEkiLCJmaWxlIjoiYnVuYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQgTGV4ZXIgZnJvbSAnLi9sZXhlcic7XG5pbXBvcnQge1J1bnRpbWVFcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcbmltcG9ydCByZWFkTGluZSBmcm9tICcuL3JlYWRsaW5lJztcblxudmFyIHJlYWRGaWxlID0gcmVxdWlyZSgnZnMtcmVhZGZpbGUtcHJvbWlzZScpO1xuXG52YXIgX2luc3RhbmNlID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVuYSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaGFkRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYWRSdW50aW1lRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgcHJvY2Vzcy5zdGRpbi5yZXN1bWUoKTtcbiAgICAgICAgX2luc3RhbmNlID0gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFpbihhcmdzKSB7XG4gICAgICAgIGlmICghYXJncykge1xuICAgICAgICAgICAgdGhpcy5ydW5Qcm9tcHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bkZpbGUoYXJnc1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzYWdlOiBidW5hIFtzY3JpcHRdXCIpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDY0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBydW5GaWxlKHBhdGgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICByZWFkRmlsZShwYXRoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoYXQucnVuKGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBpZiAodGhhdC5oYWRFcnJvcikgcHJvY2Vzcy5leGl0KDY1KTtcbiAgICAgICAgICAgIGlmICh0aGF0LmhhZFJ1bnRpbWVFcnJvcikgcHJvY2Vzcy5leGl0KDcwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bldlYihwYXRoKSB7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMucnVuKHBhdGgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5oYWRFcnJvcikgcHJvY2Vzcy5leGl0KDY1KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhZFJ1bnRpbWVFcnJvcikgcHJvY2Vzcy5leGl0KDcwKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfWNhdGNoKGVycil7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgcnVuUHJvbXB0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJ1bmEgMC40LjggKGRlZmF1bHQsIFNlcCAyOCAyMDE4LCAxNTowNDozNilcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dDQyA0LjIuMSBDb21wYXRpYmxlIEFwcGxlIExMVk0gNi4wIChjbGFuZy02MDAuMC4zOSldIG9uIGRhcndpblwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJUeXBlIFxcXCJoZWxwXFxcIiwgXFxcImNvcHlyaWdodFxcXCIsIFxcXCJjcmVkaXRzXFxcIiBvciBcXFwibGljZW5zZVxcXCIgZm9yIG1vcmUgaW5mb3JtYXRpb24uXCIpO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlYWRMaW5lLnJlYWRsaW5lKFwiPiBcIik7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJ1bihkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICBzdGF0aWMgcnVuKHNvdXJjZSkge1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgTGV4ZXIoKTtcbiAgICAgICAgLy9sZXhlci5ydW4oc291cmNlKTtcbiAgICAgICAgLy9sZXhlci5ydW5QYXJzZXIoc291cmNlKTtcbiAgICAgICAgbGV4ZXIucnVuSW50ZXJwcmV0ZXIoc291cmNlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmIChfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgX2luc3RhbmNlID0gbmV3IEJ1bmEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2luc3RhbmNlO1xuICAgIH1cblxuICAgIGVycih0b2tlbiwgbWVzc2FnZSkge1xuICAgICAgICBpZiAodG9rZW4udHlwZSA9PSBUb2tlblR5cGUuRU9GKSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydCh0b2tlbi5saW5lLCBcIiBhdCB0aGUgZW5kXCIsIG1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXBvcnQodG9rZW4ubGluZSwgXCIgYXQgJ1wiICsgdG9rZW4ubGV4ZW1lICsgXCInXCIsIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVwb3J0KGxpbmUsIHdoZXJlLCBtZXNzYWdlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xpbmUgXCIgKyBsaW5lICsgXCJdIEVycm9yXCIgKyB3aGVyZSArIFwiOiBcIiArIG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmhhZEVycm9yID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBydW50aW1lRXJyb3IoZXJyKSB7XG4gICAgICAgIGlmKGVyciBpbnN0YW5jZW9mIFJ1bnRpbWVFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UgKyAnXFxuW2xpbmUnLCBlcnIuZXJyLmxpbmUsICddJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYWRSdW50aW1lRXJyb3IgPSB0cnVlO1xuICAgIH1cbn0iXX0=