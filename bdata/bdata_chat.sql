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
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wid` varchar(20) DEFAULT NULL,
  `sendtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` varchar(20) DEFAULT NULL,
  `message` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,'07zC53MWkrjrPRt','2018-03-04 17:13:27','test',' hi'),(2,'07zC53MWkrjrPRt','2018-03-04 17:13:27','test',' hi'),(3,'07zC53MWkrjrPRt','2018-03-04 17:13:34','root',' damn it'),(4,'07zC53MWkrjrPRt','2018-03-04 17:13:34','root',' damn it'),(5,'07zC53MWkrjrPRt','2018-03-04 17:13:43','test',' why twice again'),(6,'07zC53MWkrjrPRt','2018-03-04 17:13:43','test',' why twice again'),(12,'07zC53MWkrjrPRt','2018-03-05 11:46:44','root',' hi'),(13,'07zC53MWkrjrPRt','2018-03-05 11:46:49','test',' hi'),(14,'07zC53MWkrjrPRt','2018-03-05 11:46:52','user',' hi'),(15,'07zC53MWkrjrPRt','2018-03-05 22:54:57','test',' hi'),(16,'07zC53MWkrjrPRt','2018-03-05 22:55:01','user',' hi'),(17,'07zC53MWkrjrPRt','2018-03-07 13:04:22','test',' hi'),(18,'07zC53MWkrjrPRt','2018-03-07 13:04:30','user',' sudsa'),(19,'DymdPontNLcRjFz','2018-03-18 15:24:03','test',' test'),(20,'07zC53MWkrjrPRt','2018-03-18 18:18:22','user',' hey'),(21,'07zC53MWkrjrPRt','2018-03-18 18:18:29','test',' fsdfsdf'),(22,'3sJna5eUDIHJEnb','2018-03-19 10:28:42','root',' Hi'),(23,'3sJna5eUDIHJEnb','2018-03-19 10:28:52','username',' hi'),(24,'ak63mZ4xLffxz4u','2018-03-19 14:17:02','root',' Hey'),(25,'ak63mZ4xLffxz4u','2018-03-19 14:17:08','username',' Hey'),(26,'ak63mZ4xLffxz4u','2018-03-19 14:37:26','username',' gsfsd'),(27,'ak63mZ4xLffxz4u','2018-03-19 14:55:23','root',' jhgvmh'),(28,'ak63mZ4xLffxz4u','2018-03-19 15:10:30','username',' jgdsfjsdf'),(29,'ak63mZ4xLffxz4u','2018-03-19 16:00:36','username',' xwxwsx'),(30,'ak63mZ4xLffxz4u','2018-03-19 16:11:31','root',' tyhffvv'),(31,'ak63mZ4xLffxz4u','2018-03-19 16:44:28','username',' vccb'),(32,'ak63mZ4xLffxz4u','2018-03-19 16:45:47','username',' hey'),(33,'ak63mZ4xLffxz4u','2018-03-19 16:48:53','username',' rgdfg'),(34,'q0qyqajHJuphRwK','2018-04-09 11:36:14','username',' Hi');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-20 15:36:17
