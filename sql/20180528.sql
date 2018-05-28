/*
 Navicat Premium Data Transfer

 Source Server         : localSql
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : localhost:3306
 Source Schema         : db_entu

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 28/05/2018 19:18:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for blocks
-- ----------------------------
DROP TABLE IF EXISTS `blocks`;
CREATE TABLE `blocks` (
  `id` varchar(20) NOT NULL,
  `version` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `previousBlock` varchar(20) DEFAULT NULL,
  `numberOfTransactions` int(11) NOT NULL,
  `totalAmount` bigint(20) NOT NULL,
  `totalFee` bigint(20) NOT NULL,
  `reward` bigint(20) NOT NULL,
  `payloadLength` int(11) NOT NULL,
  `payloadHash` binary(64) NOT NULL,
  `generatorPublicKey` binary(64) NOT NULL,
  `blockSignature` binary(128) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `previousBlock` (`previousBlock`),
  CONSTRAINT `blocks_ibfk_1` FOREIGN KEY (`previousBlock`) REFERENCES `blocks` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for dapps
-- ----------------------------
DROP TABLE IF EXISTS `dapps`;
CREATE TABLE `dapps` (
  `transactionId` varchar(20) NOT NULL,
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
  `transactionId` varchar(20) NOT NULL,
  `username` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for multisignatures
-- ----------------------------
DROP TABLE IF EXISTS `multisignatures`;
CREATE TABLE `multisignatures` (
  `transactionId` varchar(20) NOT NULL,
  `min` int(11) NOT NULL,
  `lifetime` int(11) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

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
  `transactionId` varchar(20) NOT NULL,
  `publicKey` varchar(64) NOT NULL,
  PRIMARY KEY (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` varchar(20) NOT NULL,
  `blockId` varchar(20) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `senderPublicKey` varchar(64) NOT NULL,
  `requesterPublicKey` varchar(64) DEFAULT NULL,
  `senderId` varchar(21) NOT NULL,
  `recipientId` varchar(21) DEFAULT NULL,
  `senderUsername` varchar(20) DEFAULT NULL,
  `recipientUsername` varchar(20) DEFAULT NULL,
  `amount` bigint(20) NOT NULL,
  `fee` bigint(20) NOT NULL,
  `signature` varchar(128) NOT NULL,
  `signSignature` varchar(128) DEFAULT NULL,
  `signatures` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for usernames
-- ----------------------------
DROP TABLE IF EXISTS `usernames`;
CREATE TABLE `usernames` (
  `transactionId` varchar(20) NOT NULL,
  `username` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for votes
-- ----------------------------
DROP TABLE IF EXISTS `votes`;
CREATE TABLE `votes` (
  `transactionId` varchar(20) NOT NULL,
  `votes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
