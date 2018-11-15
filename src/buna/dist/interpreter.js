"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _expr = require("./expr");var Expr = _interopRequireWildcard(_expr);
var _stmt = require("./stmt");var Stmt = _interopRequireWildcard(_stmt);
var _tokenType = require("./tokenType");var TokenType = _interopRequireWildcard(_tokenType);
var _error = require("./error");
var _token = require("./token");var _token2 = _interopRequireDefault(_token);
var _environment = require("./environment");var _environment2 = _interopRequireDefault(_environment);
var _buna = require("./buna");var _buna2 = _interopRequireDefault(_buna);
var _hashmap = require("hashmap");var _hashmap2 = _interopRequireDefault(_hashmap);
var _bunaFunction = require("./bunaFunction");var defaultFunction = _interopRequireWildcard(_bunaFunction);
var _bunaClass = require("./bunaClass");var _bunaClass2 = _interopRequireDefault(_bunaClass);
var _bunaInstance = require("./bunaInstance");var _bunaInstance2 = _interopRequireDefault(_bunaInstance);
var _abi = require("./abi");var _abi2 = _interopRequireDefault(_abi);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Interpreter = function () {
    function Interpreter(data) {(0, _classCallCheck3.default)(this, Interpreter);
        this.globals = new _environment2.default();
        this.environment = this.globals;
        this.locals = new _hashmap2.default();
        this.globals.define("clock", new defaultFunction.DefaultBunaFunction());
        this.globals.define("Balance", new defaultFunction.DefaultBunaFunctionBalance(data));
        this.globals.define("Message", new defaultFunction.DefaultBunaFunctionMsg(data));
        this.globals.define("Status", new defaultFunction.DefaultBunaFunctionStatus(data));
        this.globals.define("Get", new defaultFunction.DefaultBunFunctionGet());
        this.globals.define("SetObject", new defaultFunction.DefaultFunctionSetObject(data));
        this.globals.define("SetBalance", new defaultFunction.DefaultFunctionSetBalance(data));
        this.globals.define("SetStatus", new defaultFunction.DefaultFunctionSetStatus(data));
    }(0, _createClass3.default)(Interpreter, [{ key: "interpret", value: function interpret(

        statements, data) {
            try {
                for (var i = 0; i < statements.length; i++) {
                    this.execute(statements[i]);
                }
                data.abi = _abi2.default.get();
            } catch (e) {
                console.log(e);
                _buna2.default.getInstance().runtimeError(e);
            }
        } }, { key: "visitAssignExpr", value: function visitAssignExpr(

        expr) {
            var value = this.evaluate(expr.value);
            var distance = this.locals.get(expr);
            if (distance != null) {
                this.environment.assignAt(distance, expr.name, value);
            } else {
                this.globals.assign(expr.name, value);
            }
            return value;
        } }, { key: "visitBinaryExpr", value: function visitBinaryExpr(

        expr) {
            var left = this.evaluate(expr.left);
            var right = this.evaluate(expr.right);

            switch (expr.operator.type) {
                case TokenType.BANG_EQUAL:
                    return !this.isEqual(left, right);
                case TokenType.EQUAL_EQUAL:
                    return this.isEqual(left, right);
                case TokenType.GREATER:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left > right;
                case TokenType.GREATER_EQUAL:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left >= right;
                case TokenType.LESS:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left < right;
                case TokenType.LESS_EQUAL:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left <= right;
                case TokenType.MINUS:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left - right;
                case TokenType.PLUS:
                    if (typeof left == "number" && typeof right == "number") {
                        return left + right;
                    }
                    if (typeof left == "string" || typeof right == "string") {
                        return left.toString() + right.toString();
                    }
                    console.log("left -> ", left, " right -> ", right);
                    throw new _error.RuntimeError(expr.operator,
                    "Operands must be two numbers or two strings.");
                case TokenType.SLASH:
                    this.checkNumberOperands(expr.operator, left, right);
                    if (right == 0) {
                        throw new _error.RuntimeError(expr.operator,
                        "Numberator can not be zero.");
                    }
                    return left / right;
                case TokenType.STAR:
                    this.checkNumberOperands(expr.operator, left, right);
                    return left * right;}

            return null;
        } }, { key: "visitCallExpr", value: function visitCallExpr(

        expr) {var _this = this;
            var callee = this.evaluate(expr.callee);
            var args = expr.args.map(function (arg) {return _this.evaluate(arg);});

            if (!(callee instanceof defaultFunction.BunaFunction || callee instanceof defaultFunction.DefaultBunaFunction ||
            callee instanceof defaultFunction.DefaultBunaFunctionStatus ||
            callee instanceof defaultFunction.DefaultBunaFunctionBalance ||
            callee instanceof defaultFunction.DefaultBunaFunctionMsg ||
            callee instanceof defaultFunction.DefaultBunFunctionGet ||
            callee instanceof defaultFunction.DefaultFunctionSetObject ||
            callee instanceof defaultFunction.DefaultFunctionSetBalance ||
            callee instanceof defaultFunction.DefaultFunctionSetStatus ||
            callee instanceof _bunaInstance2.default || callee instanceof _bunaClass2.default)) {
                throw new _error.RuntimeError(expr.paren,
                "Can only call functions and classes.");
            }

            if (args.length != callee.arity()) {
                throw new _error.RuntimeError(expr.paren,
                "Expected " + callee.arity() + " arguments but got " + args.length + ".");
            }
            return callee.call(this, args);
        } }, { key: "visitGetExpr", value: function visitGetExpr(

        expr) {
            var object = this.evaluate(expr.object);
            if (object instanceof _bunaInstance2.default) {
                return object.get(expr.name);
            }

            throw new _error.RuntimeError(expr.name,
            "Only instance have properties.");
        } }, { key: "visitGroupingExpr", value: function visitGroupingExpr(

        expr) {
            return this.evaluate(expr.expression);
        } }, { key: "visitLiteralExpr", value: function visitLiteralExpr(

        expr) {
            return expr.value;
        } }, { key: "visitLogicalExpr", value: function visitLogicalExpr(

        expr) {
            var left = this.evaluate(expr.left);

            if (expr.operator.type == TokenType.OR) {
                if (this.isTruthy(left)) return left;
            } else {
                if (!this.isTruthy(left)) return left;
            }

            return this.evaluate(expr.right);
        } }, { key: "visitMsgExpr", value: function visitMsgExpr(

        expr) {
            if (expr.value) {
                this.messages[expr.name.lexeme] = this.evaluate(expr.value);
                // console.log(s);
            }
            return this.messages[expr.name.lexeme];
        } }, { key: "visitSetExpr", value: function visitSetExpr(

        expr) {
            var object = this.evaluate(expr.object);

            if (!(object instanceof _bunaInstance2.default)) {
                throw new _error.RuntimeError(expr.name, "Only instance have fields.");
            }

            var value = this.evaluate(expr.value);
            object.set(expr.name, value);
        } }, { key: "visitSuperExpr", value: function visitSuperExpr(

        expr) {
            var distance = this.locals.get(expr);
            var superclass = this.environment.getAt(distance, "super");
            // 'this' is always one level nearer than 'super' s envrionment
            var object = this.environment.getAt(distance - 1, "this");
            var method = superclass.findMethod(object, expr.method.lexeme);
            if (method == null) {
                throw new _error.RuntimeError(expr.method,
                "Undefined property '" + expr.method.lexeme + "'.");
            }
            return method;
        } }, { key: "visitThisExpr", value: function visitThisExpr(

        expr) {
            return this.lookUpVariable(expr.keyword, expr);
        } }, { key: "visitUnaryExpr", value: function visitUnaryExpr(

        expr) {
            var right = this.evaluate(expr.right);
            switch (expr.operator.type) {
                case TokenType.BANG:
                    return !this.isTruthy(right);
                case TokenType.MINUS:
                    this.checkNumberOperand(expr.operator, right);
                    return -1 * parseFloat(right);}


            // Unreachable.
            return null;
        } }, { key: "visitVariableExpr", value: function visitVariableExpr(

        expr) {
            return this.lookUpVariable(expr.name, expr);
        } }, { key: "lookUpVariable", value: function lookUpVariable(

        name, expr) {
            var distance = this.locals.get(expr);
            if (distance != null && distance != undefined) {
                return this.environment.getAt(distance, name.lexeme);
            } else {
                return this.globals.get(name);
            }
        } }, { key: "checkNumberOperand", value: function checkNumberOperand(

        operator, operand) {
            if (typeof operand == "number") return;
            throw new _error.RuntimeError(operator, "Operand must be number.");
        } }, { key: "checkNumberOperands", value: function checkNumberOperands(

        operator, left, right) {
            if (typeof left == "number" && typeof right == "number") return;
            throw new _error.RuntimeError(operator, "Operands must be numbers.");
        } }, { key: "isTruthy", value: function isTruthy(

        object) {
            if (object == null || object == undefined) return false;
            if (typeof object == "boolean") return object;
            if (typeof object == "number") return object > 0;
            return true;
        } }, { key: "isEqual", value: function isEqual(

        left, right) {
            if (left == null && right == null) return true;
            if (left == undefined && right == undefined) return true;
            if (left == null || left == undefined) return false;
            return left == right;
        } }, { key: "stringify", value: function stringify(

        object) {
            if (object == null || object == undefined) return "nil";
            if (typeof object == "number") {
                var text = object.toString();
                if (text.endsWith(".0")) {
                    text = text.substring(0, text.length - 2);
                }
                return text;
            }
            return object.toString();
        } }, { key: "evaluate", value: function evaluate(

        expr) {
            return expr.accept(this);
        } }, { key: "execute", value: function execute(

        stmt) {
            return stmt.accept(this);
        } }, { key: "resolve", value: function resolve(

        expr, depth) {
            this.locals.set(expr, depth);
        } }, { key: "executeBlock", value: function executeBlock(

        statements, env) {
            var previous = this.environment;
            try {
                this.environment = env;
                for (var i = 0; i < statements.length; i++) {
                    this.execute(statements[i]);
                }
            } finally {
                this.environment = previous;
            }
        } }, { key: "visitBlockStmt", value: function visitBlockStmt(

        stmt) {
            this.executeBlock(stmt.statements, new _environment2.default(this.environment));
        } }, { key: "visitClassStmt", value: function visitClassStmt(

        stmt) {
            _abi2.default.push(this.globals);
            var superclass = null;
            if (stmt.superclass != null) {
                superclass = this.evaluate(stmt.superclass);
                if (!(superclass instanceof _bunaClass2.default)) {
                    throw new _error.RuntimeError(stmt.superclass.name,
                    "Superclass must be a class.");
                }
            }
            this.environment.define(stmt.name.lexeme, null);

            if (stmt.superclass != null) {
                this.environment = new _environment2.default(this.environment);
                this.environment.define("super", superclass);
            }

            var methods = new _hashmap2.default();
            for (var i = 0; i < stmt.methods.length; i++) {
                var fn = new defaultFunction.BunaFunction(stmt.methods[i], this.environment, stmt.methods[i].name.lexeme == "init");
                methods.set(stmt.methods[i].name.lexeme, fn);
            }

            _abi2.default.push(stmt);
            var klass = new _bunaClass2.default(stmt.name.lexeme, superclass, methods);

            if (stmt.superclass != null) {
                this.environment = this.environment.enclosing;
            }

            this.environment.assign(stmt.name, klass);
        } }, { key: "visitExpressionStmt", value: function visitExpressionStmt(

        stmt) {
            this.evaluate(stmt.expression);
        } }, { key: "visitFunctionStmt", value: function visitFunctionStmt(

        stmt) {
            var fn = new defaultFunction.BunaFunction(stmt, this.environment, false);
            this.environment.define(stmt.name.lexeme, fn);
        } }, { key: "visitIfStmt", value: function visitIfStmt(

        stmt) {
            if (this.isTruthy(this.evaluate(stmt.condition))) {
                this.execute(stmt.thenBranch);
            } else if (stmt.elseBranch != null) {
                this.execute(stmt.elseBranch);
            }
        } }, { key: "visitPrintStmt", value: function visitPrintStmt(

        stmt) {
            var value = this.evaluate(stmt.expression);
            console.log(this.stringify(value));
        } }, { key: "visitReturnStmt", value: function visitReturnStmt(

        stmt) {
            var value = null;
            if (stmt.value != null) {
                value = this.evaluate(stmt.value);
            }
            throw new _error.Returns(stmt.keyword, value);
        } }, { key: "visitVarStmt", value: function visitVarStmt(

        stmt) {
            var value = null;
            if (stmt.initializer != null) {
                value = this.evaluate(stmt.initializer);
            }
            this.environment.define(stmt.name.lexeme, value);
        } }, { key: "visitWhileStmt", value: function visitWhileStmt(

        stmt) {
            while (this.isTruthy(this.evaluate(stmt.condition))) {
                this.execute(stmt.body);
            }
        } }]);return Interpreter;}();exports.default = Interpreter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9pbnRlcnByZXRlci5qcyJdLCJuYW1lcyI6WyJFeHByIiwiU3RtdCIsIlRva2VuVHlwZSIsImRlZmF1bHRGdW5jdGlvbiIsIkludGVycHJldGVyIiwiZGF0YSIsImdsb2JhbHMiLCJFbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwibG9jYWxzIiwiSGFzaE1hcCIsImRlZmluZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb24iLCJEZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2ciLCJEZWZhdWx0QnVuYUZ1bmN0aW9uU3RhdHVzIiwiRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZSIsIkRlZmF1bHRGdW5jdGlvblNldFN0YXR1cyIsInN0YXRlbWVudHMiLCJpIiwibGVuZ3RoIiwiZXhlY3V0ZSIsImFiaSIsImdldCIsImUiLCJjb25zb2xlIiwibG9nIiwiQnVuYSIsImdldEluc3RhbmNlIiwicnVudGltZUVycm9yIiwiZXhwciIsInZhbHVlIiwiZXZhbHVhdGUiLCJkaXN0YW5jZSIsImFzc2lnbkF0IiwibmFtZSIsImFzc2lnbiIsImxlZnQiLCJyaWdodCIsIm9wZXJhdG9yIiwidHlwZSIsIkJBTkdfRVFVQUwiLCJpc0VxdWFsIiwiRVFVQUxfRVFVQUwiLCJHUkVBVEVSIiwiY2hlY2tOdW1iZXJPcGVyYW5kcyIsIkdSRUFURVJfRVFVQUwiLCJMRVNTIiwiTEVTU19FUVVBTCIsIk1JTlVTIiwiUExVUyIsInRvU3RyaW5nIiwiUnVudGltZUVycm9yIiwiU0xBU0giLCJTVEFSIiwiY2FsbGVlIiwiYXJncyIsIm1hcCIsImFyZyIsIkJ1bmFGdW5jdGlvbiIsIkJ1bmFJbnN0YW5jZSIsIkJ1bmFDbGFzcyIsInBhcmVuIiwiYXJpdHkiLCJjYWxsIiwib2JqZWN0IiwiZXhwcmVzc2lvbiIsIk9SIiwiaXNUcnV0aHkiLCJtZXNzYWdlcyIsImxleGVtZSIsInNldCIsInN1cGVyY2xhc3MiLCJnZXRBdCIsIm1ldGhvZCIsImZpbmRNZXRob2QiLCJsb29rVXBWYXJpYWJsZSIsImtleXdvcmQiLCJCQU5HIiwiY2hlY2tOdW1iZXJPcGVyYW5kIiwicGFyc2VGbG9hdCIsInVuZGVmaW5lZCIsIm9wZXJhbmQiLCJ0ZXh0IiwiZW5kc1dpdGgiLCJzdWJzdHJpbmciLCJhY2NlcHQiLCJzdG10IiwiZGVwdGgiLCJlbnYiLCJwcmV2aW91cyIsImV4ZWN1dGVCbG9jayIsInB1c2giLCJtZXRob2RzIiwiZm4iLCJrbGFzcyIsImVuY2xvc2luZyIsImNvbmRpdGlvbiIsInRoZW5CcmFuY2giLCJlbHNlQnJhbmNoIiwic3RyaW5naWZ5IiwiUmV0dXJucyIsImluaXRpYWxpemVyIiwiYm9keSJdLCJtYXBwaW5ncyI6IjZVQUFBLDhCLElBQVlBLEk7QUFDWiw4QixJQUFZQyxJO0FBQ1osd0MsSUFBWUMsUztBQUNaO0FBQ0EsZ0M7QUFDQSw0QztBQUNBLDhCO0FBQ0Esa0M7QUFDQSw4QyxJQUFZQyxlO0FBQ1osd0M7QUFDQSw4QztBQUNBLDRCOztBQUVxQkMsVztBQUNqQix5QkFBWUMsSUFBWixFQUFrQjtBQUNkLGFBQUtDLE9BQUwsR0FBZSxJQUFJQyxxQkFBSixFQUFmO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQixLQUFLRixPQUF4QjtBQUNBLGFBQUtHLE1BQUwsR0FBYyxJQUFJQyxpQkFBSixFQUFkO0FBQ0EsYUFBS0osT0FBTCxDQUFhSyxNQUFiLENBQW9CLE9BQXBCLEVBQTZCLElBQUlSLGdCQUFnQlMsbUJBQXBCLEVBQTdCO0FBQ0EsYUFBS04sT0FBTCxDQUFhSyxNQUFiLENBQW9CLFNBQXBCLEVBQStCLElBQUlSLGdCQUFnQlUsMEJBQXBCLENBQStDUixJQUEvQyxDQUEvQjtBQUNBLGFBQUtDLE9BQUwsQ0FBYUssTUFBYixDQUFvQixTQUFwQixFQUErQixJQUFJUixnQkFBZ0JXLHNCQUFwQixDQUEyQ1QsSUFBM0MsQ0FBL0I7QUFDQSxhQUFLQyxPQUFM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SixTLDhDQXRWZ0JyRyxXIiwiZmlsZSI6ImludGVycHJldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi9leHByXCI7XG5pbXBvcnQgKiBhcyBTdG10IGZyb20gXCIuL3N0bXRcIjtcbmltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQge1J1bnRpbWVFcnJvciwgUmV0dXJuc30gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4vdG9rZW5cIjtcbmltcG9ydCBFbnZpcm9ubWVudCBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCBCdW5hIGZyb20gJy4vYnVuYSc7XG5pbXBvcnQgSGFzaE1hcCBmcm9tICdoYXNobWFwJztcbmltcG9ydCAqIGFzIGRlZmF1bHRGdW5jdGlvbiBmcm9tICcuL2J1bmFGdW5jdGlvbic7XG5pbXBvcnQgQnVuYUNsYXNzIGZyb20gJy4vYnVuYUNsYXNzJztcbmltcG9ydCBCdW5hSW5zdGFuY2UgZnJvbSBcIi4vYnVuYUluc3RhbmNlXCI7XG5pbXBvcnQgYWJpIGZyb20gXCIuL2FiaVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVycHJldGVyIHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgICAgIHRoaXMuZ2xvYmFscyA9IG5ldyBFbnZpcm9ubWVudCgpO1xuICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gdGhpcy5nbG9iYWxzO1xuICAgICAgICB0aGlzLmxvY2FscyA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJjbG9ja1wiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb24pO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiQmFsYW5jZVwiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25CYWxhbmNlKGRhdGEpKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIk1lc3NhZ2VcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uTXNnKGRhdGEpKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIlN0YXR1c1wiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25TdGF0dXMoZGF0YSkpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiR2V0XCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0KTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIlNldE9iamVjdFwiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRGdW5jdGlvblNldE9iamVjdChkYXRhKSk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJTZXRCYWxhbmNlXCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZShkYXRhKSk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJTZXRTdGF0dXNcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRTdGF0dXMoZGF0YSkpXG4gICAgfVxuXG4gICAgaW50ZXJwcmV0KHN0YXRlbWVudHMsIGRhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdGF0ZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGEuYWJpID0gYWJpLmdldCgpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLnJ1bnRpbWVFcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2l0QXNzaWduRXhwcihleHByKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRoaXMubG9jYWxzLmdldChleHByKTtcbiAgICAgICAgaWYgKGRpc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQuYXNzaWduQXQoZGlzdGFuY2UsIGV4cHIubmFtZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxzLmFzc2lnbihleHByLm5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG5cbiAgICAgICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkJBTkdfRVFVQUw6XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLmlzRXF1YWwobGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuRVFVQUxfRVFVQUw6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNFcXVhbChsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5HUkVBVEVSOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPiByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkdSRUFURVJfRVFVQUw6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkxFU1M6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA8IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuTEVTU19FUVVBTDpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuTUlOVVM6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAtIHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuUExVUzpcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxlZnQgPT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgcmlnaHQgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxlZnQgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgcmlnaHQgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdC50b1N0cmluZygpICsgcmlnaHQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsZWZ0IC0+IFwiLCBsZWZ0LCBcIiByaWdodCAtPiBcIiwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5vcGVyYXRvcixcbiAgICAgICAgICAgICAgICAgICAgXCJPcGVyYW5kcyBtdXN0IGJlIHR3byBudW1iZXJzIG9yIHR3byBzdHJpbmdzLlwiKTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLlNMQVNIOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm9wZXJhdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJOdW1iZXJhdG9yIGNhbiBub3QgYmUgemVyby5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5TVEFSOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgKiByaWdodDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdENhbGxFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgICAgICBsZXQgYXJncyA9IGV4cHIuYXJncy5tYXAoYXJnID0+IHRoaXMuZXZhbHVhdGUoYXJnKSk7XG5cbiAgICAgICAgaWYgKCEoY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkJ1bmFGdW5jdGlvbiB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvblxuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25TdGF0dXNcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZVxuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2dcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuRnVuY3Rpb25HZXRcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRPYmplY3RcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRCYWxhbmNlXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0U3RhdHVzXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBCdW5hSW5zdGFuY2UgfHwgY2FsbGVlIGluc3RhbmNlb2YgQnVuYUNsYXNzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLnBhcmVuLFxuICAgICAgICAgICAgICAgIFwiQ2FuIG9ubHkgY2FsbCBmdW5jdGlvbnMgYW5kIGNsYXNzZXMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9IGNhbGxlZS5hcml0eSgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIucGFyZW4sXG4gICAgICAgICAgICAgICAgXCJFeHBlY3RlZCBcIiArIGNhbGxlZS5hcml0eSgpICsgXCIgYXJndW1lbnRzIGJ1dCBnb3QgXCIgKyBhcmdzLmxlbmd0aCArIFwiLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGVlLmNhbGwodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgdmlzaXRHZXRFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5vYmplY3QpO1xuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgQnVuYUluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0LmdldChleHByLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm5hbWUsXG4gICAgICAgICAgICBcIk9ubHkgaW5zdGFuY2UgaGF2ZSBwcm9wZXJ0aWVzLlwiKTtcbiAgICB9XG5cbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLnZhbHVlO1xuICAgIH1cblxuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcikge1xuICAgICAgICBsZXQgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgICAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09IFRva2VuVHlwZS5PUikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUcnV0aHkobGVmdCkpIHJldHVybiBsZWZ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVHJ1dGh5KGxlZnQpKSByZXR1cm4gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cblxuICAgIHZpc2l0TXNnRXhwcihleHByKSB7XG4gICAgICAgIGlmIChleHByLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzW2V4cHIubmFtZS5sZXhlbWVdID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzW2V4cHIubmFtZS5sZXhlbWVdO1xuICAgIH1cblxuICAgIHZpc2l0U2V0RXhwcihleHByKSB7XG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLmV2YWx1YXRlKGV4cHIub2JqZWN0KTtcblxuICAgICAgICBpZiAoIShvYmplY3QgaW5zdGFuY2VvZiBCdW5hSW5zdGFuY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIubmFtZSwgXCJPbmx5IGluc3RhbmNlIGhhdmUgZmllbGRzLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgICAgIG9iamVjdC5zZXQoZXhwci5uYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdmlzaXRTdXBlckV4cHIoZXhwcikge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLmxvY2Fscy5nZXQoZXhwcik7XG4gICAgICAgIGxldCBzdXBlcmNsYXNzID0gdGhpcy5lbnZpcm9ubWVudC5nZXRBdChkaXN0YW5jZSwgXCJzdXBlclwiKTtcbiAgICAgICAgLy8gJ3RoaXMnIGlzIGFsd2F5cyBvbmUgbGV2ZWwgbmVhcmVyIHRoYW4gJ3N1cGVyJyBzIGVudnJpb25tZW50XG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLmVudmlyb25tZW50LmdldEF0KGRpc3RhbmNlIC0gMSwgXCJ0aGlzXCIpO1xuICAgICAgICBsZXQgbWV0aG9kID0gc3VwZXJjbGFzcy5maW5kTWV0aG9kKG9iamVjdCwgZXhwci5tZXRob2QubGV4ZW1lKTtcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIubWV0aG9kLFxuICAgICAgICAgICAgICAgIFwiVW5kZWZpbmVkIHByb3BlcnR5ICdcIiArIGV4cHIubWV0aG9kLmxleGVtZSArIFwiJy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZDtcbiAgICB9XG5cbiAgICB2aXNpdFRoaXNFeHByKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va1VwVmFyaWFibGUoZXhwci5rZXl3b3JkLCBleHByKTtcbiAgICB9XG5cbiAgICB2aXNpdFVuYXJ5RXhwcihleHByKSB7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5CQU5HOlxuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5pc1RydXRoeShyaWdodCk7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5NSU5VUzpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZChleHByLm9wZXJhdG9yLCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgtMSkgKiBwYXJzZUZsb2F0KHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVucmVhY2hhYmxlLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvb2tVcFZhcmlhYmxlKGV4cHIubmFtZSwgZXhwcik7XG4gICAgfVxuXG4gICAgbG9va1VwVmFyaWFibGUobmFtZSwgZXhwcikge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLmxvY2Fscy5nZXQoZXhwcik7XG4gICAgICAgIGlmIChkaXN0YW5jZSAhPSBudWxsICYmIGRpc3RhbmNlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvbm1lbnQuZ2V0QXQoZGlzdGFuY2UsIG5hbWUubGV4ZW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdsb2JhbHMuZ2V0KG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tOdW1iZXJPcGVyYW5kKG9wZXJhdG9yLCBvcGVyYW5kKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3BlcmFuZCA9PSBcIm51bWJlclwiKSByZXR1cm47XG4gICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3Iob3BlcmF0b3IsIFwiT3BlcmFuZCBtdXN0IGJlIG51bWJlci5cIik7XG4gICAgfVxuXG4gICAgY2hlY2tOdW1iZXJPcGVyYW5kcyhvcGVyYXRvciwgbGVmdCwgcmlnaHQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsZWZ0ID09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHJpZ2h0ID09IFwibnVtYmVyXCIpIHJldHVybjtcbiAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihvcGVyYXRvciwgXCJPcGVyYW5kcyBtdXN0IGJlIG51bWJlcnMuXCIpO1xuICAgIH1cblxuICAgIGlzVHJ1dGh5KG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgb2JqZWN0ID09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PSBcImJvb2xlYW5cIikgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gXCJudW1iZXJcIikgcmV0dXJuIG9iamVjdCA+IDA7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlzRXF1YWwobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgaWYgKGxlZnQgPT0gbnVsbCAmJiByaWdodCA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKGxlZnQgPT0gdW5kZWZpbmVkICYmIHJpZ2h0ID09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChsZWZ0ID09IG51bGwgfHwgbGVmdCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGxlZnQgPT0gcmlnaHQ7XG4gICAgfVxuXG4gICAgc3RyaW5naWZ5KG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgb2JqZWN0ID09IHVuZGVmaW5lZCkgcmV0dXJuIFwibmlsXCI7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gb2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAodGV4dC5lbmRzV2l0aChcIi4wXCIpKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRleHQubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoZXhwcikge1xuICAgICAgICByZXR1cm4gZXhwci5hY2NlcHQodGhpcyk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZShzdG10KSB7XG4gICAgICAgIHJldHVybiBzdG10LmFjY2VwdCh0aGlzKTtcbiAgICB9XG5cbiAgICByZXNvbHZlKGV4cHIsIGRlcHRoKSB7XG4gICAgICAgIHRoaXMubG9jYWxzLnNldChleHByLCBkZXB0aCk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZUJsb2NrKHN0YXRlbWVudHMsIGVudikge1xuICAgICAgICBsZXQgcHJldmlvdXMgPSB0aGlzLmVudmlyb25tZW50O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdGF0ZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBwcmV2aW91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2l0QmxvY2tTdG10KHN0bXQpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlQmxvY2soc3RtdC5zdGF0ZW1lbnRzLCBuZXcgRW52aXJvbm1lbnQodGhpcy5lbnZpcm9ubWVudCkpO1xuICAgIH1cblxuICAgIHZpc2l0Q2xhc3NTdG10KHN0bXQpIHtcbiAgICAgICAgYWJpLnB1c2godGhpcy5nbG9iYWxzKTtcbiAgICAgICAgbGV0IHN1cGVyY2xhc3MgPSBudWxsO1xuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHN1cGVyY2xhc3MgPSB0aGlzLmV2YWx1YXRlKHN0bXQuc3VwZXJjbGFzcyk7XG4gICAgICAgICAgICBpZiAoIShzdXBlcmNsYXNzIGluc3RhbmNlb2YgQnVuYUNsYXNzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3Ioc3RtdC5zdXBlcmNsYXNzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwiU3VwZXJjbGFzcyBtdXN0IGJlIGEgY2xhc3MuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKHN0bXQubmFtZS5sZXhlbWUsIG51bGwpO1xuXG4gICAgICAgIGlmIChzdG10LnN1cGVyY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IG5ldyBFbnZpcm9ubWVudCh0aGlzLmVudmlyb25tZW50KTtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKFwic3VwZXJcIiwgc3VwZXJjbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWV0aG9kcyA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RtdC5tZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZm4gPSBuZXcgZGVmYXVsdEZ1bmN0aW9uLkJ1bmFGdW5jdGlvbihzdG10Lm1ldGhvZHNbaV0sIHRoaXMuZW52aXJvbm1lbnQsIHN0bXQubWV0aG9kc1tpXS5uYW1lLmxleGVtZSA9PSBcImluaXRcIik7XG4gICAgICAgICAgICBtZXRob2RzLnNldChzdG10Lm1ldGhvZHNbaV0ubmFtZS5sZXhlbWUsIGZuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFiaS5wdXNoKHN0bXQpXG4gICAgICAgIGxldCBrbGFzcyA9IG5ldyBCdW5hQ2xhc3Moc3RtdC5uYW1lLmxleGVtZSwgc3VwZXJjbGFzcywgbWV0aG9kcyk7XG5cbiAgICAgICAgaWYgKHN0bXQuc3VwZXJjbGFzcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gdGhpcy5lbnZpcm9ubWVudC5lbmNsb3Npbmc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVudmlyb25tZW50LmFzc2lnbihzdG10Lm5hbWUsIGtsYXNzKTtcbiAgICB9XG5cbiAgICB2aXNpdEV4cHJlc3Npb25TdG10KHN0bXQpIHtcbiAgICAgICAgdGhpcy5ldmFsdWF0ZShzdG10LmV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIHZpc2l0RnVuY3Rpb25TdG10KHN0bXQpIHtcbiAgICAgICAgbGV0IGZuID0gbmV3IGRlZmF1bHRGdW5jdGlvbi5CdW5hRnVuY3Rpb24oc3RtdCwgdGhpcy5lbnZpcm9ubWVudCwgZmFsc2UpO1xuICAgICAgICB0aGlzLmVudmlyb25tZW50LmRlZmluZShzdG10Lm5hbWUubGV4ZW1lLCBmbik7XG4gICAgfVxuXG4gICAgdmlzaXRJZlN0bXQoc3RtdCkge1xuICAgICAgICBpZiAodGhpcy5pc1RydXRoeSh0aGlzLmV2YWx1YXRlKHN0bXQuY29uZGl0aW9uKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdG10LnRoZW5CcmFuY2gpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0bXQuZWxzZUJyYW5jaCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGUoc3RtdC5lbHNlQnJhbmNoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2l0UHJpbnRTdG10KHN0bXQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShzdG10LmV4cHJlc3Npb24pO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHZpc2l0UmV0dXJuU3RtdChzdG10KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChzdG10LnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5ldmFsdWF0ZShzdG10LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmV0dXJucyhzdG10LmtleXdvcmQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICB2aXNpdFZhclN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoc3RtdC5pbml0aWFsaXplciAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoc3RtdC5pbml0aWFsaXplcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5kZWZpbmUoc3RtdC5uYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHZpc2l0V2hpbGVTdG10KHN0bXQpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuaXNUcnV0aHkodGhpcy5ldmFsdWF0ZShzdG10LmNvbmRpdGlvbikpKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGUoc3RtdC5ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=