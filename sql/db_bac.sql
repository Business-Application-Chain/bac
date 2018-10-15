/*
 Navicat Premium Data Transfer

 Source Server         : localSql
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : localhost:3306
 Source Schema         : db_bac

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 15/10/2018 17:30:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account2assets
-- ----------------------------
DROP TABLE IF EXISTS `account2assets`;
CREATE TABLE `account2assets` (
  `hash` varchar(64) CHARACTER SET latin1 NOT NULL,
  `name` varchar(32) CHARACTER SET latin1 DEFAULT NULL,
  `description` text,
  `decimal` int(8) DEFAULT NULL,
  `total` bigint(32) DEFAULT NULL,
  `burn` bigint(32) DEFAULT NULL,
  `transactionHash` varchar(64) DEFAULT NULL,
  `time` bigint(13) DEFAULT NULL,
  `accountId` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`hash`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `master_pub` varchar(128) CHARACTER SET latin1 DEFAULT NULL,
  `master_address` varchar(64) CHARACTER SET latin1 NOT NULL,
  `username` varchar(32) CHARACTER SET latin1 DEFAULT NULL,
  `username_unconfirmed` varchar(32) CHARACTER SET latin1 DEFAULT NULL,
  `secondsign` tinyint(1) DEFAULT '0',
  `secondsign_unconfirmed` tinyint(1) DEFAULT '0',
  `second_pub` varchar(128) CHARACTER SET latin1 DEFAULT NULL,
  `balance` bigint(20) DEFAULT '0',
  `balance_unconfirmed` bigint(20) DEFAULT '0',
  `uservote` bigint(20) DEFAULT '0',
  `rate` bigint(20) DEFAULT '0',
  `delegates` text CHARACTER SET latin1,
  `contacts` text CHARACTER SET latin1,
  `delegates_unconfirmed` text CHARACTER SET latin1,
  `create_block` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  `isDelegate` tinyint(1) DEFAULT '0',
  `isDelegate_unconfirmed` tinyint(1) DEFAULT '0',
  `name_exist` tinyint(1) DEFAULT '0',
  `name_exist_unconfirmed` tinyint(1) DEFAULT '0',
  `prod_block_num` bigint(20) DEFAULT '0',
  `missed_block_num` bigint(20) DEFAULT '0',
  `multisignatures` text CHARACTER SET latin1,
  `multisignatures_unconfirmed` text CHARACTER SET latin1,
  `multisign_min` bigint(20) DEFAULT '0',
  `multisign_min_unconfirmed` bigint(20) DEFAULT '0',
  `multisign_lifetime` bigint(20) DEFAULT '0',
  `multisign_lifetime_unconfirmed` bigint(20) DEFAULT '0',
  `virgin` tinyint(1) DEFAULT '0',
  `fees` bigint(20) DEFAULT '0',
  `rewards` bigint(20) DEFAULT '0',
  `lockHeight` int(11) DEFAULT NULL,
  `lockHeight_unconfirmed` int(11) DEFAULT NULL,
  `ip` bigint(11) DEFAULT NULL,
  `ip_unconfirmed` bigint(11) DEFAULT NULL,
  `port` int(10) DEFAULT NULL,
  `port_unconfirmed` int(10) DEFAULT NULL,
  PRIMARY KEY (`master_address`),
  UNIQUE KEY `master_address` (`master_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts2asset_balance
-- ----------------------------
DROP TABLE IF EXISTS `accounts2asset_balance`;
CREATE TABLE `accounts2asset_balance` (
  `assetsHash` varchar(64) CHARACTER SET latin1 DEFAULT NULL,
  `assets_name` varchar(32) CHARACTER SET latin1 DEFAULT NULL,
  `master_address` varchar(64) CHARACTER SET latin1 DEFAULT NULL,
  `balance` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts2contacts
-- ----------------------------
DROP TABLE IF EXISTS `accounts2contacts`;
CREATE TABLE `accounts2contacts` (
  `accountId` varchar(64) CHARACTER SET latin1 NOT NULL,
  `dependentId` varchar(64) CHARACTER SET latin1 NOT NULL,
  KEY `accountId` (`accountId`),
  CONSTRAINT `accounts2contacts_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`master_address`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts2contacts_unconfirmed
-- ----------------------------
DROP TABLE IF EXISTS `accounts2contacts_unconfirmed`;
CREATE TABLE `accounts2contacts_unconfirmed` (
  `accountId` varchar(64) CHARACTER SET latin1 NOT NULL,
  `dependentId` varchar(64) CHARACTER SET latin1 NOT NULL,
  KEY `accountId` (`accountId`),
  CONSTRAINT `accounts2contacts_unconfirmed_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`master_address`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts2delegates
-- ----------------------------
DROP TABLE IF EXISTS `accounts2delegates`;
CREATE TABLE `accounts2delegates` (
  `accountId` varchar(64) CHARACTER SET latin1 NOT NULL,
  `dependentId` varchar(64) CHARACTER SET latin1 NOT NULL,
  KEY `accountId` (`accountId`),
  CONSTRAINT `accounts2delegates_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`master_address`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts2delegates_unconfirmed
-- ----------------------------
DROP TABLE IF EXISTS `accounts2delegates_unconfirmed`;
CREATE TABLE `accounts2delegates_unconfirmed` (
  `accountId` varchar(64) CHARACTER SET latin1 NOT NULL,
  `dependentId` varchar(64) CHARACTER SET latin1 NOT NULL,
  KEY `accountId` (`accountId`),
  CONSTRAINT `accounts2delegates_unconfirmed_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`master_address`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts2multisignatures
-- ----------------------------
DROP TABLE IF EXISTS `accounts2multisignatures`;
CREATE TABLE `accounts2multisignatures` (
  `accountId` varchar(64) CHARACTER SET latin1 NOT NULL,
  `dependentId` varchar(64) CHARACTER SET latin1 NOT NULL,
  KEY `accountId` (`accountId`),
  CONSTRAINT `accounts2multisignatures_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`master_address`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts2multisignatures_unconfirmed
-- ----------------------------
DROP TABLE IF EXISTS `accounts2multisignatures_unconfirmed`;
CREATE TABLE `accounts2multisignatures_unconfirmed` (
  `accountId` varchar(64) CHARACTER SET latin1 NOT NULL,
  `dependentId` varchar(64) CHARACTER SET latin1 NOT NULL,
  KEY `accountId` (`accountId`),
  CONSTRAINT `accounts2multisignatures_unconfirmed_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`master_address`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for accounts_round
-- ----------------------------
DROP TABLE IF EXISTS `accounts_round`;
CREATE TABLE `accounts_round` (
  `master_address` varchar(64) CHARACTER SET latin1 DEFAULT NULL,
  `amount` bigint(20) DEFAULT NULL,
  `delegate` varchar(64) CHARACTER SET latin1 DEFAULT NULL,
  `blockHash` varchar(64) CHARACTER SET latin1 DEFAULT NULL,
  `round` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blocks
-- ----------------------------
DROP TABLE IF EXISTS `blocks`;
CREATE TABLE `blocks` (
  `hash` varchar(64) NOT NULL,
  `version` int(11) NOT NULL,
  `timestamp` bigint(13) NOT NULL,
  `height` int(11) NOT NULL,
  `previousBlock` varchar(64) DEFAULT NULL,
  `numberOfTransactions` int(11) NOT NULL,
  `totalAmount` bigint(20) NOT NULL,
  `totalFee` bigint(20) NOT NULL,
  `reward` bigint(20) NOT NULL,
  `payloadLength` int(11) NOT NULL,
  `payloadHash` varchar(64) NOT NULL,
  `generatorPublicKey` varchar(128) NOT NULL,
  `blockSignature` varchar(255) NOT NULL,
  `merkleRoot` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hash`) USING BTREE,
  KEY `previousBlock` (`previousBlock`),
  CONSTRAINT `blocks_ibkf_1` FOREIGN KEY (`previousBlock`) REFERENCES `blocks` (`hash`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for contacts
-- ----------------------------
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `address` varchar(64) NOT NULL,
  `transactionHash` varchar(64) NOT NULL,
  KEY `transactionId` (`transactionHash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for dapps
-- ----------------------------
DROP TABLE IF EXISTS `dapps`;
CREATE TABLE `dapps` (
  `transactionHash` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `description` text,
  `tags` varchar(128) DEFAULT NULL,
  `siaAscii` text,
  `siaIcon` text,
  `git` text,
  `type` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `icon` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for delegates
-- ----------------------------
DROP TABLE IF EXISTS `delegates`;
CREATE TABLE `delegates` (
  `transactionHash` varchar(64) NOT NULL,
  `address` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for forks_stat
-- ----------------------------
DROP TABLE IF EXISTS `forks_stat`;
CREATE TABLE `forks_stat` (
  `delegatePublicKey` varchar(128) NOT NULL,
  `blockTimestamp` bigint(13) NOT NULL,
  `blockHash` varchar(64) NOT NULL,
  `blockHeight` int(11) NOT NULL,
  `previousBlock` varchar(64) NOT NULL,
  `cause` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for lock_height
-- ----------------------------
DROP TABLE IF EXISTS `lock_height`;
CREATE TABLE `lock_height` (
  `transactionHash` varchar(255) DEFAULT NULL,
  `lockHeight` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for miner
-- ----------------------------
DROP TABLE IF EXISTS `miner`;
CREATE TABLE `miner` (
  `address` varchar(64) CHARACTER SET utf8 NOT NULL,
  `publicKey` varchar(255) NOT NULL,
  `ip` bigint(10) NOT NULL,
  `port` int(11) DEFAULT NULL,
  `version` varchar(64) DEFAULT NULL,
  `lock` tinyint(8) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for miner_ip
-- ----------------------------
DROP TABLE IF EXISTS `miner_ip`;
CREATE TABLE `miner_ip` (
  `transactionHash` varchar(64) CHARACTER SET latin1 NOT NULL,
  `ip` bigint(11) NOT NULL,
  `port` int(10) NOT NULL,
  `address` varchar(64) CHARACTER SET latin1 NOT NULL,
  `publicKey` varchar(128) CHARACTER SET latin1 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for multisignatures
-- ----------------------------
DROP TABLE IF EXISTS `multisignatures`;
CREATE TABLE `multisignatures` (
  `transactionHash` varchar(64) NOT NULL,
  `min` int(11) NOT NULL,
  `lifetime` int(13) NOT NULL,
  `keysgroup` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for peers
-- ----------------------------
DROP TABLE IF EXISTS `peers`;
CREATE TABLE `peers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` bigint(10) DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `os` varchar(65) DEFAULT NULL,
  `sharePort` tinyint(1) DEFAULT NULL,
  `version` varchar(11) DEFAULT NULL,
  `clock` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_UNIQUE` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=6167153 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for peers_dapp
-- ----------------------------
DROP TABLE IF EXISTS `peers_dapp`;
CREATE TABLE `peers_dapp` (
  `peerId` int(11) NOT NULL,
  `dappId` varchar(20) DEFAULT NULL,
  KEY `peers_dapp_ibfk_1_idx` (`peerId`),
  CONSTRAINT `peers_dapp_ibfk_1` FOREIGN KEY (`peerId`) REFERENCES `peers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for signatures
-- ----------------------------
DROP TABLE IF EXISTS `signatures`;
CREATE TABLE `signatures` (
  `transactionHash` varchar(64) NOT NULL,
  `publicKey` varchar(128) NOT NULL,
  PRIMARY KEY (`transactionHash`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `hash` varchar(64) NOT NULL,
  `blockHash` varchar(64) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `timestamp` bigint(13) NOT NULL,
  `senderPublicKey` varchar(128) NOT NULL,
  `requesterPublicKey` varchar(128) DEFAULT NULL,
  `senderId` varchar(64) NOT NULL,
  `recipientId` varchar(64) DEFAULT NULL,
  `senderUsername` varchar(20) DEFAULT NULL,
  `recipientUsername` varchar(20) DEFAULT NULL,
  `amount` bigint(20) NOT NULL,
  `fee` bigint(20) NOT NULL,
  `signature` varchar(255) NOT NULL,
  `signSignature` varchar(128) DEFAULT NULL,
  `signatures` text,
  `message` text,
  PRIMARY KEY (`hash`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for transfers
-- ----------------------------
DROP TABLE IF EXISTS `transfers`;
CREATE TABLE `transfers` (
  `assetsHash` varchar(64) CHARACTER SET latin1 DEFAULT NULL,
  `amount` bigint(32) DEFAULT NULL,
  `transactionHash` varchar(64) DEFAULT NULL,
  `assets_name` varchar(32) DEFAULT NULL,
  `accountId` varchar(64) DEFAULT NULL,
  `recipientId` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for usernames
-- ----------------------------
DROP TABLE IF EXISTS `usernames`;
CREATE TABLE `usernames` (
  `transactionHash` varchar(64) NOT NULL,
  `username` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for votes
-- ----------------------------
DROP TABLE IF EXISTS `votes`;
CREATE TABLE `votes` (
  `transactionHash` varchar(64) NOT NULL,
  `votes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
