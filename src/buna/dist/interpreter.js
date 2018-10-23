"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _expr = require("./expr");var Expr = _interopRequireWildcard(_expr);
var _stmt = require("./stmt");var Stmt = _interopRequireWildcard(_stmt);
var _tokenType = require("./tokenType");var TokenType = _interopRequireWildcard(_tokenType);
var _error = require("./error");
var _token = require("./token");var _token2 = _interopRequireDefault(_token);
var _environment = require("./environment");var _environment2 = _interopRequireDefault(_environment);
var _buna = require("./buna");var _buna2 = _interopRequireDefault(_buna);
var _hashmap = require("hashmap");var _hashmap2 = _interopRequireDefault(_hashmap);
var _bunaFunction = require("./bunaFunction");
var _bunaClass = require("./bunaClass");var _bunaClass2 = _interopRequireDefault(_bunaClass);
var _bunaInstance = require("./bunaInstance");var _bunaInstance2 = _interopRequireDefault(_bunaInstance);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Interpreter = function () {
    function Interpreter() {(0, _classCallCheck3.default)(this, Interpreter);
        this.globals = new _environment2.default();
        this.environment = this.globals;
        this.locals = new _hashmap2.default();
        this.globals.define("msg_sender", new _bunaFunction.DefaultBunaFunction());
    }(0, _createClass3.default)(Interpreter, [{ key: "interpret", value: function interpret(

        statements) {
            try {
                for (var i = 0; i < statements.length; i++) {
                    this.execute(statements[i]);
                }
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
                case TokenType.BANG_EQUAL:return !this.isEqual(left, right);
                case TokenType.EQUAL_EQUAL:return this.isEqual(left, right);
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

            if (!(callee instanceof _bunaFunction.BunaFunction || callee instanceof _bunaFunction.DefaultBunaFunction || callee instanceof _bunaInstance2.default || callee instanceof _bunaClass2.default)) {
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

        epxr) {
            if (expr.method.lexeme == "sender") {
                return "0x2a7e5bdeb35fca94a6ac0027d1360b1012e56f9d";
            }

            return "";
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
                var fn = new _bunaFunction.BunaFunction(stmt.methods[i], this.environment, stmt.methods[i].name.lexeme == "init");
                methods.set(stmt.methods[i].name.lexeme, fn);
            }

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
            var fn = new _bunaFunction.BunaFunction(stmt, this.environment, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9pbnRlcnByZXRlci5qcyJdLCJuYW1lcyI6WyJFeHByIiwiU3RtdCIsIlRva2VuVHlwZSIsIkludGVycHJldGVyIiwiZ2xvYmFscyIsIkVudmlyb25tZW50IiwiZW52aXJvbm1lbnQiLCJsb2NhbHMiLCJIYXNoTWFwIiwiZGVmaW5lIiwiRGVmYXVsdEJ1bmFGdW5jdGlvbiIsInN0YXRlbWVudHMiLCJpIiwibGVuZ3RoIiwiZXhlY3V0ZSIsImUiLCJjb25zb2xlIiwibG9nIiwiQnVuYSIsImdldEluc3RhbmNlIiwicnVudGltZUVycm9yIiwiZXhwciIsInZhbHVlIiwiZXZhbHVhdGUiLCJkaXN0YW5jZSIsImdldCIsImFzc2lnbkF0IiwibmFtZSIsImFzc2lnbiIsImxlZnQiLCJyaWdodCIsIm9wZXJhdG9yIiwidHlwZSIsIkJBTkdfRVFVQUwiLCJpc0VxdWFsIiwiRVFVQUxfRVFVQUwiLCJHUkVBVEVSIiwiY2hlY2tOdW1iZXJPcGVyYW5kcyIsIkdSRUFURVJfRVFVQUwiLCJMRVNTIiwiTEVTU19FUVVBTCIsIk1JTlVTIiwiUExVUyIsInRvU3RyaW5nIiwiUnVudGltZUVycm9yIiwiU0xBU0giLCJTVEFSIiwiY2FsbGVlIiwiYXJncyIsIm1hcCIsImFyZyIsIkJ1bmFGdW5jdGlvbiIsIkJ1bmFJbnN0YW5jZSIsIkJ1bmFDbGFzcyIsInBhcmVuIiwiYXJpdHkiLCJjYWxsIiwib2JqZWN0IiwiZXhwcmVzc2lvbiIsIk9SIiwiaXNUcnV0aHkiLCJlcHhyIiwibWV0aG9kIiwibGV4ZW1lIiwic2V0Iiwic3VwZXJjbGFzcyIsImdldEF0IiwiZmluZE1ldGhvZCIsImxvb2tVcFZhcmlhYmxlIiwia2V5d29yZCIsIkJBTkciLCJjaGVja051bWJlck9wZXJhbmQiLCJwYXJzZUZsb2F0IiwidW5kZWZpbmVkIiwib3BlcmFuZCIsInRleHQiLCJlbmRzV2l0aCIsInN1YnN0cmluZyIsImFjY2VwdCIsInN0bXQiLCJkZXB0aCIsImVudiIsInByZXZpb3VzIiwiZXhlY3V0ZUJsb2NrIiwibWV0aG9kcyIsImZuIiwia2xhc3MiLCJlbmNsb3NpbmciLCJjb25kaXRpb24iLCJ0aGVuQnJhbmNoIiwiZWxzZUJyYW5jaCIsInN0cmluZ2lmeSIsIlJldHVybnMiLCJpbml0aWFsaXplciIsImJvZHkiXSwibWFwcGluZ3MiOiI2VUFBQSw4QixJQUFZQSxJO0FBQ1osOEIsSUFBWUMsSTtBQUNaLHdDLElBQVlDLFM7QUFDWjtBQUNBLGdDO0FBQ0EsNEM7QUFDQSw4QjtBQUNBLGtDO0FBQ0E7QUFDQSx3QztBQUNBLDhDOztBQUVxQkMsVztBQUNqQiwyQkFBYztBQUNWLGFBQUtDLE9BQUwsR0FBZSxJQUFJQyxxQkFBSixFQUFmO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQixLQUFLRixPQUF4QjtBQUNBLGFBQUtHLE1BQUwsR0FBYyxJQUFJQyxpQkFBSixFQUFkO0FBQ0EsYUFBS0osT0FBTCxDQUFhSyxNQUFiLENBQW9CLFlBQXBCLEVBQWtDLElBQUlDLGlDQUFKLEVBQWxDO0FBQ0gsSzs7QUFFU0Msa0IsRUFBWTtBQUNsQixnQkFBSTtBQUNBLHFCQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsV0FBV0UsTUFBL0IsRUFBdUNELEdBQXZDLEVBQTRDO0FBQ3hDLHlCQUFLRSxPQUFMLENBQWFILFdBQVdDLENBQVgsQ0FBYjtBQUNIO0FBQ0osYUFKRCxDQUlFLE9BQU9HLENBQVAsRUFBVTtBQUNSQyx3QkFBUUMsR0FBUixDQUFZRixDQUFaO0FBQ0FHLCtCQUFLQyxXQUFMLEdBQW1CQyxZQUFuQixDQUFnQ0wsQ0FBaEM7QUFDSDtBQUNKLFM7O0FBRWVNLFksRUFBTTtBQUNsQixnQkFBSUMsUUFBUSxLQUFLQyxRQUFMLENBQWNGLEtBQUtDLEtBQW5CLENBQVo7QUFDQSxnQkFBSUUsV0FBVyxLQUFLakIsTUFBTCxDQUFZa0IsR0FBWixDQUFnQkosSUFBaEIsQ0FBZjtBQUNBLGdCQUFJRyxZQUFZLElBQWhCLEVBQXNCO0FBQ2xCLHFCQUFLbEIsV0FBTCxDQUFpQm9CLFFBQWpCLENB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bEIsRUFBd0I7QUFDcEJBLHdCQUFRLEtBQUtDLFFBQUwsQ0FBY3dELEtBQUt6RCxLQUFuQixDQUFSO0FBQ0g7QUFDRCxrQkFBTSxJQUFJc0UsY0FBSixDQUFZYixLQUFLVixPQUFqQixFQUEwQi9DLEtBQTFCLENBQU47QUFDSCxTOztBQUVZeUQsWSxFQUFNO0FBQ2YsZ0JBQUl6RCxRQUFRLElBQVo7QUFDQSxnQkFBSXlELEtBQUtjLFdBQUwsSUFBb0IsSUFBeEIsRUFBOEI7QUFDMUJ2RSx3QkFBUSxLQUFLQyxRQUFMLENBQWN3RCxLQUFLYyxXQUFuQixDQUFSO0FBQ0g7QUFDRCxpQkFBS3ZGLFdBQUwsQ0FBaUJHLE1BQWpCLENBQXdCc0UsS0FBS3BELElBQUwsQ0FBVW9DLE1BQWxDLEVBQTBDekMsS0FBMUM7QUFDSCxTOztBQUVjeUQsWSxFQUFNO0FBQ2pCLG1CQUFPLEtBQUtuQixRQUFMLENBQWMsS0FBS3JDLFFBQUwsQ0FBY3dELEtBQUtTLFNBQW5CLENBQWQsQ0FBUCxFQUFxRDtBQUNqRCxxQkFBSzFFLE9BQUwsQ0FBYWlFLEtBQUtlLElBQWxCO0FBQ0g7QUFDSixTLDhDQWxVZ0IzRixXIiwiZmlsZSI6ImludGVycHJldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi9leHByXCI7XG5pbXBvcnQgKiBhcyBTdG10IGZyb20gXCIuL3N0bXRcIjtcbmltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQge1J1bnRpbWVFcnJvciwgUmV0dXJuc30gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4vdG9rZW5cIjtcbmltcG9ydCBFbnZpcm9ubWVudCBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCBCdW5hIGZyb20gJy4vYnVuYSc7XG5pbXBvcnQgSGFzaE1hcCBmcm9tICdoYXNobWFwJztcbmltcG9ydCB7RGVmYXVsdEJ1bmFGdW5jdGlvbiwgQnVuYUZ1bmN0aW9ufSBmcm9tICcuL2J1bmFGdW5jdGlvbic7XG5pbXBvcnQgQnVuYUNsYXNzIGZyb20gJy4vYnVuYUNsYXNzJztcbmltcG9ydCBCdW5hSW5zdGFuY2UgZnJvbSBcIi4vYnVuYUluc3RhbmNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVycHJldGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nbG9iYWxzID0gbmV3IEVudmlyb25tZW50KCk7XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSB0aGlzLmdsb2JhbHM7XG4gICAgICAgIHRoaXMubG9jYWxzID0gbmV3IEhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5nbG9iYWxzLmRlZmluZShcIm1zZ19zZW5kZXJcIiwgbmV3IERlZmF1bHRCdW5hRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIGludGVycHJldChzdGF0ZW1lbnRzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGUoc3RhdGVtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLnJ1bnRpbWVFcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2l0QXNzaWduRXhwcihleHByKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRoaXMubG9jYWxzLmdldChleHByKTtcbiAgICAgICAgaWYgKGRpc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQuYXNzaWduQXQoZGlzdGFuY2UsIGV4cHIubmFtZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxzLmFzc2lnbihleHByLm5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG5cbiAgICAgICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkJBTkdfRVFVQUw6IHJldHVybiAhdGhpcy5pc0VxdWFsKGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkVRVUFMX0VRVUFMOiByZXR1cm4gdGhpcy5pc0VxdWFsKGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkdSRUFURVI6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuR1JFQVRFUl9FUVVBTDpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuTEVTUzpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5MRVNTX0VRVUFMOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kcyhleHByLm9wZXJhdG9yLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5NSU5VUzpcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTnVtYmVyT3BlcmFuZHMoZXhwci5vcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFRva2VuVHlwZS5QTFVTOlxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGVmdCA9PSBcIm51bWJlclwiICYmIHR5cGVvZiByaWdodCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGVmdCA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiByaWdodCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0LnRvU3RyaW5nKCkgKyByaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxlZnQgLT4gXCIsIGxlZnQsIFwiIHJpZ2h0IC0+IFwiLCByaWdodCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm9wZXJhdG9yLFxuICAgICAgICAgICAgICAgICAgICBcIk9wZXJhbmRzIG11c3QgYmUgdHdvIG51bWJlcnMgb3IgdHdvIHN0cmluZ3MuXCIpO1xuICAgICAgICAgICAgY2FzZSBUb2tlblR5cGUuU0xBU0g6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICBpZiAocmlnaHQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIub3BlcmF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIk51bWJlcmF0b3IgY2FuIG5vdCBiZSB6ZXJvLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLlNUQVI6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja051bWJlck9wZXJhbmRzKGV4cHIub3BlcmF0b3IsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcikge1xuICAgICAgICBsZXQgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgICAgIGxldCBhcmdzID0gZXhwci5hcmdzLm1hcChhcmcgPT4gdGhpcy5ldmFsdWF0ZShhcmcpKTtcblxuICAgICAgICBpZiAoIShjYWxsZWUgaW5zdGFuY2VvZiBCdW5hRnVuY3Rpb24gfHwgY2FsbGVlIGluc3RhbmNlb2YgRGVmYXVsdEJ1bmFGdW5jdGlvbiB8fCBjYWxsZWUgaW5zdGFuY2VvZiBCdW5hSW5zdGFuY2UgfHwgY2FsbGVlIGluc3RhbmNlb2YgQnVuYUNsYXNzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLnBhcmVuLFxuICAgICAgICAgICAgICAgIFwiQ2FuIG9ubHkgY2FsbCBmdW5jdGlvbnMgYW5kIGNsYXNzZXMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9IGNhbGxlZS5hcml0eSgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGV4cHIucGFyZW4sXG4gICAgICAgICAgICAgICAgXCJFeHBlY3RlZCBcIiArIGNhbGxlZS5hcml0eSgpICsgXCIgYXJndW1lbnRzIGJ1dCBnb3QgXCIgKyBhcmdzLmxlbmd0aCArIFwiLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGVlLmNhbGwodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgdmlzaXRHZXRFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5vYmplY3QpO1xuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgQnVuYUluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0LmdldChleHByLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihleHByLm5hbWUsXG4gICAgICAgICAgICBcIk9ubHkgaW5zdGFuY2UgaGF2ZSBwcm9wZXJ0aWVzLlwiKTtcbiAgICB9XG5cbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLnZhbHVlO1xuICAgIH1cblxuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcikge1xuICAgICAgICBsZXQgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgICAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09IFRva2VuVHlwZS5PUikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUcnV0aHkobGVmdCkpIHJldHVybiBsZWZ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVHJ1dGh5KGxlZnQpKSByZXR1cm4gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cblxuICAgIHZpc2l0TXNnRXhwcihlcHhyKSB7XG4gICAgICAgIGlmIChleHByLm1ldGhvZC5sZXhlbWUgPT0gXCJzZW5kZXJcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwiMHgyYTdlNWJkZWIzNWZjYTk0YTZhYzAwMjdkMTM2MGIxMDEyZTU2ZjlkXCI7XG4gICAgICAgIH0gXG5cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgdmlzaXRTZXRFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5vYmplY3QpO1xuXG4gICAgICAgIGlmICghKG9iamVjdCBpbnN0YW5jZW9mIEJ1bmFJbnN0YW5jZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5uYW1lLCBcIk9ubHkgaW5zdGFuY2UgaGF2ZSBmaWVsZHMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICAgICAgb2JqZWN0LnNldChleHByLm5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICB2aXNpdFN1cGVyRXhwcihleHByKSB7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRoaXMubG9jYWxzLmdldChleHByKTtcbiAgICAgICAgbGV0IHN1cGVyY2xhc3MgPSB0aGlzLmVudmlyb25tZW50LmdldEF0KGRpc3RhbmNlLCBcInN1cGVyXCIpO1xuICAgICAgICAvLyAndGhpcycgaXMgYWx3YXlzIG9uZSBsZXZlbCBuZWFyZXIgdGhhbiAnc3VwZXInIHMgZW52cmlvbm1lbnRcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuZW52aXJvbm1lbnQuZ2V0QXQoZGlzdGFuY2UgLSAxLCBcInRoaXNcIik7XG4gICAgICAgIGxldCBtZXRob2QgPSBzdXBlcmNsYXNzLmZpbmRNZXRob2Qob2JqZWN0LCBleHByLm1ldGhvZC5sZXhlbWUpO1xuICAgICAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoZXhwci5tZXRob2QsXG4gICAgICAgICAgICAgICAgXCJVbmRlZmluZWQgcHJvcGVydHkgJ1wiICsgZXhwci5tZXRob2QubGV4ZW1lICsgXCInLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0aG9kO1xuICAgIH1cblxuICAgIHZpc2l0VGhpc0V4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5sb29rVXBWYXJpYWJsZShleHByLmtleXdvcmQsIGV4cHIpO1xuICAgIH1cblxuICAgIHZpc2l0VW5hcnlFeHByKGV4cHIpIHtcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICAgICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkJBTkc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLmlzVHJ1dGh5KHJpZ2h0KTtcbiAgICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLk1JTlVTOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOdW1iZXJPcGVyYW5kKGV4cHIub3BlcmF0b3IsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKC0xKSpwYXJzZUZsb2F0KHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVucmVhY2hhYmxlLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvb2tVcFZhcmlhYmxlKGV4cHIubmFtZSwgZXhwcik7XG4gICAgfVxuXG4gICAgbG9va1VwVmFyaWFibGUobmFtZSwgZXhwcikge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLmxvY2Fscy5nZXQoZXhwcik7XG4gICAgICAgIGlmIChkaXN0YW5jZSAhPSBudWxsICYmIGRpc3RhbmNlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvbm1lbnQuZ2V0QXQoZGlzdGFuY2UsIG5hbWUubGV4ZW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdsb2JhbHMuZ2V0KG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tOdW1iZXJPcGVyYW5kKG9wZXJhdG9yLCBvcGVyYW5kKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3BlcmFuZCA9PSBcIm51bWJlclwiKSByZXR1cm47XG4gICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3Iob3BlcmF0b3IsIFwiT3BlcmFuZCBtdXN0IGJlIG51bWJlci5cIik7XG4gICAgfVxuXG4gICAgY2hlY2tOdW1iZXJPcGVyYW5kcyhvcGVyYXRvciwgbGVmdCwgcmlnaHQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsZWZ0ID09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHJpZ2h0ID09IFwibnVtYmVyXCIpIHJldHVybjtcbiAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihvcGVyYXRvciwgXCJPcGVyYW5kcyBtdXN0IGJlIG51bWJlcnMuXCIpO1xuICAgIH1cblxuICAgIGlzVHJ1dGh5KG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgb2JqZWN0ID09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PSBcImJvb2xlYW5cIikgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gXCJudW1iZXJcIikgcmV0dXJuIG9iamVjdCA+IDA7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlzRXF1YWwobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgaWYgKGxlZnQgPT0gbnVsbCAmJiByaWdodCA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKGxlZnQgPT0gdW5kZWZpbmVkICYmIHJpZ2h0ID09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChsZWZ0ID09IG51bGwgfHwgbGVmdCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGxlZnQgPT0gcmlnaHQ7XG4gICAgfVxuXG4gICAgc3RyaW5naWZ5KG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgb2JqZWN0ID09IHVuZGVmaW5lZCkgcmV0dXJuIFwibmlsXCI7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gb2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAodGV4dC5lbmRzV2l0aChcIi4wXCIpKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRleHQubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUoZXhwcikge1xuICAgICAgICByZXR1cm4gZXhwci5hY2NlcHQodGhpcyk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZShzdG10KSB7XG4gICAgICAgIHJldHVybiBzdG10LmFjY2VwdCh0aGlzKTtcbiAgICB9XG5cbiAgICByZXNvbHZlKGV4cHIsIGRlcHRoKSB7XG4gICAgICAgIHRoaXMubG9jYWxzLnNldChleHByLCBkZXB0aCk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZUJsb2NrKHN0YXRlbWVudHMsIGVudikge1xuICAgICAgICBsZXQgcHJldmlvdXMgPSB0aGlzLmVudmlyb25tZW50O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzdGF0ZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSBwcmV2aW91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2l0QmxvY2tTdG10KHN0bXQpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlQmxvY2soc3RtdC5zdGF0ZW1lbnRzLCBuZXcgRW52aXJvbm1lbnQodGhpcy5lbnZpcm9ubWVudCkpO1xuICAgIH1cblxuICAgIHZpc2l0Q2xhc3NTdG10KHN0bXQpIHtcbiAgICAgICAgbGV0IHN1cGVyY2xhc3MgPSBudWxsO1xuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHN1cGVyY2xhc3MgPSB0aGlzLmV2YWx1YXRlKHN0bXQuc3VwZXJjbGFzcyk7XG4gICAgICAgICAgICBpZiAoIShzdXBlcmNsYXNzIGluc3RhbmNlb2YgQnVuYUNsYXNzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3Ioc3RtdC5zdXBlcmNsYXNzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwiU3VwZXJjbGFzcyBtdXN0IGJlIGEgY2xhc3MuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKHN0bXQubmFtZS5sZXhlbWUsIG51bGwpO1xuXG4gICAgICAgIGlmIChzdG10LnN1cGVyY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IG5ldyBFbnZpcm9ubWVudCh0aGlzLmVudmlyb25tZW50KTtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKFwic3VwZXJcIiwgc3VwZXJjbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWV0aG9kcyA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RtdC5tZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZm4gPSBuZXcgQnVuYUZ1bmN0aW9uKHN0bXQubWV0aG9kc1tpXSwgdGhpcy5lbnZpcm9ubWVudCwgc3RtdC5tZXRob2RzW2ldLm5hbWUubGV4ZW1lID09IFwiaW5pdFwiKTtcbiAgICAgICAgICAgIG1ldGhvZHMuc2V0KHN0bXQubWV0aG9kc1tpXS5uYW1lLmxleGVtZSwgZm4pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGtsYXNzID0gbmV3IEJ1bmFDbGFzcyhzdG10Lm5hbWUubGV4ZW1lLCBzdXBlcmNsYXNzLCBtZXRob2RzKTtcblxuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSB0aGlzLmVudmlyb25tZW50LmVuY2xvc2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuYXNzaWduKHN0bXQubmFtZSwga2xhc3MpO1xuICAgIH1cblxuICAgIHZpc2l0RXhwcmVzc2lvblN0bXQoc3RtdCkge1xuICAgICAgICB0aGlzLmV2YWx1YXRlKHN0bXQuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRGdW5jdGlvblN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgZm4gPSBuZXcgQnVuYUZ1bmN0aW9uKHN0bXQsIHRoaXMuZW52aXJvbm1lbnQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudC5kZWZpbmUoc3RtdC5uYW1lLmxleGVtZSwgZm4pO1xuICAgIH1cblxuICAgIHZpc2l0SWZTdG10KHN0bXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUcnV0aHkodGhpcy5ldmFsdWF0ZShzdG10LmNvbmRpdGlvbikpKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGUoc3RtdC50aGVuQnJhbmNoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LmVsc2VCcmFuY2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0bXQuZWxzZUJyYW5jaCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aXNpdFByaW50U3RtdChzdG10KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoc3RtdC5leHByZXNzaW9uKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICB9XG5cbiAgICB2aXNpdFJldHVyblN0bXQoc3RtdCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoc3RtdC52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoc3RtdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJldHVybnMoc3RtdC5rZXl3b3JkLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdmlzaXRWYXJTdG10KHN0bXQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKHN0bXQuaW5pdGlhbGl6ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKHN0bXQuaW5pdGlhbGl6ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnQuZGVmaW5lKHN0bXQubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICB2aXNpdFdoaWxlU3RtdChzdG10KSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmlzVHJ1dGh5KHRoaXMuZXZhbHVhdGUoc3RtdC5jb25kaXRpb24pKSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlKHN0bXQuYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG59Il19