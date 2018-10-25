'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _tokenType = require('./tokenType');var TokenType = _interopRequireWildcard(_tokenType);
var _token = require('./token');var _token2 = _interopRequireDefault(_token);
var _keyword = require('./keyword');var _keyword2 = _interopRequireDefault(_keyword);
var _buna = require('./buna');var _buna2 = _interopRequireDefault(_buna);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Scanner = function () {
    function Scanner(source) {(0, _classCallCheck3.default)(this, Scanner);
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
    }(0, _createClass3.default)(Scanner, [{ key: 'scanTokens', value: function scanTokens()

        {
            while (!this.isAtEnd()) {
                this.start = this.current;
                this.scanToken();
            }

            this.tokens.push(new _token2.default(TokenType.EOF, '', null, this.line));
            return this.tokens;
        } }, { key: 'scanToken', value: function scanToken()

        {
            var c = this.advance();
            switch (c) {
                case '(':this.addToken(TokenType.LEFT_PAREN);break;
                case ')':this.addToken(TokenType.RIGHT_PAREN);break;
                case '{':this.addToken(TokenType.LEFT_BRACE);break;
                case '}':this.addToken(TokenType.RIGHT_BRACE);break;
                case ',':this.addToken(TokenType.COMMA);break;
                case '.':this.addToken(TokenType.DOT);break;
                case '-':this.addToken(TokenType.MINUS);break;
                case '+':this.addToken(TokenType.PLUS);break;
                case ';':this.addToken(TokenType.SEMICOLON);break;
                case '*':this.addToken(TokenType.STAR);break;
                case '!':this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
                    break;
                case '=':this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                    break;
                case '<':this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                    break;
                case '>':this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                    break;
                case '/':
                    if (this.match('/')) {
                        // A comment goes until the end of the line.
                        while (this.peek() != '\n' && !this.isAtEnd()) {this.advance();}
                    } else {
                        this.addToken(TokenType.SLASH);
                    }
                case ' ':
                case '\r':
                case '\t':
                    break;
                case '\n':
                    this.line++;
                    break;
                case '"':
                    this.string();
                    break;
                default:
                    if (this.isDigit(c)) {
                        this.number();
                    } else if (this.isAlpha(c)) {
                        this.identifier();
                    } else {
                        throw new LexerError("Underminated string.", this.line);
                    }
                    break;}

        } }, { key: 'identifier', value: function identifier()

        {
            while (this.isAlphaNumeric(this.peek())) {this.advance();}

            // see if the identifier is a reserved word.
            var text = this.source.substring(this.start, this.current);
            var type = _keyword2.default[text];
            if (type == undefined) type = TokenType.IDENTIFIER;

            this.addToken(type);
        } }, { key: 'isAtEnd', value: function isAtEnd()

        {
            return this.current >= this.source.length;
        } }, { key: 'number', value: function number()

        {
            while (this.isDigit(this.peek())) {this.advance();}

            // Look for a fractional part.
            if (this.peek() == '.' && this.isDigit(this.peekNext())) {
                // Consume the "."
                this.advance();

                while (this.isDigit(this.peek())) {this.advance();}
            }

            this.addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
        } }, { key: 'string', value: function string()

        {
            while (this.peek() != '"' && !this.isAtEnd()) {
                if (this.peek() == '\n') this.line++;
                this.advance();
            }

            // Unterminated string.
            if (this.isAtEnd()) {
                throw new LexerError("Unterminated string.", this.line);
            }

            // The closing ".
            this.advance();

            // Trim the surrounding quotes.
            var value = this.source.substring(this.start + 1, this.current - 1);
            this.addToken(TokenType.STRING, value);
        } }, { key: 'match', value: function match(

        expected) {
            if (this.isAtEnd()) return false;
            if (this.source[this.current] != expected) return false;

            this.current++;
            return true;
        } }, { key: 'peek', value: function peek()

        {
            if (this.isAtEnd()) return '\0';
            return this.source[this.current];
        } }, { key: 'peekNext', value: function peekNext()

        {
            if (this.current + 1 >= this.source.length) return '\0';
            return this.source[this.current + 1];
        } }, { key: 'isAlpha', value: function isAlpha(

        c) {
            return c >= 'a' && c <= 'z' ||
            c >= 'A' && c <= 'Z' ||
            c == '_';
        } }, { key: 'isAlphaNumeric', value: function isAlphaNumeric(

        c) {
            return this.isDigit(c) || this.isAlpha(c);
        } }, { key: 'isDigit', value: function isDigit(

        c) {
            return c >= '0' && c <= '9';
        } }, { key: 'advance', value: function advance()

        {
            this.current++;
            return this.source[this.current - 1];
        } }, { key: 'addToken', value: function addToken(

        type) {var literal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
            var text = this.source.substring(this.start, this.current);
            this.tokens.push(new _token2.default(type, text, literal, this.line));
        } }]);return Scanner;}();exports.default = Scanner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9zY2FubmVyLmpzIl0sIm5hbWVzIjpbIlRva2VuVHlwZSIsIlNjYW5uZXIiLCJzb3VyY2UiLCJ0b2tlbnMiLCJzdGFydCIsImN1cnJlbnQiLCJsaW5lIiwiaXNBdEVuZCIsInNjYW5Ub2tlbiIsInB1c2giLCJUb2tlbiIsIkVPRiIsImMiLCJhZHZhbmNlIiwiYWRkVG9rZW4iLCJMRUZUX1BBUkVOIiwiUklHSFRfUEFSRU4iLCJMRUZUX0JSQUNFIiwiUklHSFRfQlJBQ0UiLCJDT01NQSIsIkRPVCIsIk1JTlVTIiwiUExVUyIsIlNFTUlDT0xPTiIsIlNUQVIiLCJtYXRjaCIsIkJBTkdfRVFVQUwiLCJCQU5HIiwiRVFVQUxfRVFVQUwiLCJFUVVBTCIsIkxFU1NfRVFVQUwiLCJMRVNTIiwiR1JFQVRFUl9FUVVBTCIsIkdSRUFURVIiLCJwZWVrIiwiU0xBU0giLCJzdHJpbmciLCJpc0RpZ2l0IiwibnVtYmVyIiwiaXNBbHBoYSIsImlkZW50aWZpZXIiLCJMZXhlckVycm9yIiwiaXNBbHBoYU51bWVyaWMiLCJ0ZXh0Iiwic3Vic3RyaW5nIiwidHlwZSIsIktleVdvcmQiLCJ1bmRlZmluZWQiLCJJREVOVElGSUVSIiwibGVuZ3RoIiwicGVla05leHQiLCJOVU1CRVIiLCJwYXJzZUZsb2F0IiwidmFsdWUiLCJTVFJJTkciLCJleHBlY3RlZCIsImxpdGVyYWwiXSwibWFwcGluZ3MiOiI2VUFBQSx3QyxJQUFZQSxTO0FBQ1osZ0M7QUFDQSxvQztBQUNBLDhCOztBQUVxQkMsTztBQUNqQixxQkFBWUMsTUFBWixFQUFvQjtBQUNoQixhQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxhQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNBLGFBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsYUFBS0MsT0FBTCxHQUFlLENBQWY7QUFDQSxhQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNILEs7O0FBRVk7QUFDVCxtQkFBTyxDQUFDLEtBQUtDLE9BQUwsRUFBUixFQUF3QjtBQUNwQixxQkFBS0gsS0FBTCxHQUFhLEtBQUtDLE9BQWxCO0FBQ0EscUJBQUtHLFNBQUw7QUFDSDs7QUFFRCxpQkFBS0wsTUFBTCxDQUFZTSxJQUFaLENBQWlCLElBQUlDLGVBQUosQ0FBVVYsVUFBVVcsR0FBcEIsRUFBeUIsRUFBekIsRUFBNkIsSUFBN0IsRUFBbUMsS0FBS0wsSUFBeEMsQ0FBakI7QUFDQSxtQkFBTyxLQUFLSCxNQUFaO0FBQ0gsUzs7QUFFVztBQUNSLGdCQUFJUyxJQUFJLEtBQUtDLE9BQUwsRUFBUjtBQUNBLG9CQUFRRCxDQUFSO0FBQ0kscUJBQUssR0FBTCxDQUFVLEtBQUtFLFFBQUwsQ0FBY2QsVUFBVWUsVUFBeEIsRUFBcUM7QUFDL0MscUJBQUssR0FBTCxDQUFVLEtBQUtELFFBQUwsQ0FBY2QsVUFBVWdCLFdBQXhCLEVBQXNDO0FBQ2hELHFCQUFLLEdBQUwsQ0FBVSxLQUFLRixRQUFMLENBQWNkLFVBQVVpQixVQUF4QixFQUFxQztBQUMvQyxxQkFBSyxHQUFMLENBQVUsS0FBS0gsUUFBTCxDQUFjZCxVQUFVa0IsV0FBeEIsRUFBc0M7QUFDaEQscUJBQUssR0FBTCxDQUFVLEtBQUtKLFFBQUwsQ0FBY2QsVUFBVW1CLEtBQXhCLEVBQWdDO0FBQzFDLHFCQUFLLEdBQUwsQ0FBVSxLQUFLTCxRQUFMLENBQWNkLFVBQVVvQixHQUF4QixFQUE4QjtBQUN4QyxxQkFBSyxHQUFMLENBQVUsS0FBS04sUUFBTCxDQUFjZCxVQUFVcUIsS0FBeEIsRUFBZ0M7QUFDMUMscUJBQUssR0FBTCxDQUFVLEtBQUtQLFFBQUwsQ0FBY2QsVUFBVXNCLElBQXhCLEVBQStCO0FBQ3pDLHFCQUFLLEdBQUwsQ0FBVSxLQUFLUixRQUFMLENBQWNkLFVBQVV1QixTQUF4QixFQUFvQztBQUM5QyxxQkFBSyxHQUFMLENBQVUsS0FBS1QsUUFBTCxDQUFjZCxVQUFVd0IsSUFBeEIsRUFBK0I7QUFDekMscUJBQUssR0FBTCxDQUFVLEtBQUtWLFFBQUwsQ0FBYyxLQUFLVyxLQUFMLENBQVcsR0FBWCxJQUFrQnpCLFVBQVUwQixVQUE1QixHQUF5QzFCLFVBQVUyQixJQUFqRTtBQUNOO0FBQ0oscUJBQUssR0FBTCxDQUFVLEtBQUtiLFFBQUwsQ0FBYyxLQUFLVyxLQUFMLENBQVcsR0FBWCxJQUFrQnpCLFVBQVU0QixXQUE1QixHQUEwQzVCLFVBQVU2QixLQUFsRTtBQUNOO0FBQ0oscUJBQUssR0FBTCxDQUFVLEtBQUtmLFFBQUwsQ0FBYyxLQUFLVyxLQUFMLENBQVcsR0FBWCxJQUFrQnpCLFVBQVU4QixVQUE1QixHQUF5QzlCLFVBQVUrQixJQUFqRTtBQUNOO0FBQ0oscUJBQUssR0FBTCxDQUFVLEtBQUtqQixRQUFMLENBQWMsS0FBS1csS0FBTCxDQUFXLEdBQVgsSUFBa0J6QixVQUFVZ0MsYUFBNUIsR0FBNENoQyxVQUFVaUMsT0FBcEU7QUFDTjtBQUNKLHFCQUFLLEdBQUw7QUFDSSx3QkFBSSxLQUFLUixLQUFMLENBQVcsR0FBWCxDQUFKLEVBQXFCO0FBQ2pCO0FBQ0EsK0JBQU8sS0FBS1MsSUFBTCxNQUFlLElBQWYsSUFBdUIsQ0FBQyxLQUFLM0IsT0FBTCxFQUEvQixHQUErQyxLQUFLTSxPQUFMLEdBQS9DO0FBQ0gscUJBSEQsTUFHTztBQUNILDZCQUFLQyxRQUFMLENBQWNkLFVBQVVtQyxLQUF4QjtBQUNIO0FBQ0wscUJBQUssR0FBTDtBQUNBLHFCQUFLLElBQUw7QUFDQSxxQkFBSyxJQUFMO0FBQ0k7QUFDSixxQkFBSyxJQUFMO0FBQ0kseUJBQUs3QixJQUFMO0FBQ0E7QUFDSixxQkFBSyxHQUFMO0FBQ0kseUJBQUs4QixNQUFMO0FBQ0E7QUFDSjtBQUNJLHdCQUFJLEtBQUtDLE9BQUwsQ0FBYXpCLENBQWIsQ0FBSixFQUFxQjtBQUNqQiw2QkFBSzBCLE1BQUw7QUFDSCxxQkFGRCxNQUVPLElBQUksS0FBS0MsT0FBTCxDQUFhM0IsQ0FBYixDQUFKLEVBQXFCO0FBQ3hCLDZCQUFLNEIsVUFBTDtBQUNILHFCQUZNLE1BRUE7QUFDSCw4QkFBTSxJQUFJQyxVQUFKLENBQWUsc0JBQWYsRUFBdUMsS0FBS25DLElBQTVDLENBQU47QUFDSDtBQUNELDBCQTVDUjs7QUE4Q0gsUzs7QUFFWTtBQUNULG1CQUFPLEtBQUtvQyxjQUFMLENBQW9CLEtBQUtSLElBQUwsRUFBcEIsQ0FBUCxHQUF5QyxLQUFLckIsT0FBTCxHQUF6Qzs7QUFFQTtBQUNBLGdCQUFJOEIsT0FBTyxLQUFLekMsTUFBTCxDQUFZMEMsU0FBWixDQUFzQixLQUFLeEMsS0FBM0IsRUFBa0MsS0FBS0MsT0FBdkMsQ0FBWDtBQUNBLGdCQUFJd0MsT0FBT0Msa0JBQVFILElBQVIsQ0FBWDtBQUNBLGdCQUFJRSxRQUFRRSxTQUFaLEVBQXVCRixPQUFPN0MsVUFBVWdELFVBQWpCOztBQUV2QixpQkFBS2xDLFFBQUwsQ0FBYytCLElBQWQ7QUFDSCxTOztBQUVTO0FBQ04sbUJBQU8sS0FBS3hDLE9BQUwsSUFBZ0IsS0FBS0gsTUFBTCxDQUFZK0MsTUFBbkM7QUFDSCxTOztBQUVRO0FBQ0wsbUJBQU8sS0FBS1osT0FBTCxDQUFhLEtBQUtILElBQUwsRUFBYixDQUFQLEdBQWtDLEtBQUtyQixPQUFMLEdBQWxDOztBQUVBO0FBQ0EsZ0JBQUksS0FBS3FCLElBQUwsTUFBZSxHQUFmLElBQXNCLEtBQUtHLE9BQUwsQ0FBYSxLQUFLYSxRQUFMLEVBQWIsQ0FBMUIsRUFBeUQ7QUFDckQ7QUFDQSxxQkFBS3JDLE9BQUw7O0FBRUEsdUJBQU8sS0FBS3dCLE9BQUwsQ0FBYSxLQUFLSCxJQUFMLEVBQWIsQ0FBUCxHQUFrQyxLQUFLckIsT0FBTCxHQUFsQztBQUNIOztBQUVELGlCQUFLQyxRQUFMLENBQWNkLFVBQVVtRCxNQUF4QixFQUFnQ0MsV0FBVyxLQUFLbEQsTUFBTCxDQUFZMEMsU0FBWixDQUFzQixLQUFLeEMsS0FBM0IsRUFBa0MsS0FBS0MsT0FBdkMsQ0FBWCxDQUFoQztBQUNILFM7O0FBRVE7QUFDTCxtQkFBTyxLQUFLNkIsSUFBTCxNQUFlLEdBQWYsSUFBc0IsQ0FBQyxLQUFLM0IsT0FBTCxFQUE5QixFQUE4QztBQUMxQyxvQkFBSSxLQUFLMkIsSUFBTCxNQUFlLElBQW5CLEVBQXlCLEtBQUs1QixJQUFMO0FBQ3pCLHFCQUFLTyxPQUFMO0FBQ0g7O0FBRUQ7QUFDQSxnQkFBSSxLQUFLTixPQUFMLEVBQUosRUFBb0I7QUFDaEIsc0JBQU0sSUFBSWtDLFVBQUosQ0FBZSxzQkFBZixFQUF1QyxLQUFLbkMsSUFBNUMsQ0FBTjtBQUNIOztBQUVEO0FBQ0EsaUJBQUtPLE9BQUw7O0FBRUE7QUFDQSxnQkFBSXdDLFFBQVEsS0FBS25ELE1BQUwsQ0FBWTBDLFNBQVosQ0FBc0IsS0FBS3hDLEtBQUwsR0FBYSxDQUFuQyxFQUFzQyxLQUFLQyxPQUFMLEdBQWUsQ0FBckQsQ0FBWjtBQUNBLGlCQUFLUyxRQUFMLENBQWNkLFVBQVVzRCxNQUF4QixFQUFnQ0QsS0FBaEM7QUFDSCxTOztBQUVLRSxnQixFQUFVO0FBQ1osZ0JBQUksS0FBS2hELE9BQUwsRUFBSixFQUFvQixPQUFPLEtBQVA7QUFDcEIsZ0JBQUksS0FBS0wsTUFBTCxDQUFZLEtBQUtHLE9BQWpCLEtBQTZCa0QsUUFBakMsRUFBMkMsT0FBTyxLQUFQOztBQUUzQyxpQkFBS2xELE9BQUw7QUFDQSxtQkFBTyxJQUFQO0FBQ0gsUzs7QUFFTTtBQUNILGdCQUFJLEtBQUtFLE9BQUwsRUFBSixFQUFvQixPQUFPLElBQVA7QUFDcEIsbUJBQU8sS0FBS0wsTUFBTCxDQUFZLEtBQUtHLE9BQWpCLENBQVA7QUFDSCxTOztBQUVVO0FBQ1AsZ0JBQUksS0FBS0EsT0FBTCxHQUFlLENBQWYsSUFBb0IsS0FBS0gsTUFBTCxDQUFZK0MsTUFBcEMsRUFBNEMsT0FBTyxJQUFQO0FBQzVDLG1CQUFPLEtBQUsvQyxNQUFMLENBQVksS0FBS0csT0FBTCxHQUFlLENBQTNCLENBQVA7QUFDSCxTOztBQUVPTyxTLEVBQUc7QUFDUCxtQkFBUUEsS0FBSyxHQUFMLElBQVlBLEtBQUssR0FBbEI7QUFDRkEsaUJBQUssR0FBTCxJQUFZQSxLQUFLLEdBRGY7QUFFSEEsaUJBQUssR0FGVDtBQUdILFM7O0FBRWNBLFMsRUFBRztBQUNkLG1CQUFPLEtBQUt5QixPQUFMLENBQWF6QixDQUFiLEtBQW1CLEtBQUsyQixPQUFMLENBQWEzQixDQUFiLENBQTFCO0FBQ0gsUzs7QUFFT0EsUyxFQUFHO0FBQ1AsbUJBQU9BLEtBQUssR0FBTCxJQUFZQSxLQUFLLEdBQXhCO0FBQ0gsUzs7QUFFUztBQUNOLGlCQUFLUCxPQUFMO0FBQ0EsbUJBQU8sS0FBS0gsTUFBTCxDQUFZLEtBQUtHLE9BQUwsR0FBZSxDQUEzQixDQUFQO0FBQ0gsUzs7QUFFUXdDLFksRUFBb0IsS0FBZFcsT0FBYyx1RUFBSixFQUFJO0FBQ3pCLGdCQUFJYixPQUFPLEtBQUt6QyxNQUFMLENBQVkwQyxTQUFaLENBQXNCLEtBQUt4QyxLQUEzQixFQUFrQyxLQUFLQyxPQUF2QyxDQUFYO0FBQ0EsaUJBQUtGLE1BQUwsQ0FBWU0sSUFBWixDQUFpQixJQUFJQyxlQUFKLENBQVVtQyxJQUFWLEVBQWdCRixJQUFoQixFQUFzQmEsT0FBdEIsRUFBK0IsS0FBS2xELElBQXBDLENBQWpCO0FBQ0gsUywwQ0E3SmdCTCxPIiwiZmlsZSI6InNjYW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUb2tlblR5cGUgZnJvbSAnLi90b2tlblR5cGUnO1xuaW1wb3J0IFRva2VuIGZyb20gJy4vdG9rZW4nO1xuaW1wb3J0IEtleVdvcmQgZnJvbSAnLi9rZXl3b3JkJztcbmltcG9ydCBCdW5hIGZyb20gJy4vYnVuYSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYW5uZXIge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICAgICAgdGhpcy5zdGFydCA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgICAgIHRoaXMubGluZSA9IDE7XG4gICAgfVxuXG4gICAgc2NhblRva2VucygpIHtcbiAgICAgICAgd2hpbGUgKCF0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgIHRoaXMuc2NhblRva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRU9GLCAnJywgbnVsbCwgdGhpcy5saW5lKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgICB9XG5cbiAgICBzY2FuVG9rZW4oKSB7XG4gICAgICAgIGxldCBjID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgICAgY2FzZSAnKCc6IHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxFRlRfUEFSRU4pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyknOiB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SSUdIVF9QQVJFTik7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAneyc6IHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxFRlRfQlJBQ0UpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ30nOiB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SSUdIVF9CUkFDRSk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLCc6IHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNPTU1BKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcuJzogdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRE9UKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICctJzogdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTUlOVVMpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJysnOiB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5QTFVTKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICc7JzogdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU0VNSUNPTE9OKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcqJzogdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU1RBUik7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnISc6IHRoaXMuYWRkVG9rZW4odGhpcy5tYXRjaCgnPScpID8gVG9rZW5UeXBlLkJBTkdfRVFVQUwgOiBUb2tlblR5cGUuQkFORyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICc9JzogdGhpcy5hZGRUb2tlbih0aGlzLm1hdGNoKCc9JykgPyBUb2tlblR5cGUuRVFVQUxfRVFVQUwgOiBUb2tlblR5cGUuRVFVQUwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnPCc6IHRoaXMuYWRkVG9rZW4odGhpcy5tYXRjaCgnPScpID8gVG9rZW5UeXBlLkxFU1NfRVFVQUwgOiBUb2tlblR5cGUuTEVTUyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICc+JzogdGhpcy5hZGRUb2tlbih0aGlzLm1hdGNoKCc9JykgPyBUb2tlblR5cGUuR1JFQVRFUl9FUVVBTCA6IFRva2VuVHlwZS5HUkVBVEVSKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcvJykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQSBjb21tZW50IGdvZXMgdW50aWwgdGhlIGVuZCBvZiB0aGUgbGluZS5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMucGVlaygpICE9ICdcXG4nICYmICF0aGlzLmlzQXRFbmQoKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU0xBU0gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgY2FzZSAnXFxyJzpcbiAgICAgICAgICAgIGNhc2UgJ1xcdCc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdcXG4nOlxuICAgICAgICAgICAgICAgIHRoaXMubGluZSsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnXCInOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRGlnaXQoYykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5udW1iZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBbHBoYShjKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlkZW50aWZpZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTGV4ZXJFcnJvcihcIlVuZGVybWluYXRlZCBzdHJpbmcuXCIsIHRoaXMubGluZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcigpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuaXNBbHBoYU51bWVyaWModGhpcy5wZWVrKCkpKSB0aGlzLmFkdmFuY2UoKTtcblxuICAgICAgICAvLyBzZWUgaWYgdGhlIGlkZW50aWZpZXIgaXMgYSByZXNlcnZlZCB3b3JkLlxuICAgICAgICBsZXQgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgICAgICBsZXQgdHlwZSA9IEtleVdvcmRbdGV4dF07XG4gICAgICAgIGlmICh0eXBlID09IHVuZGVmaW5lZCkgdHlwZSA9IFRva2VuVHlwZS5JREVOVElGSUVSO1xuXG4gICAgICAgIHRoaXMuYWRkVG9rZW4odHlwZSk7XG4gICAgfVxuXG4gICAgaXNBdEVuZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudCA+PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgbnVtYmVyKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pc0RpZ2l0KHRoaXMucGVlaygpKSkgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAgICAgLy8gTG9vayBmb3IgYSBmcmFjdGlvbmFsIHBhcnQuXG4gICAgICAgIGlmICh0aGlzLnBlZWsoKSA9PSAnLicgJiYgdGhpcy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcbiAgICAgICAgICAgIC8vIENvbnN1bWUgdGhlIFwiLlwiXG4gICAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcblxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTlVNQkVSLCBwYXJzZUZsb2F0KHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpKSk7XG4gICAgfVxuXG4gICAgc3RyaW5nKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT0gJ1wiJyAmJiAhdGhpcy5pc0F0RW5kKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBlZWsoKSA9PSAnXFxuJykgdGhpcy5saW5lKys7XG4gICAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG4gICAgICAgIGlmICh0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IExleGVyRXJyb3IoXCJVbnRlcm1pbmF0ZWQgc3RyaW5nLlwiLCB0aGlzLmxpbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGNsb3NpbmcgXCIuXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgICAgIC8vIFRyaW0gdGhlIHN1cnJvdW5kaW5nIHF1b3Rlcy5cbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU1RSSU5HLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgbWF0Y2goZXhwZWN0ZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBdEVuZCgpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZVt0aGlzLmN1cnJlbnRdICE9IGV4cGVjdGVkKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHBlZWsoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQXRFbmQoKSkgcmV0dXJuICdcXDAnO1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VbdGhpcy5jdXJyZW50XTtcbiAgICB9XG5cbiAgICBwZWVrTmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSByZXR1cm4gJ1xcMCc7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVt0aGlzLmN1cnJlbnQgKyAxXTtcbiAgICB9XG5cbiAgICBpc0FscGhhKGMpIHtcbiAgICAgICAgcmV0dXJuIChjID49ICdhJyAmJiBjIDw9ICd6JykgfHxcbiAgICAgICAgICAgIChjID49ICdBJyAmJiBjIDw9ICdaJykgfHxcbiAgICAgICAgICAgIGMgPT0gJ18nO1xuICAgIH1cblxuICAgIGlzQWxwaGFOdW1lcmljKGMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNEaWdpdChjKSB8fCB0aGlzLmlzQWxwaGEoYyk7XG4gICAgfVxuXG4gICAgaXNEaWdpdChjKSB7XG4gICAgICAgIHJldHVybiBjID49ICcwJyAmJiBjIDw9ICc5JztcbiAgICB9XG5cbiAgICBhZHZhbmNlKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMuY3VycmVudCAtIDFdO1xuICAgIH1cblxuICAgIGFkZFRva2VuKHR5cGUsIGxpdGVyYWwgPSBcIlwiKSB7XG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKHR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSkpO1xuICAgIH1cbn0iXX0=