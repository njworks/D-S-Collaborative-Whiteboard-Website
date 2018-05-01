-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: bdata
-- ------------------------------------------------------
-- Server version	5.7.21-log

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
-- Table structure for table `boardusers`
--

DROP TABLE IF EXISTS `boardusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boardusers` (
  `wid` varchar(20) NOT NULL,
  `user` varchar(20) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  KEY `boardusers_ibfk_1` (`wid`),
  CONSTRAINT `boardusers_ibfk_1` FOREIGN KEY (`wid`) REFERENCES `whiteboard` (`wid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boardusers`
--

LOCK TABLES `boardusers` WRITE;
/*!40000 ALTER TABLE `boardusers` DISABLE KEYS */;
INSERT INTO `boardusers` VALUES ('2LeMUY1KgI','test','untitled'),('2LeMUY1KgI','root','untitled'),('7oybRw62WDCQkYc','test','untitled'),('7oybRw62WDCQkYc','user','untitled'),('NbwJPy22VvF2M0U','user','untitled'),('NbwJPy22VvF2M0U','tester2','untitled'),('NbwJPy22VvF2M0U','tester3','untitled'),('DymdPontNLcRjFz','root','untitled'),('DymdPontNLcRjFz','user','untitled'),('07zC53MWkrjrPRt','user','None'),('07zC53MWkrjrPRt','root','None'),('07zC53MWkrjrPRt','tester','None'),('3sJna5eUDIHJEnb','test','changed'),('3sJna5eUDIHJEnb','user','changed'),('3sJna5eUDIHJEnb','root','changed'),('ak63mZ4xLffxz4u','root','untitled'),('q0qyqajHJuphRwK','username','Board 5'),('q0qyqajHJuphRwK','test2','Board 5');
/*!40000 ALTER TABLE `boardusers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-20 15:36:18
