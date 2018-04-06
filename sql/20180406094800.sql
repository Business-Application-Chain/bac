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
