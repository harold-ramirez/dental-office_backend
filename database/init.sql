CREATE DATABASE  IF NOT EXISTS `dbdentaloffice` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbdentaloffice`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: dbdentaloffice
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `Id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `dateHour` datetime NOT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `AppointmentRequest_Id` mediumint unsigned DEFAULT NULL,
  `Treatment_Id` tinyint unsigned DEFAULT NULL,
  `Patient_Id` mediumint unsigned DEFAULT NULL,
  `minutesDuration` tinyint NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Appointment_Patient1_idx` (`Patient_Id`),
  KEY `fk_Appointment_AppointmentRequest1_idx` (`AppointmentRequest_Id`),
  KEY `fk_Appointment_AppUser1_idx` (`AppUser_Id`),
  KEY `fk_Appointment_Treatment1_idx` (`Treatment_Id`),
  CONSTRAINT `fk_Appointment_AppointmentRequest1` FOREIGN KEY (`AppointmentRequest_Id`) REFERENCES `appointmentrequest` (`Id`),
  CONSTRAINT `fk_Appointment_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`),
  CONSTRAINT `fk_Appointment_Patient1` FOREIGN KEY (`Patient_Id`) REFERENCES `patient` (`Id`),
  CONSTRAINT `fk_Appointment_Treatment1` FOREIGN KEY (`Treatment_Id`) REFERENCES `treatment` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointmentrequest`
--

