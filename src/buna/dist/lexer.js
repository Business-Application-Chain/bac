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
        } }, { key: 'runInterpreter', value: function runInterpreter(

        source) {
            this.scanner = new _scanner2.default(source);
            this.scanner.scanTokens();
            var tokens = this.scanner.tokens;
            var parser = new _parser2.default(tokens);
            var statements = parser.parse();
            if (_buna2.default.getInstance().hadError) return;
            if (interpreter == null) {
                interpreter = new _interpreter2.default();
            }
            try {
                var resolver = new _resolver2.default(interpreter);
                resolver.resolve(statements);

                // Stop if there was a resolution error.
                if (_buna2.default.getInstance().hadError) return;

                interpreter.interpret(statements);
            } catch (e) {
                console.log(e);
            }
        } }]);return Lexer;}();exports.default = Lexer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9sZXhlci5qcyJdLCJuYW1lcyI6WyJpbnRlcnByZXRlciIsIkxleGVyIiwic291cmNlIiwic2Nhbm5lciIsIlNjYW5uZXIiLCJzY2FuVG9rZW5zIiwidG9rZW5zIiwiZm9yRWFjaCIsInRva2VuIiwiY29uc29sZSIsImxvZyIsInRvU3RyaW5nIiwicGFyc2VyIiwiUGFyc2VyIiwiZXhwcmVzc2lvbiIsInBhcnNlIiwiQXN0UHJpbnRlciIsInByaW50Iiwic3RhdGVtZW50cyIsIkJ1bmEiLCJnZXRJbnN0YW5jZSIsImhhZEVycm9yIiwiSW50ZXJwcmV0ZXIiLCJyZXNvbHZlciIsIlJlc29sdmVyIiwicmVzb2x2ZSIsImludGVycHJldCIsImUiXSwibWFwcGluZ3MiOiI2VUFBQSxvQztBQUNBLGtDO0FBQ0EsMEM7QUFDQSw0QztBQUNBLHNDO0FBQ0EsOEI7O0FBRUEsSUFBSUEsY0FBYyxJQUFsQixDOztBQUVxQkMsSztBQUNqQixxQkFBYztBQUNiLEs7O0FBRUdDLGMsRUFBUTtBQUNSLGlCQUFLQyxPQUFMLEdBQWUsSUFBSUMsaUJBQUosQ0FBWUYsTUFBWixDQUFmO0FBQ0EsaUJBQUtDLE9BQUwsQ0FBYUUsVUFBYjtBQUNBLGdCQUFJQyxTQUFTLEtBQUtILE9BQUwsQ0FBYUcsTUFBMUI7QUFDQUEsbUJBQU9DLE9BQVAsQ0FBZSxVQUFDQyxLQUFELEVBQVc7QUFDdEJDLHdCQUFRQyxHQUFSLENBQVlGLE1BQU1HLFFBQU4sRUFBWjtBQUNILGFBRkQ7QUFHQSxtQkFBT0wsTUFBUDtBQUNILFM7O0FBRVNKLGMsRUFBUTtBQUNkLGlCQUFLQyxPQUFMLEdBQWUsSUFBSUMsaUJBQUosQ0FBWUYsTUFBWixDQUFmO0FBQ0EsaUJBQUtDLE9BQUwsQ0FBYUUsVUFBYjtBQUNBLGdCQUFJQyxTQUFTLEtBQUtILE9BQUwsQ0FBYUcsTUFBMUI7QUFDQSxnQkFBSU0sU0FBUyxJQUFJQyxnQkFBSixDQUFXUCxNQUFYLENBQWI7QUFDQSxnQkFBSVEsYUFBYUYsT0FBT0csS0FBUCxFQUFqQjtBQUNBTixvQkFBUUMsR0FBUixDQUFZLElBQUlNLG9CQUFKLEdBQWlCQyxLQUFqQixDQUF1QkgsVUFBdkIsQ0FBWjtBQUNILFM7O0FBRWNaLGMsRUFBUTtBQUNuQixpQkFBS0MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLENBQVlGLE1BQVosQ0FBZjtBQUNBLGlCQUFLQyxPQUFMLENBQWFFLFVBQWI7QUFDQSxnQkFBSUMsU0FBUyxLQUFLSCxPQUFMLENBQWFHLE1BQTFCO0FBQ0EsZ0JBQUlNLFNBQVMsSUFBSUMsZ0JBQUosQ0FBV1AsTUFBWCxDQUFiO0FBQ0EsZ0JBQUlZLGFBQWFOLE9BQU9HLEtBQVAsRUFBakI7QUFDQSxnQkFBSUksZUFBS0MsV0FBTCxHQUFtQkMsUUFBdkIsRUFBaUM7QUFDakMsZ0JBQUlyQixlQUFlLElBQW5CLEVBQXlCO0FBQ3JCQSw4QkFBYyxJQUFJc0IscUJBQUosRUFBZDtBQUNIO0FBQ0QsZ0JBQUk7QUFDQSxvQkFBSUMsV0FBVyxJQUFJQyxrQkFBSixDQUFheEIsV0FBYixDQUFmO0FBQ0F1Qix5QkFBU0UsT0FBVCxDQUFpQlAsVUFBakI7O0FBRUE7QUFDQSxvQkFBSUMsZUFBS0MsV0FBTCxHQUFtQkMsUUFBdkIsRUFBaUM7O0FBRWpDckIsNEJBQVkwQixTQUFaLENBQXNCUixVQUF0QjtBQUNILGFBUkQsQ0FRRSxPQUFPUyxDQUFQLEVBQVU7QUFDUmxCLHdCQUFRQyxHQUFSLENBQVlpQixDQUFaO0FBQ0g7QUFDSixTLHdDQTVDZ0IxQixLIiwiZmlsZSI6ImxleGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjYW5uZXIgZnJvbSAnLi9zY2FubmVyJztcbmltcG9ydCBQYXJzZXIgZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0IEFzdFByaW50ZXIgZnJvbSBcIi4vYXN0UHJpbnRlclwiO1xuaW1wb3J0IEludGVycHJldGVyIGZyb20gJy4vaW50ZXJwcmV0ZXInO1xuaW1wb3J0IFJlc29sdmVyIGZyb20gJy4vcmVzb2x2ZXInO1xuaW1wb3J0IEJ1bmEgZnJvbSBcIi4vYnVuYVwiO1xuXG5sZXQgaW50ZXJwcmV0ZXIgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXhlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgcnVuKHNvdXJjZSkge1xuICAgICAgICB0aGlzLnNjYW5uZXIgPSBuZXcgU2Nhbm5lcihzb3VyY2UpO1xuICAgICAgICB0aGlzLnNjYW5uZXIuc2NhblRva2VucygpO1xuICAgICAgICBsZXQgdG9rZW5zID0gdGhpcy5zY2FubmVyLnRva2VucztcbiAgICAgICAgdG9rZW5zLmZvckVhY2goKHRva2VuKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b2tlbi50b1N0cmluZygpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfVxuXG4gICAgcnVuUGFyc2VyKHNvdXJjZSkge1xuICAgICAgICB0aGlzLnNjYW5uZXIgPSBuZXcgU2Nhbm5lcihzb3VyY2UpO1xuICAgICAgICB0aGlzLnNjYW5uZXIuc2NhblRva2VucygpO1xuICAgICAgICBsZXQgdG9rZW5zID0gdGhpcy5zY2FubmVyLnRva2VucztcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBQYXJzZXIodG9rZW5zKTtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBwYXJzZXIucGFyc2UoKTtcbiAgICAgICAgY29uc29sZS5sb2cobmV3IEFzdFByaW50ZXIoKS5wcmludChleHByZXNzaW9uKSk7XG4gICAgfVxuXG4gICAgcnVuSW50ZXJwcmV0ZXIoc291cmNlKSB7XG4gICAgICAgIHRoaXMuc2Nhbm5lciA9IG5ldyBTY2FubmVyKHNvdXJjZSk7XG4gICAgICAgIHRoaXMuc2Nhbm5lci5zY2FuVG9rZW5zKCk7XG4gICAgICAgIGxldCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIudG9rZW5zO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IFBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgc3RhdGVtZW50cyA9IHBhcnNlci5wYXJzZSgpO1xuICAgICAgICBpZiAoQnVuYS5nZXRJbnN0YW5jZSgpLmhhZEVycm9yKSByZXR1cm47XG4gICAgICAgIGlmIChpbnRlcnByZXRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZXIgPSBuZXcgUmVzb2x2ZXIoaW50ZXJwcmV0ZXIpO1xuICAgICAgICAgICAgcmVzb2x2ZXIucmVzb2x2ZShzdGF0ZW1lbnRzKTtcblxuICAgICAgICAgICAgLy8gU3RvcCBpZiB0aGVyZSB3YXMgYSByZXNvbHV0aW9uIGVycm9yLlxuICAgICAgICAgICAgaWYgKEJ1bmEuZ2V0SW5zdGFuY2UoKS5oYWRFcnJvcikgcmV0dXJuO1xuXG4gICAgICAgICAgICBpbnRlcnByZXRlci5pbnRlcnByZXQoc3RhdGVtZW50cyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==