'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _scanner = require('./scanner');var _scanner2 = _interopRequireDefault(_scanner);
var _parser = require('./parser');var _parser2 = _interopRequireDefault(_parser);
var _astPrinter = require('./astPrinter');var _astPrinter2 = _interopRequireDefault(_astPrinter);
var _interpreter = require('./interpreter');var _interpreter2 = _interopRequireDefault(_interpreter);
var _resolver = require('./resolver');var _resolver2 = _interopRequireDefault(_resolver);
var _buna = require('./buna');var _buna2 = _interopRequireDefault(_buna);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var interpreter = null;var

Lexer = function () {
    function Lexer() {(0, _classCallCheck3.default)(this, Lexer);
    }(0, _createClass3.default)(Lexer, [{ key: 'run', value: function run(

        source) {
            this.scanner = new _scanner2.default(source);
            this.scanner.scanTokens();
            var tokens = this.scanner.tokens;
            tokens.forEach(function (token) {
                console.log(token.toString());
            });
            return tokens;
        } }, { key: 'runParser', value: function runParser(

        source) {
            this.scanner = new _scanner2.default(source);
            this.scanner.scanTokens();
            var tokens = this.scanner.tokens;
            var parser = new _parser2.default(tokens);
            var expression = parser.parse();
            console.log(new _astPrinter2.default().print(expression));
        } }, { key: 'runGetToken', value: function runGetToken(

        source, data) {
            this.scanner = new _scanner2.default(source);
            this.scanner.scanTokens();
            data.token = this.scanner.tokens;
            return data;
        } }, { key: 'runInterpreter', value: function runInterpreter(

        source, data) {
            this.scanner = new _scanner2.default(source);
            this.scanner.scanTokens();
            var tokens = this.scanner.tokens;
            data.token = tokens;
            var parser = new _parser2.default(tokens);
            var statements = parser.parse();
            if (_buna2.default.getInstance().hadError) return;
            interpreter = new _interpreter2.default(data);
            //         // if (interpreter == null) {
            //     interpreter = new Interpreter(data);
            // }
            try {
                var resolver = new _resolver2.default(interpreter);
                resolver.resolve(statements);

                // Stop if there was a resolution error.
                if (_buna2.default.getInstance().hadError) return;
                interpreter.interpret(statements, data);
            } catch (e) {
                console.log(e);
            }
        } }, { key: 'runInterpreterToken', value: function runInterpreterToken(

        tokens, data) {
            data.token = tokens;
            console.log(tokens.length);
            var parser = new _parser2.default(tokens);
            var statements = parser.parse();
            if (_buna2.default.getInstance().hadError) return;
            interpreter = new _interpreter2.default(data);
            //         // if (interpreter == null) {
            //     console.log("data>>>>>>>",data)
            //     interpreter = new Interpreter(data);
            // }
            try {
                var resolver = new _resolver2.default(interpreter);
                resolver.resolve(statements);

                // Stop if there was a resolution error.
                if (_buna2.default.getInstance().hadError) return;
                interpreter.interpret(statements, data);
            } catch (e) {
                console.log(e);
            }
        } }]);return Lexer;}();exports.default = Lexer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9sZXhlci5qcyJdLCJuYW1lcyI6WyJpbnRlcnByZXRlciIsIkxleGVyIiwic291cmNlIiwic2Nhbm5lciIsIlNjYW5uZXIiLCJzY2FuVG9rZW5zIiwidG9rZW5zIiwiZm9yRWFjaCIsInRva2VuIiwiY29uc29sZSIsImxvZyIsInRvU3RyaW5nIiwicGFyc2VyIiwiUGFyc2VyIiwiZXhwcmVzc2lvbiIsInBhcnNlIiwiQXN0UHJpbnRlciIsInByaW50IiwiZGF0YSIsInN0YXRlbWVudHMiLCJCdW5hIiwiZ2V0SW5zdGFuY2UiLCJoYWRFcnJvciIsIkludGVycHJldGVyIiwicmVzb2x2ZXIiLCJSZXNvbHZlciIsInJlc29sdmUiLCJpbnRlcnByZXQiLCJlIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiNlVBQUEsb0M7QUFDQSxrQztBQUNBLDBDO0FBQ0EsNEM7QUFDQSxzQztBQUNBLDhCOztBQUVBLElBQUlBLGNBQWMsSUFBbEIsQzs7QUFFcUJDLEs7QUFDakIscUJBQWM7QUFDYixLOztBQUVHQyxjLEVBQVE7QUFDUixpQkFBS0MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLENBQVlGLE1BQVosQ0FBZjtBQUNBLGlCQUFLQyxPQUFMLENBQWFFLFVBQWI7QUFDQSxnQkFBSUMsU0FBUyxLQUFLSCxPQUFMLENBQWFHLE1BQTFCO0FBQ0FBLG1CQUFPQyxPQUFQLENBQWUsVUFBQ0MsS0FBRCxFQUFXO0FBQ3RCQyx3QkFBUUMsR0FBUixDQUFZRixNQUFNRyxRQUFOLEVBQVo7QUFDSCxhQUZEO0FBR0EsbUJBQU9MLE1BQVA7QUFDSCxTOztBQUVTSixjLEVBQVE7QUFDZCxpQkFBS0MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLENBQVlGLE1BQVosQ0FBZjtBQUNBLGlCQUFLQyxPQUFMLENBQWFFLFVBQWI7QUFDQSxnQkFBSUMsU0FBUyxLQUFLSCxPQUFMLENBQWFHLE1BQTFCO0FBQ0EsZ0JBQUlNLFNBQVMsSUFBSUMsZ0JBQUosQ0FBV1AsTUFBWCxDQUFiO0FBQ0EsZ0JBQUlRLGFBQWFGLE9BQU9HLEtBQVAsRUFBakI7QUFDQU4sb0JBQVFDLEdBQVIsQ0FBWSxJQUFJTSxvQkFBSixHQUFpQkMsS0FBakIsQ0FBdUJILFVBQXZCLENBQVo7QUFDSCxTOztBQUVXWixjLEVBQVFnQixJLEVBQU07QUFDdEIsaUJBQUtmLE9BQUwsR0FBZSxJQUFJQyxpQkFBSixDQUFZRixNQUFaLENBQWY7QUFDQSxpQkFBS0MsT0FBTCxDQUFhRSxVQUFiO0FBQ0FhLGlCQUFLVixLQUFMLEdBQWEsS0FBS0wsT0FBTCxDQUFhRyxNQUExQjtBQUNBLG1CQUFPWSxJQUFQO0FBQ0gsUzs7QUFFY2hCLGMsRUFBUWdCLEksRUFBTTtBQUN6QixpQkFBS2YsT0FBTCxHQUFlLElBQUlDLGlCQUFKLENBQVlGLE1BQVosQ0FBZjtBQUNBLGlCQUFLQyxPQUFMLENBQWFFLFVBQWI7QUFDQSxnQkFBSUMsU0FBUyxLQUFLSCxPQUFMLENBQWFHLE1BQTFCO0FBQ0FZLGlCQUFLVixLQUFMLEdBQWFGLE1BQWI7QUFDQSxnQkFBSU0sU0FBUyxJQUFJQyxnQkFBSixDQUFXUCxNQUFYLENBQWI7QUFDQSxnQkFBSWEsYUFBYVAsT0FBT0csS0FBUCxFQUFqQjtBQUNBLGdCQUFJSyxlQUFLQyxXQUFMLEdBQW1CQyxRQUF2QixFQUFpQztBQUNqQ3RCLDBCQUFjLElBQUl1QixxQkFBSixDQUFnQkwsSUFBaEIsQ0FBZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFJO0FBQ0Esb0JBQUlNLFdBQVcsSUFBSUMsa0JBQUosQ0FBYXpCLFdBQWIsQ0FBZjtBQUNBd0IseUJBQVNFLE9BQVQsQ0FBaUJQLFVBQWpCOztBQUVBO0FBQ0Esb0JBQUlDLGVBQUtDLFdBQUwsR0FBbUJDLFFBQXZCLEVBQWlDO0FBQ2pDdEIsNEJBQVkyQixTQUFaLENBQXNCUixVQUF0QixFQUFrQ0QsSUFBbEM7QUFDSCxhQVBELENBT0UsT0FBT1UsQ0FBUCxFQUFVO0FBQ1JuQix3QkFBUUMsR0FBUixDQUFZa0IsQ0FBWjtBQUNIO0FBQ0osUzs7QUFFbUJ0QixjLEVBQU9ZLEksRUFBSztBQUM1QkEsaUJBQUtWLEtBQUwsR0FBV0YsTUFBWDtBQUNBRyxvQkFBUUMsR0FBUixDQUFZSixPQUFPdUIsTUFBbkI7QUFDQSxnQkFBSWpCLFNBQVMsSUFBSUMsZ0JBQUosQ0FBV1AsTUFBWCxDQUFiO0FBQ0EsZ0JBQUlhLGFBQWFQLE9BQU9HLEtBQVAsRUFBakI7QUFDQSxnQkFBSUssZUFBS0MsV0FBTCxHQUFtQkMsUUFBdkIsRUFBaUM7QUFDakN0QiwwQkFBYyxJQUFJdUIscUJBQUosQ0FBZ0JMLElBQWhCLENBQWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFJO0FBQ0Esb0JBQUlNLFdBQVcsSUFBSUMsa0JBQUosQ0FBYXpCLFdBQWIsQ0FBZjtBQUNBd0IseUJBQVNFLE9BQVQsQ0FBaUJQLFVBQWpCOztBQUVBO0FBQ0Esb0JBQUlDLGVBQUtDLFdBQUwsR0FBbUJDLFFBQXZCLEVBQWlDO0FBQ2pDdEIsNEJBQVkyQixTQUFaLENBQXNCUixVQUF0QixFQUFrQ0QsSUFBbEM7QUFDSCxhQVBELENBT0UsT0FBT1UsQ0FBUCxFQUFVO0FBQ1JuQix3QkFBUUMsR0FBUixDQUFZa0IsQ0FBWjtBQUNIO0FBQ0osUyx3Q0EzRWdCM0IsSyIsImZpbGUiOiJsZXhlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTY2FubmVyIGZyb20gJy4vc2Nhbm5lcic7XG5pbXBvcnQgUGFyc2VyIGZyb20gJy4vcGFyc2VyJztcbmltcG9ydCBBc3RQcmludGVyIGZyb20gXCIuL2FzdFByaW50ZXJcIjtcbmltcG9ydCBJbnRlcnByZXRlciBmcm9tICcuL2ludGVycHJldGVyJztcbmltcG9ydCBSZXNvbHZlciBmcm9tICcuL3Jlc29sdmVyJztcbmltcG9ydCBCdW5hIGZyb20gXCIuL2J1bmFcIjtcblxubGV0IGludGVycHJldGVyID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV4ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHJ1bihzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5zY2FubmVyID0gbmV3IFNjYW5uZXIoc291cmNlKTtcbiAgICAgICAgdGhpcy5zY2FubmVyLnNjYW5Ub2tlbnMoKTtcbiAgICAgICAgbGV0IHRva2VucyA9IHRoaXMuc2Nhbm5lci50b2tlbnM7XG4gICAgICAgIHRva2Vucy5mb3JFYWNoKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9rZW4udG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH1cblxuICAgIHJ1blBhcnNlcihzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5zY2FubmVyID0gbmV3IFNjYW5uZXIoc291cmNlKTtcbiAgICAgICAgdGhpcy5zY2FubmVyLnNjYW5Ub2tlbnMoKTtcbiAgICAgICAgbGV0IHRva2VucyA9IHRoaXMuc2Nhbm5lci50b2tlbnM7XG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgUGFyc2VyKHRva2Vucyk7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0gcGFyc2VyLnBhcnNlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ldyBBc3RQcmludGVyKCkucHJpbnQoZXhwcmVzc2lvbikpO1xuICAgIH1cblxuICAgIHJ1bkdldFRva2VuKHNvdXJjZSwgZGF0YSkge1xuICAgICAgICB0aGlzLnNjYW5uZXIgPSBuZXcgU2Nhbm5lcihzb3VyY2UpO1xuICAgICAgICB0aGlzLnNjYW5uZXIuc2NhblRva2VucygpO1xuICAgICAgICBkYXRhLnRva2VuID0gdGhpcy5zY2FubmVyLnRva2VucztcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgcnVuSW50ZXJwcmV0ZXIoc291cmNlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuc2Nhbm5lciA9IG5ldyBTY2FubmVyKHNvdXJjZSk7XG4gICAgICAgIHRoaXMuc2Nhbm5lci5zY2FuVG9rZW5zKCk7XG4gICAgICAgIGxldCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIudG9rZW5zO1xuICAgICAgICBkYXRhLnRva2VuID0gdG9rZW5zO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IFBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgc3RhdGVtZW50cyA9IHBhcnNlci5wYXJzZSgpO1xuICAgICAgICBpZiAoQnVuYS5nZXRJbnN0YW5jZSgpLmhhZEVycm9yKSByZXR1cm47XG4gICAgICAgIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKGRhdGEpO1xuICAgICAgICAvLyAgICAgICAgIC8vIGlmIChpbnRlcnByZXRlciA9PSBudWxsKSB7XG4gICAgICAgIC8vICAgICBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcihkYXRhKTtcbiAgICAgICAgLy8gfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc29sdmVyID0gbmV3IFJlc29sdmVyKGludGVycHJldGVyKTtcbiAgICAgICAgICAgIHJlc29sdmVyLnJlc29sdmUoc3RhdGVtZW50cyk7XG5cbiAgICAgICAgICAgIC8vIFN0b3AgaWYgdGhlcmUgd2FzIGEgcmVzb2x1dGlvbiBlcnJvci5cbiAgICAgICAgICAgIGlmIChCdW5hLmdldEluc3RhbmNlKCkuaGFkRXJyb3IpIHJldHVybjtcbiAgICAgICAgICAgIGludGVycHJldGVyLmludGVycHJldChzdGF0ZW1lbnRzLCBkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBydW5JbnRlcnByZXRlclRva2VuKHRva2VucyxkYXRhKXtcbiAgICAgICAgZGF0YS50b2tlbj10b2tlbnM7XG4gICAgICAgIGNvbnNvbGUubG9nKHRva2Vucy5sZW5ndGgpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IFBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgc3RhdGVtZW50cyA9IHBhcnNlci5wYXJzZSgpO1xuICAgICAgICBpZiAoQnVuYS5nZXRJbnN0YW5jZSgpLmhhZEVycm9yKSByZXR1cm47XG4gICAgICAgIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKGRhdGEpO1xuICAgICAgICAvLyAgICAgICAgIC8vIGlmIChpbnRlcnByZXRlciA9PSBudWxsKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImRhdGE+Pj4+Pj4+XCIsZGF0YSlcbiAgICAgICAgLy8gICAgIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKGRhdGEpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZXIgPSBuZXcgUmVzb2x2ZXIoaW50ZXJwcmV0ZXIpO1xuICAgICAgICAgICAgcmVzb2x2ZXIucmVzb2x2ZShzdGF0ZW1lbnRzKTtcblxuICAgICAgICAgICAgLy8gU3RvcCBpZiB0aGVyZSB3YXMgYSByZXNvbHV0aW9uIGVycm9yLlxuICAgICAgICAgICAgaWYgKEJ1bmEuZ2V0SW5zdGFuY2UoKS5oYWRFcnJvcikgcmV0dXJuO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuaW50ZXJwcmV0KHN0YXRlbWVudHMsIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=