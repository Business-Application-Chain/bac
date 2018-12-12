BAC is a blockchain for storage and transfer of decentralized value. See bacx.io.

## Binary Downloads
[bacx.io](https://bacx.io/) (comming soon)


## Installation
Download and install Node.js v6.3.0+, NPM v3.10+, node-gyp v3.6.2+, Mysql v5.7.x, g++, libssl, libtool. These versions are recommended for easiest install but newer versions will work too. If you already have another version of Node.js installed, you can use NVM to keep both.

Clone the source:
```
> git clone https://github.com/Business-Application-Chain/bac.git
> cd bac
```

Install bower and grunt if you haven't already:
```
> npm install -g bower
> npm install -g grunt-cli
```

Build BAC:
```
> npm install
```

If you are on Windows or using NW.js and Node.js versions other than recommended, see [NW.js instructions about building native modules](http://docs.nwjs.io/en/latest/For%20Users/Advanced/Use%20Native%20Node%20Modules/).

## Installation on docker
```
coming soon
```

## Usage
```
Start Mysql and init your db for BAC, you can simply exec ./sql/db_bac.sql
change the config.json with user and password as you want for the db you just created, and then
> node bin/www
and open http://127.0.0.1:7259, enjoy!!
```

## Issues Fix
If you get authority issues, like: EACCES: permission denied, mkdir ‘/opt/bac/node_modules/ed25519/build’
try to use root as
```
> npm i —unsafe-perm=true —allow-root
```

If you get runtime errors, like: Error=ENOTDIR: not a directory, open 'libreadline.so' Stack=Error: not a directory, open 'libreadline.so'
* CentOS
```
> ldconfig -p | grep readline
> ln -fs /lib64/libreadline.so.6 /lib64/libreadline.so
```
* Ubuntu
```  
> sudo apt-get install libreadline6-dev  
> ldconfig -p | grep readline
> ldconfig -p |awk '/libreadline.so.6/{print "ln -fs " $NF " /lib64/libreadline.so" }' |bash
```  


## License
The MIT License (MIT)

Copyright (c) 2016-2018 BAC
Copyright (c) 2015 Crypti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.