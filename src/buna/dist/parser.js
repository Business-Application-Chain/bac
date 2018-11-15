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
                } else if (expr instanceof Expr.Msg) {
                    var _get = expr;
                    return new Expr.Msg(_get.object, _get.name, value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9wYXJzZXIuanMiXSwibmFtZXMiOlsiRXhwciIsIlN0bXQiLCJUb2tlblR5cGUiLCJQYXJzZXIiLCJ0b2tlbnMiLCJjdXJyZW50Iiwic3RhdGVtZW50cyIsImlzQXRFbmQiLCJwdXNoIiwiZGVjbGFyYXRpb24iLCJhc3NpZ25tZW50IiwiZXhwciIsIm9yIiwibWF0Y2giLCJFUVVBTCIsImVxdWFscyIsInByZXZpb3VzIiwidmFsdWUiLCJWYXJpYWJsZSIsIm5hbWUiLCJBc3NpZ24iLCJHZXQiLCJnZXQiLCJTZXQiLCJvYmplY3QiLCJNc2ciLCJlcnJvckZ1bmMiLCJhbmQiLCJPUiIsIm9wZXJhdG9yIiwicmlnaHQiLCJMb2dpY2FsIiwiZXF1YWxpdHkiLCJBTkQiLCJDTEFTUyIsImNsYXNzRGVjbGFyYXRpb24iLCJGVU4iLCJmdW5jdGlvbiIsIlZBUiIsInZhckRlY2xhcmF0aW9uIiwic3RhdGVtZW50IiwiZSIsInN5bmNocm9uaXplIiwiY29uc3VtZSIsIklERU5USUZJRVIiLCJzdXBlcmNsYXNzIiwiTEVTUyIsIkxFRlRfQlJBQ0UiLCJtZXRob2RzIiwiY2hlY2siLCJSSUdIVF9CUkFDRSIsIkNsYXNzIiwiRk9SIiwiZm9yU3RhdGVtZW50IiwiSUYiLCJpZlN0YXRlbWVudCIsIlBSSU5UIiwicHJpbnRTdGF0ZW1lbnQiLCJSRVRVUk4iLCJyZXR1cm5TdGF0ZW1lbnQiLCJXSElMRSIsIndoaWxlU3RhdGVtZW50IiwiQmxvY2siLCJibG9jayIsImV4cHJlc3Npb25TdGF0ZW1lbnQiLCJMRUZUX1BBUkVOIiwiaW5pdGlhbGl6ZXIiLCJTRU1JQ09MT04iLCJjb25kaXRpb24iLCJleHByZXNzaW9uIiwiaW5jcmVtZW50IiwiUklHSFRfUEFSRU4iLCJib2R5IiwiRXhwcmVzc2lvbiIsIkxpdGVyYWwiLCJXaGlsZSIsInRoZW5CcmFuY2giLCJlbHNlQnJhbmNoIiwiRUxTRSIsIklmIiwiUHJpbnQiLCJrZXl3b3JkIiwiUmV0dXJuIiwiY29uc29sZSIsImxvZyIsIlZhciIsImtpbmQiLCJwYXJhbWV0ZXJzIiwibGVuZ3RoIiwicGVlayIsIkNPTU1BIiwiRnVuY3Rpb24iLCJjb21wYXJpc29uIiwiQkFOR19FUVVBTCIsIkVRVUFMX0VRVUFMIiwiQmluYXJ5IiwiYWRkaXRpb24iLCJHUkVBVEVSX0VRVUFMIiwiR1JFQVRFUiIsIkxFU1NfRVFVQUwiLCJtdWx0aXBsaWNhdGlvbiIsIk1JTlVTIiwiUExVUyIsInVuYXJ5IiwiU0xBU0giLCJTVEFSIiwiQkFORyIsIlVuYXJ5IiwiY2FsbCIsImNhbGxlZSIsImFyZ3MiLCJwYXJlbiIsIkNhbGwiLCJwcmltYXJ5IiwiZmluaXNoQ2FsbCIsIkRPVCIsIkZBTFNFIiwiVFJVRSIsIk5JTCIsIk5VTUJFUiIsIlNUUklORyIsImxpdGVyYWwiLCJTVVBFUiIsIm1ldGhvZCIsIlN1cGVyIiwiVEhJUyIsIlRoaXMiLCJNU0ciLCJHcm91cGluZyIsInR5cGVzIiwiaSIsImFkdmFuY2UiLCJ0eXBlIiwibWVzc2FnZSIsIkVPRiIsInRva2VuIiwiQnVuYSIsImdldEluc3RhbmNlIiwiZXJyIiwiUGFyc2VFcnJvciJdLCJtYXBwaW5ncyI6IjZVQUFBLDhCLElBQVlBLEk7QUFDWiw4QixJQUFZQyxJO0FBQ1osd0MsSUFBWUMsUztBQUNaO0FBQ0EsZ0M7QUFDQSw4Qjs7QUFFcUJDLE07QUFDakIsb0JBQVlDLE1BQVosRUFBb0I7QUFDaEIsYUFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsYUFBS0MsT0FBTCxHQUFlLENBQWY7QUFDSCxLOztBQUVPO0FBQ0osZ0JBQUlDLGFBQWEsRUFBakI7QUFDQSxtQkFBTyxDQUFDLEtBQUtDLE9BQUwsRUFBUixFQUF3QjtBQUNwQkQsMkJBQVdFLElBQVgsQ0FBZ0IsS0FBS0MsV0FBTCxFQUFoQjtBQUNIOztBQUVELG1CQUFPSCxVQUFQO0FBQ0gsUzs7QUFFWTtBQUNULG1CQUFPLEtBQUtJLFVBQUwsRUFBUDtBQUNILFM7O0FBRVk7QUFDVCxnQkFBSUMsT0FBTyxLQUFLQyxFQUFMLEVBQVg7O0FB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LFVBQVUwRCxLQUFmO0FBQ0EseUJBQUsxRCxVQUFVc0QsS0FBZjtBQUNBLHlCQUFLdEQsVUFBVXdELE1BQWY7QUFDSSwrQkFUUjs7QUFXQSxxQkFBS3lFLE9BQUw7QUFDSDs7QUFFSixTLHlDQTViZ0JoSSxNIiwiZmlsZSI6InBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0ICogYXMgU3RtdCBmcm9tIFwiLi9zdG10XCI7XG5pbXBvcnQgKiBhcyBUb2tlblR5cGUgZnJvbSAnLi90b2tlblR5cGUnO1xuaW1wb3J0IHsgUGFyc2VFcnJvciB9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IFRva2VuIGZyb20gJy4vdG9rZW4nO1xuaW1wb3J0IEJ1bmEgZnJvbSAnLi9idW5hJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih0b2tlbnMpIHtcbiAgICAgICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgfVxuXG4gICAgcGFyc2UoKSB7XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzID0gW107XG4gICAgICAgIHdoaWxlICghdGhpcy5pc0F0RW5kKCkpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlY2xhcmF0aW9uKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gICAgfVxuXG4gICAgZXhwcmVzc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXNzaWdubWVudCgpO1xuICAgIH1cblxuICAgIGFzc2lnbm1lbnQoKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5vcigpO1xuXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuRVFVQUxdKSkge1xuICAgICAgICAgICAgbGV0IGVxdWFscyA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgICAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBleHByLm5hbWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICAgICAgICAgIGxldCBnZXQgPSBleHByO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXhwci5TZXQoZ2V0Lm9iamVjdCwgZ2V0Lm5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuTXNnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGdldCA9IGV4cHI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLk1zZyhnZXQub2JqZWN0LCBnZXQubmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgdGhpcy5lcnJvckZ1bmMoZXF1YWxzLCBcIkludmFsaWQgYXNzaWdubWVudCB0YXJnZXQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgb3IoKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5hbmQoKTtcblxuICAgICAgICB3aGlsZSAodGhpcy5tYXRjaChbVG9rZW5UeXBlLk9SXSkpIHtcbiAgICAgICAgICAgIGxldCBvcGVyYXRvciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgICAgIGxldCByaWdodCA9IHRoaXMuYW5kKCk7XG4gICAgICAgICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgYW5kKCkge1xuICAgICAgICBsZXQgZXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcblxuICAgICAgICB3aGlsZSAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkFORF0pKSB7XG4gICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgICAgICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgZGVjbGFyYXRpb24oKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkNMQVNTXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0RlY2xhcmF0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkZVTl0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnVuY3Rpb24oXCJmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuVkFSXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YXJEZWNsYXJhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZW1lbnQoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5zeW5jaHJvbml6ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzc0RlY2xhcmF0aW9uKCkge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuSURFTlRJRklFUiwgXCJFeHBlY3QgY2xhc3MgbmFtZS5cIik7XG5cbiAgICAgICAgbGV0IHN1cGVyY2xhc3MgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkxFU1NdKSkge1xuICAgICAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5JREVOVElGSUVSLCBcIkV4cGVjdCBzdXBlcmNsYXNzIG5hbWUuXCIpO1xuICAgICAgICAgICAgc3VwZXJjbGFzcyA9IG5ldyBFeHByLlZhcmlhYmxlKHRoaXMucHJldmlvdXMoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkxFRlRfQlJBQ0UsIFwiRXhwZWN0ICd7JyBiZWZvcmUgY2xhc3MgYm9keS5cIik7XG5cbiAgICAgICAgbGV0IG1ldGhvZHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SSUdIVF9CUkFDRSkgJiYgIXRoaXMuaXNBdEVuZCgpKSB7XG4gICAgICAgICAgICBtZXRob2RzLnB1c2godGhpcy5mdW5jdGlvbihcIm1ldGhvZFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJJR0hUX0JSQUNFLCBcIkV4cGVjdCAnfScgYWZ0ZXIgY2xhc3MgYm9keS5cIik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdG10LkNsYXNzKG5hbWUsIHN1cGVyY2xhc3MsIG1ldGhvZHMpO1xuICAgIH1cblxuICAgIHN0YXRlbWVudCgpIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5GT1JdKSkgcmV0dXJuIHRoaXMuZm9yU3RhdGVtZW50KCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuSUZdKSkgcmV0dXJuIHRoaXMuaWZTdGF0ZW1lbnQoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5QUklOVF0pKSByZXR1cm4gdGhpcy5wcmludFN0YXRlbWVudCgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLlJFVFVSTl0pKSByZXR1cm4gdGhpcy5yZXR1cm5TdGF0ZW1lbnQoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5XSElMRV0pKSByZXR1cm4gdGhpcy53aGlsZVN0YXRlbWVudCgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkxFRlRfQlJBQ0VdKSkgcmV0dXJuIG5ldyBTdG10LkJsb2NrKHRoaXMuYmxvY2soKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwcmVzc2lvblN0YXRlbWVudCgpO1xuICAgIH1cblxuICAgIGZvclN0YXRlbWVudCgpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5MRUZUX1BBUkVOLCBcIkV4cGVjdCAnKCcgYWZ0ZXIgJ2ZvcicuXCIpO1xuXG4gICAgICAgIGxldCBpbml0aWFsaXplcjtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5TRU1JQ09MT05dKSkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZXIgPSBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5WQVJdKSkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZXIgPSB0aGlzLnZhckRlY2xhcmF0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbml0aWFsaXplciA9IHRoaXMuZXhwcmVzc2lvblN0YXRlbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbmRpdGlvbiA9IG51bGw7XG4gICAgICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuU0VNSUNPTE9OKSkge1xuICAgICAgICAgICAgY29uZGl0aW9uID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlNFTUlDT0xPTiwgXCJFeHBlY3QgJzsnIGFmdGVyIGxvb3AgY29uZGl0aW9uLlwiKTtcblxuICAgICAgICBsZXQgaW5jcmVtZW50ID0gbnVsbDtcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SSUdIVF9QQVJFTikpIHtcbiAgICAgICAgICAgIGluY3JlbWVudCA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SSUdIVF9QQVJFTiwgXCJFeHBlY3QgJyknIGFmdGVyIGZvciBjbGF1c2VzLlwiKTtcblxuICAgICAgICBsZXQgYm9keSA9IHRoaXMuc3RhdGVtZW50KCk7XG5cbiAgICAgICAgLy8gQmVnaW4gZGVzdWdhcmluZyBpbnRvIGEgJ3doaWxlJyBsb29wLi4uXG4gICAgICAgIGlmIChpbmNyZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgYm9keSA9IG5ldyBTdG10LkJsb2NrKFtib2R5LCBuZXcgU3RtdC5FeHByZXNzaW9uKGluY3JlbWVudCldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25kaXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZGl0aW9uID0gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBib2R5ID0gbmV3IFN0bXQuV2hpbGUoY29uZGl0aW9uLCBib2R5KTtcblxuICAgICAgICBpZiAoaW5pdGlhbGl6ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgYm9keSA9IG5ldyBTdG10LkJsb2NrKFtpbml0aWFsaXplciwgYm9keV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgaWZTdGF0ZW1lbnQoKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuTEVGVF9QQVJFTiwgXCJFeHBlY3QgJygnIGFmdGVyICdpZicuXCIpO1xuICAgICAgICBsZXQgY29uZGl0aW9uID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUklHSFRfUEFSRU4sIFwiRXhwZWN0ICcpJyBhZnRlciAnaWYnLlwiKTtcblxuICAgICAgICBsZXQgdGhlbkJyYW5jaCA9IHRoaXMuc3RhdGVtZW50KCk7XG4gICAgICAgIGxldCBlbHNlQnJhbmNoID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5FTFNFXSkpIHtcbiAgICAgICAgICAgIGVsc2VCcmFuY2ggPSB0aGlzLnN0YXRlbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdG10LklmKGNvbmRpdGlvbiwgdGhlbkJyYW5jaCwgZWxzZUJyYW5jaCk7XG4gICAgfVxuXG4gICAgcHJpbnRTdGF0ZW1lbnQoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlNFTUlDT0xPTiwgXCJFeHBlY3QgJzsnIGFmdGVyIHZhbHVlO1wiKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdG10LlByaW50KHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm5TdGF0ZW1lbnQoKSB7XG4gICAgICAgIGxldCBrZXl3b3JkID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBsZXQgdmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlNFTUlDT0xPTikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5TRU1JQ09MT04sIFwiRXhwZWN0ICc7JyBhZnRlciByZXR1cm4gdmFsdWUuXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdG10LlJldHVybihrZXl3b3JkLCB2YWx1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyRGVjbGFyYXRpb24oKSB7XG4gICAgICAgIGxldCBuYW1lID0gdGhpcy5jb25zdW1lKFRva2VuVHlwZS5JREVOVElGSUVSLCBcIkV4cGVjdCB2YXJpYWJsZSBuYW1lLlwiKTtcblxuICAgICAgICBsZXQgaW5pdGlhbGl6ZXIgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkVRVUFMXSkpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVyID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5TRU1JQ09MT04sIFwiRXhwZWN0ICc7JyBhZnRlciB2YXJpYWJsZSBkZWNsYXJhdGlvbi5cIik7XG4gICAgICAgIHJldHVybiBuZXcgU3RtdC5WYXIobmFtZSwgaW5pdGlhbGl6ZXIpO1xuICAgIH1cblxuICAgIHdoaWxlU3RhdGVtZW50KCkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkxFRlRfUEFSRU4sIFwiRXhwZWN0ICcoJyBhZnRlciAnd2hpbGUnLlwiKTtcbiAgICAgICAgbGV0IGNvbmRpdGlvbiA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJJR0hUX1BBUkVOLCBcIkV4cGVjdCAnKScgYWZ0ZXIgJ2NvbmRpdGlvbicuXCIpO1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuc3RhdGVtZW50KCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdG10LldoaWxlKGNvbmRpdGlvbiwgYm9keSk7XG4gICAgfVxuXG4gICAgZXhwcmVzc2lvblN0YXRlbWVudCgpIHtcbiAgICAgICAgbGV0IGV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5TRU1JQ09MT04sIFwiRXhwZWN0ICc7JyBhZnRlciBleHByZXNzaW9uLlwiKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdG10LkV4cHJlc3Npb24oZXhwcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24oa2luZCkge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuSURFTlRJRklFUiwgXCJFeHBlY3QgXCIgKyBraW5kICsgXCIgbmFtZS5cIik7XG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuTEVGVF9QQVJFTiwgXCJFeHBlY3QgJygnIGFmdGVyIFwiICsga2luZCArIFwiIG5hbWUuXCIpO1xuICAgICAgICBsZXQgcGFyYW1ldGVycyA9IFtdO1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJJR0hUX1BBUkVOKSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLmxlbmd0aCA+PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IHRoaXMuZXJyb3JGdW5jKHRoaXMucGVlaygpLCBcIkNhbm5vdCBoYXZlIG1vcmUgdGhhbiA4IHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCh0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklERU5USUZJRVIsIFwiRXhwZWN0IHBhcmFtZXRlciBuYW1lLlwiKSk7XG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuQ09NTUFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SSUdIVF9QQVJFTiwgXCJFeHBlY3QgJyknIGFmdGVyIHBhcmFtZXRlcnMuXCIpO1xuXG4gICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuTEVGVF9CUkFDRSwgXCJFeHBlY3QgJ3snIGJlZm9yZSBcIiArIGtpbmQgKyBcIiBib2R5LlwiKTtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLmJsb2NrKCk7XG4gICAgICAgIHJldHVybiBuZXcgU3RtdC5GdW5jdGlvbihuYW1lLCBwYXJhbWV0ZXJzLCBib2R5KTtcbiAgICB9XG5cbiAgICBibG9jaygpIHtcbiAgICAgICAgbGV0IHN0YXRlbWVudHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SSUdIVF9CUkFDRSkgJiYgIXRoaXMuaXNBdEVuZCgpKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWNsYXJhdGlvbigpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJJR0hUX0JSQUNFLCBcIkV4cGVjdCAnfScgYWZ0ZXIgYmxvY2suXCIpO1xuICAgICAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgICB9XG5cbiAgICBlcXVhbGl0eSgpIHtcbiAgICAgICAgbGV0IGV4cHIgPSB0aGlzLmNvbXBhcmlzb24oKTtcblxuICAgICAgICB3aGlsZSAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkJBTkdfRVFVQUwsIFRva2VuVHlwZS5FUVVBTF9FUVVBTF0pKSB7XG4gICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLmNvbXBhcmlzb24oKTtcbiAgICAgICAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIGNvbXBhcmlzb24oKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5hZGRpdGlvbigpO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuR1JFQVRFUl9FUVVBTCwgVG9rZW5UeXBlLkdSRUFURVIsIFRva2VuVHlwZS5MRVNTX0VRVUFMLCBUb2tlblR5cGUuTEVTU10pKSB7XG4gICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgICAgICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICBhZGRpdGlvbigpIHtcbiAgICAgICAgbGV0IGV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5NSU5VUywgVG9rZW5UeXBlLlBMVVNdKSkge1xuICAgICAgICAgICAgbGV0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgICAgICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgbXVsdGlwbGljYXRpb24oKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy51bmFyeSgpO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuU0xBU0gsIFRva2VuVHlwZS5TVEFSXSkpIHtcbiAgICAgICAgICAgIGxldCBvcGVyYXRvciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgICAgIGxldCByaWdodCA9IHRoaXMudW5hcnkoKTtcbiAgICAgICAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIHVuYXJ5KCkge1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkJBTkcsIFRva2VuVHlwZS5NSU5VU10pKSB7XG4gICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLnVuYXJ5KCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEV4cHIuVW5hcnkob3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwoKTtcbiAgICB9XG5cbiAgICBmaW5pc2hDYWxsKGNhbGxlZSkge1xuICAgICAgICBsZXQgYXJncyA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUklHSFRfUEFSRU4pKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID49IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgdGhpcy5lcnJvckZ1bmModGhpcy5wZWVrKCksIFwiQ2Fubm90IGhhdmUgbW9yZSB0aGFuIDggYXJndW1lbnRzLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5DT01NQV0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJlbiA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuUklHSFRfUEFSRU4sIFwiRXhwZWN0ICcpJyBhZnRlciBhcmd1bWVudHMuXCIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgRXhwci5DYWxsKGNhbGxlZSwgcGFyZW4sIGFyZ3MpO1xuICAgIH1cblxuICAgIGNhbGwoKSB7XG4gICAgICAgIGxldCBleHByID0gdGhpcy5wcmltYXJ5KCk7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkxFRlRfUEFSRU5dKSkge1xuICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5ET1RdKSkge1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gdGhpcy5jb25zdW1lKFRva2VuVHlwZS5JREVOVElGSUVSLCBcIkV4cGVjdCBwcm9wZXJ0eSBuYW1lIGFmdGVyICcuJy5cIik7XG4gICAgICAgICAgICAgICAgZXhwciA9IG5ldyBFeHByLkdldChleHByLCBuYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICBwcmltYXJ5KCkge1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkZBTFNFXSkpIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKGZhbHNlKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goW1Rva2VuVHlwZS5UUlVFXSkpIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRydWUpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLk5JTF0pKSByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsKTtcblxuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLk5VTUJFUiwgVG9rZW5UeXBlLlNUUklOR10pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLlNVUEVSXSkpIHtcbiAgICAgICAgICAgIGxldCBrZXl3b3JkID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5ET1QsIFwiRXhwZWN0ICcuJyBhZnRlciAnc3VwZXInLlwiKTtcbiAgICAgICAgICAgIGxldCBtZXRob2QgPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklERU5USUZJRVIsXG4gICAgICAgICAgICAgICAgXCJFeHBlY3Qgc3VwZXJjbGFzcyBtZXRob2QgbmFtZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEV4cHIuU3VwZXIoa2V5d29yZCwgbWV0aG9kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuVEhJU10pKSByZXR1cm4gbmV3IEV4cHIuVGhpcyh0aGlzLnByZXZpb3VzKCkpO1xuXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFtUb2tlblR5cGUuTVNHXSkpIHtcbiAgICAgICAgICAgIGxldCBrZXl3b3JkID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5ET1QsIFwiRXhwZWN0ICcuJyBhZnRlciAnbXNnJy5cIik7XG4gICAgICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5jb25zdW1lKFRva2VuVHlwZS5JREVOVElGSUVSLCBcbiAgICAgICAgICAgICAgICBcIkV4cGVjdCBtc2djbGFzcyBtZXRob2QgbmFtZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEV4cHIuTXNnKGtleXdvcmQsIG1ldGhvZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLklERU5USUZJRVJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFeHByLlZhcmlhYmxlKHRoaXMucHJldmlvdXMoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXRjaChbVG9rZW5UeXBlLkxFRlRfUEFSRU5dKSkge1xuICAgICAgICAgICAgbGV0IGV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUklHSFRfUEFSRU4sIFwiRXhwZWN0ICcpJyBhZnRlciBleHByZXNzaW9uLlwiKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXhwci5Hcm91cGluZyhleHByKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IHRoaXMuZXJyb3JGdW5jKHRoaXMucGVlaygpLCBcIkV4cGVjdCBleHByZXNzaW9uLlwiKTtcbiAgICB9XG5cbiAgICBtYXRjaCh0eXBlcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVjayh0eXBlc1tpXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdW1lKHR5cGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyB0aGlzLmVycm9yRnVuYyh0aGlzLnBlZWsoKSwgbWVzc2FnZSk7XG4gICAgfVxuXG4gICAgY2hlY2sodHlwZSkge1xuICAgICAgICBpZiAodGhpcy5pc0F0RW5kKCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGVlaygpLnR5cGUgPT0gdHlwZTtcbiAgICB9XG5cbiAgICBhZHZhbmNlKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBdEVuZCgpKSB0aGlzLmN1cnJlbnQrKztcbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKTtcbiAgICB9XG5cbiAgICBpc0F0RW5kKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PSBUb2tlblR5cGUuRU9GO1xuICAgIH1cblxuICAgIHBlZWsoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnRdO1xuICAgIH1cblxuICAgIHByZXZpb3VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50IC0gMV07XG4gICAgfVxuXG4gICAgZXJyb3JGdW5jKHRva2VuLCBtZXNzYWdlKSB7XG4gICAgICAgIEJ1bmEuZ2V0SW5zdGFuY2UoKS5lcnIodG9rZW4sIG1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlRXJyb3IodG9rZW4sIG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHN5bmNocm9uaXplKCkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgd2hpbGUgKCF0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldmlvdXMoKS50eXBlID09IFRva2VuVHlwZS5TRU1JQ09MT04pIHJldHVybjtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5wZWVrKCkudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkNMQVNTOlxuICAgICAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkZVTjpcbiAgICAgICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5WQVI6XG4gICAgICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuRk9SOlxuICAgICAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLklGOlxuICAgICAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLldISUxFOlxuICAgICAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLlBSSU5UOlxuICAgICAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLlJFVFVSTjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIH1cblxuICAgIH1cbn0iXX0=