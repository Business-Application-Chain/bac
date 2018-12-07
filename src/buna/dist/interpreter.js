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
            _abi2.default.abi = [];
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
            console.log("operator -> ", operator);
            console.log("operand -> ", operand);
            if (/^\d+$/.test(operand))
            return;
            // if (typeof operand == "number") return;
            throw new _error.RuntimeError(operator, "Operand must be number.");
        } }, { key: "checkNumberOperands", value: function checkNumberOperands(

        operator, left, right) {
            let re = /^[0-9]+.?[0-9]*$/;
            if(re.test(right)) {
                right = parseInt(right);
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9pbnRlcnByZXRlci5qcyJdLCJuYW1lcyI6WyJFeHByIiwiU3RtdCIsIlRva2VuVHlwZSIsImRlZmF1bHRGdW5jdGlvbiIsIkludGVycHJldGVyIiwiZGF0YSIsImdsb2JhbHMiLCJFbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwibG9jYWxzIiwiSGFzaE1hcCIsImRlZmluZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb24iLCJEZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2ciLCJEZWZhdWx0QnVuYUZ1bmN0aW9uU3RhdHVzIiwiRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZSIsIkRlZmF1bHRGdW5jdGlvblNldFN0YXR1cyIsInN0YXRlbWVudHMiLCJhYmkiLCJpIiwibGVuZ3RoIiwiZXhlY3V0ZSIsImdldCIsImUiLCJjb25zb2xlIiwibG9nIiwiQnVuYSIsImdldEluc3RhbmNlIiwicnVudGltZUVycm9yIiwiZXhwciIsInZhbHVlIiwiZXZhbHVhdGUiLCJkaXN0YW5jZSIsImFzc2lnbkF0IiwibmFtZSIsImFzc2lnbiIsImxlZnQiLCJyaWdodCIsIm9wZXJhdG9yIiwidHlwZSIsIkJBTkdfRVFVQUwiLCJpc0VxdWFsIiwiRVFVQUxfRVFVQUwiLCJHUkVBVEVSIiwiY2hlY2tOdW1iZXJPcGVyYW5kcyIsIkdSRUFURVJfRVFVQUwiLCJMRVNTIiwiTEVTU19FUVVBTCIsIk1JTlVTIiwiUExVUyIsInRvU3RyaW5nIiwiUnVudGltZUVycm9yIiwiU0xBU0giLCJTVEFSIiwiY2FsbGVlIiwiYXJncyIsIm1hcCIsImFyZyIsIkJ1bmFGdW5jdGlvbiIsIkJ1bmFJbnN0YW5jZSIsIkJ1bmFDbGFzcyIsInBhcmVuIiwiYXJpdHkiLCJjYWxsIiwib2JqZWN0IiwiZXhwcmVzc2lvbiIsIk9SIiwiaXNUcnV0aHkiLCJtZXNzYWdlcyIsImxleGVtZSIsInNldCIsInN1cGVyY2xhc3MiLCJnZXRBdCIsIm1ldGhvZCIsImZpbmRNZXRob2QiLCJsb29rVXBWYXJpYWJsZSIsImtleXdvcmQiLCJCQU5HIiwiY2hlY2tOdW1iZXJPcGVyYW5kIiwicGFyc2VGbG9hdCIsInVuZGVmaW5lZCIsIm9wZXJhbmQiLCJ0ZXN0IiwidGV4dCIsImVuZHNXaXRoIiwic3Vic3RyaW5nIiwiYWNjZXB0Iiwic3RtdCIsImRlcHRoIiwiZW52IiwicHJldmlvdXMiLCJleGVjdXRlQmxvY2siLCJwdXNoIiwibWV0aG9kcyIsImZuIiwia2xhc3MiLCJlbmNsb3NpbmciLCJjb25kaXRpb24iLCJ0aGVuQnJhbmNoIiwiZWxzZUJyYW5jaCIsInN0cmluZ2lmeSIsIlJldHVybnMiLCJpbml0aWFsaXplciIsImJvZHkiXSwibWFwcGluZ3MiOiI2VUFBQSw4QixJQUFZQSxJO0FBQ1osOEIsSUFBWUMsSTtBQUNaLHdDLElBQVlDLFM7QUFDWjtBQUNBLGdDO0FBQ0EsNEM7QUFDQSw4QjtBQUNBLGtDO0FBQ0EsOEMsSUFBWUMsZTtBQUNaLHdDO0FBQ0EsOEM7QUFDQSw0Qjs7QUFFcUJDLFc7QUFDakIseUJBQVlDLElBQVosRUFBa0I7QUFDZCxhQUFLQyxPQUFMLEdBQWUsSUFBSUMscUJBQUosRUFBZjtBQUNBLGFBQUtDLFdBQUwsR0FBbUIsS0FBS0YsT0FBeEI7QUFDQSxhQUFLRyxNQUFMLEdBQWMsSUFBSUMsaUJBQUosRUFBZDtBQUNBLGFBQUtKLE9BQUwsQ0FBYUssTUFBYixDQUFvQixPQUFwQixFQUE2QixJQUFJUixnQkFBZ0JTLG1CQUFwQixFQUE3QjtBQUNBLGFBQUtOLE9BQUwsQ0FBYUssTUFBYixDQUFvQixTQUFwQixFQUErQixJQUFJUixnQkFBZ0JVLDBCQUFwQixDQUErQ1IsSUFBL0MsQ0FBL0I7QUFDQSxhQUFLQyxPQUFMLENBQWFLLE1BQWIsQ0FBb0IsU0FBcEIsRUFBK0IsSUFBSVIsZ0JBQWdCVyxzQkFBcEIsQ0FBMkNULElBQTNDLENBQS9CO0FBQ0EsYUFB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WSxFQUFNO0FBQ2pCLG1CQUFPLEtBQUtwQixRQUFMLENBQWMsS0FBS3BDLFFBQUwsQ0FBY3dELEtBQUtVLFNBQW5CLENBQWQsQ0FBUCxFQUFxRDtBQUNqRCxxQkFBSzVFLE9BQUwsQ0FBYWtFLEtBQUtnQixJQUFsQjtBQUNIO0FBQ0osUyw4Q0EzVmdCdEcsVyIsImZpbGUiOiJpbnRlcnByZXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0ICogYXMgU3RtdCBmcm9tIFwiLi9zdG10XCI7XG5pbXBvcnQgKiBhcyBUb2tlblR5cGUgZnJvbSAnLi90b2tlblR5cGUnO1xuaW1wb3J0IHtSdW50aW1lRXJyb3IsIFJldHVybnN9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuL3Rva2VuXCI7XG5pbXBvcnQgRW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQnVuYSBmcm9tICcuL2J1bmEnO1xuaW1wb3J0IEhhc2hNYXAgZnJvbSAnaGFzaG1hcCc7XG5pbXBvcnQgKiBhcyBkZWZhdWx0RnVuY3Rpb24gZnJvbSAnLi9idW5hRnVuY3Rpb24nO1xuaW1wb3J0IEJ1bmFDbGFzcyBmcm9tICcuL2J1bmFDbGFzcyc7XG5pbXBvcnQgQnVuYUluc3RhbmNlIGZyb20gXCIuL2J1bmFJbnN0YW5jZVwiO1xuaW1wb3J0IGFiaSBmcm9tIFwiLi9hYmlcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlcnByZXRlciB7XG4gICAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgICAgICB0aGlzLmdsb2JhbHMgPSBuZXcgRW52aXJvbm1lbnQoKTtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IHRoaXMuZ2xvYmFscztcbiAgICAgICAgdGhpcy5sb2NhbHMgPSBuZXcgSGFzaE1hcCgpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiY2xvY2tcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIkJhbGFuY2VcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZShkYXRhKSk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJNZXNzYWdlXCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvbk1zZyhkYXRhKSk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJTdGF0dXNcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uU3RhdHVzKGRhdGEpKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIkdldFwiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5GdW5jdGlvbkdldCk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJTZXRPYmplY3RcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRPYmplY3QoZGF0YSkpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiU2V0QmFsYW5jZVwiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRGdW5jdGlvblNldEJhbGFuY2UoZGF0YSkpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiU2V0U3RhdHVzXCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0U3RhdHVzKGRhdGEpKVxuICAgIH1cblxuICAgIGludGVycHJldChzdGF0ZW1lbnRzLCBkYXRhKSB7XG4gICAgICAgIGFiaS5hYmkgPSBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdGF0ZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGEuYWJpID0gYWJpLmdldCgpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLnJ1bnRpbWVFcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2l0QXNzaWduRXhwcihleHByKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRoaXMubG9jYWxzLmdldChleHByKTtcbiAgICAgICAgaWYgKGRpc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQuYXNzaWduQXQoZGlzdGFuY2UsIGV4cHIubmFtZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxzLmFzc2lnbihleHByLm5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG5cbiAgICAgICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkJBTkdfRVFVQUw6XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLmlzRXF1YWwobGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuRVFVQUxfRVFVQUw6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNFcXVhbChsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5HUkVBVEVSOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPiByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkdSRUFURVJfRVFVQUw6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkxFU1M6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA8IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuTEVTU19FUVVBTDpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuTUlOVVM6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAtIHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuUExVUzpcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxlZnQgPT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgcmlnaHQgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxlZnQgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgcmlnaHQgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdC50b1N0cmluZygpICsgcmlnaHQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsZWZ0IC0+IFwiLCBsZWZ0LCBcIiByaWdodCAtPiBcIiwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5vcGVyYXRvcixcbiAgICAgICAgICAgICAgICAgICAgXCJPcGVyYW5kcyBtdXN0IGJlIHR3byBudW1iZXJzIG9yIHR3byBzdHJpbmdzLlwiKTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLlNMQVNIOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm9wZXJhdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJOdW1iZXJhdG9yIGNhbiBub3QgYmUgemVyby5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5TVEFSOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgKiByaWdodDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdENhbGxFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgICAgICBsZXQgYXJncyA9IGV4cHIuYXJncy5tYXAoYXJnID0+IHRoaXMuZXZhbHVhdGUoYXJnKSk7XG5cbiAgICAgICAgaWYgKCEoY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkJ1bmFGdW5jdGlvbiB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvblxuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25TdGF0dXNcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZVxuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2dcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuRnVuY3Rpb25HZXRcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRPYmplY3RcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRCYWxhbmNlXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0U3RhdHVzXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBCdW5hSW5zdGFuY2UgfHwgY2FsbGVlIGluc3RhbmNlb2YgQnVuYUNsYXNzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLnBhcmVuLFxuICAgICAgICAgICAgICAgIFwiQ2FuIG9ubHkgY2FsbCBmdW5jdGlvbnMgYW5kIGNsYXNzZXMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9IGNhbGxlZS5hcml0eSgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIucGFyZW4sXG4gICAgICAgICAgICAgICAgXCJFeHBlY3RlZCBcIiArIGNhbGxlZS5hcml0eSgpICsgXCIgYXJndW1lbnRzIGJ1dCBnb3QgXCIgKyBhcmdzLmxlbmd0aCArIFwiLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGVlLmNhbGwodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgdmlzaXRHZXRFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5vYmplY3QpO1xuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgQnVuYUluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0LmdldChleHByLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm5hbWUsXG4gICAgICAgICAgICBcIk9ubHkgaW5zdGFuY2UgaGF2ZSBwcm9wZXJ0aWVzLlwiKTtcbiAgICB9XG5cbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLnZhbHVlO1xuICAgIH1cblxuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcikge1xuICAgICAgICBsZXQgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgICAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09IFRva2VuVHlwZS5PUikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUcnV0aHkobGVmdCkpIHJldHVybiBsZWZ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVHJ1dGh5KGxlZnQpKSByZXR1cm4gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cblxuICAgIHZpc2l0TXNnRXhwcihleHByKSB7XG4gICAgICAgIGlmIChleHByLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzW2V4cHIubmFtZS5sZXhlbWVdID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzW2V4cHIubmFtZS5sZXhlbWVdO1xuICAgIH1cblxuICAgIHZpc2l0U2V0RXhwcihleHByKSB7XG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLmV2YWx1YXRlKGV4cHIub2JqZWN0KTtcblxuICAgICAgICBpZiAoIShvYmplY3QgaW5zdGFuY2VvZiBCdW5hSW5zdGFuY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIubmFtZSwgXCJPbmx5IGluc3RhbmNlIGhhdmUgZmllbGRzLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgICAgIG9iamVjdC5zZXQoZXhwci5uYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdmlzaXRTdXBlckV4cHIoZXhwcikge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLmxvY2Fscy5nZXQoZXhwcik7XG4gICAgICAgIGxldCBzdXBlcmNsYXNzID0gdGhpcy5lbnZpcm9ubWVudC5nZXRBdChkaXN0YW5jZSwgXCJzdXBlclwiKTtcbiAgICAgICAgLy8gJ3RoaXMnIGlzIGFsd2F5cyBvbmUgbGV2ZWwgbmVhcmVyIHRoYW4gJ3N1cGVyJyBzIGVudnJpb25tZW50XG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLmVudmlyb25tZW50LmdldEF0KGRpc3RhbmNlIC0gMSwgXCJ0aGlzXCIpO1xuICAgICAgICBsZXQgbWV0aG9kID0gc3VwZXJjbGFzcy5maW5kTWV0aG9kKG9iamVjdCwgZXhwci5tZXRob2QubGV4ZW1lKTtcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIubWV0aG9kLFxuICAgICAgICAgICAgICAgIFwiVW5kZWZpbmVkIHByb3BlcnR5ICdcIiArIGV4cHIubWV0aG9kLmxleGVtZSArIFwiJy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZDtcbiAgICB9XG5cbiAgICB2aXNpdFRoaXNFeHByKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va1VwVmFyaWFibGUoZXhwci5rZXl3b3JkLCBleHByKTtcbiAgICB9XG5cbiAgICB2aXNpdFVuYXJ5RXhwcihleHByKSB7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5CQU5HOlxuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5pc1RydXRoeShyaWdodCk7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5NSU5VUzpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZChleHByLm9wZXJhdG9yLCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgtMSkgKiBwYXJzZUZsb2F0KHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVucmVhY2hhYmxlLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvb2tVcFZhcmlhYmxlKGV4cHIubmFtZSwgZXhwcik7XG4gICAgfVxuXG4gICAgbG9va1VwVmFyaWFibGUobmFtZSwgZXhwcikge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLmxvY2Fscy5nZXQoZXhwcik7XG4gICAgICAgIGlmIChkaXN0YW5jZSAhPSBudWxsICYmIGRpc3RhbmNlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvbm1lbnQuZ2V0QXQoZGlzdGFuY2UsIG5hbWUubGV4ZW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdsb2JhbHMuZ2V0KG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tOdW1iZXJPcGVyYW5kKG9wZXJhdG9yLCBvcGVyYW5kKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib3BlcmF0b3IgLT4gXCIsIG9wZXJhdG9yKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJvcGVyYW5kIC0+IFwiLCBvcGVyYW5kKTtcbiAgICAgICAgaWYoL15cXGQrJC8udGVzdChvcGVyYW5kKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gaWYgKHR5cGVvZiBvcGVyYW5kID09IFwibnVtYmVyXCIpIHJldHVybjtcbiAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihvcGVyYXRvciwgXCJPcGVyYW5kIG11c3QgYmUgbnVtYmVyLlwiKTtcbiAgICB9XG5cbiAgICBjaGVja051bWJlck9wZXJhbmRzKG9wZXJhdG9yLCBsZWZ0LCByaWdodCkge1xuICAgICAgICBpZiAodHlwZW9mIGxlZnQgPT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgcmlnaHQgPT0gXCJudW1iZXJcIikgcmV0dXJuO1xuICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKG9wZXJhdG9yLCBcIk9wZXJhbmRzIG11c3QgYmUgbnVtYmVycy5cIik7XG4gICAgfVxuXG4gICAgaXNUcnV0aHkob2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3QgPT0gbnVsbCB8fCBvYmplY3QgPT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09IFwiYm9vbGVhblwiKSByZXR1cm4gb2JqZWN0O1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PSBcIm51bWJlclwiKSByZXR1cm4gb2JqZWN0ID4gMDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaXNFcXVhbChsZWZ0LCByaWdodCkge1xuICAgICAgICBpZiAobGVmdCA9PSBudWxsICYmIHJpZ2h0ID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAobGVmdCA9PSB1bmRlZmluZWQgJiYgcmlnaHQgPT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKGxlZnQgPT0gbnVsbCB8fCBsZWZ0ID09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gbGVmdCA9PSByaWdodDtcbiAgICB9XG5cbiAgICBzdHJpbmdpZnkob2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3QgPT0gbnVsbCB8fCBvYmplY3QgPT0gdW5kZWZpbmVkKSByZXR1cm4gXCJuaWxcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBvYmplY3QudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmICh0ZXh0LmVuZHNXaXRoKFwiLjBcIikpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgdGV4dC5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3QudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBldmFsdWF0ZShleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLmFjY2VwdCh0aGlzKTtcbiAgICB9XG5cbiAgICBleGVjdXRlKHN0bXQpIHtcbiAgICAgICAgcmV0dXJuIHN0bXQuYWNjZXB0KHRoaXMpO1xuICAgIH1cblxuICAgIHJlc29sdmUoZXhwciwgZGVwdGgpIHtcbiAgICAgICAgdGhpcy5sb2NhbHMuc2V0KGV4cHIsIGRlcHRoKTtcbiAgICB9XG5cbiAgICBleGVjdXRlQmxvY2soc3RhdGVtZW50cywgZW52KSB7XG4gICAgICAgIGxldCBwcmV2aW91cyA9IHRoaXMuZW52aXJvbm1lbnQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gZW52O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0YXRlbWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IHByZXZpb3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRCbG9ja1N0bXQoc3RtdCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGVCbG9jayhzdG10LnN0YXRlbWVudHMsIG5ldyBFbnZpcm9ubWVudCh0aGlzLmVudmlyb25tZW50KSk7XG4gICAgfVxuXG4gICAgdmlzaXRDbGFzc1N0bXQoc3RtdCkge1xuICAgICAgICBhYmkucHVzaCh0aGlzLmdsb2JhbHMpO1xuICAgICAgICBsZXQgc3VwZXJjbGFzcyA9IG51bGw7XG4gICAgICAgIGlmIChzdG10LnN1cGVyY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3VwZXJjbGFzcyA9IHRoaXMuZXZhbHVhdGUoc3RtdC5zdXBlcmNsYXNzKTtcbiAgICAgICAgICAgIGlmICghKHN1cGVyY2xhc3MgaW5zdGFuY2VvZiBCdW5hQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihzdG10LnN1cGVyY2xhc3MubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJTdXBlcmNsYXNzIG11c3QgYmUgYSBjbGFzcy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5kZWZpbmUoc3RtdC5uYW1lLmxleGVtZSwgbnVsbCk7XG5cbiAgICAgICAgaWYgKHN0bXQuc3VwZXJjbGFzcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHRoaXMuZW52aXJvbm1lbnQpO1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5kZWZpbmUoXCJzdXBlclwiLCBzdXBlcmNsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtZXRob2RzID0gbmV3IEhhc2hNYXAoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdG10Lm1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBmbiA9IG5ldyBkZWZhdWx0RnVuY3Rpb24uQnVuYUZ1bmN0aW9uKHN0bXQubWV0aG9kc1tpXSwgdGhpcy5lbnZpcm9ubWVudCwgc3RtdC5tZXRob2RzW2ldLm5hbWUubGV4ZW1lID09IFwiaW5pdFwiKTtcbiAgICAgICAgICAgIG1ldGhvZHMuc2V0KHN0bXQubWV0aG9kc1tpXS5uYW1lLmxleGVtZSwgZm4pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWJpLnB1c2goc3RtdClcbiAgICAgICAgbGV0IGtsYXNzID0gbmV3IEJ1bmFDbGFzcyhzdG10Lm5hbWUubGV4ZW1lLCBzdXBlcmNsYXNzLCBtZXRob2RzKTtcblxuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSB0aGlzLmVudmlyb25tZW50LmVuY2xvc2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuYXNzaWduKHN0bXQubmFtZSwga2xhc3MpO1xuICAgIH1cblxuICAgIHZpc2l0RXhwcmVzc2lvblN0bXQoc3RtdCkge1xuICAgICAgICB0aGlzLmV2YWx1YXRlKHN0bXQuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRGdW5jdGlvblN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgZm4gPSBuZXcgZGVmYXVsdEZ1bmN0aW9uLkJ1bmFGdW5jdGlvbihzdG10LCB0aGlzLmVudmlyb25tZW50LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKHN0bXQubmFtZS5sZXhlbWUsIGZuKTtcbiAgICB9XG5cbiAgICB2aXNpdElmU3RtdChzdG10KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHJ1dGh5KHRoaXMuZXZhbHVhdGUoc3RtdC5jb25kaXRpb24pKSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0bXQudGhlbkJyYW5jaCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RtdC5lbHNlQnJhbmNoICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdG10LmVsc2VCcmFuY2gpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRQcmludFN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKHN0bXQuZXhwcmVzc2lvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgfVxuXG4gICAgdmlzaXRSZXR1cm5TdG10KHN0bXQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKHN0bXQudmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKHN0bXQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBSZXR1cm5zKHN0bXQua2V5d29yZCwgdmFsdWUpO1xuICAgIH1cblxuICAgIHZpc2l0VmFyU3RtdChzdG10KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChzdG10LmluaXRpYWxpemVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5ldmFsdWF0ZShzdG10LmluaXRpYWxpemVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVudmlyb25tZW50LmRlZmluZShzdG10Lm5hbWUubGV4ZW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdmlzaXRXaGlsZVN0bXQoc3RtdCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pc1RydXRoeSh0aGlzLmV2YWx1YXRlKHN0bXQuY29uZGl0aW9uKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdG10LmJvZHkpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==