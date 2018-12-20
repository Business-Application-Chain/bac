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
var _abi = require("./abi");var _abi2 = _interopRequireDefault(_abi);
var _gas = require("./gas");var _gas2 = _interopRequireDefault(_gas);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

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
            _abi2.default.abi = [];
            try {
                this.gas = new _gas2.default(data.gasMount);
                for (var i = 0; i < statements.length; i++) {
                    this.execute(statements[i]);
                }
                data.abi = _abi2.default.get();
                data.gasUsed = this.gas.gasUsed;
            } catch (e) {
                data.gasUsed = this.gas.gasUsed;
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
            if (/^\d+$/.test(operand))
            return;
            // if (typeof operand == "number") return;
            throw new _error.RuntimeError(operator, "Operand must be number.");
        } }, { key: "checkNumberOperands", value: function checkNumberOperands(

        operator, left, right) {
            if (/^\d+$/.test(right))
                right = parseInt(right);
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
            this.gas.visit(this.gas, expr);
            return expr.accept(this);
        } }, { key: "execute", value: function execute(

        stmt) {
            this.gas.visit(this.gas, stmt);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9pbnRlcnByZXRlci5qcyJdLCJuYW1lcyI6WyJFeHByIiwiU3RtdCIsIlRva2VuVHlwZSIsImRlZmF1bHRGdW5jdGlvbiIsIkludGVycHJldGVyIiwiZGF0YSIsImdsb2JhbHMiLCJFbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwibG9jYWxzIiwiSGFzaE1hcCIsImRlZmluZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb24iLCJEZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2ciLCJEZWZhdWx0QnVuYUZ1bmN0aW9uU3RhdHVzIiwiRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZSIsIkRlZmF1bHRGdW5jdGlvblNldFN0YXR1cyIsInN0YXRlbWVudHMiLCJhYmkiLCJnYXMiLCJHYXMiLCJnYXNNb3VudCIsImkiLCJsZW5ndGgiLCJleGVjdXRlIiwiZ2V0IiwiZ2FzVXNlZCIsImUiLCJCdW5hIiwiZ2V0SW5zdGFuY2UiLCJydW50aW1lRXJyb3IiLCJleHByIiwidmFsdWUiLCJldmFsdWF0ZSIsImRpc3RhbmNlIiwiYXNzaWduQXQiLCJuYW1lIiwiYXNzaWduIiwibGVmdCIsInJpZ2h0Iiwib3BlcmF0b3IiLCJ0eXBlIiwiQkFOR19FUVVBTCIsImlzRXF1YWwiLCJFUVVBTF9FUVVBTCIsIkdSRUFURVIiLCJjaGVja051bWJlck9wZXJhbmRzIiwiR1JFQVRFUl9FUVVBTCIsIkxFU1MiLCJMRVNTX0VRVUFMIiwiTUlOVVMiLCJQTFVTIiwidG9TdHJpbmciLCJjb25zb2xlIiwibG9nIiwiUnVudGltZUVycm9yIiwiU0xBU0giLCJTVEFSIiwiY2FsbGVlIiwiYXJncyIsIm1hcCIsImFyZyIsIkJ1bmFGdW5jdGlvbiIsIkJ1bmFJbnN0YW5jZSIsIkJ1bmFDbGFzcyIsInBhcmVuIiwiYXJpdHkiLCJjYWxsIiwib2JqZWN0IiwiZXhwcmVzc2lvbiIsIk9SIiwiaXNUcnV0aHkiLCJtZXNzYWdlcyIsImxleGVtZSIsInNldCIsInN1cGVyY2xhc3MiLCJnZXRBdCIsIm1ldGhvZCIsImZpbmRNZXRob2QiLCJsb29rVXBWYXJpYWJsZSIsImtleXdvcmQiLCJCQU5HIiwiY2hlY2tOdW1iZXJPcGVyYW5kIiwicGFyc2VGbG9hdCIsInVuZGVmaW5lZCIsIm9wZXJhbmQiLCJ0ZXN0IiwidGV4dCIsImVuZHNXaXRoIiwic3Vic3RyaW5nIiwidmlzaXQiLCJhY2NlcHQiLCJzdG10IiwiZGVwdGgiLCJlbnYiLCJwcmV2aW91cyIsImV4ZWN1dGVCbG9jayIsInB1c2giLCJtZXRob2RzIiwiZm4iLCJrbGFzcyIsImVuY2xvc2luZyIsImNvbmRpdGlvbiIsInRoZW5CcmFuY2giLCJlbHNlQnJhbmNoIiwic3RyaW5naWZ5IiwiUmV0dXJucyIsImluaXRpYWxpemVyIiwiYm9keSJdLCJtYXBwaW5ncyI6IjZVQUFBLDhCLElBQVlBLEk7QUFDWiw4QixJQUFZQyxJO0FBQ1osd0MsSUFBWUMsUztBQUNaO0FBQ0EsZ0M7QUFDQSw0QztBQUNBLDhCO0FBQ0Esa0M7QUFDQSw4QyxJQUFZQyxlO0FBQ1osd0M7QUFDQSw4QztBQUNBLDRCO0FBQ0EsNEI7O0FBRXFCQyxXO0FBQ2pCLHlCQUFZQyxJQUFaLEVBQWtCO0FBQ2QsYUFBS0MsT0FBTCxHQUFlLElBQUlDLHFCQUFKLEVBQWY7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLEtBQUtGLE9BQXhCO0FBQ0EsYUFBS0csTUFBTCxHQUFjLElBQUlDLGlCQUFKLEVBQWQ7QUFDQSxhQUFLSixPQUFMLENBQWFLLE1BQWIsQ0FBb0IsT0FBcEIsRUFBNkIsSUFBSVIsZ0JBQWdCUyxtQkFBcEIsRUFBN0I7QUFDQSxhQUFLTixPQUFMLENBQWFLLE1BQWIsQ0FBb0IsU0FBcEIsRUFBK0IsSUFBSVIsZ0JBQWdCVSwwQkFBcEIsQ0FBK0NSLElBQS9DLENBQS9CO0FBQ0EsYUFBS0MsT0FBTCxDQUFhSyxNQUFiLENBQW9CLFNBQXBCLEVBQStC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QVI7QUFDSDtBQUNELGtCQUFNLElBQUkwRSxjQUFKLENBQVlkLEtBQUtaLE9BQWpCLEVBQTBCaEQsS0FBMUIsQ0FBTjtBQUNILFM7O0FBRVk0RCxZLEVBQU07QUFDZixnQkFBSTVELFFBQVEsSUFBWjtBQUNBLGdCQUFJNEQsS0FBS2UsV0FBTCxJQUFvQixJQUF4QixFQUE4QjtBQUMxQjNFLHdCQUFRLEtBQUtDLFFBQUwsQ0FBYzJELEtBQUtlLFdBQW5CLENBQVI7QUFDSDtBQUNELGlCQUFLdEcsV0FBTCxDQUFpQkcsTUFBakIsQ0FBd0JvRixLQUFLeEQsSUFBTCxDQUFVcUMsTUFBbEMsRUFBMEN6QyxLQUExQztBQUNILFM7O0FBRWM0RCxZLEVBQU07QUFDakIsbUJBQU8sS0FBS3JCLFFBQUwsQ0FBYyxLQUFLdEMsUUFBTCxDQUFjMkQsS0FBS1UsU0FBbkIsQ0FBZCxDQUFQLEVBQXFEO0FBQ2pELHFCQUFLOUUsT0FBTCxDQUFhb0UsS0FBS2dCLElBQWxCO0FBQ0g7QUFDSixTLDhDQS9WZ0IzRyxXIiwiZmlsZSI6ImludGVycHJldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi9leHByXCI7XG5pbXBvcnQgKiBhcyBTdG10IGZyb20gXCIuL3N0bXRcIjtcbmltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQge1J1bnRpbWVFcnJvciwgUmV0dXJuc30gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4vdG9rZW5cIjtcbmltcG9ydCBFbnZpcm9ubWVudCBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCBCdW5hIGZyb20gJy4vYnVuYSc7XG5pbXBvcnQgSGFzaE1hcCBmcm9tICdoYXNobWFwJztcbmltcG9ydCAqIGFzIGRlZmF1bHRGdW5jdGlvbiBmcm9tICcuL2J1bmFGdW5jdGlvbic7XG5pbXBvcnQgQnVuYUNsYXNzIGZyb20gJy4vYnVuYUNsYXNzJztcbmltcG9ydCBCdW5hSW5zdGFuY2UgZnJvbSBcIi4vYnVuYUluc3RhbmNlXCI7XG5pbXBvcnQgYWJpIGZyb20gJy4vYWJpJztcbmltcG9ydCBHYXMgZnJvbSBcIi4vZ2FzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVycHJldGVyIHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgICAgIHRoaXMuZ2xvYmFscyA9IG5ldyBFbnZpcm9ubWVudCgpO1xuICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gdGhpcy5nbG9iYWxzO1xuICAgICAgICB0aGlzLmxvY2FscyA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJjbG9ja1wiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb24pO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiQmFsYW5jZVwiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25CYWxhbmNlKGRhdGEpKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIk1lc3NhZ2VcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uTXNnKGRhdGEpKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIlN0YXR1c1wiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25TdGF0dXMoZGF0YSkpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiR2V0XCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0KTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIlNldE9iamVjdFwiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRGdW5jdGlvblNldE9iamVjdChkYXRhKSk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJTZXRCYWxhbmNlXCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZShkYXRhKSk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJTZXRTdGF0dXNcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRTdGF0dXMoZGF0YSkpXG4gICAgfVxuXG4gICAgaW50ZXJwcmV0KHN0YXRlbWVudHMsIGRhdGEpIHtcbiAgICAgICAgYWJpLmFiaSA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5nYXMgPSBuZXcgR2FzKGRhdGEuZ2FzTW91bnQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0YXRlbWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YS5hYmkgPSBhYmkuZ2V0KClcbiAgICAgICAgICAgIGRhdGEuZ2FzVXNlZCA9IHRoaXMuZ2FzLmdhc1VzZWQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGRhdGEuZ2FzVXNlZCA9IHRoaXMuZ2FzLmdhc1VzZWQ7XG4gICAgICAgICAgICBCdW5hLmdldEluc3RhbmNlKCkucnVudGltZUVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdGhpcy5sb2NhbHMuZ2V0KGV4cHIpO1xuICAgICAgICBpZiAoZGlzdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5hc3NpZ25BdChkaXN0YW5jZSwgZXhwci5uYW1lLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbHMuYXNzaWduKGV4cHIubmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcikge1xuICAgICAgICBsZXQgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgICAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuQkFOR19FUVVBTDpcbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMuaXNFcXVhbChsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5FUVVBTF9FUVVBTDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc0VxdWFsKGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkdSRUFURVI6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuR1JFQVRFUl9FUVVBTDpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuTEVTUzpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5MRVNTX0VRVUFMOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5NSU5VUzpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5QTFVTOlxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGVmdCA9PSBcIm51bWJlclwiICYmIHR5cGVvZiByaWdodCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGVmdCA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiByaWdodCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0LnRvU3RyaW5nKCkgKyByaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxlZnQgLT4gXCIsIGxlZnQsIFwiIHJpZ2h0IC0+IFwiLCByaWdodCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm9wZXJhdG9yLFxuICAgICAgICAgICAgICAgICAgICBcIk9wZXJhbmRzIG11c3QgYmUgdHdvIG51bWJlcnMgb3IgdHdvIHN0cmluZ3MuXCIpO1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuU0xBU0g6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICBpZiAocmlnaHQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIub3BlcmF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIk51bWJlcmF0b3IgY2FuIG5vdCBiZSB6ZXJvLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLlNUQVI6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcikge1xuICAgICAgICBsZXQgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgICAgIGxldCBhcmdzID0gZXhwci5hcmdzLm1hcChhcmcgPT4gdGhpcy5ldmFsdWF0ZShhcmcpKTtcblxuICAgICAgICBpZiAoIShjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uQnVuYUZ1bmN0aW9uIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvblN0YXR1c1xuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25CYWxhbmNlXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvbk1zZ1xuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5GdW5jdGlvbkdldFxuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRGdW5jdGlvblNldE9iamVjdFxuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRGdW5jdGlvblNldEJhbGFuY2VcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRTdGF0dXNcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIEJ1bmFJbnN0YW5jZSB8fCBjYWxsZWUgaW5zdGFuY2VvZiBCdW5hQ2xhc3MpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIucGFyZW4sXG4gICAgICAgICAgICAgICAgXCJDYW4gb25seSBjYWxsIGZ1bmN0aW9ucyBhbmQgY2xhc3Nlcy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT0gY2FsbGVlLmFyaXR5KCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5wYXJlbixcbiAgICAgICAgICAgICAgICBcIkV4cGVjdGVkIFwiICsgY2FsbGVlLmFyaXR5KCkgKyBcIiBhcmd1bWVudHMgYnV0IGdvdCBcIiArIGFyZ3MubGVuZ3RoICsgXCIuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsZWUuY2FsbCh0aGlzLCBhcmdzKTtcbiAgICB9XG5cbiAgICB2aXNpdEdldEV4cHIoZXhwcikge1xuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5ldmFsdWF0ZShleHByLm9iamVjdCk7XG4gICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBCdW5hSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3QuZ2V0KGV4cHIubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIubmFtZSxcbiAgICAgICAgICAgIFwiT25seSBpbnN0YW5jZSBoYXZlIHByb3BlcnRpZXMuXCIpO1xuICAgIH1cblxuICAgIHZpc2l0R3JvdXBpbmdFeHByKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5leHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIGV4cHIudmFsdWU7XG4gICAgfVxuXG4gICAgdmlzaXRMb2dpY2FsRXhwcihleHByKSB7XG4gICAgICAgIGxldCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgICAgIGlmIChleHByLm9wZXJhdG9yLnR5cGUgPT0gVG9rZW5UeXBlLk9SKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1RydXRoeShsZWZ0KSkgcmV0dXJuIGxlZnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNUcnV0aHkobGVmdCkpIHJldHVybiBsZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuXG4gICAgdmlzaXRNc2dFeHByKGV4cHIpIHtcbiAgICAgICAgaWYgKGV4cHIudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZXNbZXhwci5uYW1lLmxleGVtZV0gPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZXNbZXhwci5uYW1lLmxleGVtZV07XG4gICAgfVxuXG4gICAgdmlzaXRTZXRFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5vYmplY3QpO1xuXG4gICAgICAgIGlmICghKG9iamVjdCBpbnN0YW5jZW9mIEJ1bmFJbnN0YW5jZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5uYW1lLCBcIk9ubHkgaW5zdGFuY2UgaGF2ZSBmaWVsZHMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICAgICAgb2JqZWN0LnNldChleHByLm5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICB2aXNpdFN1cGVyRXhwcihleHByKSB7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRoaXMubG9jYWxzLmdldChleHByKTtcbiAgICAgICAgbGV0IHN1cGVyY2xhc3MgPSB0aGlzLmVudmlyb25tZW50LmdldEF0KGRpc3RhbmNlLCBcInN1cGVyXCIpO1xuICAgICAgICAvLyAndGhpcycgaXMgYWx3YXlzIG9uZSBsZXZlbCBuZWFyZXIgdGhhbiAnc3VwZXInIHMgZW52cmlvbm1lbnRcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuZW52aXJvbm1lbnQuZ2V0QXQoZGlzdGFuY2UgLSAxLCBcInRoaXNcIik7XG4gICAgICAgIGxldCBtZXRob2QgPSBzdXBlcmNsYXNzLmZpbmRNZXRob2Qob2JqZWN0LCBleHByLm1ldGhvZC5sZXhlbWUpO1xuICAgICAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5tZXRob2QsXG4gICAgICAgICAgICAgICAgXCJVbmRlZmluZWQgcHJvcGVydHkgJ1wiICsgZXhwci5tZXRob2QubGV4ZW1lICsgXCInLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0aG9kO1xuICAgIH1cblxuICAgIHZpc2l0VGhpc0V4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5sb29rVXBWYXJpYWJsZShleHByLmtleXdvcmQsIGV4cHIpO1xuICAgIH1cblxuICAgIHZpc2l0VW5hcnlFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICAgICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkJBTkc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLmlzVHJ1dGh5KHJpZ2h0KTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLk1JTlVTOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kKGV4cHIub3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKC0xKSAqIHBhcnNlRmxvYXQocmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVW5yZWFjaGFibGUuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZpc2l0VmFyaWFibGVFeHByKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va1VwVmFyaWFibGUoZXhwci5uYW1lLCBleHByKTtcbiAgICB9XG5cbiAgICBsb29rVXBWYXJpYWJsZShuYW1lLCBleHByKSB7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRoaXMubG9jYWxzLmdldChleHByKTtcbiAgICAgICAgaWYgKGRpc3RhbmNlICE9IG51bGwgJiYgZGlzdGFuY2UgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudC5nZXRBdChkaXN0YW5jZSwgbmFtZS5sZXhlbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFscy5nZXQobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja051bWJlck9wZXJhbmQob3BlcmF0b3IsIG9wZXJhbmQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJvcGVyYXRvciAtPiBcIiwgb3BlcmF0b3IpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9wZXJhbmQgLT4gXCIsIG9wZXJhbmQpO1xuICAgICAgICBpZigvXlxcZCskLy50ZXN0KG9wZXJhbmQpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyBpZiAodHlwZW9mIG9wZXJhbmQgPT0gXCJudW1iZXJcIikgcmV0dXJuO1xuICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKG9wZXJhdG9yLCBcIk9wZXJhbmQgbXVzdCBiZSBudW1iZXIuXCIpO1xuICAgIH1cblxuICAgIGNoZWNrTnVtYmVyT3BlcmFuZHMob3BlcmF0b3IsIGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVmdCA9PSBcIm51bWJlclwiICYmIHR5cGVvZiByaWdodCA9PSBcIm51bWJlclwiKSByZXR1cm47XG4gICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3Iob3BlcmF0b3IsIFwiT3BlcmFuZHMgbXVzdCBiZSBudW1iZXJzLlwiKTtcbiAgICB9XG5cbiAgICBpc1RydXRoeShvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdCA9PSBudWxsIHx8IG9iamVjdCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gXCJib29sZWFuXCIpIHJldHVybiBvYmplY3Q7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09IFwibnVtYmVyXCIpIHJldHVybiBvYmplY3QgPiAwO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpc0VxdWFsKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgIGlmIChsZWZ0ID09IG51bGwgJiYgcmlnaHQgPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChsZWZ0ID09IHVuZGVmaW5lZCAmJiByaWdodCA9PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAobGVmdCA9PSBudWxsIHx8IGxlZnQgPT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBsZWZ0ID09IHJpZ2h0O1xuICAgIH1cblxuICAgIHN0cmluZ2lmeShvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdCA9PSBudWxsIHx8IG9iamVjdCA9PSB1bmRlZmluZWQpIHJldHVybiBcIm5pbFwiO1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IG9iamVjdC50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHRleHQuZW5kc1dpdGgoXCIuMFwiKSkge1xuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGV4cHIpIHtcbiAgICAgICAgdGhpcy5nYXMudmlzaXQodGhpcy5nYXMsIGV4cHIpO1xuICAgICAgICByZXR1cm4gZXhwci5hY2NlcHQodGhpcyk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZShzdG10KSB7XG4gICAgICAgIHRoaXMuZ2FzLnZpc2l0KHRoaXMuZ2FzLCBzdG10KTtcbiAgICAgICAgcmV0dXJuIHN0bXQuYWNjZXB0KHRoaXMpO1xuICAgIH1cblxuICAgIHJlc29sdmUoZXhwciwgZGVwdGgpIHtcbiAgICAgICAgdGhpcy5sb2NhbHMuc2V0KGV4cHIsIGRlcHRoKTtcbiAgICB9XG5cbiAgICBleGVjdXRlQmxvY2soc3RhdGVtZW50cywgZW52KSB7XG4gICAgICAgIGxldCBwcmV2aW91cyA9IHRoaXMuZW52aXJvbm1lbnQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gZW52O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0YXRlbWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IHByZXZpb3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRCbG9ja1N0bXQoc3RtdCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGVCbG9jayhzdG10LnN0YXRlbWVudHMsIG5ldyBFbnZpcm9ubWVudCh0aGlzLmVudmlyb25tZW50KSk7XG4gICAgfVxuXG4gICAgdmlzaXRDbGFzc1N0bXQoc3RtdCkge1xuICAgICAgICBhYmkucHVzaCh0aGlzLmdsb2JhbHMpO1xuICAgICAgICBsZXQgc3VwZXJjbGFzcyA9IG51bGw7XG4gICAgICAgIGlmIChzdG10LnN1cGVyY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3VwZXJjbGFzcyA9IHRoaXMuZXZhbHVhdGUoc3RtdC5zdXBlcmNsYXNzKTtcbiAgICAgICAgICAgIGlmICghKHN1cGVyY2xhc3MgaW5zdGFuY2VvZiBCdW5hQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihzdG10LnN1cGVyY2xhc3MubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJTdXBlcmNsYXNzIG11c3QgYmUgYSBjbGFzcy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5kZWZpbmUoc3RtdC5uYW1lLmxleGVtZSwgbnVsbCk7XG5cbiAgICAgICAgaWYgKHN0bXQuc3VwZXJjbGFzcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHRoaXMuZW52aXJvbm1lbnQpO1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5kZWZpbmUoXCJzdXBlclwiLCBzdXBlcmNsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtZXRob2RzID0gbmV3IEhhc2hNYXAoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdG10Lm1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBmbiA9IG5ldyBkZWZhdWx0RnVuY3Rpb24uQnVuYUZ1bmN0aW9uKHN0bXQubWV0aG9kc1tpXSwgdGhpcy5lbnZpcm9ubWVudCwgc3RtdC5tZXRob2RzW2ldLm5hbWUubGV4ZW1lID09IFwiaW5pdFwiKTtcbiAgICAgICAgICAgIG1ldGhvZHMuc2V0KHN0bXQubWV0aG9kc1tpXS5uYW1lLmxleGVtZSwgZm4pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWJpLnB1c2goc3RtdClcbiAgICAgICAgbGV0IGtsYXNzID0gbmV3IEJ1bmFDbGFzcyhzdG10Lm5hbWUubGV4ZW1lLCBzdXBlcmNsYXNzLCBtZXRob2RzKTtcblxuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSB0aGlzLmVudmlyb25tZW50LmVuY2xvc2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuYXNzaWduKHN0bXQubmFtZSwga2xhc3MpO1xuICAgIH1cblxuICAgIHZpc2l0RXhwcmVzc2lvblN0bXQoc3RtdCkge1xuICAgICAgICB0aGlzLmV2YWx1YXRlKHN0bXQuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRGdW5jdGlvblN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgZm4gPSBuZXcgZGVmYXVsdEZ1bmN0aW9uLkJ1bmFGdW5jdGlvbihzdG10LCB0aGlzLmVudmlyb25tZW50LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKHN0bXQubmFtZS5sZXhlbWUsIGZuKTtcbiAgICB9XG5cbiAgICB2aXNpdElmU3RtdChzdG10KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHJ1dGh5KHRoaXMuZXZhbHVhdGUoc3RtdC5jb25kaXRpb24pKSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0bXQudGhlbkJyYW5jaCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RtdC5lbHNlQnJhbmNoICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdG10LmVsc2VCcmFuY2gpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRQcmludFN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKHN0bXQuZXhwcmVzc2lvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgfVxuXG4gICAgdmlzaXRSZXR1cm5TdG10KHN0bXQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKHN0bXQudmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKHN0bXQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBSZXR1cm5zKHN0bXQua2V5d29yZCwgdmFsdWUpO1xuICAgIH1cblxuICAgIHZpc2l0VmFyU3RtdChzdG10KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChzdG10LmluaXRpYWxpemVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5ldmFsdWF0ZShzdG10LmluaXRpYWxpemVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVudmlyb25tZW50LmRlZmluZShzdG10Lm5hbWUubGV4ZW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdmlzaXRXaGlsZVN0bXQoc3RtdCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pc1RydXRoeSh0aGlzLmV2YWx1YXRlKHN0bXQuY29uZGl0aW9uKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdG10LmJvZHkpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==