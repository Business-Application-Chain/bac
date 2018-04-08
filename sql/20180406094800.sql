CREATE DATABASE  IF NOT EXISTS `db_entu` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `db_entu`;
-- MySQL dump 10.13  Distrib 5.6.17, for osx10.6 (i386)
--
-- Host: localhost    Database: db_entu
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blocks` (
  `id` varchar(20) NOT NULL,
  `version` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `previousBlock` varchar(45) DEFAULT NULL,
  `numberOfTransactions` int(11) NOT NULL,
  `totalAmount` bigint(20) NOT NULL,
  `totalFee` bigint(20) NOT NULL,
  `reward` bigint(20) NOT NULL,
  `payloadLength` int(11) NOT NULL,
  `payloadHash` varchar(32) NOT NULL,
  `generatorPublicKey` varchar(32) NOT NULL,
  `blockSignature` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `dapps`
--

DROP TABLE IF EXISTS `dapps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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

--
-- Table structure for table `delegates`
--

DROP TABLE IF EXISTS `delegates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delegates` (
  `transactionId` varchar(20) NOT NULL,
  `username` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `multisignatures`
--

DROP TABLE IF EXISTS `multisignatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `multisignatures` (
  `transactionId` varchar(20) NOT NULL,
  `min` int(11) NOT NULL,
  `lifetime` int(11) NOT NULL,
  `keysgroup` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `peers`
--

DROP TABLE IF EXISTS `peers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `peers_dapp`
--

DROP TABLE IF EXISTS `peers_dapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peers_dapp` (
  `peerId` int(11) NOT NULL,
  `dappId` varchar(20) DEFAULT NULL,
  KEY `peers_dapp_ibfk_1_idx` (`peerId`),
  CONSTRAINT `peers_dapp_ibfk_1` FOREIGN KEY (`peerId`) REFERENCES `peers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `signatures`
--

DROP TABLE IF EXISTS `signatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `signatures` (
  `transactionId` varchar(20) NOT NULL,
  `publicKey` varchar(64) NOT NULL,
  PRIMARY KEY (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` varchar(20) NOT NULL,
  `blockId` varchar(20) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  `senderPublicKey` varchar(64) DEFAULT NULL,
  `requesterPublicKey` varchar(64) DEFAULT NULL,
  `senderId` varchar(21) DEFAULT NULL,
  `recipientId` varchar(21) DEFAULT NULL,
  `senderUsername` varchar(20) DEFAULT NULL,
  `recipientUsername` varchar(20) DEFAULT NULL,
  `amount` bigint(20) DEFAULT NULL,
  `fee` bigint(20) DEFAULT NULL,
  `signature` varchar(64) DEFAULT NULL,
  `signSignature` varchar(64) DEFAULT NULL,
  `signatures` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `usernames`
--

DROP TABLE IF EXISTS `usernames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usernames` (
  `transactionId` varchar(20) NOT NULL,
  `username` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `transactionId` varchar(20) NOT NULL,
  `votes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

