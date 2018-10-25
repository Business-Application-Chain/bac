"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _expr = require("./expr");var Expr = _interopRequireWildcard(_expr);
var _stmt = require("./stmt");var Stmt = _interopRequireWildcard(_stmt);
var _tokenType = require("./tokenType");var TokenType = _interopRequireWildcard(_tokenType);
var _error = require("./error");
var _token = require("./token");var _token2 = _interopRequireDefault(_token);
var _buna = require("./buna");var _buna2 = _interopRequireDefault(_buna);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Parser = function () {
    function Parser(tokens) {(0, _classCallCheck3.default)(this, Parser);
        this.tokens = tokens;
        this.current = 0;
    }(0, _createClass3.default)(Parser, [{ key: "parse", value: function parse()

        {
            var statements = [];
            while (!this.isAtEnd()) {
                statements.push(this.declaration());
            }

            return statements;
        } }, { key: "expression", value: function expression()

        {
            return this.assignment();
        } }, { key: "assignment", value: function assignment()

        {
            var expr = this.or();

            if (this.match([TokenType.EQUAL])) {
                var equals = this.previous();
                var value = this.assignment();
                if (expr instanceof Expr.Variable) {
                    var name = expr.name;
                    return new Expr.Assign(name, value);
                } else if (expr instanceof Expr.Get) {
                    var get = expr;
                    return new Expr.Set(get.object, get.name, value);
                }
                throw this.errorFunc(equals, "Invalid assignment target.");
            }

            return expr;
        } }, { key: "or", value: function or()

        {
            var expr = this.and();

            while (this.match([TokenType.OR])) {
                var operator = this.previous();
                var right = this.and();
                expr = new Expr.Logical(expr, operator, right);
            }

            return expr;
        } }, { key: "and", value: function and()

        {
            var expr = this.equality();

            while (this.match([TokenType.AND])) {
                var operator = this.previous();
                var right = this.equality();
                expr = new Expr.Logical(expr, operator, right);
            }

            return expr;
        } }, { key: "declaration", value: function declaration()

        {
            try {
                if (this.match([TokenType.CLASS])) {
                    return this.classDeclaration();
                }
                if (this.match([TokenType.FUN])) {
                    return this.function("function");
                }
                if (this.match([TokenType.VAR])) {
                    return this.varDeclaration();
                }

                return this.statement();
            } catch (e) {
                this.synchronize();
                return null;
            }
        } }, { key: "classDeclaration", value: function classDeclaration()

        {
            var name = this.consume(TokenType.IDENTIFIER, "Expect class name.");

            var superclass = null;
            if (this.match([TokenType.LESS])) {
                this.consume(TokenType.IDENTIFIER, "Expect superclass name.");
                superclass = new Expr.Variable(this.previous());
            }

            this.consume(TokenType.LEFT_BRACE, "Expect '{' before class body.");

            var methods = [];
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                methods.push(this.function("method"));
            }

            this.consume(TokenType.RIGHT_BRACE, "Expect '}' after class body.");

            return new Stmt.Class(name, superclass, methods);
        } }, { key: "statement", value: function statement()

        {
            if (this.match([TokenType.FOR])) return this.forStatement();
            if (this.match([TokenType.IF])) return this.ifStatement();
            if (this.match([TokenType.PRINT])) return this.printStatement();
            if (this.match([TokenType.RETURN])) return this.returnStatement();
            if (this.match([TokenType.WHILE])) return this.whileStatement();
            if (this.match([TokenType.LEFT_BRACE])) return new Stmt.Block(this.block());

            return this.expressionStatement();
        } }, { key: "forStatement", value: function forStatement()

        {
            this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

            var initializer = void 0;
            if (this.match([TokenType.SEMICOLON])) {
                initializer = null;
            } else if (this.match([TokenType.VAR])) {
                initializer = this.varDeclaration();
            } else {
                initializer = this.expressionStatement();
            }

            var condition = null;
            if (!this.check(TokenType.SEMICOLON)) {
                condition = this.expression();
            }

            this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

            var increment = null;
            if (!this.check(TokenType.RIGHT_PAREN)) {
                increment = this.expression();
            }

            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

            var body = this.statement();

            // Begin desugaring into a 'while' loop...
            if (increment != null) {
                body = new Stmt.Block([body, new Stmt.Expression(increment)]);
            }

            if (condition == null) {
                condition = new Expr.Literal(true);
            }
            body = new Stmt.While(condition, body);

            if (initializer != null) {
                body = new Stmt.Block([initializer, body]);
            }

            return body;
        } }, { key: "ifStatement", value: function ifStatement()

        {
            this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
            var condition = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after 'if'.");

            var thenBranch = this.statement();
            var elseBranch = null;
            if (this.match([TokenType.ELSE])) {
                elseBranch = this.statement();
            }

            return new Stmt.If(condition, thenBranch, elseBranch);
        } }, { key: "printStatement", value: function printStatement()

        {
            var value = this.expression();
            this.consume(TokenType.SEMICOLON, "Expect ';' after value;");
            return new Stmt.Print(value);
        } }, { key: "returnStatement", value: function returnStatement()

        {
            var keyword = this.previous();
            var value = null;
            if (!this.check(TokenType.SEMICOLON)) {
                value = this.expression();
            }
            this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
            try {
                return new Stmt.Return(keyword, value);
            } catch (e) {
                console.log(e);
            }
        } }, { key: "varDeclaration", value: function varDeclaration()

        {
            var name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

            var initializer = null;
            if (this.match([TokenType.EQUAL])) {
                initializer = this.expression();
            }
            this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
            return new Stmt.Var(name, initializer);
        } }, { key: "whileStatement", value: function whileStatement()

        {
            this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
            var condition = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after 'condition'.");
            var body = this.statement();

            return new Stmt.While(condition, body);
        } }, { key: "expressionStatement", value: function expressionStatement()

        {
            var expr = this.expression();
            this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
            return new Stmt.Expression(expr);
        } }, { key: "function", value: function _function(

        kind) {
            var name = this.consume(TokenType.IDENTIFIER, "Expect " + kind + " name.");
            this.consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");
            var parameters = [];
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (parameters.length >= 8) {
                        throw this.errorFunc(this.peek(), "Cannot have more than 8 parameters.");
                    }

                    parameters.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
                } while (this.match([TokenType.COMMA]));
            }
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");

            this.consume(TokenType.LEFT_BRACE, "Expect '{' before " + kind + " body.");
            var body = this.block();
            return new Stmt.Function(name, parameters, body);
        } }, { key: "block", value: function block()

        {
            var statements = [];
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                statements.push(this.declaration());
            }
            this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
            return statements;
        } }, { key: "equality", value: function equality()

        {
            var expr = this.comparison();

            while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
                var operator = this.previous();
                var right = this.comparison();
                expr = new Expr.Binary(expr, operator, right);
            }

            return expr;
        } }, { key: "comparison", value: function comparison()

        {
            var expr = this.addition();

            while (this.match([TokenType.GREATER_EQUAL, TokenType.GREATER, TokenType.LESS_EQUAL, TokenType.LESS])) {
                var operator = this.previous();
                var right = this.addition();
                expr = new Expr.Binary(expr, operator, right);
            }

            return expr;
        } }, { key: "addition", value: function addition()

        {
            var expr = this.multiplication();

            while (this.match([TokenType.MINUS, TokenType.PLUS])) {
                var operator = this.previous();
                var right = this.multiplication();
                expr = new Expr.Binary(expr, operator, right);
            }

            return expr;
        } }, { key: "multiplication", value: function multiplication()

        {
            var expr = this.unary();

            while (this.match([TokenType.SLASH, TokenType.STAR])) {
                var operator = this.previous();
                var right = this.unary();
                expr = new Expr.Binary(expr, operator, right);
            }

            return expr;
        } }, { key: "unary", value: function unary()

        {
            if (this.match([TokenType.BANG, TokenType.MINUS])) {
                var operator = this.previous();
                var right = this.unary();
                return new Expr.Unary(operator, right);
            }

            return this.call();
        } }, { key: "finishCall", value: function finishCall(

        callee) {
            var args = [];

            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (args.length >= 8) {
                        throw this.errorFunc(this.peek(), "Cannot have more than 8 arguments.");
                    }
                    args.push(this.expression());
                } while (this.match([TokenType.COMMA]));
            }

            var paren = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");

            return new Expr.Call(callee, paren, args);
        } }, { key: "call", value: function call()

        {
            var expr = this.primary();
            while (true) {
                if (this.match([TokenType.LEFT_PAREN])) {
                    expr = this.finishCall(expr);
                } else if (this.match([TokenType.DOT])) {
                    var name = this.consume(TokenType.IDENTIFIER, "Expect property name after '.'.");
                    expr = new Expr.Get(expr, name);
                } else {
                    break;
                }
            }

            return expr;
        } }, { key: "primary", value: function primary()

        {
            if (this.match([TokenType.FALSE])) return new Expr.Literal(false);
            if (this.match([TokenType.TRUE])) return new Expr.Literal(true);
            if (this.match([TokenType.NIL])) return new Expr.Literal(null);

            if (this.match([TokenType.NUMBER, TokenType.STRING])) {
                return new Expr.Literal(this.previous().literal);
            }

            if (this.match([TokenType.SUPER])) {
                var keyword = this.previous();
                this.consume(TokenType.DOT, "Expect '.' after 'super'.");
                var method = this.consume(TokenType.IDENTIFIER,
                "Expect superclass method name.");
                return new Expr.Super(keyword, method);
            }

            if (this.match([TokenType.THIS])) return new Expr.This(this.previous());

            if (this.match([TokenType.MSG])) {
                var _keyword = this.previous();
                this.consume(TokenType.DOT, "Expect '.' after 'msg'.");
                var _method = this.consume(TokenType.IDENTIFIER,
                "Expect msgclass method name.");
                return new Expr.Msg(_keyword, _method);
            }

            if (this.match([TokenType.IDENTIFIER])) {
                return new Expr.Variable(this.previous());
            }

            if (this.match([TokenType.LEFT_PAREN])) {
                var expr = this.expression();
                this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
                return new Expr.Grouping(expr);
            }

            throw this.errorFunc(this.peek(), "Expect expression.");
        } }, { key: "match", value: function match(

        types) {
            for (var i = 0; i < types.length; i++) {
                if (this.check(types[i])) {
                    this.advance();
                    return true;
                }
            }

            return false;
        } }, { key: "consume", value: function consume(

        type, message) {
            if (this.check(type)) {
                return this.advance();
            }
            throw this.errorFunc(this.peek(), message);
        } }, { key: "check", value: function check(

        type) {
            if (this.isAtEnd()) return false;
            return this.peek().type == type;
        } }, { key: "advance", value: function advance()

        {
            if (!this.isAtEnd()) this.current++;
            return this.previous();
        } }, { key: "isAtEnd", value: function isAtEnd()

        {
            return this.peek().type == TokenType.EOF;
        } }, { key: "peek", value: function peek()

        {
            return this.tokens[this.current];
        } }, { key: "previous", value: function previous()

        {
            return this.tokens[this.current - 1];
        } }, { key: "errorFunc", value: function errorFunc(

        token, message) {
            _buna2.default.getInstance().err(token, message);
            return new _error.ParseError(token, message);
        } }, { key: "synchronize", value: function synchronize()

        {
            this.advance();
            while (!this.isAtEnd()) {
                if (this.previous().type == TokenType.SEMICOLON) return;
                switch (this.peek().type) {
                    case TokenType.CLASS:
                    case TokenType.FUN:
                    case TokenType.VAR:
                    case TokenType.FOR:
                    case TokenType.IF:
                    case TokenType.WHILE:
                    case TokenType.PRINT:
                    case TokenType.RETURN:
                        return;}

                this.advance();
            }

        } }]);return Parser;}();exports.default = Parser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9wYXJzZXIuanMiXSwibmFtZXMiOlsiRXhwciIsIlN0bXQiLCJUb2tlblR5cGUiLCJQYXJzZXIiLCJ0b2tlbnMiLCJjdXJyZW50Iiwic3RhdGVtZW50cyIsImlzQXRFbmQiLCJwdXNoIiwiZGVjbGFyYXRpb24iLCJhc3NpZ25tZW50IiwiZXhwciIsIm9yIiwibWF0Y2giLCJFUVVBTCIsImVxdWFscyIsInByZXZpb3VzIiwidmFsdWUiLCJWYXJpYWJsZSIsIm5hbWUiLCJBc3NpZ24iLCJHZXQiLCJnZXQiLCJTZXQiLCJvYmplY3QiLCJlcnJvckZ1bmMiLCJhbmQiLCJPUiIsIm9wZXJhdG9yIiwicmlnaHQiLCJMb2dpY2FsIiwiZXF1YWxpdHkiLCJBTkQiLCJDTEFTUyIsImNsYXNzRGVjbGFyYXRpb24iLCJGVU4iLCJmdW5jdGlvbiIsIlZBUiIsInZhckRlY2xhcmF0aW9uIiwic3RhdGVtZW50IiwiZSIsInN5bmNocm9uaXplIiwiY29uc3VtZSIsIklERU5USUZJRVIiLCJzdXBlcmNsYXNzIiwiTEVTUyIsIkxFRlRfQlJBQ0UiLCJtZXRob2RzIiwiY2hlY2siLCJSSUdIVF9CUkFDRSIsIkNsYXNzIiwiRk9SIiwiZm9yU3RhdGVtZW50IiwiSUYiLCJpZlN0YXRlbWVudCIsIlBSSU5UIiwicHJpbnRTdGF0ZW1lbnQiLCJSRVRVUk4iLCJyZXR1cm5TdGF0ZW1lbnQiLCJXSElMRSIsIndoaWxlU3RhdGVtZW50IiwiQmxvY2siLCJibG9jayIsImV4cHJlc3Npb25TdGF0ZW1lbnQiLCJMRUZUX1BBUkVOIiwiaW5pdGlhbGl6ZXIiLCJTRU1JQ09MT04iLCJjb25kaXRpb24iLCJleHByZXNzaW9uIiwiaW5jcmVtZW50IiwiUklHSFRfUEFSRU4iLCJib2R5IiwiRXhwcmVzc2lvbiIsIkxpdGVyYWwiLCJXaGlsZSIsInRoZW5CcmFuY2giLCJlbHNlQnJhbmNoIiwiRUxTRSIsIklmIiwiUHJpbnQiLCJrZXl3b3JkIiwiUmV0dXJuIiwiY29uc29sZSIsImxvZyIsIlZhciIsImtpbmQiLCJwYXJhbWV0ZXJzIiwibGVuZ3RoIiwicGVlayIsIkNPTU1BIiwiRnVuY3Rpb24iLCJjb21wYXJpc29uIiwiQkFOR19FUVVBTCIsIkVRVUFMX0VRVUFMIiwiQmluYXJ5IiwiYWRkaXRpb24iLCJHUkVBVEVSX0VRVUFMIiwiR1JFQVRFUiIsIkxFU1NfRVFVQUwiLCJtdWx0aXBsaWNhdGlvbiIsIk1JTlVTIiwiUExVUyIsInVuYXJ5IiwiU0xBU0giLCJTVEFSIiwiQkFORyIsIlVuYXJ5IiwiY2FsbCIsImNhbGxlZSIsImFyZ3MiLCJwYXJlbiIsIkNhbGwiLCJwcmltYXJ5IiwiZmluaXNoQ2FsbCIsIkRPVCIsIkZBTFNFIiwiVFJVRSIsIk5JTCIsIk5VTUJFUiIsIlNUUklORyIsImxpdGVyYWwiLCJTVVBFUiIsIm1ldGhvZCIsIlN1cGVyIiwiVEhJUyIsIlRoaXMiLCJNU0ciLCJNc2ciLCJHcm91cGluZyIsInR5cGVzIiwiaSIsImFkdmFuY2UiLCJ0eXBlIiwibWVzc2FnZSIsIkVPRiIsInRva2VuIiwiQnVuYSIsImdldEluc3RhbmNlIiwiZXJyIiwiUGFyc2VFcnJvciJdLCJtYXBwaW5ncyI6IjZVQUFBLDhCLElBQVlBLEk7QUFDWiw4QixJQUFZQyxJO0FBQ1osd0MsSUFBWUMsUztBQUNaO0FBQ0EsZ0M7QUFDQSw4Qjs7QUFFcUJDLE07QUFDakIsb0JBQVlDLE1BQVosRUFBb0I7QUFDaEIsYUFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsYUFBS0MsT0FBTCxHQUFlLENBQWY7QUFDSCxLOztBQUVPO0FBQ0osZ0JBQUlDLGFBQWEsRUFBakI7QUFDQSxtQkFBTyxDQUFDLEtBQUtDLE9BQUwsRUFBUixFQUF3QjtBQUNwQkQsMkJBQVdFLElBQVgsQ0FBZ0IsS0FBS0MsV0FBTCxFQUFoQjtBQUNIOztBQUVELG1CQUFPSCxVQUFQO0FBQ0gsUzs7QUFFWTtBQUNULG1CQUFPLEtBQUtJLFVBQUwsRUFBUDtBQUNILFM7O0FBRVk7QUFDVCxnQkFBSUMsT0FBTyxLQUFLQyxFQUFMLEVBQVg7O0FBRUEsZ0JBQUksS0FBS0MsS0FBTCxDQUFXLENBQUNYLFVBQVVZLEtBQVgsQ0FBWCxDQUFKLEVBQW1DO0FBQy9CLG9CQUFJQyxTQUFTLEtBQUtDLFFBQUwsRUFBYjtBQUNBLG9CQUFJQyxRQUFRLEtBQUtQLFVBQUwsRUFBWjtBQUNBLG9CQUFJQyxnQkFBZ0JYLEtBQUtrQixRQUF6QixFQUFtQztBQUMvQix3QkFBSUMsT0FBT1IsS0FBS1EsSUFBaEI7QUFDQSwyQkFBTyxJQUFJbkIsS0FBS29CLE1BQVQsQ0FBZ0JELElBQWhCLEVBQXNCRixLQUF0QixDQUFQO0FBQ0gsaUJBSEQsTUFHTyxJQUFJTixnQkFBZ0JYLEtBQUtxQixHQUF6QixFQUE4QjtBQUNqQyx3QkFBSUMsTUFBTVgsSUFBVjtBQUNBLDJCQUFPLElBQUlYLEtBQUt1QixHQUFULENBQWFELElBQUlFLE1BQWpCLEVBQXlCRixJQUFJSCxJQUE3QixFQUFtQ0YsS0FBbkMsQ0FBUDtBQUNIO0FBQ0Qsc0JBQU0sS0FBS1EsU0FBTCxDQUFlVixNQUFmLEVBQXVCLDRCQUF2QixDQUFOO0FBQ0g7O0FBRUQsbUJBQU9KLElBQVA7QUFDSCxTOztBQUVJO0FBQ0QsZ0JBQUlBLE9BQU8sS0FBS2UsR0FBTCxFQUFYOztBQUVBLG1CQUFPLEtBQUtiLEtBQUwsQ0FBVyxDQUFDWCxVQUFVeUIsRUFBWCxDQUFYLENBQVAsRUFBbUM7QUFDL0Isb0JBQUlDLFdBQVcsS0FBS1osUUFBTCxFQUFmO0FBQ0Esb0JBQUlhLFFBQVEsS0FBS0gsR0FBTCxFQUFaO0FBQ0FmLHVCQUFPLElBQUlYLEtBQUs4QixPQUFULENBQWlCbkIsSUFBakIsRUFBdUJpQixRQUF2QixFQUFpQ0MsS0FBakMsQ0FBUDtBQUNIOztBQUVELG1CQUFPbEIsSUFBUDtBQUNILFM7O0FBRUs7QUFDRixnQkFBSUEsT0FBTyxLQUFLb0IsUUFBTCxFQUFYOztBQUVBLG1CQUFPLEtBQUtsQixLQUFMLENBQVcsQ0FBQ1gsVUFBVThCLEdBQVgsQ0FBWCxDQUFQLEVBQW9DO0FBQ2hDLG9CQUFJSixXQUFXLEtBQUtaLFFBQUwsRUFBZjtBQUNBLG9CQUFJYSxRQUFRLEtBQUtFLFFBQUwsRUFBWjtBQUNBcEIsdUJBQU8sSUFBSVgsS0FBSzhCLE9BQVQsQ0FBaUJuQixJQUFqQixFQUF1QmlCLFFBQXZCLEVBQWlDQyxLQUFqQyxDQUFQO0FBQ0g7O0FBRUQsbUJBQU9sQixJQUFQO0FBQ0gsUzs7QUFFYTtBQUNWLGdCQUFJO0FBQ0Esb0JBQUksS0FBS0UsS0FBTCxDQUFXLENBQUNYLFVBQVUrQixLQUFYLENBQVgsQ0FBSixFQUFtQztBQUMvQiwyQkFBTyxLQUFLQyxnQkFBTCxFQUFQO0FBQ0g7QUFDRCxvQkFBSSxLQUFLckIsS0FBTCxDQUFXLENBQUNYLFVBQVVpQyxHQUFYLENBQVgsQ0FBSixFQUFpQztBQUM3QiwyQkFBTyxLQUFLQyxRQUFMLENBQWMsVUFBZCxDQUFQO0FBQ0g7QUFDRCxvQkFBSSxLQUFLdkIsS0FBTCxDQUFXLENBQUNYLFVBQVVtQyxHQUFYLENBQVgsQ0FBSixFQUFpQztBQUM3QiwyQkFBTyxLQUFLQyxjQUFMLEVBQVA7QUFDSDs7QUFFRCx1QkFBTyxLQUFLQyxTQUFMLEVBQVA7QUFDSCxhQVpELENBWUUsT0FBT0MsQ0FBUCxFQUFVO0FBQ1IscUJBQUtDLFdBQUw7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUFDSixTOztBQUVrQjtBQUNmLGdCQUFJdEIsT0FBTyxLQUFLdUIsT0FBTCxDQUFheEMsVUFBVXlDLFVBQXZCLEVBQW1DLG9CQUFuQyxDQUFYOztBQUVBLGdCQUFJQyxhQUFhLElBQWpCO0FBQ0EsZ0JBQUksS0FBSy9CLEtBQUwsQ0FBVyxDQUFDWCxVQUFVMkMsSUFBWCxDQUFYLENBQUosRUFBa0M7QUFDOUIscUJBQUtILE9BQUwsQ0FBYXhDLFVBQVV5QyxVQUF2QixFQUFtQyx5QkFBbkM7QUFDQUMsNkJBQWEsSUFBSTVDLEtBQUtrQixRQUFULENBQWtCLEtBQUtGLFFBQUwsRUFBbEIsQ0FBYjtBQUNIOztBQUVELGlCQUFLMEIsT0FBTCxDQUFheEMsVUFBVTRDLFVBQXZCLEVBQW1DLCtCQUFuQzs7QUFFQSxnQkFBSUMsVUFBVSxFQUFkO0FBQ0EsbUJBQU8sQ0FBQyxLQUFLQyxLQUFMLENBQVc5QyxVQUFVK0MsV0FBckIsQ0FBRCxJQUFzQyxDQUFDLEtBQUsxQyxPQUFMLEVBQTlDLEVBQThEO0FBQzFEd0Msd0JBQVF2QyxJQUFSLENBQWEsS0FBSzRCLFFBQUwsQ0FBYyxRQUFkLENBQWI7QUFDSDs7QUFFRCxpQkFBS00sT0FBTCxDQUFheEMsVUFBVStDLFdBQXZCLEVBQW9DLDhCQUFwQzs7QUFFQSxtQkFBTyxJQUFJaEQsS0FBS2lELEtBQVQsQ0FBZS9CLElBQWYsRUFBcUJ5QixVQUFyQixFQUFpQ0csT0FBakMsQ0FBUDtBQUNILFM7O0FBRVc7QUFDUixnQkFBSSxLQUFLbEMsS0FBTCxDQUFXLENBQUNYLFVBQVVpRCxHQUFYLENBQVgsQ0FBSixFQUFpQyxPQUFPLEtBQUtDLFlBQUwsRUFBUDtBQUNqQyxnQkFBSSxLQUFLdkMsS0FBTCxDQUFXLENBQUNYLFVBQVVtRCxFQUFYLENBQVgsQ0FBSixFQUFnQyxPQUFPLEtBQUtDLFdBQUwsRUFBUDtBQUNoQyxnQkFBSSxLQUFLekMsS0FBTCxDQUFXLENBQUNYLFVBQVVxRCxLQUFYLENBQVgsQ0FBSixFQUFtQyxPQUFPLEtBQUtDLGNBQUwsRUFBUDtBQUNuQyxnQkFBSSxLQUFLM0MsS0FBTCxDQUFXLENBQUNYLFVBQVV1RCxNQUFYLENBQVgsQ0FBSixFQUFvQyxPQUFPLEtBQUtDLGVBQUwsRUFBUDtBQUNwQyxnQkFBSSxLQUFLN0MsS0FBTCxDQUFXLENBQUNYLFVBQVV5RCxLQUFYLENBQVgsQ0FBSixFQUFtQyxPQUFPLEtBQUtDLGNBQUwsRUFBUDtBQUNuQyxnQkFBSSxLQUFLL0MsS0FBTCxDQUFXLENBQUNYLFVBQVU0QyxVQUFYLENBQVgsQ0FBSixFQUF3QyxPQUFPLElBQUk3QyxLQUFLNEQsS0FBVCxDQUFlLEtBQUtDLEtBQUwsRUFBZixDQUFQOztBQUV4QyxtQkFBTyxLQUFLQyxtQkFBTCxFQUFQO0FBQ0gsUzs7QUFFYztBQUNYLGlCQUFLckIsT0FBTCxDQUFheEMsVUFBVThELFVBQXZCLEVBQW1DLHlCQUFuQzs7QUFFQSxnQkFBSUMsb0JBQUo7QUFDQSxnQkFBSSxLQUFLcEQsS0FBTCxDQUFXLENBQUNYLFVBQVVnRSxTQUFYLENBQVgsQ0FBSixFQUF1QztBQUNuQ0QsOEJBQWMsSUFBZDtBQUNILGFBRkQsTUFFTyxJQUFJLEtBQUtwRCxLQUFMLENBQVcsQ0FBQ1gsVUFBVW1DLEdBQVgsQ0FBWCxDQUFKLEVBQWlDO0FBQ3BDNEIsOEJBQWMsS0FBSzNCLGNBQUwsRUFBZDtBQUNILGFBRk0sTUFFQTtBQUNIMkIsOEJBQWMsS0FBS0YsbUJBQUwsRUFBZDtBQUNIOztBQUVELGdCQUFJSSxZQUFZLElBQWhCO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLbkIsS0FBTCxDQUFXOUMsVUFBVWdFLFNBQXJCLENBQUwsRUFBc0M7QUFDbENDLDRCQUFZLEtBQUtDLFVBQUwsRUFBWjtBQUNIOztBQUVELGlCQUFLMUIsT0FBTCxDQUFheEMsVUFBVWdFLFNBQXZCLEVBQWtDLGtDQUFsQzs7QUFFQSxnQkFBSUcsWUFBWSxJQUFoQjtBQUNBLGdCQUFJLENBQUMsS0FBS3JCLEtBQUwsQ0FBVzlDLFVBQVVvRSxXQUFyQixDQUFMLEVBQXdDO0FBQ3BDRCw0QkFBWSxLQUFLRCxVQUFMLEVBQVo7QUFDSDs7QUFFRCxpQkFBSzFCLE9BQUwsQ0FBYXhDLFVBQVVvRSxXQUF2QixFQUFvQywrQkFBcEM7O0FBRUEsZ0JBQUlDLE9BQU8sS0FBS2hDLFNBQUwsRUFBWDs7QUFFQTtBQUNBLGdCQUFJOEIsYUFBYSxJQUFqQixFQUF1QjtBQUNuQkUsdUJBQU8sSUFBSXRFLEtBQUs0RCxLQUFULENBQWUsQ0FBQ1UsSUFBRCxFQUFPLElBQUl0RSxLQUFLdUUsVUFBVCxDQUFvQkgsU0FBcEIsQ0FBUCxDQUFmLENBQVA7QUFDSDs7QUFFRCxnQkFBSUYsYUFBYSxJQUFqQixFQUF1QjtBQUNuQkEsNEJBQVksSUFBSW5FLEtBQUt5RSxPQUFULENBQWlCLElBQWpCLENBQVo7QUFDSDtBQUNERixtQkFBTyxJQUFJdEUsS0FBS3lFLEtBQVQsQ0FBZVAsU0FBZixFQUEwQkksSUFBMUIsQ0FBUDs7QUFFQSxnQkFBSU4sZUFBZSxJQUFuQixFQUF5QjtBQUNyQk0sdUJBQU8sSUFBSXRFLEtBQUs0RCxLQUFULENBQWUsQ0FBQ0ksV0FBRCxFQUFjTSxJQUFkLENBQWYsQ0FBUDtBQUNIOztBQUVELG1CQUFPQSxJQUFQO0FBQ0gsUzs7QUFFYTtBQUNWLGlCQUFLN0IsT0FBTCxDQUFheEMsVUFBVThELFVBQXZCLEVBQW1DLHdCQUFuQztBQUNBLGdCQUFJRyxZQUFZLEtBQUtDLFVBQUwsRUFBaEI7QUFDQSxpQkFBSzFCLE9BQUwsQ0FBYXhDLFVBQVVvRSxXQUF2QixFQUFvQyx3QkFBcEM7O0FBRUEsZ0JBQUlLLGFBQWEsS0FBS3BDLFNBQUwsRUFBakI7QUFDQSxnQkFBSXFDLGFBQWEsSUFBakI7QUFDQSxnQkFBSSxLQUFLL0QsS0FBTCxDQUFXLENBQUNYLFVBQVUyRSxJQUFYLENBQVgsQ0FBSixFQUFrQztBQUM5QkQsNkJBQWEsS0FBS3JDLFNBQUwsRUFBYjtBQUNIOztBQUVELG1CQUFPLElBQUl0QyxLQUFLNkUsRUFBVCxDQUFZWCxTQUFaLEVBQXVCUSxVQUF2QixFQUFtQ0MsVUFBbkMsQ0FBUDtBQUNILFM7O0FBRWdCO0FBQ2IsZ0JBQUkzRCxRQUFRLEtBQUttRCxVQUFMLEVBQVo7QUFDQSxpQkFBSzFCLE9BQUwsQ0FBYXhDLFVBQVVnRSxTQUF2QixFQUFrQyx5QkFBbEM7QUFDQSxtQkFBTyxJQUFJakUsS0FBSzhFLEtBQVQsQ0FBZTlELEtBQWYsQ0FBUDtBQUNILFM7O0FBRWlCO0FBQ2QsZ0JBQUkrRCxVQUFVLEtBQUtoRSxRQUFMLEVBQWQ7QUFDQSxnQkFBSUMsUUFBUSxJQUFaO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLK0IsS0FBTCxDQUFXOUMsVUFBVWdFLFNBQXJCLENBQUwsRUFBc0M7QUFDbENqRCx3QkFBUSxLQUFLbUQsVUFBTCxFQUFSO0FBQ0g7QUFDRCxpQkFBSzFCLE9BQUwsQ0FBYXhDLFVBQVVnRSxTQUF2QixFQUFrQyxnQ0FBbEM7QUFDQSxnQkFBSTtBQUNBLHVCQUFPLElBQUlqRSxLQUFLZ0YsTUFBVCxDQUFnQkQsT0FBaEIsRUFBeUIvRCxLQUF6QixDQUFQO0FBQ0gsYUFGRCxDQUVFLE9BQU91QixDQUFQLEVBQVU7QUFDUjBDLHdCQUFRQyxHQUFSLENBQVkzQyxDQUFaO0FBQ0g7QUFDSixTOztBQUVnQjtBQUNiLGdCQUFJckIsT0FBTyxLQUFLdUIsT0FBTCxDQUFheEMsVUFBVXlDLFVBQXZCLEVBQW1DLHVCQUFuQyxDQUFYOztBQUVBLGdCQUFJc0IsY0FBYyxJQUFsQjtBQUNBLGdCQUFJLEtBQUtwRCxLQUFMLENBQVcsQ0FBQ1gsVUFBVVksS0FBWCxDQUFYLENBQUosRUFBbUM7QUFDL0JtRCw4QkFBYyxLQUFLRyxVQUFMLEVBQWQ7QUFDSDtBQUNELGlCQUFLMUIsT0FBTCxDQUFheEMsVUFBVWdFLFNBQXZCLEVBQWtDLHdDQUFsQztBQUNBLG1CQUFPLElBQUlqRSxLQUFLbUYsR0FBVCxDQUFhakUsSUFBYixFQUFtQjhDLFdBQW5CLENBQVA7QUFDSCxTOztBQUVnQjtBQUNiLGlCQUFLdkIsT0FBTCxDQUFheEMsVUFBVThELFVBQXZCLEVBQW1DLDJCQUFuQztBQUNBLGdCQUFJRyxZQUFZLEtBQUtDLFVBQUwsRUFBaEI7QUFDQSxpQkFBSzFCLE9BQUwsQ0FBYXhDLFVBQVVvRSxXQUF2QixFQUFvQywrQkFBcEM7QUFDQSxnQkFBSUMsT0FBTyxLQUFLaEMsU0FBTCxFQUFYOztBQUVBLG1CQUFPLElBQUl0QyxLQUFLeUUsS0FBVCxDQUFlUCxTQUFmLEVBQTBCSSxJQUExQixDQUFQO0FBQ0gsUzs7QUFFcUI7QUFDbEIsZ0JBQUk1RCxPQUFPLEtBQUt5RCxVQUFMLEVBQVg7QUFDQSxpQkFBSzFCLE9BQUwsQ0FBYXhDLFVBQVVnRSxTQUF2QixFQUFrQyw4QkFBbEM7QUFDQSxtQkFBTyxJQUFJakUsS0FBS3VFLFVBQVQsQ0FBb0I3RCxJQUFwQixDQUFQO0FBQ0gsUzs7QUFFUTBFLFksRUFBTTtBQUNYLGdCQUFJbEUsT0FBTyxLQUFLdUIsT0FBTCxDQUFheEMsVUFBVXlDLFVBQXZCLEVBQW1DLFlBQVkwQyxJQUFaLEdBQW1CLFFBQXRELENBQVg7QUFDQSxpQkFBSzNDLE9BQUwsQ0FBYXhDLFVBQVU4RCxVQUF2QixFQUFtQyxzQkFBc0JxQixJQUF0QixHQUE2QixRQUFoRTtBQUNBLGdCQUFJQyxhQUFhLEVBQWpCO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLdEMsS0FBTCxDQUFXOUMsVUFBVW9FLFdBQXJCLENBQUwsRUFBd0M7QUFDcEMsbUJBQUc7QUFDQyx3QkFBSWdCLFdBQVdDLE1BQVgsSUFBcUIsQ0FBekIsRUFBNEI7QUFDeEIsOEJBQU0sS0FBSzlELFNBQUwsQ0FBZSxLQUFLK0QsSUFBTCxFQUFmLEVBQTRCLHFDQUE1QixDQUFOO0FBQ0g7O0FBRURGLCtCQUFXOUUsSUFBWCxDQUFnQixLQUFLa0MsT0FBTCxDQUFheEMsVUFBVXlDLFVBQXZCLEVBQW1DLHdCQUFuQyxDQUFoQjtBQUNILGlCQU5ELFFBTVMsS0FBSzlCLEtBQUwsQ0FBVyxDQUFDWCxVQUFVdUYsS0FBWCxDQUFYLENBTlQ7QUFPSDtBQUNELGlCQUFLL0MsT0FBTCxDQUFheEMsVUFBVW9FLFdBQXZCLEVBQW9DLDhCQUFwQzs7QUFFQSxpQkFBSzVCLE9BQUwsQ0FBYXhDLFVBQVU0QyxVQUF2QixFQUFtQyx1QkFBdUJ1QyxJQUF2QixHQUE4QixRQUFqRTtBQUNBLGdCQUFJZCxPQUFPLEtBQUtULEtBQUwsRUFBWDtBQUNBLG1CQUFPLElBQUk3RCxLQUFLeUYsUUFBVCxDQUFrQnZFLElBQWxCLEVBQXdCbUUsVUFBeEIsRUFBb0NmLElBQXBDLENBQVA7QUFDSCxTOztBQUVPO0FBQ0osZ0JBQUlqRSxhQUFhLEVBQWpCO0FBQ0EsbUJBQU8sQ0FBQyxLQUFLMEMsS0FBTCxDQUFXOUMsVUFBVStDLFdBQXJCLENBQUQsSUFBc0MsQ0FBQyxLQUFLMUMsT0FBTCxFQUE5QyxFQUE4RDtBQUMxREQsMkJBQVdFLElBQVgsQ0FBZ0IsS0FBS0MsV0FBTCxFQUFoQjtBQUNIO0FBQ0QsaUJBQUtpQyxPQUFMLENBQWF4QyxVQUFVK0MsV0FBdkIsRUFBb0MseUJBQXBDO0FBQ0EsbUJBQU8zQyxVQUFQO0FBQ0gsUzs7QUFFVTtBQUNQLGdCQUFJSyxPQUFPLEtBQUtnRixVQUFMLEVBQVg7O0FBRUEsbUJBQU8sS0FBSzlFLEtBQUwsQ0FBVyxDQUFDWCxVQUFVMEYsVUFBWCxFQUF1QjFGLFVBQVUyRixXQUFqQyxDQUFYLENBQVAsRUFBa0U7QUFDOUQsb0JBQUlqRSxXQUFXLEtBQUtaLFFBQUwsRUFBZjtBQUNBLG9CQUFJYSxRQUFRLEtBQUs4RCxVQUFMLEVBQVo7QUFDQWhGLHVCQUFPLElBQUlYLEtBQUs4RixNQUFULENBQWdCbkYsSUFBaEIsRUFBc0JpQixRQUF0QixFQUFnQ0MsS0FBaEMsQ0FBUDtBQUNIOztBQUVELG1CQUFPbEIsSUFBUDtBQUNILFM7O0FBRVk7QUFDVCxnQkFBSUEsT0FBTyxLQUFLb0YsUUFBTCxFQUFYOztBQUVBLG1CQUFPLEtBQUtsRixLQUFMLENBQVcsQ0FBQ1gsVUFBVThGLGFBQVgsRUFBMEI5RixVQUFVK0YsT0FBcEMsRUFBNkMvRixVQUFVZ0csVUFBdkQsRUFBbUVoRyxVQUFVMkMsSUFBN0UsQ0FBWCxDQUFQLEVBQXVHO0FBQ25HLG9CQUFJakIsV0FBVyxLQUFLWixRQUFMLEVBQWY7QUFDQSxvQkFBSWEsUUFBUSxLQUFLa0UsUUFBTCxFQUFaO0FBQ0FwRix1QkFBTyxJQUFJWCxLQUFLOEYsTUFBVCxDQUFnQm5GLElBQWhCLEVBQXNCaUIsUUFBdEIsRUFBZ0NDLEtBQWhDLENBQVA7QUFDSDs7QUFFRCxtQkFBT2xCLElBQVA7QUFDSCxTOztBQUVVO0FBQ1AsZ0JBQUlBLE9BQU8sS0FBS3dGLGNBQUwsRUFBWDs7QUFFQSxtQkFBTyxLQUFLdEYsS0FBTCxDQUFXLENBQUNYLFVBQVVrRyxLQUFYLEVBQWtCbEcsVUFBVW1HLElBQTVCLENBQVgsQ0FBUCxFQUFzRDtBQUNsRCxvQkFBSXpFLFdBQVcsS0FBS1osUUFBTCxFQUFmO0FBQ0Esb0JBQUlhLFFBQVEsS0FBS3NFLGNBQUwsRUFBWjtBQUNBeEYsdUJBQU8sSUFBSVgsS0FBSzhGLE1BQVQsQ0FBZ0JuRixJQUFoQixFQUFzQmlCLFFBQXRCLEVBQWdDQyxLQUFoQyxDQUFQO0FBQ0g7O0FBRUQsbUJBQU9sQixJQUFQO0FBQ0gsUzs7QUFFZ0I7QUFDYixnQkFBSUEsT0FBTyxLQUFLMkYsS0FBTCxFQUFYOztBQUVBLG1CQUFPLEtBQUt6RixLQUFMLENBQVcsQ0FBQ1gsVUFBVXFHLEtBQVgsRUFBa0JyRyxVQUFVc0csSUFBNUIsQ0FBWCxDQUFQLEVBQXNEO0FBQ2xELG9CQUFJNUUsV0FBVyxLQUFLWixRQUFMLEVBQWY7QUFDQSxvQkFBSWEsUUFBUSxLQUFLeUUsS0FBTCxFQUFaO0FBQ0EzRix1QkFBTyxJQUFJWCxLQUFLOEYsTUFBVCxDQUFnQm5GLElBQWhCLEVBQXNCaUIsUUFBdEIsRUFBZ0NDLEtBQWhDLENBQVA7QUFDSDs7QUFFRCxtQkFBT2xCLElBQVA7QUFDSCxTOztBQUVPO0FBQ0osZ0JBQUksS0FBS0UsS0FBTCxDQUFXLENBQUNYLFVBQVV1RyxJQUFYLEVBQWlCdkcsVUFBVWtHLEtBQTNCLENBQVgsQ0FBSixFQUFtRDtBQUMvQyxvQkFBSXhFLFdBQVcsS0FBS1osUUFBTCxFQUFmO0FBQ0Esb0JBQUlhLFFBQVEsS0FBS3lFLEtBQUwsRUFBWjtBQUNBLHVCQUFPLElBQUl0RyxLQUFLMEcsS0FBVCxDQUFlOUUsUUFBZixFQUF5QkMsS0FBekIsQ0FBUDtBQUNIOztBQUVELG1CQUFPLEtBQUs4RSxJQUFMLEVBQVA7QUFDSCxTOztBQUVVQyxjLEVBQVE7QUFDZixnQkFBSUMsT0FBTyxFQUFYOztBQUVBLGdCQUFJLENBQUMsS0FBSzdELEtBQUwsQ0FBVzlDLFVBQVVvRSxXQUFyQixDQUFMLEVBQXdDO0FBQ3BDLG1CQUFHO0FBQ0Msd0JBQUl1QyxLQUFLdEIsTUFBTCxJQUFlLENBQW5CLEVBQXNCO0FBQ2xCLDhCQUFNLEtBQUs5RCxTQUFMLENBQWUsS0FBSytELElBQUwsRUFBZixFQUE0QixvQ0FBNUIsQ0FBTjtBQUNIO0FBQ0RxQix5QkFBS3JHLElBQUwsQ0FBVSxLQUFLNEQsVUFBTCxFQUFWO0FBQ0gsaUJBTEQsUUFLUyxLQUFLdkQsS0FBTCxDQUFXLENBQUNYLFVBQVV1RixLQUFYLENBQVgsQ0FMVDtBQU1IOztBQUVELGdCQUFJcUIsUUFBUSxLQUFLcEUsT0FBTCxDQUFheEMsVUFBVW9FLFdBQXZCLEVBQW9DLDZCQUFwQyxDQUFaOztBQUVBLG1CQUFPLElBQUl0RSxLQUFLK0csSUFBVCxDQUFjSCxNQUFkLEVBQXNCRSxLQUF0QixFQUE2QkQsSUFBN0IsQ0FBUDtBQUNILFM7O0FBRU07QUFDSCxnQkFBSWxHLE9BQU8sS0FBS3FHLE9BQUwsRUFBWDtBQUNBLG1CQUFPLElBQVAsRUFBYTtBQUNULG9CQUFJLEtBQUtuRyxLQUFMLENBQVcsQ0FBQ1gsVUFBVThELFVBQVgsQ0FBWCxDQUFKLEVBQXdDO0FBQ3BDckQsMkJBQU8sS0FBS3NHLFVBQUwsQ0FBZ0J0RyxJQUFoQixDQUFQO0FBQ0gsaUJBRkQsTUFFTyxJQUFJLEtBQUtFLEtBQUwsQ0FBVyxDQUFDWCxVQUFVZ0gsR0FBWCxDQUFYLENBQUosRUFBaUM7QUFDcEMsd0JBQUkvRixPQUFPLEtBQUt1QixPQUFMLENBQWF4QyxVQUFVeUMsVUFBdkIsRUFBbUMsaUNBQW5DLENBQVg7QUFDQWhDLDJCQUFPLElBQUlYLEtBQUtxQixHQUFULENBQWFWLElBQWIsRUFBbUJRLElBQW5CLENBQVA7QUFDSCxpQkFITSxNQUdBO0FBQ0g7QUFDSDtBQUNKOztBQUVELG1CQUFPUixJQUFQO0FBQ0gsUzs7QUFFUztBQUNOLGdCQUFJLEtBQUtFLEtBQUwsQ0FBVyxDQUFDWCxVQUFVaUgsS0FBWCxDQUFYLENBQUosRUFBbUMsT0FBTyxJQUFJbkgsS0FBS3lFLE9BQVQsQ0FBaUIsS0FBakIsQ0FBUDtBQUNuQyxnQkFBSSxLQUFLNUQsS0FBTCxDQUFXLENBQUNYLFVBQVVrSCxJQUFYLENBQVgsQ0FBSixFQUFrQyxPQUFPLElBQUlwSCxLQUFLeUUsT0FBVCxDQUFpQixJQUFqQixDQUFQO0FBQ2xDLGdCQUFJLEtBQUs1RCxLQUFMLENBQVcsQ0FBQ1gsVUFBVW1ILEdBQVgsQ0FBWCxDQUFKLEVBQWlDLE9BQU8sSUFBSXJILEtBQUt5RSxPQUFULENBQWlCLElBQWpCLENBQVA7O0FBRWpDLGdCQUFJLEtBQUs1RCxLQUFMLENBQVcsQ0FBQ1gsVUFBVW9ILE1BQVgsRUFBbUJwSCxVQUFVcUgsTUFBN0IsQ0FBWCxDQUFKLEVBQXNEO0FBQ2xELHVCQUFPLElBQUl2SCxLQUFLeUUsT0FBVCxDQUFpQixLQUFLekQsUUFBTCxHQUFnQndHLE9BQWpDLENBQVA7QUFDSDs7QUFFRCxnQkFBSSxLQUFLM0csS0FBTCxDQUFXLENBQUNYLFVBQVV1SCxLQUFYLENBQVgsQ0FBSixFQUFtQztBQUMvQixvQkFBSXpDLFVBQVUsS0FBS2hFLFFBQUwsRUFBZDtBQUNBLHFCQUFLMEIsT0FBTCxDQUFheEMsVUFBVWdILEdBQXZCLEVBQTRCLDJCQUE1QjtBQUNBLG9CQUFJUSxTQUFTLEtBQUtoRixPQUFMLENBQWF4QyxVQUFVeUMsVUFBdkI7QUFDVCxnREFEUyxDQUFiO0FBRUEsdUJBQU8sSUFBSTNDLEtBQUsySCxLQUFULENBQWUzQyxPQUFmLEVBQXdCMEMsTUFBeEIsQ0FBUDtBQUNIOztBQUVELGdCQUFJLEtBQUs3RyxLQUFMLENBQVcsQ0FBQ1gsVUFBVTBILElBQVgsQ0FBWCxDQUFKLEVBQWtDLE9BQU8sSUFBSTVILEtBQUs2SCxJQUFULENBQWMsS0FBSzdHLFFBQUwsRUFBZCxDQUFQOztBQUVsQyxnQkFBSSxLQUFLSCxLQUFMLENBQVcsQ0FBQ1gsVUFBVTRILEdBQVgsQ0FBWCxDQUFKLEVBQWlDO0FBQzdCLG9CQUFJOUMsV0FBVSxLQUFLaEUsUUFBTCxFQUFkO0FBQ0EscUJBQUswQixPQUFMLENBQWF4QyxVQUFVZ0gsR0FBdkIsRUFBNEIseUJBQTVCO0FBQ0Esb0JBQUlRLFVBQVMsS0FBS2hGLE9BQUwsQ0FBYXhDLFVBQVV5QyxVQUF2QjtBQUNULDhDQURTLENBQWI7QUFFQSx1QkFBTyxJQUFJM0MsS0FBSytILEdBQVQsQ0FBYS9DLFFBQWIsRUFBc0IwQyxPQUF0QixDQUFQO0FBQ0g7O0FBRUQsZ0JBQUksS0FBSzdHLEtBQUwsQ0FBVyxDQUFDWCxVQUFVeUMsVUFBWCxDQUFYLENBQUosRUFBd0M7QUFDcEMsdUJBQU8sSUFBSTNDLEtBQUtrQixRQUFULENBQWtCLEtBQUtGLFFBQUwsRUFBbEIsQ0FBUDtBQUNIOztBQUVELGdCQUFJLEtBQUtILEtBQUwsQ0FBVyxDQUFDWCxVQUFVOEQsVUFBWCxDQUFYLENBQUosRUFBd0M7QUFDcEMsb0JBQUlyRCxPQUFPLEtBQUt5RCxVQUFMLEVBQVg7QUFDQSxxQkFBSzFCLE9BQUwsQ0FBYXhDLFVBQVVvRSxXQUF2QixFQUFvQyw4QkFBcEM7QUFDQSx1QkFBTyxJQUFJdEUsS0FBS2dJLFFBQVQsQ0FBa0JySCxJQUFsQixDQUFQO0FBQ0g7O0FBRUQsa0JBQU0sS0FBS2MsU0FBTCxDQUFlLEtBQUsrRCxJQUFMLEVBQWYsRUFBNEIsb0JBQTVCLENBQU47QUFDSCxTOztBQUVLeUMsYSxFQUFPO0FBQ1QsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxNQUFNMUMsTUFBMUIsRUFBa0MyQyxHQUFsQyxFQUF1QztBQUNuQyxvQkFBSSxLQUFLbEYsS0FBTCxDQUFXaUYsTUFBTUMsQ0FBTixDQUFYLENBQUosRUFBMEI7QUFDdEIseUJBQUtDLE9BQUw7QUFDQSwyQkFBTyxJQUFQO0FBQ0g7QUFDSjs7QUFFRCxtQkFBTyxLQUFQO0FBQ0gsUzs7QUFFT0MsWSxFQUFNQyxPLEVBQVM7QUFDbkIsZ0JBQUksS0FBS3JGLEtBQUwsQ0FBV29GLElBQVgsQ0FBSixFQUFzQjtBQUNsQix1QkFBTyxLQUFLRCxPQUFMLEVBQVA7QUFDSDtBQUNELGtCQUFNLEtBQUsxRyxTQUFMLENBQWUsS0FBSytELElBQUwsRUFBZixFQUE0QjZDLE9BQTVCLENBQU47QUFDSCxTOztBQUVLRCxZLEVBQU07QUFDUixnQkFBSSxLQUFLN0gsT0FBTCxFQUFKLEVBQW9CLE9BQU8sS0FBUDtBQUNwQixtQkFBTyxLQUFLaUYsSUFBTCxHQUFZNEMsSUFBWixJQUFvQkEsSUFBM0I7QUFDSCxTOztBQUVTO0FBQ04sZ0JBQUksQ0FBQyxLQUFLN0gsT0FBTCxFQUFMLEVBQXFCLEtBQUtGLE9BQUw7QUFDckIsbUJBQU8sS0FBS1csUUFBTCxFQUFQO0FBQ0gsUzs7QUFFUztBQUNOLG1CQUFPLEtBQUt3RSxJQUFMLEdBQVk0QyxJQUFaLElBQW9CbEksVUFBVW9JLEdBQXJDO0FBQ0gsUzs7QUFFTTtBQUNILG1CQUFPLEtBQUtsSSxNQUFMLENBQVksS0FBS0MsT0FBakIsQ0FBUDtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxLQUFLRCxNQUFMLENBQVksS0FBS0MsT0FBTCxHQUFlLENBQTNCLENBQVA7QUFDSCxTOztBQUVTa0ksYSxFQUFPRixPLEVBQVM7QUFDdEJHLDJCQUFLQyxXQUFMLEdBQW1CQyxHQUFuQixDQUF1QkgsS0FBdkIsRUFBOEJGLE9BQTlCO0FBQ0EsbUJBQU8sSUFBSU0saUJBQUosQ0FBZUosS0FBZixFQUFzQkYsT0FBdEIsQ0FBUDtBQUNILFM7O0FBRWE7QUFDVixpQkFBS0YsT0FBTDtBQUNBLG1CQUFPLENBQUMsS0FBSzVILE9BQUwsRUFBUixFQUF3QjtBQUNwQixvQkFBSSxLQUFLUyxRQUFMLEdBQWdCb0gsSUFBaEIsSUFBd0JsSSxVQUFVZ0UsU0FBdEMsRUFBaUQ7QUFDakQsd0JBQVEsS0FBS3NCLElBQUwsR0FBWTRDLElBQXBCO0FBQ0kseUJBQUtsSSxVQUFVK0IsS0FBZjtBQUNBLHlCQUFLL0IsVUFBVWlDLEdBQWY7QUFDQSx5QkFBS2pDLFVBQVVtQyxHQUFmO0FBQ0EseUJBQUtuQyxVQUFVaUQsR0FBZjtBQUNBLHlCQUFLakQsVUFBVW1ELEVBQWY7QUFDQSx5QkFBS25ELFVBQVV5RCxLQUFmO0FBQ0EseUJBQUt6RCxVQUFVcUQsS0FBZjtBQUNBLHlCQUFLckQsVUFBVXVELE1BQWY7QUFDSSwrQkFUUjs7QUFXQSxxQkFBSzBFLE9BQUw7QUFDSDs7QUFFSixTLHlDQXpiZ0JoSSxNIiwiZmlsZSI6InBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0ICogYXMgU3RtdCBmcm9tIFwiLi9zdG10XCI7XG5pbXBvcnQgKiBhcyBUb2tlblR5cGUgZnJvbSAnLi90b2tlblR5cGUnO1xuaW1wb3J0IHsgUGFyc2VFcnJvciB9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IFRva2VuIGZyb20gJy4vdG9rZW4nO1xuaW1wb3J0IEJ1bmEgZnJvbSAnLi9idW5hJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih0b2tlbnMpIHtcbiAgICAgICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgfVxuXG4gICAgcGFyc2UoKSB7XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzID0gW107XG4gICAgICAgIHdoaWxlICghdGhpcy5pc0F0RW5kKCkpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlY2xhcmF0aW9uKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gICAgfVxuXG4gICAgZXhwcmVzc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXNzaWdubWVudCgpO1xuICAgIH1cblxuICAgIGFzc2lnbm1lbnQoKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5vcigpO1xuXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuRVFVQUxdKSkge1xuICAgICAgICAgICAgbGV0IGVxdWFscyA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgICAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBleHByLm5hbWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICAgICAgICAgIGxldCBnZXQgPSBleHByO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXhwci5TZXQoZ2V0Lm9iamVjdCwgZ2V0Lm5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IHRoaXMuZXJyb3JGdW5jKGVxdWFscywgXCJJbnZhbGlkIGFzc2lnbm1lbnQgdGFyZ2V0LlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIG9yKCkge1xuICAgICAgICBsZXQgZXhwciA9IHRoaXMuYW5kKCk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5PUl0pKSB7XG4gICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLmFuZCgpO1xuICAgICAgICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIGFuZCgpIHtcbiAgICAgICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5BTkRdKSkge1xuICAgICAgICAgICAgbGV0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgICAgICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIGRlY2xhcmF0aW9uKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5DTEFTU10pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NEZWNsYXJhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5GVU5dKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZ1bmN0aW9uKFwiZnVuY3Rpb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLlZBUl0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFyRGVjbGFyYXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVtZW50KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3luY2hyb25pemUoKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3NEZWNsYXJhdGlvbigpIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklERU5USUZJRVIsIFwiRXhwZWN0IGNsYXNzIG5hbWUuXCIpO1xuXG4gICAgICAgIGxldCBzdXBlcmNsYXNzID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5MRVNTXSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuSURFTlRJRklFUiwgXCJFeHBlY3Qgc3VwZXJjbGFzcyBuYW1lLlwiKTtcbiAgICAgICAgICAgIHN1cGVyY2xhc3MgPSBuZXcgRXhwci5WYXJpYWJsZSh0aGlzLnByZXZpb3VzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5MRUZUX0JSQUNFLCBcIkV4cGVjdCAneycgYmVmb3JlIGNsYXNzIGJvZHkuXCIpO1xuXG4gICAgICAgIGxldCBtZXRob2RzID0gW107XG4gICAgICAgIHdoaWxlICghdGhpcy5jaGVjayhUb2tlblR5cGUuUklHSFRfQlJBQ0UpICYmICF0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICAgICAgbWV0aG9kcy5wdXNoKHRoaXMuZnVuY3Rpb24oXCJtZXRob2RcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SSUdIVF9CUkFDRSwgXCJFeHBlY3QgJ30nIGFmdGVyIGNsYXNzIGJvZHkuXCIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RtdC5DbGFzcyhuYW1lLCBzdXBlcmNsYXNzLCBtZXRob2RzKTtcbiAgICB9XG5cbiAgICBzdGF0ZW1lbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuRk9SXSkpIHJldHVybiB0aGlzLmZvclN0YXRlbWVudCgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLklGXSkpIHJldHVybiB0aGlzLmlmU3RhdGVtZW50KCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuUFJJTlRdKSkgcmV0dXJuIHRoaXMucHJpbnRTdGF0ZW1lbnQoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5SRVRVUk5dKSkgcmV0dXJuIHRoaXMucmV0dXJuU3RhdGVtZW50KCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuV0hJTEVdKSkgcmV0dXJuIHRoaXMud2hpbGVTdGF0ZW1lbnQoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5MRUZUX0JSQUNFXSkpIHJldHVybiBuZXcgU3RtdC5CbG9jayh0aGlzLmJsb2NrKCkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmV4cHJlc3Npb25TdGF0ZW1lbnQoKTtcbiAgICB9XG5cbiAgICBmb3JTdGF0ZW1lbnQoKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuTEVGVF9QQVJFTiwgXCJFeHBlY3QgJygnIGFmdGVyICdmb3InLlwiKTtcblxuICAgICAgICBsZXQgaW5pdGlhbGl6ZXI7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuU0VNSUNPTE9OXSkpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVyID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuVkFSXSkpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVyID0gdGhpcy52YXJEZWNsYXJhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZXIgPSB0aGlzLmV4cHJlc3Npb25TdGF0ZW1lbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb25kaXRpb24gPSBudWxsO1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlNFTUlDT0xPTikpIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbiA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5TRU1JQ09MT04sIFwiRXhwZWN0ICc7JyBhZnRlciBsb29wIGNvbmRpdGlvbi5cIik7XG5cbiAgICAgICAgbGV0IGluY3JlbWVudCA9IG51bGw7XG4gICAgICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUklHSFRfUEFSRU4pKSB7XG4gICAgICAgICAgICBpbmNyZW1lbnQgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUklHSFRfUEFSRU4sIFwiRXhwZWN0ICcpJyBhZnRlciBmb3IgY2xhdXNlcy5cIik7XG5cbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLnN0YXRlbWVudCgpO1xuXG4gICAgICAgIC8vIEJlZ2luIGRlc3VnYXJpbmcgaW50byBhICd3aGlsZScgbG9vcC4uLlxuICAgICAgICBpZiAoaW5jcmVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGJvZHkgPSBuZXcgU3RtdC5CbG9jayhbYm9keSwgbmV3IFN0bXQuRXhwcmVzc2lvbihpbmNyZW1lbnQpXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZGl0aW9uID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbiA9IG5ldyBFeHByLkxpdGVyYWwodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IG5ldyBTdG10LldoaWxlKGNvbmRpdGlvbiwgYm9keSk7XG5cbiAgICAgICAgaWYgKGluaXRpYWxpemVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIGJvZHkgPSBuZXcgU3RtdC5CbG9jayhbaW5pdGlhbGl6ZXIsIGJvZHldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH1cblxuICAgIGlmU3RhdGVtZW50KCkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkxFRlRfUEFSRU4sIFwiRXhwZWN0ICcoJyBhZnRlciAnaWYnLlwiKTtcbiAgICAgICAgbGV0IGNvbmRpdGlvbiA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJJR0hUX1BBUkVOLCBcIkV4cGVjdCAnKScgYWZ0ZXIgJ2lmJy5cIik7XG5cbiAgICAgICAgbGV0IHRoZW5CcmFuY2ggPSB0aGlzLnN0YXRlbWVudCgpO1xuICAgICAgICBsZXQgZWxzZUJyYW5jaCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuRUxTRV0pKSB7XG4gICAgICAgICAgICBlbHNlQnJhbmNoID0gdGhpcy5zdGF0ZW1lbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgU3RtdC5JZihjb25kaXRpb24sIHRoZW5CcmFuY2gsIGVsc2VCcmFuY2gpO1xuICAgIH1cblxuICAgIHByaW50U3RhdGVtZW50KCkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5TRU1JQ09MT04sIFwiRXhwZWN0ICc7JyBhZnRlciB2YWx1ZTtcIik7XG4gICAgICAgIHJldHVybiBuZXcgU3RtdC5QcmludCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuU3RhdGVtZW50KCkge1xuICAgICAgICBsZXQga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5TRU1JQ09MT04pKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuU0VNSUNPTE9OLCBcIkV4cGVjdCAnOycgYWZ0ZXIgcmV0dXJuIHZhbHVlLlwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RtdC5SZXR1cm4oa2V5d29yZCwgdmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhckRlY2xhcmF0aW9uKCkge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuSURFTlRJRklFUiwgXCJFeHBlY3QgdmFyaWFibGUgbmFtZS5cIik7XG5cbiAgICAgICAgbGV0IGluaXRpYWxpemVyID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5FUVVBTF0pKSB7XG4gICAgICAgICAgICBpbml0aWFsaXplciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuU0VNSUNPTE9OLCBcIkV4cGVjdCAnOycgYWZ0ZXIgdmFyaWFibGUgZGVjbGFyYXRpb24uXCIpO1xuICAgICAgICByZXR1cm4gbmV3IFN0bXQuVmFyKG5hbWUsIGluaXRpYWxpemVyKTtcbiAgICB9XG5cbiAgICB3aGlsZVN0YXRlbWVudCgpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5MRUZUX1BBUkVOLCBcIkV4cGVjdCAnKCcgYWZ0ZXIgJ3doaWxlJy5cIik7XG4gICAgICAgIGxldCBjb25kaXRpb24gPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SSUdIVF9QQVJFTiwgXCJFeHBlY3QgJyknIGFmdGVyICdjb25kaXRpb24nLlwiKTtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLnN0YXRlbWVudCgpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RtdC5XaGlsZShjb25kaXRpb24sIGJvZHkpO1xuICAgIH1cblxuICAgIGV4cHJlc3Npb25TdGF0ZW1lbnQoKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuU0VNSUNPTE9OLCBcIkV4cGVjdCAnOycgYWZ0ZXIgZXhwcmVzc2lvbi5cIik7XG4gICAgICAgIHJldHVybiBuZXcgU3RtdC5FeHByZXNzaW9uKGV4cHIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uKGtpbmQpIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklERU5USUZJRVIsIFwiRXhwZWN0IFwiICsga2luZCArIFwiIG5hbWUuXCIpO1xuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkxFRlRfUEFSRU4sIFwiRXhwZWN0ICcoJyBhZnRlciBcIiArIGtpbmQgKyBcIiBuYW1lLlwiKTtcbiAgICAgICAgbGV0IHBhcmFtZXRlcnMgPSBbXTtcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SSUdIVF9QQVJFTikpIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1ldGVycy5sZW5ndGggPj0gOCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yRnVuYyh0aGlzLnBlZWsoKSwgXCJDYW5ub3QgaGF2ZSBtb3JlIHRoYW4gOCBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2godGhpcy5jb25zdW1lKFRva2VuVHlwZS5JREVOVElGSUVSLCBcIkV4cGVjdCBwYXJhbWV0ZXIgbmFtZS5cIikpO1xuICAgICAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkNPTU1BXSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUklHSFRfUEFSRU4sIFwiRXhwZWN0ICcpJyBhZnRlciBwYXJhbWV0ZXJzLlwiKTtcblxuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkxFRlRfQlJBQ0UsIFwiRXhwZWN0ICd7JyBiZWZvcmUgXCIgKyBraW5kICsgXCIgYm9keS5cIik7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5ibG9jaygpO1xuICAgICAgICByZXR1cm4gbmV3IFN0bXQuRnVuY3Rpb24obmFtZSwgcGFyYW1ldGVycywgYm9keSk7XG4gICAgfVxuXG4gICAgYmxvY2soKSB7XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzID0gW107XG4gICAgICAgIHdoaWxlICghdGhpcy5jaGVjayhUb2tlblR5cGUuUklHSFRfQlJBQ0UpICYmICF0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVjbGFyYXRpb24oKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SSUdIVF9CUkFDRSwgXCJFeHBlY3QgJ30nIGFmdGVyIGJsb2NrLlwiKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gICAgfVxuXG4gICAgZXF1YWxpdHkoKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5jb21wYXJpc29uKCk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5CQU5HX0VRVUFMLCBUb2tlblR5cGUuRVFVQUxfRVFVQUxdKSkge1xuICAgICAgICAgICAgbGV0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5jb21wYXJpc29uKCk7XG4gICAgICAgICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICBjb21wYXJpc29uKCkge1xuICAgICAgICBsZXQgZXhwciA9IHRoaXMuYWRkaXRpb24oKTtcblxuICAgICAgICB3aGlsZSAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkdSRUFURVJfRVFVQUwsIFRva2VuVHlwZS5HUkVBVEVSLCBUb2tlblR5cGUuTEVTU19FUVVBTCwgVG9rZW5UeXBlLkxFU1NdKSkge1xuICAgICAgICAgICAgbGV0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5hZGRpdGlvbigpO1xuICAgICAgICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgYWRkaXRpb24oKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuTUlOVVMsIFRva2VuVHlwZS5QTFVTXSkpIHtcbiAgICAgICAgICAgIGxldCBvcGVyYXRvciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgICAgIGxldCByaWdodCA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICAgICAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIG11bHRpcGxpY2F0aW9uKCkge1xuICAgICAgICBsZXQgZXhwciA9IHRoaXMudW5hcnkoKTtcblxuICAgICAgICB3aGlsZSAodGhpcy5tYXRjaChbVG9rZW5UeXBlLlNMQVNILCBUb2tlblR5cGUuU1RBUl0pKSB7XG4gICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLnVuYXJ5KCk7XG4gICAgICAgICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICB1bmFyeSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5CQU5HLCBUb2tlblR5cGUuTUlOVVNdKSkge1xuICAgICAgICAgICAgbGV0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy51bmFyeSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLlVuYXJ5KG9wZXJhdG9yLCByaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKCk7XG4gICAgfVxuXG4gICAgZmluaXNoQ2FsbChjYWxsZWUpIHtcbiAgICAgICAgbGV0IGFyZ3MgPSBbXTtcblxuICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJJR0hUX1BBUkVOKSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IHRoaXMuZXJyb3JGdW5jKHRoaXMucGVlaygpLCBcIkNhbm5vdCBoYXZlIG1vcmUgdGhhbiA4IGFyZ3VtZW50cy5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuQ09NTUFdKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyZW4gPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJJR0hUX1BBUkVOLCBcIkV4cGVjdCAnKScgYWZ0ZXIgYXJndW1lbnRzLlwiKTtcblxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuQ2FsbChjYWxsZWUsIHBhcmVuLCBhcmdzKTtcbiAgICB9XG5cbiAgICBjYWxsKCkge1xuICAgICAgICBsZXQgZXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5MRUZUX1BBUkVOXSkpIHtcbiAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuRE9UXSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuSURFTlRJRklFUiwgXCJFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLicuXCIpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBuZXcgRXhwci5HZXQoZXhwciwgbmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgcHJpbWFyeSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5GQUxTRV0pKSByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChmYWxzZSk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuVFJVRV0pKSByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5OSUxdKSkgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCk7XG5cbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5OVU1CRVIsIFRva2VuVHlwZS5TVFJJTkddKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodGhpcy5wcmV2aW91cygpLmxpdGVyYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5TVVBFUl0pKSB7XG4gICAgICAgICAgICBsZXQga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuRE9ULCBcIkV4cGVjdCAnLicgYWZ0ZXIgJ3N1cGVyJy5cIik7XG4gICAgICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5jb25zdW1lKFRva2VuVHlwZS5JREVOVElGSUVSLFxuICAgICAgICAgICAgICAgIFwiRXhwZWN0IHN1cGVyY2xhc3MgbWV0aG9kIG5hbWUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLlN1cGVyKGtleXdvcmQsIG1ldGhvZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLlRISVNdKSkgcmV0dXJuIG5ldyBFeHByLlRoaXModGhpcy5wcmV2aW91cygpKTtcblxuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLk1TR10pKSB7XG4gICAgICAgICAgICBsZXQga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuRE9ULCBcIkV4cGVjdCAnLicgYWZ0ZXIgJ21zZycuXCIpO1xuICAgICAgICAgICAgbGV0IG1ldGhvZCA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuSURFTlRJRklFUiwgXG4gICAgICAgICAgICAgICAgXCJFeHBlY3QgbXNnY2xhc3MgbWV0aG9kIG5hbWUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLk1zZyhrZXl3b3JkLCBtZXRob2QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5JREVOVElGSUVSXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXhwci5WYXJpYWJsZSh0aGlzLnByZXZpb3VzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5MRUZUX1BBUkVOXSkpIHtcbiAgICAgICAgICAgIGxldCBleHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJJR0hUX1BBUkVOLCBcIkV4cGVjdCAnKScgYWZ0ZXIgZXhwcmVzc2lvbi5cIik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEV4cHIuR3JvdXBpbmcoZXhwcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyB0aGlzLmVycm9yRnVuYyh0aGlzLnBlZWsoKSwgXCJFeHBlY3QgZXhwcmVzc2lvbi5cIik7XG4gICAgfVxuXG4gICAgbWF0Y2godHlwZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3VtZSh0eXBlLCBtZXNzYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvckZ1bmModGhpcy5wZWVrKCksIG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGNoZWNrKHR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBdEVuZCgpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzLnBlZWsoKS50eXBlID09IHR5cGU7XG4gICAgfVxuXG4gICAgYWR2YW5jZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXRFbmQoKSkgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XG4gICAgfVxuXG4gICAgaXNBdEVuZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGVlaygpLnR5cGUgPT0gVG9rZW5UeXBlLkVPRjtcbiAgICB9XG5cbiAgICBwZWVrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50XTtcbiAgICB9XG5cbiAgICBwcmV2aW91cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCAtIDFdO1xuICAgIH1cblxuICAgIGVycm9yRnVuYyh0b2tlbiwgbWVzc2FnZSkge1xuICAgICAgICBCdW5hLmdldEluc3RhbmNlKCkuZXJyKHRva2VuLCBtZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZUVycm9yKHRva2VuLCBtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBzeW5jaHJvbml6ZSgpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHdoaWxlICghdGhpcy5pc0F0RW5kKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXZpb3VzKCkudHlwZSA9PSBUb2tlblR5cGUuU0VNSUNPTE9OKSByZXR1cm47XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMucGVlaygpLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5DTEFTUzpcbiAgICAgICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5GVU46XG4gICAgICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuVkFSOlxuICAgICAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkZPUjpcbiAgICAgICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5JRjpcbiAgICAgICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5XSElMRTpcbiAgICAgICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5QUklOVDpcbiAgICAgICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5SRVRVUk46XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG59Il19