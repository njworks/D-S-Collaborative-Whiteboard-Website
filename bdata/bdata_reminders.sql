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
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reminders` (
  `bid` varchar(20) NOT NULL,
  `bname` varchar(40) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `remindtext` tinytext,
  `setTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `send` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminders`
--

LOCK TABLES `reminders` WRITE;
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
INSERT INTO `reminders` VALUES ('undefined','undefined','undefined','2018-03-02','01:00:00','hi asd\r\nasdad\r\nasdasd\r\nasd\r\nsad\r\nasd\r\nsad\r\nsa\r\nd\r\nsaddsfsdgfgg',NULL,NULL),('07zC53MWkrjrPRt','untitled','3','2018-03-03','03:05:00','xfcvbfcxvbcxvbfgh\r\ndfghdsh\r\ngdfhsgdh',NULL,NULL),('undefined','undefined','undefined','2018-03-07','03:05:00','xfcgv\r\ndsf\r\nsdf\r\ndsf\r\n','2018-03-01 13:07:46',NULL),('undefined','undefined','undefined','2018-03-01','19:05:00','testing testing bye\r\n','2018-03-01 18:45:16',NULL),('0XLA7UFA39Phaq7','untitled','3','2018-03-01','19:05:00','testing testing bye\r\n','2018-03-01 18:46:06',NULL),('07zC53MWkrjrPRt','untitled','3','2018-03-25','19:15:00','hi\r\n\r\ntest\r\n\r\nbye','2018-03-01 18:59:14',NULL),('07zC53MWkrjrPRt','untitled','3','2018-03-25','19:30:00','bye\r\n\r\ntest\r\n\r\nbye','2018-03-01 18:59:38',NULL),('NbwJPy22VvF2M0U','untitled','3','2018-03-25','20:05:00','hi\r\nbye\r\n\r\ntest','2018-04-18 19:01:01',1),('NbwJPy22VvF2M0U','untitled','3','2018-03-25','21:05:00','hi\r\ndsfsdfs','2018-03-01 19:32:53',NULL),('NbwJPy22VvF2M0U','untitled','3','2018-03-25','19:46:00','sdfdgbdbsdfgbsd','2018-03-01 19:33:16',NULL),('07zC53MWkrjrPRt','untitled','3','2018-03-25','22:50:00','afdsaf\r\ndsf\r\nsdfsd','2018-03-02 17:13:42',1),('07zC53MWkrjrPRt','untitled','3','2018-03-25','22:30:00','afdsaf\r\ndsf\r\nsdfsd','2018-03-02 17:13:42',1),('07zC53MWkrjrPRt','untitled','3','2018-03-26','22:30:00','afdsaf\r\ndsf\r\nsdfsd','2018-03-02 17:13:42',1),('DymdPontNLcRjFz','untitled','3','2018-03-25','23:25:00','gdg\r\ndfg\r\ndfg','2018-04-11 22:01:01',1),('DymdPontNLcRjFz','untitled','3','2018-03-25','22:25:00','gdg\r\ndfg\r\ndfg','2018-03-02 17:13:42',1),('DymdPontNLcRjFz','finally','test','2018-03-07','06:05:00','Today is the deadline for project','2018-03-05 23:23:02',NULL),('07zC53MWkrjrPRt','titlesasd','test','2018-03-15','00:00:00','dfgdfgdf','2018-03-07 13:10:04',NULL),('07zC53MWkrjrPRt','titlesasd','test','2018-03-08','05:00:00','n,b,','2018-03-07 13:10:43',NULL);
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;
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