DROP TABLE IF EXISTS `appointmentrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointmentrequest` (
  `Id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `patientFullName` varchar(350) NOT NULL,
  `dateHourRequest` datetime NOT NULL,
  `phoneNumber` varchar(300) NOT NULL,
  `message` text NOT NULL,
  `AppUser_Id` tinyint unsigned DEFAULT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_AppointmentRequest_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_AppointmentRequest_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointmentrequest`
--

LOCK TABLES `appointmentrequest` WRITE;
/*!40000 ALTER TABLE `appointmentrequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointmentrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appuser`
--

DROP TABLE IF EXISTS `appuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appuser` (
  `Id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `paternalSurname` varchar(150) DEFAULT NULL,
  `maternalSurname` varchar(150) DEFAULT NULL,
  `gender` char(1) NOT NULL,
  `phoneNumber` varchar(300) NOT NULL,
  `defaultMessage` varchar(200) DEFAULT NULL,
  `sessionDurationMinutes` smallint unsigned NOT NULL DEFAULT '60',
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_AppUser_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_AppUser_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appuser`
--

LOCK TABLES `appuser` WRITE;
/*!40000 ALTER TABLE `appuser` DISABLE KEYS */;
INSERT INTO `appuser` VALUES (1,'UserAdmin101','$2b$10$lIjZ4y8MQqBsTU4z3oT/Q.atKnwtyHdgRnfxx/K8OLxAeWhzyAUz2','ec6d17b3c9fb36781c961d7e577ebe51:306d4f031cb8b0cb165340654df62043:f545bc4b28a6b92df3','a8c0d066ab0bb93b748475b0bd3c1724:b31570ff0d57fb27462dbdbad40a2b30:b20785f933fa',NULL,'M','26bf2be59126f3a95b33d86214c99d83:fd91967ba302ef2660be345dc65073df:8522c354ae652613',NULL,60,1,'2026-02-19 18:34:43',NULL,_binary '');
/*!40000 ALTER TABLE `appuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complementaryimage`
--

DROP TABLE IF EXISTS `complementaryimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complementaryimage` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `fileName` varchar(100) NOT NULL,
  `captureDate` datetime DEFAULT NULL,
  `description` text,
  `Patient_Id` mediumint unsigned NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_ComplementaryImage_Patient_idx` (`Patient_Id`),
  KEY `fk_ComplementaryImage_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_ComplementaryImage_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`),
  CONSTRAINT `fk_ComplementaryImage_Patient` FOREIGN KEY (`Patient_Id`) REFERENCES `patient` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complementaryimage`
--

LOCK TABLES `complementaryimage` WRITE;
/*!40000 ALTER TABLE `complementaryimage` DISABLE KEYS */;
/*!40000 ALTER TABLE `complementaryimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnosedprocedure`
--

DROP TABLE IF EXISTS `diagnosedprocedure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnosedprocedure` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(500) DEFAULT NULL,
  `totalCost` decimal(7,2) DEFAULT NULL,
  `Patient_Id` mediumint unsigned NOT NULL,
  `Treatment_Id` tinyint unsigned NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  `dentalPieces` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_DiagnosedProcedure_Patient1_idx` (`Patient_Id`),
  KEY `fk_DiagnosedProcedure_Treatment1_idx` (`Treatment_Id`),
  KEY `fk_DiagnosedProcedure_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_DiagnosedProcedure_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`),
  CONSTRAINT `fk_DiagnosedProcedure_Patient1` FOREIGN KEY (`Patient_Id`) REFERENCES `patient` (`Id`),
  CONSTRAINT `fk_DiagnosedProcedure_Treatment1` FOREIGN KEY (`Treatment_Id`) REFERENCES `treatment` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosedprocedure`
--

LOCK TABLES `diagnosedprocedure` WRITE;
/*!40000 ALTER TABLE `diagnosedprocedure` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnosedprocedure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habits`
--

DROP TABLE IF EXISTS `habits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habits` (
  `Id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Habits_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_Habits_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habits`
--

LOCK TABLES `habits` WRITE;
/*!40000 ALTER TABLE `habits` DISABLE KEYS */;
/*!40000 ALTER TABLE `habits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicalhistoryform`
--

DROP TABLE IF EXISTS `medicalhistoryform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicalhistoryform` (
  `Id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `familyPathologicalHistory` varchar(500) DEFAULT NULL,
  `allergies` varchar(300) DEFAULT NULL,
  `pregnantMonths` varchar(500) DEFAULT NULL,
  `medicalTreatment` varchar(300) DEFAULT NULL,
  `takingMedicine` varchar(300) DEFAULT NULL,
  `hemorrhageType` varchar(300) DEFAULT NULL,
  `tmj` varchar(300) DEFAULT NULL,
  `lymphNodes` varchar(300) DEFAULT NULL,
  `breathingType` varchar(300) DEFAULT NULL,
  `others` varchar(300) DEFAULT NULL,
  `lipsStatus` varchar(300) DEFAULT NULL,
  `tongueStatus` varchar(300) DEFAULT NULL,
  `palateStatus` varchar(300) DEFAULT NULL,
  `mouthFloorStatus` varchar(300) DEFAULT NULL,
  `buccalMucousStatus` varchar(300) DEFAULT NULL,
  `gumsStatus` varchar(300) DEFAULT NULL,
  `prosthesisLocation` varchar(300) DEFAULT NULL,
  `lastTimeVisitedDentist` varchar(300) DEFAULT NULL,
  `useDentalFloss` bit(1) DEFAULT NULL,
  `useMouthWash` bit(1) DEFAULT NULL,
  `toothBrushingFrequency` varchar(45) DEFAULT NULL,
  `hasBleedOnToothBrushing` bit(1) DEFAULT NULL,
  `oralHygiene` varchar(45) DEFAULT NULL,
  `Patient_Id` mediumint unsigned NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_MedicalHistoryForm_Patient1_idx` (`Patient_Id`),
  KEY `fk_MedicalHistoryForm_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_MedicalHistoryForm_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`),
  CONSTRAINT `fk_MedicalHistoryForm_Patient1` FOREIGN KEY (`Patient_Id`) REFERENCES `patient` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalhistoryform`
--

LOCK TABLES `medicalhistoryform` WRITE;
/*!40000 ALTER TABLE `medicalhistoryform` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicalhistoryform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicalhistoryform_habits`
--

DROP TABLE IF EXISTS `medicalhistoryform_habits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicalhistoryform_habits` (
  `MedicalHistoryForm_Id` mediumint unsigned NOT NULL,
  `Habits_Id` tinyint unsigned NOT NULL,
  PRIMARY KEY (`MedicalHistoryForm_Id`,`Habits_Id`),
  KEY `fk_MedicalHistoryForm_has_Habits_Habits1_idx` (`Habits_Id`),
  KEY `fk_MedicalHistoryForm_has_Habits_MedicalHistoryForm1_idx` (`MedicalHistoryForm_Id`),
  CONSTRAINT `fk_MedicalHistoryForm_has_Habits_Habits1` FOREIGN KEY (`Habits_Id`) REFERENCES `habits` (`Id`),
  CONSTRAINT `fk_MedicalHistoryForm_has_Habits_MedicalHistoryForm1` FOREIGN KEY (`MedicalHistoryForm_Id`) REFERENCES `medicalhistoryform` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalhistoryform_habits`
--

LOCK TABLES `medicalhistoryform_habits` WRITE;
/*!40000 ALTER TABLE `medicalhistoryform_habits` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicalhistoryform_habits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicalhistoryform_personalpathologicalhistory`
--

DROP TABLE IF EXISTS `medicalhistoryform_personalpathologicalhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicalhistoryform_personalpathologicalhistory` (
  `PersonalPathologicalHistory_Id` tinyint unsigned NOT NULL,
  `MedicalHistoryForm_Id` mediumint unsigned NOT NULL,
  PRIMARY KEY (`PersonalPathologicalHistory_Id`,`MedicalHistoryForm_Id`),
  KEY `fk_PersonalPathologicalHistory_has_MedicalHistoryForm_Medic_idx` (`MedicalHistoryForm_Id`),
  KEY `fk_PersonalPathologicalHistory_has_MedicalHistoryForm_Perso_idx` (`PersonalPathologicalHistory_Id`),
  CONSTRAINT `fk_PersonalPathologicalHistory_has_MedicalHistoryForm_Medical1` FOREIGN KEY (`MedicalHistoryForm_Id`) REFERENCES `medicalhistoryform` (`Id`),
  CONSTRAINT `fk_PersonalPathologicalHistory_has_MedicalHistoryForm_Persona1` FOREIGN KEY (`PersonalPathologicalHistory_Id`) REFERENCES `personalpathologicalhistory` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalhistoryform_personalpathologicalhistory`
--

LOCK TABLES `medicalhistoryform_personalpathologicalhistory` WRITE;
/*!40000 ALTER TABLE `medicalhistoryform_personalpathologicalhistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicalhistoryform_personalpathologicalhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `odontogram`
--

DROP TABLE IF EXISTS `odontogram`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `odontogram` (
  `Id` mediumint unsigned NOT NULL,
  `model` varchar(10) NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  KEY `fk_Odontogram_MedicalHistoryForm1_idx` (`Id`),
  KEY `fk_Odontogram_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_Odontogram_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`),
  CONSTRAINT `fk_Odontogram_MedicalHistoryForm1` FOREIGN KEY (`Id`) REFERENCES `medicalhistoryform` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `odontogram`
--

LOCK TABLES `odontogram` WRITE;
/*!40000 ALTER TABLE `odontogram` DISABLE KEYS */;
/*!40000 ALTER TABLE `odontogram` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `Id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `paternalSurname` varchar(150) DEFAULT NULL,
  `maternalSurname` varchar(150) DEFAULT NULL,
  `identityDocument` varchar(15) NOT NULL,
  `gender` char(1) NOT NULL,
  `cellphoneNumber` varchar(300) DEFAULT NULL,
  `telephoneNumber` varchar(300) DEFAULT NULL,
  `placeOfBirth` varchar(200) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `occupation` varchar(50) DEFAULT NULL,
  `address` varchar(400) DEFAULT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `documentNumber_UNIQUE` (`identityDocument`),
  KEY `fk_Patient_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_Patient_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(7,2) NOT NULL,
  `DiagnosedProcedure_Id` int unsigned NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Payment_DiagnosedProcedure1_idx` (`DiagnosedProcedure_Id`),
  KEY `fk_Payment_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_Payment_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`),
  CONSTRAINT `fk_Payment_DiagnosedProcedure1` FOREIGN KEY (`DiagnosedProcedure_Id`) REFERENCES `diagnosedprocedure` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalpathologicalhistory`
--

DROP TABLE IF EXISTS `personalpathologicalhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalpathologicalhistory` (
  `Id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_PersonalPathologicalHistory_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_PersonalPathologicalHistory_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalpathologicalhistory`
--

LOCK TABLES `personalpathologicalhistory` WRITE;
/*!40000 ALTER TABLE `personalpathologicalhistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `personalpathologicalhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift`
--

DROP TABLE IF EXISTS `shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift` (
  `Id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `day` varchar(15) NOT NULL,
  `hour` time NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Shift_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_Shift_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift`
--

LOCK TABLES `shift` WRITE;
/*!40000 ALTER TABLE `shift` DISABLE KEYS */;
INSERT INTO `shift` VALUES (1,'Monday','11:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(2,'Monday','11:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(3,'Monday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(4,'Monday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(5,'Monday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(6,'Monday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(7,'Monday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(8,'Monday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(9,'Monday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(10,'Monday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(11,'Monday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(12,'Monday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(13,'Monday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(14,'Monday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(15,'Monday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(16,'Monday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(17,'Monday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(18,'Monday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(19,'Monday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(20,'Monday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(21,'Monday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(22,'Monday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(23,'Monday','22:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(24,'Monday','22:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(25,'Monday','23:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(26,'Monday','23:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(27,'Tuesday','11:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(28,'Tuesday','11:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(29,'Tuesday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(30,'Tuesday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(31,'Tuesday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(32,'Tuesday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(33,'Tuesday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(34,'Tuesday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(35,'Tuesday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(36,'Tuesday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(37,'Tuesday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(38,'Tuesday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(39,'Tuesday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(40,'Tuesday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(41,'Tuesday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(42,'Tuesday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(43,'Tuesday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(44,'Tuesday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(45,'Tuesday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(46,'Tuesday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(47,'Tuesday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(48,'Tuesday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(49,'Tuesday','22:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(50,'Tuesday','22:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(51,'Tuesday','23:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(52,'Tuesday','23:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(53,'Wednesday','11:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(54,'Wednesday','11:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(55,'Wednesday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(56,'Wednesday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(57,'Wednesday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(58,'Wednesday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(59,'Wednesday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(60,'Wednesday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(61,'Wednesday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(62,'Wednesday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(63,'Wednesday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(64,'Wednesday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(65,'Wednesday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(66,'Wednesday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(67,'Wednesday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(68,'Wednesday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(69,'Wednesday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(70,'Wednesday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(71,'Wednesday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(72,'Wednesday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(73,'Wednesday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(74,'Wednesday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(75,'Wednesday','22:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(76,'Wednesday','22:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(77,'Wednesday','23:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(78,'Wednesday','23:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(79,'Thursday','11:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(80,'Thursday','11:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(81,'Thursday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(82,'Thursday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(83,'Thursday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(84,'Thursday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(85,'Thursday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(86,'Thursday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(87,'Thursday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(88,'Thursday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(89,'Thursday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(90,'Thursday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(91,'Thursday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(92,'Thursday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(93,'Thursday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(94,'Thursday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(95,'Thursday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(96,'Thursday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(97,'Thursday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(98,'Thursday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(99,'Thursday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(100,'Thursday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(101,'Thursday','22:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(102,'Thursday','22:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(103,'Thursday','23:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(104,'Thursday','23:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(105,'Friday','11:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(106,'Friday','11:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(107,'Friday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(108,'Friday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(109,'Friday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(110,'Friday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(111,'Friday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(112,'Friday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(113,'Friday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(114,'Friday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(115,'Friday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(116,'Friday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(117,'Friday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(118,'Friday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(119,'Friday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(120,'Friday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(121,'Friday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(122,'Friday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(123,'Friday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(124,'Friday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(125,'Friday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(126,'Friday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(127,'Friday','22:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(128,'Friday','22:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(129,'Friday','23:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(130,'Friday','23:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(131,'Saturday','11:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(132,'Saturday','11:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(133,'Saturday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(134,'Saturday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(135,'Saturday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(136,'Saturday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(137,'Saturday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(138,'Saturday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(139,'Saturday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(140,'Saturday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(141,'Saturday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(142,'Saturday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(143,'Saturday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(144,'Saturday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(145,'Saturday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(146,'Saturday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(147,'Saturday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(148,'Saturday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(149,'Saturday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(150,'Saturday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(151,'Saturday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(152,'Saturday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(153,'Saturday','22:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(154,'Saturday','22:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(155,'Saturday','23:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(156,'Saturday','23:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(157,'Sunday','11:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(158,'Sunday','11:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(159,'Sunday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(160,'Sunday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(161,'Sunday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(162,'Sunday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(163,'Sunday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(164,'Sunday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(165,'Sunday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(166,'Sunday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(167,'Sunday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(168,'Sunday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(169,'Sunday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(170,'Sunday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(171,'Sunday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(172,'Sunday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(173,'Sunday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(174,'Sunday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(175,'Sunday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(176,'Sunday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(177,'Sunday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(178,'Sunday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(179,'Sunday','22:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(180,'Sunday','22:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(181,'Sunday','23:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(182,'Sunday','23:30:00',1,'2026-02-19 18:34:43',NULL,_binary '');
/*!40000 ALTER TABLE `shift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tooth`
--

DROP TABLE IF EXISTS `tooth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tooth` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `pieceNumber` tinyint DEFAULT NULL,
  `localStatus` varchar(45) DEFAULT 'white',
  `Odontogram_Id` mediumint unsigned NOT NULL,
  `AppUser_Id` tinyint unsigned NOT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Tooth_Odontogram1_idx` (`Odontogram_Id`),
  KEY `fk_Tooth_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_Tooth_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`),
  CONSTRAINT `fk_Tooth_Odontogram1` FOREIGN KEY (`Odontogram_Id`) REFERENCES `odontogram` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tooth`
--

LOCK TABLES `tooth` WRITE;
/*!40000 ALTER TABLE `tooth` DISABLE KEYS */;
/*!40000 ALTER TABLE `tooth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `toothsection`
--

DROP TABLE IF EXISTS `toothsection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `toothsection` (
  `Id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `localStatus` varchar(45) DEFAULT 'white',
  `Tooth_Id` int unsigned NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_ToothSection_Tooth1_idx` (`Tooth_Id`),
  CONSTRAINT `fk_ToothSection_Tooth1` FOREIGN KEY (`Tooth_Id`) REFERENCES `tooth` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toothsection`
--

LOCK TABLES `toothsection` WRITE;
/*!40000 ALTER TABLE `toothsection` DISABLE KEYS */;
/*!40000 ALTER TABLE `toothsection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `Id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` timestamp NULL DEFAULT NULL,
  `status` bit(1) NOT NULL DEFAULT b'1',
  `AppUser_Id` tinyint unsigned NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Treatment_AppUser1_idx` (`AppUser_Id`),
  CONSTRAINT `fk_Treatment_AppUser1` FOREIGN KEY (`AppUser_Id`) REFERENCES `appuser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-19 10:43:37
