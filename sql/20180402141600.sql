CREATE DATABASE  IF NOT EXISTS `db_entu` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `db_entu`;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `uid` varchar(45) NOT NULL,
  `master_pub` varchar(60) DEFAULT NULL,
  `master_address` varchar(45) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `username_unconfirmed` varchar(20) DEFAULT NULL,
  `secondsign` tinyint(1) DEFAULT NULL,
  `secondsign_unconfirmed` tinyint(1) DEFAULT NULL,
  `second_pub` binary(32) DEFAULT NULL,
  `balance` bigint(16) DEFAULT NULL,
  `balance_unconfirmed` bigint(16) DEFAULT NULL,
  `uservote` bigint(16) DEFAULT NULL,
  `rate` varchar(45) DEFAULT NULL,
  `createat_block` varchar(45) DEFAULT NULL,
  `prod_block` bigint(16) DEFAULT NULL,
  `missed_block` bigint(16) DEFAULT NULL,
  `multisignatures` text,
  `multisignatures_unconfirmed` text,
  `multisign_min` int(11) DEFAULT NULL,
  `multisign_min_unconfirmed` int(11) DEFAULT NULL,
  `multisign_lifetime` int(11) DEFAULT NULL,
  `multisign_lifetime_unconfirmed` int(11) DEFAULT NULL,
  `is_delegate` tinyint(1) DEFAULT NULL,
  `is_delegate_unconfirmed` tinyint(1) DEFAULT NULL,
  `virgin` tinyint(1) DEFAULT NULL,
  `fees` bigint(16) DEFAULT NULL,
  `rewards` bigint(16) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `accounts2delegators`
--

DROP TABLE IF EXISTS `accounts2delegators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts2delegators` (
  `uid` varchar(45) NOT NULL,
  `delegator_pub` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `accounts2delegators_unconfirmed`
--

DROP TABLE IF EXISTS `accounts2delegators_unconfirmed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts2delegators_unconfirmed` (
  `uid` varchar(45) NOT NULL,
  `delegator_pub` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `accounts2multisignatures`
--

DROP TABLE IF EXISTS `accounts2multisignatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts2multisignatures` (
  `uid` varchar(45) NOT NULL,
  `somebody_pub` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `accounts2multisignatures_unconfirmed`
--

DROP TABLE IF EXISTS `accounts2multisignatures_unconfirmed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts2multisignatures_unconfirmed` (
  `uid` varchar(45) NOT NULL,
  `somebody_pub` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

