# BAC公链
## 配置系统环境
Ubuntu 14.04 ~ 16.10 (LTS) - x86_64
安装必要的依赖包（命令行操作）:
  $ sudo apt-get update
  $ sudo apt-get install curl build-essential python

#### 安装mysql数据库

#### 安装Node.js和npm:
  $ sudo apt-get install nodejs
  MAC OSX(>=10.9)

#### 安装Homeberw
  ```
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```

*安装Mysql*

* 安装 Node.js (版本>= 8.都可以) 和 npm:*

#### 配置工程
  全局安装 grunt-cli:
  ```
  $ npm install grunt-cli -g
  ```
#### 全局安装 brower:
  ```
  $ npm install bower -g
  ```
#### 克隆代码:
#### 安装node.js模块：
```
$ npm install
  *注*：如果遇到权限错误，如：EACCES: permission denied, mkdir ‘/opt/bac/node_modules/ed25519/build’
  使用root权限
  npm i —unsafe-perm=true —allow-root
```
#### 运行mysql
  创建一个新的库名字为db_bac,执行./sql/db_bac.sql
#### 修改配置文件
  config.json中user的user和password为数据库的user和password
## 运行bac:
  node bin/www.js
* 运行时可能会出现 *
  ```
  Error=ENOTDIR: not a directory, open 'libreadline.so' Stack=Error: not a directory, open 'libreadline.so'
  ```
* Center OS下 查找Readline动态链接库位置*
```
  ldconfig -p | grep readline
  ln -fs /lib64/libreadline.so.6 /lib64/libreadline.so
```
* Ubuntu下 *
  ```
  sudo apt-get install libreadline6-dev
  ```
  找到Readline对应的位置
  ```
  ldconfig -p | grep readline
  ```
  编译的时候连接一下Readline库
  ```
  ldconfig -p |awk '/libreadline.so.6/{print "ln -fs " $NF " /lib64/libreadline.so" }' |bash
  ```
  打开 http://localhost:7259
  助记词 credit video joy hero draft leisure coin arrest floor vague punch ozone 下有100000000个bac提供测试
