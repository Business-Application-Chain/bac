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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9pbnRlcnByZXRlci5qcyJdLCJuYW1lcyI6WyJFeHByIiwiU3RtdCIsIlRva2VuVHlwZSIsImRlZmF1bHRGdW5jdGlvbiIsIkludGVycHJldGVyIiwiZGF0YSIsImdsb2JhbHMiLCJFbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwibG9jYWxzIiwiSGFzaE1hcCIsImRlZmluZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb24iLCJEZWZhdWx0QnVuYUZ1bmN0aW9uQmFsYW5jZSIsIkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2ciLCJEZWZhdWx0QnVuYUZ1bmN0aW9uU3RhdHVzIiwiRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0IiwiRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZSIsIkRlZmF1bHRGdW5jdGlvblNldFN0YXR1cyIsInN0YXRlbWVudHMiLCJhYmkiLCJpIiwibGVuZ3RoIiwiZXhlY3V0ZSIsImdldCIsImUiLCJjb25zb2xlIiwibG9nIiwiQnVuYSIsImdldEluc3RhbmNlIiwicnVudGltZUVycm9yIiwiZXhwciIsInZhbHVlIiwiZXZhbHVhdGUiLCJkaXN0YW5jZSIsImFzc2lnbkF0IiwibmFtZSIsImFzc2lnbiIsImxlZnQiLCJyaWdodCIsIm9wZXJhdG9yIiwidHlwZSIsIkJBTkdfRVFVQUwiLCJpc0VxdWFsIiwiRVFVQUxfRVFVQUwiLCJHUkVBVEVSIiwiY2hlY2tOdW1iZXJPcGVyYW5kcyIsIkdSRUFURVJfRVFVQUwiLCJMRVNTIiwiTEVTU19FUVVBTCIsIk1JTlVTIiwiUExVUyIsInRvU3RyaW5nIiwiUnVudGltZUVycm9yIiwiU0xBU0giLCJTVEFSIiwiY2FsbGVlIiwiYXJncyIsIm1hcCIsImFyZyIsIkJ1bmFGdW5jdGlvbiIsIkJ1bmFJbnN0YW5jZSIsIkJ1bmFDbGFzcyIsInBhcmVuIiwiYXJpdHkiLCJjYWxsIiwib2JqZWN0IiwiZXhwcmVzc2lvbiIsIk9SIiwiaXNUcnV0aHkiLCJtZXNzYWdlcyIsImxleGVtZSIsInNldCIsInN1cGVyY2xhc3MiLCJnZXRBdCIsIm1ldGhvZCIsImZpbmRNZXRob2QiLCJsb29rVXBWYXJpYWJsZSIsImtleXdvcmQiLCJCQU5HIiwiY2hlY2tOdW1iZXJPcGVyYW5kIiwicGFyc2VGbG9hdCIsInVuZGVmaW5lZCIsIm9wZXJhbmQiLCJ0ZXh0IiwiZW5kc1dpdGgiLCJzdWJzdHJpbmciLCJhY2NlcHQiLCJzdG10IiwiZGVwdGgiLCJlbnYiLCJwcmV2aW91cyIsImV4ZWN1dGVCbG9jayIsInB1c2giLCJtZXRob2RzIiwiZm4iLCJrbGFzcyIsImVuY2xvc2luZyIsImNvbmRpdGlvbiIsInRoZW5CcmFuY2giLCJlbHNlQnJhbmNoIiwic3RyaW5naWZ5IiwiUmV0dXJucyIsImluaXRpYWxpemVyIiwiYm9keSJdLCJtYXBwaW5ncyI6IjZVQUFBLDhCLElBQVlBLEk7QUFDWiw4QixJQUFZQyxJO0FBQ1osd0MsSUFBWUMsUztBQUNaO0FBQ0EsZ0M7QUFDQSw0QztBQUNBLDhCO0FBQ0Esa0M7QUFDQSw4QyxJQUFZQyxlO0FBQ1osd0M7QUFDQSw4QztBQUNBLDRCOztBQUVxQkMsVztBQUNqQix5QkFBWUMsSUFBWixFQUFrQjtBQUNkLGFBQUtDLE9BQUwsR0FBZSxJQUFJQyxxQkFBSixFQUFmO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQixLQUFLRixPQUF4QjtBQUNBLGFBQUtHLE1BQUwsR0FBYyxJQUFJQyxpQkFBSixFQUFkO0FBQ0EsYUFBS0osT0FBTCxDQUFhSyxNQUFiLENBQW9CLE9BQXBCLEVBQTZCLElBQUlSLGdCQUFnQlMsbUJBQXBCLEVBQTdCO0FBQ0EsYUFBS04sT0FBTCxDQUFhSyxNQUFiLENBQW9CLFNBQXBCLEVBQStCLElBQUlSLGdCQUFnQlUsMEJBQXBCLENBQStDUixJQUEvQyxDQUEvQjtBQUNBLGFBQUtDLE9BQUwsQ0FBYUssTUFBYixDQUFvQixTQUFwQixFQUErQixJQUFJUixnQkFBZ0JXLHNCQUFwQixDQUEyQ1QsSUFBM0MsQ0FBL0I7QUFDQSxhQUFLQyxPQUFMLENBQWFLLE1BQWIsQ0FBb0IsUUFBcEIsRUFBOEIsSUFBSVIsZ0JBQWdCWSx5QkFBcEIsQ0FBOENWLElBQTlDLENBQTlCO0FBQ0EsYUFBS0MsT0FBTCxDQUFhSyxNQUFiLENBQW9CLEtBQXBCLEVBQTJCLElBQUlSLGdCQUFnQmEscUJBQXBCLEVBQTNCO0FBQ0EsYUFBS1YsT0FBTCxDQUFhSyxNQUFiLENBQW9CLFdBQXBCLEVBQWlDLElBQUlSLGdCQUFnQmMsd0JBQXBCLENBQTZDWixJQUE3QyxDQUFqQztBQUNBLGFBQUtDLE9BQUwsQ0FBYUssTUFBYixDQUFvQixZQUFwQixFQUFrQyxJQUFJUixnQkFBZ0JlLHlCQUFwQixDQUE4Q2IsSUFBOUMsQ0FBbEM7QUFDQSxhQUFLQyxPQUFMLENBQWFLLE1BQWIsQ0FBb0IsV0FBcEIsRUFBaUMsSUFBSVIsZ0JBQWdCZ0Isd0JBQXBCLENBQTZDZCxJQUE3QyxDQUFqQztBQUNILEs7O0FBRVNlLGtCLEVBQVlmLEksRUFBTTtBQUN4QmdCLDBCQUFJQSxHQUFKLEdBQVUsRUFBVjtBQUNBLGdCQUFJO0FBQ0EscUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixXQUFXRyxNQUEvQixFQUF1Q0QsR0FBdkMsRUFBNEM7QUFDeEMseUJBQUtFLE9BQUwsQ0FBYUosV0FBV0UsQ0FBWCxDQUFiO0FBQ0g7QUFDRGpCLHFCQUFLZ0IsR0FBTCxHQUFXQSxjQUFJSSxHQUFKLEVBQVg7QUFDSCxhQUxELENBS0UsT0FBT0MsQ0FBUCxFQUFVO0FBQ1JDLHdCQUFRQyxHQUFSLENBQVlGLENBQVo7QUFDQUcsK0JBQUtDLFdBQUwsR0FBbUJDLFlBQW5CLENBQWdDTCxDQUFoQztBQUNIO0FBQ0osUzs7QUFFZU0sWSxFQUFNO0FBQ2xCLGdCQUFJQyxRQUFRLEtBQUtDLFFBQUwsQ0FBY0YsS0FBS0MsS0FBbkIsQ0FBWjtBQUNBLGdCQUFJRSxXQUFXLEtBQUsxQixNQUFMLENBQVlnQixHQUFaLENBQWdCTyxJQUFoQixDQUFmO0FBQ0EsZ0JBQUlHLFlBQVksSUFBaEIsRUFBc0I7QUFDbEIscUJBQUszQixXQUFMLENBQWlCNEIsUUFBakIsQ0FBMEJELFFBQTFCLEVBQW9DSCxLQUFLSyxJQUF6QyxFQUErQ0osS0FBL0M7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSzNCLE9BQUwsQ0FBYWdDLE1BQWIsQ0FBb0JOLEtBQUtLLElBQXpCLEVBQStCSixLQUEvQjtBQUNIO0FBQ0QsbUJBQU9BLEtBQVA7QUFDSCxTOztBQUVlRCxZLEVBQU07QUFDbEIsZ0JBQUlPLE9BQU8sS0FBS0wsUUFBTCxDQUFjRixLQUFLTyxJQUFuQixDQUFYO0FBQ0EsZ0JBQUlDLFFBQVEsS0FBS04sUUFBTCxDQUFjRixLQUFLUSxLQUFuQixDQUFaOztBQUVBLG9CQUFRUixLQUFLUyxRQUFMLENBQWNDLElBQXRCO0FBQ0kscUJBQUt4QyxVQUFVeUMsVUFBZjtBQUNJLDJCQUFPLENBQUMsS0FBS0MsT0FBTCxDQUFhTCxJQUFiLEVBQW1CQyxLQUFuQixDQUFSO0FBQ0oscUJBQUt0QyxVQUFVMkMsV0FBZjtBQUNJLDJCQUFPLEtBQUtELE9BQUwsQ0FBYUwsSUFBYixFQUFtQkMsS0FBbkIsQ0FBUDtBQUNKLHFCQUFLdEMsVUFBVTRDLE9BQWY7QUFDSSx5QkFBS0MsbUJBQUwsQ0FBeUJmLEtBQUtTLFFBQTlCLEVBQXdDRixJQUF4QyxFQUE4Q0MsS0FBOUM7QUFDQSwyQkFBT0QsT0FBT0MsS0FBZDtBQUNKLHFCQUFLdEMsVUFBVThDLGFBQWY7QUFDSSx5QkFBS0QsbUJBQUwsQ0FBeUJmLEtBQUtTLFFBQTlCLEVBQXdDRixJQUF4QyxFQUE4Q0MsS0FBOUM7QUFDQSwyQkFBT0QsUUFBUUMsS0FBZjtBQUNKLHFCQUFLdEMsVUFBVStDLElBQWY7QUFDSSx5QkFBS0YsbUJBQUwsQ0FBeUJmLEtBQUtTLFFBQTlCLEVBQXdDRixJQUF4QyxFQUE4Q0MsS0FBOUM7QUFDQSwyQkFBT0QsT0FBT0MsS0FBZDtBQUNKLHFCQUFLdEMsVUFBVWdELFVBQWY7QUFDSSx5QkFBS0gsbUJBQUwsQ0FBeUJmLEtBQUtTLFFBQTlCLEVBQXdDRixJQUF4QyxFQUE4Q0MsS0FBOUM7QUFDQSwyQkFBT0QsUUFBUUMsS0FBZjtBQUNKLHFCQUFLdEMsVUFBVWlELEtBQWY7QUFDSSx5QkFBS0osbUJBQUwsQ0FBeUJmLEtBQUtTLFFBQTlCLEVBQXdDRixJQUF4QyxFQUE4Q0MsS0FBOUM7QUFDQSwyQkFBT0QsT0FBT0MsS0FBZDtBQUNKLHFCQUFLdEMsVUFBVWtELElBQWY7QUFDSSx3QkFBSSxPQUFPYixJQUFQLElBQWUsUUFBZixJQUEyQixPQUFPQyxLQUFQLElBQWdCLFFBQS9DLEVBQXlEO0FBQ3JELCtCQUFPRCxPQUFPQyxLQUFkO0FBQ0g7QUFDRCx3QkFBSSxPQUFPRCxJQUFQLElBQWUsUUFBZixJQUEyQixPQUFPQyxLQUFQLElBQWdCLFFBQS9DLEVBQXlEO0FBQ3JELCtCQUFPRCxLQUFLYyxRQUFMLEtBQWtCYixNQUFNYSxRQUFOLEVBQXpCO0FBQ0g7QUFDRDFCLDRCQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QlcsSUFBeEIsRUFBOEIsWUFBOUIsRUFBNENDLEtBQTVDO0FBQ0EsMEJBQU0sSUFBSWMsbUJBQUosQ0FBaUJ0QixLQUFLUyxRQUF0QjtBQUNGLGtFQURFLENBQU47QUFFSixxQkFBS3ZDLFVBQVVxRCxLQUFmO0FBQ0kseUJBQUtSLG1CQUFMLENBQXlCZixLQUFLUyxRQUE5QixFQUF3Q0YsSUFBeEMsRUFBOENDLEtBQTlDO0FBQ0Esd0JBQUlBLFNBQVMsQ0FBYixFQUFnQjtBQUNaLDhCQUFNLElBQUljLG1CQUFKLENBQWlCdEIsS0FBS1MsUUFBdEI7QUFDRixxREFERSxDQUFOO0FBRUg7QUFDRCwyQkFBT0YsT0FBT0MsS0FBZDtBQUNKLHFCQUFLdEMsVUFBVXNELElBQWY7QUFDSSx5QkFBS1QsbUJBQUwsQ0FBeUJmLEtBQUtTLFFBQTlCLEVBQXdDRixJQUF4QyxFQUE4Q0MsS0FBOUM7QUFDQSwyQkFBT0QsT0FBT0MsS0FBZCxDQXZDUjs7QUF5Q0EsbUJBQU8sSUFBUDtBQUNILFM7O0FBRWFSLFksRUFBTTtBQUNoQixnQkFBSXlCLFNBQVMsS0FBS3ZCLFFBQUwsQ0FBY0YsS0FBS3lCLE1BQW5CLENBQWI7QUFDQSxnQkFBSUMsT0FBTzFCLEtBQUswQixJQUFMLENBQVVDLEdBQVYsQ0FBYyx1QkFBTyxNQUFLekIsUUFBTCxDQUFjMEIsR0FBZCxDQUFQLEVBQWQsQ0FBWDs7QUFFQSxnQkFBSSxFQUFFSCxrQkFBa0J0RCxnQkFBZ0IwRCxZQUFsQyxJQUFrREosa0JBQWtCdEQsZ0JBQWdCUyxtQkFBcEY7QUFDQzZDLDhCQUFrQnRELGdCQUFnQlkseUJBRG5DO0FBRUMwQyw4QkFBa0J0RCxnQkFBZ0JVLDBCQUZuQztBQUdDNEMsOEJBQWtCdEQsZ0JBQWdCVyxzQkFIbkM7QUFJQzJDLDhCQUFrQnRELGdCQUFnQmEscUJBSm5DO0FBS0N5Qyw4QkFBa0J0RCxnQkFBZ0JjLHdCQUxuQztBQU1Dd0MsOEJBQWtCdEQsZ0JBQWdCZSx5QkFObkM7QUFPQ3VDLDhCQUFrQnRELGdCQUFnQmdCLHdCQVBuQztBQVFDc0MsOEJBQWtCSyxzQkFSbkIsSUFRbUNMLGtCQUFrQk0sbUJBUnZELENBQUosRUFRdUU7QUFDbkUsc0JBQU0sSUFBSVQsbUJBQUosQ0FBaUJ0QixLQUFLZ0MsS0FBdEI7QUFDRixzREFERSxDQUFOO0FBRUg7O0FBRUQsZ0JBQUlOLEtBQUtuQyxNQUFMLElBQWVrQyxPQUFPUSxLQUFQLEVBQW5CLEVBQW1DO0FBQy9CLHNCQUFNLElBQUlYLG1CQUFKLENBQWlCdEIsS0FBS2dDLEtBQXRCO0FBQ0YsOEJBQWNQLE9BQU9RLEtBQVAsRUFBZCxHQUErQixxQkFBL0IsR0FBdURQLEtBQUtuQyxNQUE1RCxHQUFxRSxHQURuRSxDQUFOO0FBRUg7QUFDRCxtQkFBT2tDLE9BQU9TLElBQVAsQ0FBWSxJQUFaLEVBQWtCUixJQUFsQixDQUFQO0FBQ0gsUzs7QUFFWTFCLFksRUFBTTtBQUNmLGdCQUFJbUMsU0FBUyxLQUFLakMsUUFBTCxDQUFjRixLQUFLbUMsTUFBbkIsQ0FBYjtBQUNBLGdCQUFJQSxrQkFBa0JMLHNCQUF0QixFQUFvQztBQUNoQyx1QkFBT0ssT0FBTzFDLEdBQVAsQ0FBV08sS0FBS0ssSUFBaEIsQ0FBUDtBQUNIOztBQUVELGtCQUFNLElBQUlpQixtQkFBSixDQUFpQnRCLEtBQUtLLElBQXRCO0FBQ0YsNENBREUsQ0FBTjtBQUVILFM7O0FBRWlCTCxZLEVBQU07QUFDcEIsbUJBQU8sS0FBS0UsUUFBTCxDQUFjRixLQUFLb0MsVUFBbkIsQ0FBUDtBQUNILFM7O0FBRWdCcEMsWSxFQUFNO0FBQ25CLG1CQUFPQSxLQUFLQyxLQUFaO0FBQ0gsUzs7QUFFZ0JELFksRUFBTTtBQUNuQixnQkFBSU8sT0FBTyxLQUFLTCxRQUFMLENBQWNGLEtBQUtPLElBQW5CLENBQVg7O0FBRUEsZ0JBQUlQLEtBQUtTLFFBQUwsQ0FBY0MsSUFBZCxJQUFzQnhDLFVBQVVtRSxFQUFwQyxFQUF3QztBQUNwQyxvQkFBSSxLQUFLQyxRQUFMLENBQWMvQixJQUFkLENBQUosRUFBeUIsT0FBT0EsSUFBUDtBQUM1QixhQUZELE1BRU87QUFDSCxvQkFBSSxDQUFDLEtBQUsrQixRQUFMLENBQWMvQixJQUFkLENBQUwsRUFBMEIsT0FBT0EsSUFBUDtBQUM3Qjs7QUFFRCxtQkFBTyxLQUFLTCxRQUFMLENBQWNGLEtBQUtRLEtBQW5CLENBQVA7QUFDSCxTOztBQUVZUixZLEVBQU07QUFDZixnQkFBSUEsS0FBS0MsS0FBVCxFQUFnQjtBQUNaLHFCQUFLc0MsUUFBTCxDQUFjdkMsS0FBS0ssSUFBTCxDQUFVbUMsTUFBeEIsSUFBa0MsS0FBS3RDLFFBQUwsQ0FBY0YsS0FBS0MsS0FBbkIsQ0FBbEM7QUFDQTtBQUNIO0FBQ0QsbUJBQU8sS0FBS3NDLFFBQUwsQ0FBY3ZDLEtBQUtLLElBQUwsQ0FBVW1DLE1BQXhCLENBQVA7QUFDSCxTOztBQUVZeEMsWSxFQUFNO0FBQ2YsZ0JBQUltQyxTQUFTLEtBQUtqQyxRQUFMLENBQWNGLEtBQUttQyxNQUFuQixDQUFiOztBQUVBLGdCQUFJLEVBQUVBLGtCQUFrQkwsc0JBQXBCLENBQUosRUFBdUM7QUFDbkMsc0JBQU0sSUFBSVIsbUJBQUosQ0FBaUJ0QixLQUFLSyxJQUF0QixFQUE0Qiw0QkFBNUIsQ0FBTjtBQUNIOztBQUVELGdCQUFJSixRQUFRLEtBQUtDLFFBQUwsQ0FBY0YsS0FBS0MsS0FBbkIsQ0FBWjtBQUNBa0MsbUJBQU9NLEdBQVAsQ0FBV3pDLEtBQUtLLElBQWhCLEVBQXNCSixLQUF0QjtBQUNILFM7O0FBRWNELFksRUFBTTtBQUNqQixnQkFBSUcsV0FBVyxLQUFLMUIsTUFBTCxDQUFZZ0IsR0FBWixDQUFnQk8sSUFBaEIsQ0FBZjtBQUNBLGdCQUFJMEMsYUFBYSxLQUFLbEUsV0FBTCxDQUFpQm1FLEtBQWpCLENBQXVCeEMsUUFBdkIsRUFBaUMsT0FBakMsQ0FBakI7QUFDQTtBQUNBLGdCQUFJZ0MsU0FBUyxLQUFLM0QsV0FBTCxDQUFpQm1FLEtBQWpCLENBQXVCeEMsV0FBVyxDQUFsQyxFQUFxQyxNQUFyQyxDQUFiO0FBQ0EsZ0JBQUl5QyxTQUFTRixXQUFXRyxVQUFYLENBQXNCVixNQUF0QixFQUE4Qm5DLEtBQUs0QyxNQUFMLENBQVlKLE1BQTFDLENBQWI7QUFDQSxnQkFBSUksVUFBVSxJQUFkLEVBQW9CO0FBQ2hCLHNCQUFNLElBQUl0QixtQkFBSixDQUFpQnRCLEtBQUs0QyxNQUF0QjtBQUNGLHlDQUF5QjVDLEtBQUs0QyxNQUFMLENBQVlKLE1BQXJDLEdBQThDLElBRDVDLENBQU47QUFFSDtBQUNELG1CQUFPSSxNQUFQO0FBQ0gsUzs7QUFFYTVDLFksRUFBTTtBQUNoQixtQkFBTyxLQUFLOEMsY0FBTCxDQUFvQjlDLEtBQUsrQyxPQUF6QixFQUFrQy9DLElBQWxDLENBQVA7QUFDSCxTOztBQUVjQSxZLEVBQU07QUFDakIsZ0JBQUlRLFFBQVEsS0FBS04sUUFBTCxDQUFjRixLQUFLUSxLQUFuQixDQUFaO0FBQ0Esb0JBQVFSLEtBQUtTLFFBQUwsQ0FBY0MsSUFBdEI7QUFDSSxxQkFBS3hDLFVBQVU4RSxJQUFmO0FBQ0ksMkJBQU8sQ0FBQyxLQUFLVixRQUFMLENBQWM5QixLQUFkLENBQVI7QUFDSixxQkFBS3RDLFVBQVVpRCxLQUFmO0FBQ0kseUJBQUs4QixrQkFBTCxDQUF3QmpELEtBQUtTLFFBQTdCLEVBQXVDRCxLQUF2QztBQUNBLDJCQUFRLENBQUMsQ0FBRixHQUFPMEMsV0FBVzFDLEtBQVgsQ0FBZCxDQUxSOzs7QUFRQTtBQUNBLG1CQUFPLElBQVA7QUFDSCxTOztBQUVpQlIsWSxFQUFNO0FBQ3BCLG1CQUFPLEtBQUs4QyxjQUFMLENBQW9COUMsS0FBS0ssSUFBekIsRUFBK0JMLElBQS9CLENBQVA7QUFDSCxTOztBQUVjSyxZLEVBQU1MLEksRUFBTTtBQUN2QixnQkFBSUcsV0FBVyxLQUFLMUIsTUFBTCxDQUFZZ0IsR0FBWixDQUFnQk8sSUFBaEIsQ0FBZjtBQUNBLGdCQUFJRyxZQUFZLElBQVosSUFBb0JBLFlBQVlnRCxTQUFwQyxFQUErQztBQUMzQyx1QkFBTyxLQUFLM0UsV0FBTCxDQUFpQm1FLEtBQWpCLENBQXVCeEMsUUFBdkIsRUFBaUNFLEtBQUttQyxNQUF0QyxDQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sS0FBS2xFLE9BQUwsQ0FBYW1CLEdBQWIsQ0FBaUJZLElBQWpCLENBQVA7QUFDSDtBQUNKLFM7O0FBRWtCSSxnQixFQUFVMkMsTyxFQUFTO0FBQ2xDLGdCQUFJLE9BQU9BLE9BQVAsSUFBa0IsUUFBdEIsRUFBZ0M7QUFDaEMsa0JBQU0sSUFBSTlCLG1CQUFKLENBQWlCYixRQUFqQixFQUEyQix5QkFBM0IsQ0FBTjtBQUNILFM7O0FBRW1CQSxnQixFQUFVRixJLEVBQU1DLEssRUFBTztBQUN2QyxnQkFBSSxPQUFPRCxJQUFQLElBQWUsUUFBZixJQUEyQixPQUFPQyxLQUFQLElBQWdCLFFBQS9DLEVBQXlEO0FBQ3pELGtCQUFNLElBQUljLG1CQUFKLENBQWlCYixRQUFqQixFQUEyQiwyQkFBM0IsQ0FBTjtBQUNILFM7O0FBRVEwQixjLEVBQVE7QUFDYixnQkFBSUEsVUFBVSxJQUFWLElBQWtCQSxVQUFVZ0IsU0FBaEMsRUFBMkMsT0FBTyxLQUFQO0FBQzNDLGdCQUFJLE9BQU9oQixNQUFQLElBQWlCLFNBQXJCLEVBQWdDLE9BQU9BLE1BQVA7QUFDaEMsZ0JBQUksT0FBT0EsTUFBUCxJQUFpQixRQUFyQixFQUErQixPQUFPQSxTQUFTLENBQWhCO0FBQy9CLG1CQUFPLElBQVA7QUFDSCxTOztBQUVPNUIsWSxFQUFNQyxLLEVBQU87QUFDakIsZ0JBQUlELFFBQVEsSUFBUixJQUFnQkMsU0FBUyxJQUE3QixFQUFtQyxPQUFPLElBQVA7QUFDbkMsZ0JBQUlELFFBQVE0QyxTQUFSLElBQXFCM0MsU0FBUzJDLFNBQWxDLEVBQTZDLE9BQU8sSUFBUDtBQUM3QyxnQkFBSTVDLFFBQVEsSUFBUixJQUFnQkEsUUFBUTRDLFNBQTVCLEVBQXVDLE9BQU8sS0FBUDtBQUN2QyxtQkFBTzVDLFFBQVFDLEtBQWY7QUFDSCxTOztBQUVTMkIsYyxFQUFRO0FBQ2QsZ0JBQUlBLFVBQVUsSUFBVixJQUFrQkEsVUFBVWdCLFNBQWhDLEVBQTJDLE9BQU8sS0FBUDtBQUMzQyxnQkFBSSxPQUFPaEIsTUFBUCxJQUFpQixRQUFyQixFQUErQjtBQUMzQixvQkFBSWtCLE9BQU9sQixPQUFPZCxRQUFQLEVBQVg7QUFDQSxvQkFBSWdDLEtBQUtDLFFBQUwsQ0FBYyxJQUFkLENBQUosRUFBeUI7QUFDckJELDJCQUFPQSxLQUFLRSxTQUFMLENBQWUsQ0FBZixFQUFrQkYsS0FBSzlELE1BQUwsR0FBYyxDQUFoQyxDQUFQO0FBQ0g7QUFDRCx1QkFBTzhELElBQVA7QUFDSDtBQUNELG1CQUFPbEIsT0FBT2QsUUFBUCxFQUFQO0FBQ0gsUzs7QUFFUXJCLFksRUFBTTtBQUNYLG1CQUFPQSxLQUFLd0QsTUFBTCxDQUFZLElBQVosQ0FBUDtBQUNILFM7O0FBRU9DLFksRUFBTTtBQUNWLG1CQUFPQSxLQUFLRCxNQUFMLENBQVksSUFBWixDQUFQO0FBQ0gsUzs7QUFFT3hELFksRUFBTTBELEssRUFBTztBQUNqQixpQkFBS2pGLE1BQUwsQ0FBWWdFLEdBQVosQ0FBZ0J6QyxJQUFoQixFQUFzQjBELEtBQXRCO0FBQ0gsUzs7QUFFWXRFLGtCLEVBQVl1RSxHLEVBQUs7QUFDMUIsZ0JBQUlDLFdBQVcsS0FBS3BGLFdBQXBCO0FBQ0EsZ0JBQUk7QUFDQSxxQkFBS0EsV0FBTCxHQUFtQm1GLEdBQW5CO0FBQ0EscUJBQUssSUFBSXJFLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsV0FBV0csTUFBL0IsRUFBdUNELEdBQXZDLEVBQTRDO0FBQ3hDLHlCQUFLRSxPQUFMLENBQWFKLFdBQVdFLENBQVgsQ0FBYjtBQUNIO0FBQ0osYUFMRCxTQUtVO0FBQ04scUJBQUtkLFdBQUwsR0FBbUJvRixRQUFuQjtBQUNIO0FBQ0osUzs7QUFFY0gsWSxFQUFNO0FBQ2pCLGlCQUFLSSxZQUFMLENBQWtCSixLQUFLckUsVUFBdkIsRUFBbUMsSUFBSWIscUJBQUosQ0FBZ0IsS0FBS0MsV0FBckIsQ0FBbkM7QUFDSCxTOztBQUVjaUYsWSxFQUFNO0FBQ2pCcEUsMEJBQUl5RSxJQUFKLENBQVMsS0FBS3hGLE9BQWQ7QUFDQSxnQkFBSW9FLGFBQWEsSUFBakI7QUFDQSxnQkFBSWUsS0FBS2YsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUN6QkEsNkJBQWEsS0FBS3hDLFFBQUwsQ0FBY3VELEtBQUtmLFVBQW5CLENBQWI7QUFDQSxvQkFBSSxFQUFFQSxzQkFBc0JYLG1CQUF4QixDQUFKLEVBQXdDO0FBQ3BDLDBCQUFNLElBQUlULG1CQUFKLENBQWlCbUMsS0FBS2YsVUFBTCxDQUFnQnJDLElBQWpDO0FBQ0YsaURBREUsQ0FBTjtBQUVIO0FBQ0o7QUFDRCxpQkFBSzdCLFdBQUwsQ0FBaUJHLE1BQWpCLENBQXdCOEUsS0FBS3BELElBQUwsQ0FBVW1DLE1BQWxDLEVBQTBDLElBQTFDOztBQUVBLGdCQUFJaUIsS0FBS2YsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUN6QixxQkFBS2xFLFdBQUwsR0FBbUIsSUFBSUQscUJBQUosQ0FBZ0IsS0FBS0MsV0FBckIsQ0FBbkI7QUFDQSxxQkFBS0EsV0FBTCxDQUFpQkcsTUFBakIsQ0FBd0IsT0FBeEIsRUFBaUMrRCxVQUFqQztBQUNIOztBQUVELGdCQUFJcUIsVUFBVSxJQUFJckYsaUJBQUosRUFBZDtBQUNBLGlCQUFLLElBQUlZLElBQUksQ0FBYixFQUFnQkEsSUFBSW1FLEtBQUtNLE9BQUwsQ0FBYXhFLE1BQWpDLEVBQXlDRCxHQUF6QyxFQUE4QztBQUMxQyxvQkFBSTBFLEtBQUssSUFBSTdGLGdCQUFnQjBELFlBQXBCLENBQWlDNEIsS0FBS00sT0FBTCxDQUFhekUsQ0FBYixDQUFqQyxFQUFrRCxLQUFLZCxXQUF2RCxFQUFvRWlGLEtBQUtNLE9BQUwsQ0FBYXpFLENBQWIsRUFBZ0JlLElBQWhCLENBQXFCbUMsTUFBckIsSUFBK0IsTUFBbkcsQ0FBVDtBQUNBdUIsd0JBQVF0QixHQUFSLENBQVlnQixLQUFLTSxPQUFMLENBQWF6RSxDQUFiLEVBQWdCZSxJQUFoQixDQUFxQm1DLE1BQWpDLEVBQXlDd0IsRUFBekM7QUFDSDs7QUFFRDNFLDBCQUFJeUUsSUFBSixDQUFTTCxJQUFUO0FBQ0EsZ0JBQUlRLFFBQVEsSUFBSWxDLG1CQUFKLENBQWMwQixLQUFLcEQsSUFBTCxDQUFVbUMsTUFBeEIsRUFBZ0NFLFVBQWhDLEVBQTRDcUIsT0FBNUMsQ0FBWjs7QUFFQSxnQkFBSU4sS0FBS2YsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUN6QixxQkFBS2xFLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxDQUFpQjBGLFNBQXBDO0FBQ0g7O0FBRUQsaUJBQUsxRixXQUFMLENBQWlCOEIsTUFBakIsQ0FBd0JtRCxLQUFLcEQsSUFBN0IsRUFBbUM0RCxLQUFuQztBQUNILFM7O0FBRW1CUixZLEVBQU07QUFDdEIsaUJBQUt2RCxRQUFMLENBQWN1RCxLQUFLckIsVUFBbkI7QUFDSCxTOztBQUVpQnFCLFksRUFBTTtBQUNwQixnQkFBSU8sS0FBSyxJQUFJN0YsZ0JBQWdCMEQsWUFBcEIsQ0FBaUM0QixJQUFqQyxFQUF1QyxLQUFLakYsV0FBNUMsRUFBeUQsS0FBekQsQ0FBVDtBQUNBLGlCQUFLQSxXQUFMLENBQWlCRyxNQUFqQixDQUF3QjhFLEtBQUtwRCxJQUFMLENBQVVtQyxNQUFsQyxFQUEwQ3dCLEVBQTFDO0FBQ0gsUzs7QUFFV1AsWSxFQUFNO0FBQ2QsZ0JBQUksS0FBS25CLFFBQUwsQ0FBYyxLQUFLcEMsUUFBTCxDQUFjdUQsS0FBS1UsU0FBbkIsQ0FBZCxDQUFKLEVBQWtEO0FBQzlDLHFCQUFLM0UsT0FBTCxDQUFhaUUsS0FBS1csVUFBbEI7QUFDSCxhQUZELE1BRU8sSUFBSVgsS0FBS1ksVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUNoQyxxQkFBSzdFLE9BQUwsQ0FBYWlFLEtBQUtZLFVBQWxCO0FBQ0g7QUFDSixTOztBQUVjWixZLEVBQU07QUFDakIsZ0JBQUl4RCxRQUFRLEtBQUtDLFFBQUwsQ0FBY3VELEtBQUtyQixVQUFuQixDQUFaO0FBQ0F6QyxvQkFBUUMsR0FBUixDQUFZLEtBQUswRSxTQUFMLENBQWVyRSxLQUFmLENBQVo7QUFDSCxTOztBQUVld0QsWSxFQUFNO0FBQ2xCLGdCQUFJeEQsUUFBUSxJQUFaO0FBQ0EsZ0JBQUl3RCxLQUFLeEQsS0FBTCxJQUFjLElBQWxCLEVBQXdCO0FBQ3BCQSx3QkFBUSxLQUFLQyxRQUFMLENBQWN1RCxLQUFLeEQsS0FBbkIsQ0FBUjtBQUNIO0FBQ0Qsa0JBQU0sSUFBSXNFLGNBQUosQ0FBWWQsS0FBS1YsT0FBakIsRUFBMEI5QyxLQUExQixDQUFOO0FBQ0gsUzs7QUFFWXdELFksRUFBTTtBQUNmLGdCQUFJeEQsUUFBUSxJQUFaO0FBQ0EsZ0JBQUl3RCxLQUFLZSxXQUFMLElBQW9CLElBQXhCLEVBQThCO0FBQzFCdkUsd0JBQVEsS0FBS0MsUUFBTCxDQUFjdUQsS0FBS2UsV0FBbkIsQ0FBUjtBQUNIO0FBQ0QsaUJBQUtoRyxXQUFMLENBQWlCRyxNQUFqQixDQUF3QjhFLEtBQUtwRCxJQUFMLENBQVVtQyxNQUFsQyxFQUEwQ3ZDLEtBQTFDO0FBQ0gsUzs7QUFFY3dELFksRUFBTTtBQUNqQixtQkFBTyxLQUFLbkIsUUFBTCxDQUFjLEtBQUtwQyxRQUFMLENBQWN1RCxLQUFLVSxTQUFuQixDQUFkLENBQVAsRUFBcUQ7QUFDakQscUJBQUszRSxPQUFMLENBQWFpRSxLQUFLZ0IsSUFBbEI7QUFDSDtBQUNKLFMsOENBdlZnQnJHLFciLCJmaWxlIjoiaW50ZXJwcmV0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCAqIGFzIFN0bXQgZnJvbSBcIi4vc3RtdFwiO1xuaW1wb3J0ICogYXMgVG9rZW5UeXBlIGZyb20gJy4vdG9rZW5UeXBlJztcbmltcG9ydCB7UnVudGltZUVycm9yLCBSZXR1cm5zfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi90b2tlblwiO1xuaW1wb3J0IEVudmlyb25tZW50IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IEJ1bmEgZnJvbSAnLi9idW5hJztcbmltcG9ydCBIYXNoTWFwIGZyb20gJ2hhc2htYXAnO1xuaW1wb3J0ICogYXMgZGVmYXVsdEZ1bmN0aW9uIGZyb20gJy4vYnVuYUZ1bmN0aW9uJztcbmltcG9ydCBCdW5hQ2xhc3MgZnJvbSAnLi9idW5hQ2xhc3MnO1xuaW1wb3J0IEJ1bmFJbnN0YW5jZSBmcm9tIFwiLi9idW5hSW5zdGFuY2VcIjtcbmltcG9ydCBhYmkgZnJvbSBcIi4vYWJpXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJwcmV0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICAgICAgdGhpcy5nbG9iYWxzID0gbmV3IEVudmlyb25tZW50KCk7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSB0aGlzLmdsb2JhbHM7XG4gICAgICAgIHRoaXMubG9jYWxzID0gbmV3IEhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcImNsb2NrXCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvbik7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJCYWxhbmNlXCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvbkJhbGFuY2UoZGF0YSkpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiTWVzc2FnZVwiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25Nc2coZGF0YSkpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiU3RhdHVzXCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvblN0YXR1cyhkYXRhKSk7XG4gICAgICAgIHRoaXMuZ2xvYmFscy5kZWZpbmUoXCJHZXRcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuRnVuY3Rpb25HZXQpO1xuICAgICAgICB0aGlzLmdsb2JhbHMuZGVmaW5lKFwiU2V0T2JqZWN0XCIsIG5ldyBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0KGRhdGEpKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIlNldEJhbGFuY2VcIiwgbmV3IGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0RnVuY3Rpb25TZXRCYWxhbmNlKGRhdGEpKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIlNldFN0YXR1c1wiLCBuZXcgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRGdW5jdGlvblNldFN0YXR1cyhkYXRhKSlcbiAgICB9XG5cbiAgICBpbnRlcnByZXQoc3RhdGVtZW50cywgZGF0YSkge1xuICAgICAgICBhYmkuYWJpID0gW107XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGUoc3RhdGVtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhLmFiaSA9IGFiaS5nZXQoKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIEJ1bmEuZ2V0SW5zdGFuY2UoKS5ydW50aW1lRXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcikge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLmxvY2Fscy5nZXQoZXhwcik7XG4gICAgICAgIGlmIChkaXN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50LmFzc2lnbkF0KGRpc3RhbmNlLCBleHByLm5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFscy5hc3NpZ24oZXhwci5uYW1lLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHZpc2l0QmluYXJ5RXhwcihleHByKSB7XG4gICAgICAgIGxldCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuXG4gICAgICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5CQU5HX0VRVUFMOlxuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5pc0VxdWFsKGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkVRVUFMX0VRVUFMOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRXF1YWwobGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuR1JFQVRFUjpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5HUkVBVEVSX0VRVUFMOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5MRVNTOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkxFU1NfRVFVQUw6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA8PSByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLk1JTlVTOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLlBMVVM6XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsZWZ0ID09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHJpZ2h0ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsZWZ0ID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHJpZ2h0ID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQudG9TdHJpbmcoKSArIHJpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGVmdCAtPiBcIiwgbGVmdCwgXCIgcmlnaHQgLT4gXCIsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIub3BlcmF0b3IsXG4gICAgICAgICAgICAgICAgICAgIFwiT3BlcmFuZHMgbXVzdCBiZSB0d28gbnVtYmVycyBvciB0d28gc3RyaW5ncy5cIik7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5TTEFTSDpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIGlmIChyaWdodCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5vcGVyYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiTnVtYmVyYXRvciBjYW4gbm90IGJlIHplcm8uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuU1RBUjpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmlzaXRDYWxsRXhwcihleHByKSB7XG4gICAgICAgIGxldCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2FsbGVlKTtcbiAgICAgICAgbGV0IGFyZ3MgPSBleHByLmFyZ3MubWFwKGFyZyA9PiB0aGlzLmV2YWx1YXRlKGFyZykpO1xuXG4gICAgICAgIGlmICghKGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5CdW5hRnVuY3Rpb24gfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRCdW5hRnVuY3Rpb25cbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uU3RhdHVzXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bmFGdW5jdGlvbkJhbGFuY2VcbiAgICAgICAgICAgIHx8IGNhbGxlZSBpbnN0YW5jZW9mIGRlZmF1bHRGdW5jdGlvbi5EZWZhdWx0QnVuYUZ1bmN0aW9uTXNnXG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEJ1bkZ1bmN0aW9uR2V0XG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0T2JqZWN0XG4gICAgICAgICAgICB8fCBjYWxsZWUgaW5zdGFuY2VvZiBkZWZhdWx0RnVuY3Rpb24uRGVmYXVsdEZ1bmN0aW9uU2V0QmFsYW5jZVxuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgZGVmYXVsdEZ1bmN0aW9uLkRlZmF1bHRGdW5jdGlvblNldFN0YXR1c1xuICAgICAgICAgICAgfHwgY2FsbGVlIGluc3RhbmNlb2YgQnVuYUluc3RhbmNlIHx8IGNhbGxlZSBpbnN0YW5jZW9mIEJ1bmFDbGFzcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5wYXJlbixcbiAgICAgICAgICAgICAgICBcIkNhbiBvbmx5IGNhbGwgZnVuY3Rpb25zIGFuZCBjbGFzc2VzLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPSBjYWxsZWUuYXJpdHkoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLnBhcmVuLFxuICAgICAgICAgICAgICAgIFwiRXhwZWN0ZWQgXCIgKyBjYWxsZWUuYXJpdHkoKSArIFwiIGFyZ3VtZW50cyBidXQgZ290IFwiICsgYXJncy5sZW5ndGggKyBcIi5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbGxlZS5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgIH1cblxuICAgIHZpc2l0R2V0RXhwcihleHByKSB7XG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLmV2YWx1YXRlKGV4cHIub2JqZWN0KTtcbiAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEJ1bmFJbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdC5nZXQoZXhwci5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5uYW1lLFxuICAgICAgICAgICAgXCJPbmx5IGluc3RhbmNlIGhhdmUgcHJvcGVydGllcy5cIik7XG4gICAgfVxuXG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgICB9XG5cbiAgICB2aXNpdExvZ2ljYWxFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICAgICAgaWYgKGV4cHIub3BlcmF0b3IudHlwZSA9PSBUb2tlblR5cGUuT1IpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVHJ1dGh5KGxlZnQpKSByZXR1cm4gbGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1RydXRoeShsZWZ0KSkgcmV0dXJuIGxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICB9XG5cbiAgICB2aXNpdE1zZ0V4cHIoZXhwcikge1xuICAgICAgICBpZiAoZXhwci52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlc1tleHByLm5hbWUubGV4ZW1lXSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlc1tleHByLm5hbWUubGV4ZW1lXTtcbiAgICB9XG5cbiAgICB2aXNpdFNldEV4cHIoZXhwcikge1xuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5ldmFsdWF0ZShleHByLm9iamVjdCk7XG5cbiAgICAgICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgQnVuYUluc3RhbmNlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm5hbWUsIFwiT25seSBpbnN0YW5jZSBoYXZlIGZpZWxkcy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgICAgICBvYmplY3Quc2V0KGV4cHIubmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHZpc2l0U3VwZXJFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdGhpcy5sb2NhbHMuZ2V0KGV4cHIpO1xuICAgICAgICBsZXQgc3VwZXJjbGFzcyA9IHRoaXMuZW52aXJvbm1lbnQuZ2V0QXQoZGlzdGFuY2UsIFwic3VwZXJcIik7XG4gICAgICAgIC8vICd0aGlzJyBpcyBhbHdheXMgb25lIGxldmVsIG5lYXJlciB0aGFuICdzdXBlcicgcyBlbnZyaW9ubWVudFxuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5lbnZpcm9ubWVudC5nZXRBdChkaXN0YW5jZSAtIDEsIFwidGhpc1wiKTtcbiAgICAgICAgbGV0IG1ldGhvZCA9IHN1cGVyY2xhc3MuZmluZE1ldGhvZChvYmplY3QsIGV4cHIubWV0aG9kLmxleGVtZSk7XG4gICAgICAgIGlmIChtZXRob2QgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm1ldGhvZCxcbiAgICAgICAgICAgICAgICBcIlVuZGVmaW5lZCBwcm9wZXJ0eSAnXCIgKyBleHByLm1ldGhvZC5sZXhlbWUgKyBcIicuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2Q7XG4gICAgfVxuXG4gICAgdmlzaXRUaGlzRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvb2tVcFZhcmlhYmxlKGV4cHIua2V5d29yZCwgZXhwcik7XG4gICAgfVxuXG4gICAgdmlzaXRVbmFyeUV4cHIoZXhwcikge1xuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgICAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuQkFORzpcbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMuaXNUcnV0aHkocmlnaHQpO1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuTUlOVVM6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmQoZXhwci5vcGVyYXRvciwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoLTEpICogcGFyc2VGbG9hdChyaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVbnJlYWNoYWJsZS5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5sb29rVXBWYXJpYWJsZShleHByLm5hbWUsIGV4cHIpO1xuICAgIH1cblxuICAgIGxvb2tVcFZhcmlhYmxlKG5hbWUsIGV4cHIpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdGhpcy5sb2NhbHMuZ2V0KGV4cHIpO1xuICAgICAgICBpZiAoZGlzdGFuY2UgIT0gbnVsbCAmJiBkaXN0YW5jZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVudmlyb25tZW50LmdldEF0KGRpc3RhbmNlLCBuYW1lLmxleGVtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nbG9iYWxzLmdldChuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrTnVtYmVyT3BlcmFuZChvcGVyYXRvciwgb3BlcmFuZCkge1xuICAgICAgICBpZiAodHlwZW9mIG9wZXJhbmQgPT0gXCJudW1iZXJcIikgcmV0dXJuO1xuICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKG9wZXJhdG9yLCBcIk9wZXJhbmQgbXVzdCBiZSBudW1iZXIuXCIpO1xuICAgIH1cblxuICAgIGNoZWNrTnVtYmVyT3BlcmFuZHMob3BlcmF0b3IsIGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGVmdCA9PSBcIm51bWJlclwiICYmIHR5cGVvZiByaWdodCA9PSBcIm51bWJlclwiKSByZXR1cm47XG4gICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3Iob3BlcmF0b3IsIFwiT3BlcmFuZHMgbXVzdCBiZSBudW1iZXJzLlwiKTtcbiAgICB9XG5cbiAgICBpc1RydXRoeShvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdCA9PSBudWxsIHx8IG9iamVjdCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gXCJib29sZWFuXCIpIHJldHVybiBvYmplY3Q7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09IFwibnVtYmVyXCIpIHJldHVybiBvYmplY3QgPiAwO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpc0VxdWFsKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgIGlmIChsZWZ0ID09IG51bGwgJiYgcmlnaHQgPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChsZWZ0ID09IHVuZGVmaW5lZCAmJiByaWdodCA9PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAobGVmdCA9PSBudWxsIHx8IGxlZnQgPT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBsZWZ0ID09IHJpZ2h0O1xuICAgIH1cblxuICAgIHN0cmluZ2lmeShvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdCA9PSBudWxsIHx8IG9iamVjdCA9PSB1bmRlZmluZWQpIHJldHVybiBcIm5pbFwiO1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IG9iamVjdC50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHRleHQuZW5kc1dpdGgoXCIuMFwiKSkge1xuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGV2YWx1YXRlKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIGV4cHIuYWNjZXB0KHRoaXMpO1xuICAgIH1cblxuICAgIGV4ZWN1dGUoc3RtdCkge1xuICAgICAgICByZXR1cm4gc3RtdC5hY2NlcHQodGhpcyk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZShleHByLCBkZXB0aCkge1xuICAgICAgICB0aGlzLmxvY2Fscy5zZXQoZXhwciwgZGVwdGgpO1xuICAgIH1cblxuICAgIGV4ZWN1dGVCbG9jayhzdGF0ZW1lbnRzLCBlbnYpIHtcbiAgICAgICAgbGV0IHByZXZpb3VzID0gdGhpcy5lbnZpcm9ubWVudDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnY7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGUoc3RhdGVtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gcHJldmlvdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aXNpdEJsb2NrU3RtdChzdG10KSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUJsb2NrKHN0bXQuc3RhdGVtZW50cywgbmV3IEVudmlyb25tZW50KHRoaXMuZW52aXJvbm1lbnQpKTtcbiAgICB9XG5cbiAgICB2aXNpdENsYXNzU3RtdChzdG10KSB7XG4gICAgICAgIGFiaS5wdXNoKHRoaXMuZ2xvYmFscyk7XG4gICAgICAgIGxldCBzdXBlcmNsYXNzID0gbnVsbDtcbiAgICAgICAgaWYgKHN0bXQuc3VwZXJjbGFzcyAhPSBudWxsKSB7XG4gICAgICAgICAgICBzdXBlcmNsYXNzID0gdGhpcy5ldmFsdWF0ZShzdG10LnN1cGVyY2xhc3MpO1xuICAgICAgICAgICAgaWYgKCEoc3VwZXJjbGFzcyBpbnN0YW5jZW9mIEJ1bmFDbGFzcykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKHN0bXQuc3VwZXJjbGFzcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcIlN1cGVyY2xhc3MgbXVzdCBiZSBhIGNsYXNzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVudmlyb25tZW50LmRlZmluZShzdG10Lm5hbWUubGV4ZW1lLCBudWxsKTtcblxuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQodGhpcy5lbnZpcm9ubWVudCk7XG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50LmRlZmluZShcInN1cGVyXCIsIHN1cGVyY2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1ldGhvZHMgPSBuZXcgSGFzaE1hcCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0bXQubWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGZuID0gbmV3IGRlZmF1bHRGdW5jdGlvbi5CdW5hRnVuY3Rpb24oc3RtdC5tZXRob2RzW2ldLCB0aGlzLmVudmlyb25tZW50LCBzdG10Lm1ldGhvZHNbaV0ubmFtZS5sZXhlbWUgPT0gXCJpbml0XCIpO1xuICAgICAgICAgICAgbWV0aG9kcy5zZXQoc3RtdC5tZXRob2RzW2ldLm5hbWUubGV4ZW1lLCBmbik7XG4gICAgICAgIH1cblxuICAgICAgICBhYmkucHVzaChzdG10KVxuICAgICAgICBsZXQga2xhc3MgPSBuZXcgQnVuYUNsYXNzKHN0bXQubmFtZS5sZXhlbWUsIHN1cGVyY2xhc3MsIG1ldGhvZHMpO1xuXG4gICAgICAgIGlmIChzdG10LnN1cGVyY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IHRoaXMuZW52aXJvbm1lbnQuZW5jbG9zaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5hc3NpZ24oc3RtdC5uYW1lLCBrbGFzcyk7XG4gICAgfVxuXG4gICAgdmlzaXRFeHByZXNzaW9uU3RtdChzdG10KSB7XG4gICAgICAgIHRoaXMuZXZhbHVhdGUoc3RtdC5leHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICB2aXNpdEZ1bmN0aW9uU3RtdChzdG10KSB7XG4gICAgICAgIGxldCBmbiA9IG5ldyBkZWZhdWx0RnVuY3Rpb24uQnVuYUZ1bmN0aW9uKHN0bXQsIHRoaXMuZW52aXJvbm1lbnQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5kZWZpbmUoc3RtdC5uYW1lLmxleGVtZSwgZm4pO1xuICAgIH1cblxuICAgIHZpc2l0SWZTdG10KHN0bXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUcnV0aHkodGhpcy5ldmFsdWF0ZShzdG10LmNvbmRpdGlvbikpKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGUoc3RtdC50aGVuQnJhbmNoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LmVsc2VCcmFuY2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0bXQuZWxzZUJyYW5jaCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aXNpdFByaW50U3RtdChzdG10KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoc3RtdC5leHByZXNzaW9uKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICB9XG5cbiAgICB2aXNpdFJldHVyblN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoc3RtdC52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoc3RtdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJldHVybnMoc3RtdC5rZXl3b3JkLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdmlzaXRWYXJTdG10KHN0bXQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKHN0bXQuaW5pdGlhbGl6ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKHN0bXQuaW5pdGlhbGl6ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKHN0bXQubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICB2aXNpdFdoaWxlU3RtdChzdG10KSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmlzVHJ1dGh5KHRoaXMuZXZhbHVhdGUoc3RtdC5jb25kaXRpb24pKSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0bXQuYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG59Il19