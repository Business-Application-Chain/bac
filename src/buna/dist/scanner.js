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
                case "'":
                    this.tostring();
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
        } }, { key: 'tostring', value: function tostring()

        {
            while (this.peek() != "'" && !this.isAtEnd()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9zY2FubmVyLmpzIl0sIm5hbWVzIjpbIlRva2VuVHlwZSIsIlNjYW5uZXIiLCJzb3VyY2UiLCJ0b2tlbnMiLCJzdGFydCIsImN1cnJlbnQiLCJsaW5lIiwiaXNBdEVuZCIsInNjYW5Ub2tlbiIsInB1c2giLCJUb2tlbiIsIkVPRiIsImMiLCJhZHZhbmNlIiwiYWRkVG9rZW4iLCJMRUZUX1BBUkVOIiwiUklHSFRfUEFSRU4iLCJMRUZUX0JSQUNFIiwiUklHSFRfQlJBQ0UiLCJDT01NQSIsIkRPVCIsIk1JTlVTIiwiUExVUyIsIlNFTUlDT0xPTiIsIlNUQVIiLCJtYXRjaCIsIkJBTkdfRVFVQUwiLCJCQU5HIiwiRVFVQUxfRVFVQUwiLCJFUVVBTCIsIkxFU1NfRVFVQUwiLCJMRVNTIiwiR1JFQVRFUl9FUVVBTCIsIkdSRUFURVIiLCJwZWVrIiwiU0xBU0giLCJzdHJpbmciLCJ0b3N0cmluZyIsImlzRGlnaXQiLCJudW1iZXIiLCJpc0FscGhhIiwiaWRlbnRpZmllciIsIkxleGVyRXJyb3IiLCJpc0FscGhhTnVtZXJpYyIsInRleHQiLCJzdWJzdHJpbmciLCJ0eXBlIiwiS2V5V29yZCIsInVuZGVmaW5lZCIsIklERU5USUZJRVIiLCJsZW5ndGgiLCJwZWVrTmV4dCIsIk5VTUJFUiIsInBhcnNlRmxvYXQiLCJ2YWx1ZSIsIlNUUklORyIsImV4cGVjdGVkIiwibGl0ZXJhbCJdLCJtYXBwaW5ncyI6IjZVQUFBLHdDLElBQVlBLFM7QUFDWixnQztBQUNBLG9DO0FBQ0EsOEI7O0FBRXFCQyxPO0FBQ2pCLHFCQUFZQyxNQUFaLEVBQW9CO0FBQ2hCLGFBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGFBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsS0FBTCxHQUFhLENBQWI7QUFDQSxhQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLGFBQUtDLElBQUwsR0FBWSxDQUFaO0FBQ0gsSzs7QUFFWTtBQUNULG1CQUFPLENBQUMsS0FBS0MsT0FBTCxFQUFSLEVB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bkQsSUFBcEMsQ0FBakI7QUFDSCxTLDBDQW5MZ0JMLE8iLCJmaWxlIjoic2Nhbm5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQgVG9rZW4gZnJvbSAnLi90b2tlbic7XG5pbXBvcnQgS2V5V29yZCBmcm9tICcuL2tleXdvcmQnO1xuaW1wb3J0IEJ1bmEgZnJvbSAnLi9idW5hJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nhbm5lciB7XG4gICAgY29uc3RydWN0b3Ioc291cmNlKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICAgICAgdGhpcy5saW5lID0gMTtcbiAgICB9XG5cbiAgICBzY2FuVG9rZW5zKCkge1xuICAgICAgICB3aGlsZSAoIXRoaXMuaXNBdEVuZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgICAgICAgICAgdGhpcy5zY2FuVG9rZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5FT0YsICcnLCBudWxsLCB0aGlzLmxpbmUpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICAgIH1cblxuICAgIHNjYW5Ub2tlbigpIHtcbiAgICAgICAgbGV0IGMgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgICAgICBjYXNlICcoJzogdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTEVGVF9QQVJFTik7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKSc6IHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJJR0hUX1BBUkVOKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd7JzogdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTEVGVF9CUkFDRSk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnfSc6IHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJJR0hUX0JSQUNFKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcsJzogdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ09NTUEpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy4nOiB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5ET1QpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJy0nOiB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5NSU5VUyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnKyc6IHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlBMVVMpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJzsnOiB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TRU1JQ09MT04pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyonOiB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TVEFSKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICchJzogdGhpcy5hZGRUb2tlbih0aGlzLm1hdGNoKCc9JykgPyBUb2tlblR5cGUuQkFOR19FUVVBTCA6IFRva2VuVHlwZS5CQU5HKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJz0nOiB0aGlzLmFkZFRva2VuKHRoaXMubWF0Y2goJz0nKSA/IFRva2VuVHlwZS5FUVVBTF9FUVVBTCA6IFRva2VuVHlwZS5FUVVBTCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICc8JzogdGhpcy5hZGRUb2tlbih0aGlzLm1hdGNoKCc9JykgPyBUb2tlblR5cGUuTEVTU19FUVVBTCA6IFRva2VuVHlwZS5MRVNTKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJz4nOiB0aGlzLmFkZFRva2VuKHRoaXMubWF0Y2goJz0nKSA/IFRva2VuVHlwZS5HUkVBVEVSX0VRVUFMIDogVG9rZW5UeXBlLkdSRUFURVIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJy8nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBIGNvbW1lbnQgZ29lcyB1bnRpbCB0aGUgZW5kIG9mIHRoZSBsaW5lLlxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT0gJ1xcbicgJiYgIXRoaXMuaXNBdEVuZCgpKSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TTEFTSCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgICBjYXNlICdcXHInOlxuICAgICAgICAgICAgY2FzZSAnXFx0JzpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1xcbic6XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdcIic6XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICBjYXNlIFwiJ1wiOlxuICAgICAgICAgICAgICAgICB0aGlzLnRvc3RyaW5nKClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNEaWdpdChjKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm51bWJlcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FscGhhKGMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBMZXhlckVycm9yKFwiVW5kZXJtaW5hdGVkIHN0cmluZy5cIiwgdGhpcy5saW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZGVudGlmaWVyKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgICAgIC8vIHNlZSBpZiB0aGUgaWRlbnRpZmllciBpcyBhIHJlc2VydmVkIHdvcmQuXG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgICAgIGxldCB0eXBlID0gS2V5V29yZFt0ZXh0XTtcbiAgICAgICAgaWYgKHR5cGUgPT0gdW5kZWZpbmVkKSB0eXBlID0gVG9rZW5UeXBlLklERU5USUZJRVI7XG5cbiAgICAgICAgdGhpcy5hZGRUb2tlbih0eXBlKTtcbiAgICB9XG5cbiAgICBpc0F0RW5kKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgICB9XG5cbiAgICBudW1iZXIoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB0aGlzLmFkdmFuY2UoKTtcblxuICAgICAgICAvLyBMb29rIGZvciBhIGZyYWN0aW9uYWwgcGFydC5cbiAgICAgICAgaWYgKHRoaXMucGVlaygpID09ICcuJyAmJiB0aGlzLmlzRGlnaXQodGhpcy5wZWVrTmV4dCgpKSkge1xuICAgICAgICAgICAgLy8gQ29uc3VtZSB0aGUgXCIuXCJcbiAgICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pc0RpZ2l0KHRoaXMucGVlaygpKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OVU1CRVIsIHBhcnNlRmxvYXQodGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCkpKTtcbiAgICB9XG5cbiAgICBzdHJpbmcoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPSAnXCInICYmICF0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGVlaygpID09ICdcXG4nKSB0aGlzLmxpbmUrKztcbiAgICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICAgICAgaWYgKHRoaXMuaXNBdEVuZCgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTGV4ZXJFcnJvcihcIlVudGVybWluYXRlZCBzdHJpbmcuXCIsIHRoaXMubGluZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgY2xvc2luZyBcIi5cbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAgICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TVFJJTkcsIHZhbHVlKTtcbiAgICB9XG5cbiAgICB0b3N0cmluZygpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMucGVlaygpICE9IFwiJ1wiICYmICF0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGVlaygpID09ICdcXG4nKSB0aGlzLmxpbmUrKztcbiAgICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICAgICAgaWYgKHRoaXMuaXNBdEVuZCgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTGV4ZXJFcnJvcihcIlVudGVybWluYXRlZCBzdHJpbmcuXCIsIHRoaXMubGluZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgY2xvc2luZyBcIi5cbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAgICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TVFJJTkcsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBtYXRjaChleHBlY3RlZCkge1xuICAgICAgICBpZiAodGhpcy5pc0F0RW5kKCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuc291cmNlW3RoaXMuY3VycmVudF0gIT0gZXhwZWN0ZWQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcGVlaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBdEVuZCgpKSByZXR1cm4gJ1xcMCc7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVt0aGlzLmN1cnJlbnRdO1xuICAgIH1cblxuICAgIHBlZWtOZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50ICsgMSA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHJldHVybiAnXFwwJztcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMuY3VycmVudCArIDFdO1xuICAgIH1cblxuICAgIGlzQWxwaGEoYykge1xuICAgICAgICByZXR1cm4gKGMgPj0gJ2EnICYmIGMgPD0gJ3onKSB8fFxuICAgICAgICAgICAgKGMgPj0gJ0EnICYmIGMgPD0gJ1onKSB8fFxuICAgICAgICAgICAgYyA9PSAnXyc7XG4gICAgfVxuXG4gICAgaXNBbHBoYU51bWVyaWMoYykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0RpZ2l0KGMpIHx8IHRoaXMuaXNBbHBoYShjKTtcbiAgICB9XG5cbiAgICBpc0RpZ2l0KGMpIHtcbiAgICAgICAgcmV0dXJuIGMgPj0gJzAnICYmIGMgPD0gJzknO1xuICAgIH1cblxuICAgIGFkdmFuY2UoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VbdGhpcy5jdXJyZW50IC0gMV07XG4gICAgfVxuXG4gICAgYWRkVG9rZW4odHlwZSwgbGl0ZXJhbCA9IFwiXCIpIHtcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4odHlwZSwgdGV4dCwgbGl0ZXJhbCwgdGhpcy5saW5lKSk7XG4gICAgfVxufSJdfQ==