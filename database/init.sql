CREATE DATABASE  IF NOT EXISTS `dbdentalofficedemo` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbdentalofficedemo`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: dbdentalofficedemo
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,'2026-01-20 18:00:00',NULL,NULL,1,6,30,1,'2026-01-20 17:32:57',NULL,_binary ''),(2,'2026-03-23 20:00:00','a096fc5a9143250cec049b55d863d294:bfd985fe50406744506fae392d9368f7:48062cd19e234c00b3685f162d3b676049c1daef3c52dc5d230528077025f548eb',NULL,5,1,30,1,'2026-03-19 19:49:06',NULL,_binary ''),(3,'2026-03-26 13:00:00',NULL,NULL,7,2,45,1,'2026-03-19 19:50:22',NULL,_binary ''),(4,'2026-03-26 14:30:00','d67b02fbc7ba20a8d96c5af80b3a48e5:377432a3f70e03e61bc8b94c7681457d:922e2c1969daffed0df3deee483369226d9004',NULL,3,4,45,1,'2026-03-19 19:51:20',NULL,_binary ''),(5,'2026-03-27 18:30:00','0c71a85bf4ad70720ecdcb8bc70a2da1:1d09f8b26c3105af720259a318d741fc:4eb5608f1f145a80f6cfcfb0887857ba999e',NULL,1,5,15,1,'2026-03-19 19:53:02',NULL,_binary ''),(6,'2026-03-20 13:00:00','8b96aa36812985b6564eeaf14307da10:b82f3a19acd2ba79e09d142fe49f0282:e026cd03c0395d1e0ea089131d8e04cebd211a56909b',NULL,3,6,15,1,'2026-03-19 19:57:45',NULL,_binary '');
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
INSERT INTO `appuser` VALUES (1,'DemoUser','$2b$10$lIjZ4y8MQqBsTU4z3oT/Q.atKnwtyHdgRnfxx/K8OLxAeWhzyAUz2','ec6d17b3c9fb36781c961d7e577ebe51:306d4f031cb8b0cb165340654df62043:f545bc4b28a6b92df3','a8c0d066ab0bb93b748475b0bd3c1724:b31570ff0d57fb27462dbdbad40a2b30:b20785f933fa',NULL,'M','a859767fb2c9ad4457d2313e9e893516:0c83e004b208bc6794c3cd332edf3cb8:0fe44f88d169f33a','Buenos días, recordarle que usted reservó cita para el día de hoy a las',240,1,'2026-02-19 18:34:43','2026-03-19 19:44:01',_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosedprocedure`
--

LOCK TABLES `diagnosedprocedure` WRITE;
/*!40000 ALTER TABLE `diagnosedprocedure` DISABLE KEYS */;
INSERT INTO `diagnosedprocedure` VALUES (1,NULL,120.00,6,1,1,'2026-01-20 19:28:07','2026-01-20 19:29:24',_binary '','73-74-83-84'),(2,NULL,3500.00,2,7,1,'2026-03-19 19:55:43',NULL,_binary '','15-23-24-35-36-45');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habits`
--

LOCK TABLES `habits` WRITE;
/*!40000 ALTER TABLE `habits` DISABLE KEYS */;
INSERT INTO `habits` VALUES (1,'Tabaquismo',1,'2026-03-19 18:41:39',NULL,_binary ''),(2,'Consumo de Alcohol',1,'2026-03-19 18:41:51',NULL,_binary ''),(3,'Bruxismo',1,'2026-03-19 18:42:41',NULL,_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalhistoryform`
--

LOCK TABLES `medicalhistoryform` WRITE;
/*!40000 ALTER TABLE `medicalhistoryform` DISABLE KEYS */;
INSERT INTO `medicalhistoryform` VALUES (1,'19cee98ebbd63662f55ec9b8f35c3bd6:19c612de8846cbc02dfeea5d918d6417:8625eff71c4b66e5ce595136fee06c04c16d92988cf714e1b2a3f37adc0580083457ba018b340daf','4488c36bb725e449d92be19e379227aa:47db756395cb13273063cb7c7db529a4:23b12dc8a1bf2a38654642cf2b87ce3fce5af4acd6',NULL,'89d86e951996507fe8d0043203f77eb2:0ce16ca0c995c13c05d33398a649e03a:8f0cf8609e3a3bd7048937ac184b384c8e3b46b7d75d03a524b41c5db211f795','49de78ba32f68d98d5c022add84ccf18:6eff667231b56fab79d8b56737bca0b7:d0e0ff1ff78165b61eb5e3dab6e894c243a01216ef1030561b211062',NULL,NULL,NULL,'c95a1887d6f3723cf75fe26928517421:b6e2b3aa0e997d88718cfe8e12468148:d5fbc29a51f269fd1ed8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'d0f4df8e97b8101b9518c3642ac249e0:8e55edc4869681c7c6b12253c050c4c7:1d94a32224753edbb0909e',_binary '\0',_binary '\0','2 veces al día',_binary '\0','Regular',6,1,'2026-03-19 19:25:18',NULL,_binary ''),(2,'00f917d64b78e6b3469b06ae9d238a3c:a34411f432faa74c6bcdb16b88bef57d:32a13f3710bf3e0e9d03b473fe1fae0cf6b99635b4f01c','d39001a89a4b2895018e06bc585a1e69:f8941bf20593b5e2fb3d5ebabff8bd5c:f56c7415b6',NULL,NULL,NULL,NULL,'16e75be1d16f89110c2bac55a3590dc8:6e338c116914976846c30abf43be5ee4:4a3b8e','f1d3672dbe875ca7ca3449977f1ac964:05ece6c54d065dc31a5f7cf6000bc566:a410b3','a122b82a256505ef481252c1a5e2f8e8:244fcc99053d190281660105761b13af:d6525b19e31854ce8622',NULL,'1ecab6f565e8b9b9e1989454cab6bf2c:703e693d66f7b1afedf277672ac435f7:112b91','c7c61fc405fe91a07fc88a67da5ad1f9:a6fb86bd25a46df038fc9c179decd27f:137f61','5974db5b913e6f5960fafa93a4851224:5c4d7489643742d994a3dd139239c327:c20699','8790d472f7fc310ebe37e94a149f31b7:e98b846df48f9b7bb26d98978760af0b:a25f11','9c739065b7cf93408abdbd6a5b2ebc12:83e00da10135b7b93bf0ad1884ac0ee2:9c7fc0','70d583c55258da7a18a4dcd8cc6a83d2:3c39e37bc83391fa7bcf42251889a386:0c32fe',NULL,'09f677246914484800879612e2d0a2e6:d0f53490f61176fecc0f33a46a6a9189:e07d642773936bba7bd0f2b4',_binary '\0',_binary '\0','2 veces al día',_binary '\0','Regular',1,1,'2026-03-19 19:46:02',NULL,_binary '');
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
INSERT INTO `medicalhistoryform_personalpathologicalhistory` VALUES (2,1);
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
INSERT INTO `odontogram` VALUES (1,'child',1,'2026-03-19 19:25:18',NULL,_binary ''),(2,'adult',1,'2026-03-19 19:46:02',NULL,_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (1,'60a859b725b2e69ed2100f3b35e5098b:7760692dffe770552697b02b7e1c647b:b7053869d479cecae2203a531975','8d44a6ee7f16bf104b4c832703715cc9:5621d2b30ead79c90389efc2bf6d4939:6e7b2f95a6cbe3','f450b90b99ec7b9b0937145a6c1cfd44:f8ef7e2dc594832a15937d961f662c42:9c747c22a12d9e','12389294','M','b66ea7565de3b57ae7c943f6017fcd04:ef4380ce64a173f0e5b413d8e131c375:d0d53c243e229ccc',NULL,'c62a74896d9f2925a9b729d56f552b44:8b519e725109ccc4dd9923eaa7dffb25:40521bd10d883fd48a8e','2002-11-28','Estudiante','31dfe0ce5ca5244ccf79235962a8f3ae:f04321629c1218b469d84a2839f14ea2:69d3d2875befed96d016eca2b88568b31cc982521557edf3a7405c',1,'2026-03-19 18:52:59',NULL,_binary ''),(2,'f4642bf8f9b7b7057a8cfd1a1f2ad5d6:e05a3e1f1c4e6d75ae6f20a83593b88d:d5ebb96611b300fb739da8','bc9879526b897641a9adc084148415a9:48d16e2f235d5665c7954fb69a7d3f8c:98a5f7e35d188d','6770f1bfa5330177a61a710850c02828:0e664b1a2074bc07d6d6800c6a5f862b:030347863e2dd6','3019181','F','90902428dc32ad8dbe1a4866b812ae56:0c71c3c31bd711c5ab61fd1cbf7abf38:bcc280b38174faf3',NULL,'90b7d46e0f6dae2478334163e00c25db:c96b2319eba2bf8908cf1e06b5068fc0:1e554e95888abeb2ea970822b865418123f0','1964-09-21','Profesora','29fb48ef7bbfecf46692f2a2e9b07988:bd5caa5d7ae76c2a7c0d3b99a2dea7f0:9e06a86dca213fcb1429fc2b73d0d52292265d5bbdeb70f90347c6',1,'2026-03-19 18:54:17',NULL,_binary ''),(3,'012b0a25da0b633c96af682a99fb3fe5:04ed18ccbfcb9b556a46135d082c449b:64a904f4d8c56987f7504c0f92a6','2d8133f8b0e71a6ac7ba2a753facb0a3:d8744d2427b922a767c38a80d15faf66:09393c18f7a0fa','919e2c52fbf062deafd02275a6172a74:437725d71e983505aa42abd72fc74eee:b06391da2caa5c06','3868839','M','e23425720bec7252ede135185acac65f:625d034b9b65a0e989cf30b37b5a439b:555bda4dc3686bc8',NULL,'70f87c36f4ae12a943bdd423c48f6a3e:f10cbf0469603caa9a11941eb4e20e23:250755c5d855f0e6941326d6db423e0d11aa22e9dc21f7316baf','1970-09-23','Militar',NULL,1,'2026-03-19 18:55:26',NULL,_binary ''),(4,'9bb857e2200d7c729a10285297d37d3b:1db9f24b476d4eb0be67463c0c0acb90:7f8761e9022d396081271f06660eb8','4ece8415e594d310c48c5c32b1fa886c:9af375e3791cc22575cedb2aae405901:1c499e4552084c','2f37b44ed9f52e2e3a5b207373440a92:ea8678f066c63b5c6dddd3c28a7d942f:ac4c8bf3bd7bb9','12345678','M','395e1854bc8ecf94bf3f2a1112542cc7:1360a9fb43f4b92dc974b8dea6c5610a:0bf3208eefb1454f',NULL,'859e9c99132148c05d8071c22c394305:f823503e0709f997ba1390d47de9f63d:051f53047d69b7a89d2c','1999-12-06','Abogado',NULL,1,'2026-03-19 18:57:19',NULL,_binary ''),(5,'6e232e591ff9619cc5ae50d2a4c51f15:bc3bf401e55a956928b306aad1544c21:4d4e4133','a051c5ebe2059071594c5484eb1aab6b:c775b60d7363eb9eadeebddc66c7f176:e943f20b3e8c','c1d130d0bf3b0f95637de6fc494ca30f:4e77a93855747878d2607feb0e1da05b:134bdce4e0e4','87654321','M',NULL,NULL,NULL,'2016-07-01','Estudiante',NULL,1,'2026-03-19 18:58:46',NULL,_binary ''),(6,'f20e0cdbd9e3f9d65be532f261a8d83c:45cdcd515e352a3cc7f5774d8118f428:58d7b1','d9da1e9a09d0cd6dbaa98b06637d81f9:11ae4af40bc9b879d3120010343ac206:c2a22ad0575c','e518e3559c1df99dd0f141312ee0a34b:e87b6342e50c2215f4d06434e01f051c:11058b65','99887766','F',NULL,NULL,NULL,'2014-03-21','Estudiante',NULL,1,'2026-03-19 19:02:12',NULL,_binary ''),(7,'8f1a9b13e4000504d36ef0335af86c73:481da8bd0eb6b7f089fc8dbaac673b56:a9f28113bb','3352bdde0189afbe2d66d193a214210d:aeabcc0573447098b47d5ef8e561c563:32f2cafce3b2','96d151d08193e90f9539eae63c35e80b:067ddf1d071d2de765a280cda5080955:d9fea2cb3b49','55667788','M',NULL,NULL,'c177ecf0c56afa05e57bfaad4fe4c1ee:d4b0639df351146b73a8f8261f94fd9b:39c491532d','1979-01-24','Comerciante','44f940cb3e36e324321999c0de47ec96:71d469af23fff2ffc2611086a5bb342d:8e689b9bebfe8e7794f805942f6d92b5a36a',1,'2026-03-19 19:03:46',NULL,_binary ''),(8,'e092a7492d96fb2d545ed2b6b3deb784:3cc6da5add88628dd7543e361a0eb86f:ceb5571386b2','0d1871117901cb6f639457ba1df61203:8ae76d963c74e790ef4f4168e056400b:62a61d7e61963152','ed420f2da5550767ee45a93c262b8474:4a9cf919d013c1b226a04561bb3a61b8:f8fe0967e94e','87650000','F',NULL,NULL,'f26307843cfe182fef2b2c07cd8b23c6:ad2fb684fa8e358f84de521eab0009ae:fdaedcc5303d8457d5d7','1988-02-11','Docente',NULL,1,'2026-03-19 19:04:53',NULL,_binary ''),(9,'55e5202e9d6b705f808d466da72b7ec0:d5f60e910fc646a2ae1509ddf61bf6b0:fb7531ef','3199da7f6d5f14197713243f74994fad:66cdbde09275fa9f0d9d265701438915:d21d691107eed05a7907',NULL,'01928374','M','13ef0567046323b09f377c1e08c1bf83:81cef55d421e9801041eee4468566334:84f122815f800f3a',NULL,NULL,'2003-10-27','Ingeniero De Software',NULL,1,'2026-03-19 19:06:44',NULL,_binary ''),(10,'bd360ca3140949acf33ef96fba84b5b0:dce749023ec09940dd4024a42336d112:21009f16f03019','927ce7213c5509d24fd234cfb7d17180:2a7eefeef159bdfa42ef0065f2169c21:5a0c476ecfff','bebbcfef63132676d2808ab5fa6b26b8:c8442216905aa0e6b34aec8a73b17a10:2d31d86eaa7fcf','12345678-1A','F','53322a543af045b08d1b597595ac1d92:f19d3786adb561c626c3dbd9ce95f722:6660abca3682e73b',NULL,NULL,'2003-05-03','Ingeniera De Software',NULL,1,'2026-03-19 19:08:11',NULL,_binary ''),(11,'74ddebe835472814be69a52ae0724404:249c1aaf49f6de9f53fe83d04bdb8ead:8b6abd7c90','5b75a9fe228609c65029d09536d14e44:f03efb9b6bf1965e1878a29ae47ab57a:91e0083e2950d3b6',NULL,'16284512','M','eeb306ed7de7909a99ccae102357ef42:ae2a54fef675b6015f6423770efc0c7f:27896ef2f1e4ffe1',NULL,NULL,'2002-10-18','Ingeniero De Software',NULL,1,'2026-03-19 19:09:36',NULL,_binary ''),(12,'c0a4e8f71e326c1ce138129461965716:7e29726518a4e0ae96f5f9e513194a5f:43b475f297','4430fb42c2bf77071587863258273a05:17d302ed5647184f17699f7dea13cb5d:08e4d9a45ceb','d785ecbe2cbc910436a4523a3fcac732:7a8eb0f2bfcb28c62e16ae68d39ccda8:cae2bce77129568c','61946188-1B','F','6a665767e238ae412ade19ef37664fd5:ecfb8cb88d9609dd57cce1186ad51f1d:bbd4fef7b4c7c66e',NULL,'6bb85b16b912070ca1be2b19f241de6b:44e50969966e57337baa3a48f233728d:dbe5da8b2696bff755','1999-04-18','Ingeniera De Software',NULL,1,'2026-03-19 19:10:45',NULL,_binary ''),(13,'09ea0f7fa591d02ba5ce5772109a2942:69e859a81c153c7a43d6aa081076c14b:700db56ec191','0b6417e575b67e42f690234c06e574b5:757c79a51e215cf973ef866fe7c1ac87:9ee403148f','99f08557fb242a118317da8f162c67be:248e0df80105bfb25dad59aa47bcc5f3:3e443e71b8a9083df6','89861561','F','659dd3e88a6c509d2339bc8f8711d905:e6cec2adfeb71f47fdc980bc1f49ea2b:f30878c794896ba1',NULL,NULL,'2003-10-15','',NULL,1,'2026-03-19 19:12:14',NULL,_binary ''),(14,'3247e815d96fa8e138b140e7fd1e65e5:a67e0e72dc118f84ee2b0d7450d42024:2f3850d1e3674e45','07de5f7776b18fbc47fa02d00d1d3ec7:88c398d008a23ec7d0b85ba219b8ae7e:80cc1f1677d984c2fbdc',NULL,'61525241','M','3f413c6de24c849777bd70c8868ece54:242b1a5d92a03362da245a564e0418a4:1180203cfe6cc6f4',NULL,NULL,'2001-07-14','',NULL,1,'2026-03-19 19:13:02',NULL,_binary ''),(15,'4108885bdb4df39c02ae53580eb3bf22:22660a29d4bdd3cc773f86921e3ec914:6ab67aca2da9','427fac1fbbc642c3aa8c0ea5c5d9e8a9:dbcd59882d0f9afd1795439189271de5:e788e7fea3b2',NULL,'11152851','M','c1b407bc55695aca7123cb1fa6ceb43c:67dbc05fe8c7ba2cf02c9d58deaef2ae:8dbcb21d2f0cd495',NULL,NULL,'2002-04-24','',NULL,1,'2026-03-19 19:13:52',NULL,_binary ''),(16,'2ad9af46a1c1dc13c93d7858b233f2d1:229986beb4c91ef69c2e2e54c13e238b:329dab0164d47f4c','01941501dd6c553d6fd12333300ce6ac:1e0774a683495ae66b14aaae2d61732e:d6989b5470f5',NULL,'61528771','F',NULL,NULL,NULL,'2014-12-26','',NULL,1,'2026-03-19 19:16:00',NULL,_binary ''),(17,'61cab28b2b3640906c12847a0026bdd4:d011415a1d270a71b268e8a0325dde1e:9d2863e2341e','7c979a6a45c1b90009d4da9ebe73f6de:1e8c3238698a071e002e4770a1ca9b45:0ed02c91cc','369c0fc1593fd57ab42b2b90a7bda4a5:5eb1f5624031bf672f9425062d72f9ff:daf9db8453e4','30184618','F',NULL,NULL,NULL,'2018-03-16','',NULL,1,'2026-03-19 19:16:39',NULL,_binary ''),(18,'0e2710d9889db289f3c47cc7855a9aab:956730d83e0150d83f2406d4e2093d31:e9d63b064e61','dc93752fe8d17cbb4ca67c1a11844403:cb53446e686c8220ace4a745b895be88:72f3c7b1dcc53e4b46','0bf8ccba209d4f1047827c6de8894b07:d26c95deaf11d653f2c8172e77b6d4a5:9c3f591ca3','16014938','M',NULL,NULL,NULL,'2017-08-02','',NULL,1,'2026-03-19 19:18:22',NULL,_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,120.00,1,1,'2026-01-20 19:29:00',NULL,_binary ''),(2,1000.00,2,1,'2026-03-19 19:55:46',NULL,_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalpathologicalhistory`
--

LOCK TABLES `personalpathologicalhistory` WRITE;
/*!40000 ALTER TABLE `personalpathologicalhistory` DISABLE KEYS */;
INSERT INTO `personalpathologicalhistory` VALUES (1,'Anemia',1,'2026-03-19 18:43:37',NULL,_binary ''),(2,'Asma',1,'2026-03-19 18:43:39',NULL,_binary ''),(3,'Cardiopatías',1,'2026-03-19 18:43:45',NULL,_binary ''),(4,'Diabetes Mellitus',1,'2026-03-19 18:43:56',NULL,_binary ''),(5,'Enf. Gástricas',1,'2026-03-19 18:44:06',NULL,_binary ''),(6,'Epilepsia',1,'2026-03-19 18:44:10',NULL,_binary ''),(7,'Hepatitis',1,'2026-03-19 18:44:16',NULL,_binary ''),(8,'Hipertensión',1,'2026-03-19 18:44:21',NULL,_binary ''),(9,'Tuberculosis',1,'2026-03-19 18:44:28',NULL,_binary '');
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
INSERT INTO `shift` VALUES (1,'Monday','11:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(2,'Monday','11:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(3,'Monday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(4,'Monday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(5,'Monday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(6,'Monday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(7,'Monday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(8,'Monday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(9,'Monday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(10,'Monday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(11,'Monday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(12,'Monday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(13,'Monday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(14,'Monday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(15,'Monday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(16,'Monday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(17,'Monday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(18,'Monday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(19,'Monday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(20,'Monday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(21,'Monday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(22,'Monday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(23,'Monday','22:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(24,'Monday','22:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(25,'Monday','23:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(26,'Monday','23:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(27,'Tuesday','11:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(28,'Tuesday','11:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(29,'Tuesday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(30,'Tuesday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(31,'Tuesday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(32,'Tuesday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(33,'Tuesday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(34,'Tuesday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(35,'Tuesday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(36,'Tuesday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(37,'Tuesday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(38,'Tuesday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(39,'Tuesday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(40,'Tuesday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(41,'Tuesday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(42,'Tuesday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(43,'Tuesday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(44,'Tuesday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(45,'Tuesday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(46,'Tuesday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(47,'Tuesday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(48,'Tuesday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(49,'Tuesday','22:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(50,'Tuesday','22:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(51,'Tuesday','23:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(52,'Tuesday','23:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(53,'Wednesday','11:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(54,'Wednesday','11:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(55,'Wednesday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(56,'Wednesday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(57,'Wednesday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(58,'Wednesday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(59,'Wednesday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(60,'Wednesday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(61,'Wednesday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(62,'Wednesday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(63,'Wednesday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(64,'Wednesday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(65,'Wednesday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(66,'Wednesday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(67,'Wednesday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(68,'Wednesday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(69,'Wednesday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(70,'Wednesday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(71,'Wednesday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(72,'Wednesday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(73,'Wednesday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(74,'Wednesday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(75,'Wednesday','22:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(76,'Wednesday','22:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(77,'Wednesday','23:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(78,'Wednesday','23:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(79,'Thursday','11:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(80,'Thursday','11:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(81,'Thursday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(82,'Thursday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(83,'Thursday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(84,'Thursday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(85,'Thursday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(86,'Thursday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(87,'Thursday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(88,'Thursday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(89,'Thursday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(90,'Thursday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(91,'Thursday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(92,'Thursday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(93,'Thursday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(94,'Thursday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(95,'Thursday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(96,'Thursday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(97,'Thursday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(98,'Thursday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(99,'Thursday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(100,'Thursday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(101,'Thursday','22:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(102,'Thursday','22:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(103,'Thursday','23:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(104,'Thursday','23:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(105,'Friday','11:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(106,'Friday','11:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(107,'Friday','12:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(108,'Friday','12:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(109,'Friday','13:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(110,'Friday','13:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(111,'Friday','14:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(112,'Friday','14:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(113,'Friday','15:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(114,'Friday','15:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(115,'Friday','16:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(116,'Friday','16:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(117,'Friday','17:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(118,'Friday','17:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(119,'Friday','18:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(120,'Friday','18:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(121,'Friday','19:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(122,'Friday','19:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(123,'Friday','20:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(124,'Friday','20:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(125,'Friday','21:00:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(126,'Friday','21:30:00',1,'2026-02-19 18:34:43',NULL,_binary ''),(127,'Friday','22:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(128,'Friday','22:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(129,'Friday','23:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(130,'Friday','23:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(131,'Saturday','11:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(132,'Saturday','11:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(133,'Saturday','12:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(134,'Saturday','12:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(135,'Saturday','13:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(136,'Saturday','13:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(137,'Saturday','14:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(138,'Saturday','14:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(139,'Saturday','15:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(140,'Saturday','15:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(141,'Saturday','16:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(142,'Saturday','16:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(143,'Saturday','17:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(144,'Saturday','17:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(145,'Saturday','18:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(146,'Saturday','18:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(147,'Saturday','19:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(148,'Saturday','19:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(149,'Saturday','20:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(150,'Saturday','20:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(151,'Saturday','21:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(152,'Saturday','21:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(153,'Saturday','22:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(154,'Saturday','22:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(155,'Saturday','23:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(156,'Saturday','23:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(157,'Sunday','11:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(158,'Sunday','11:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(159,'Sunday','12:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(160,'Sunday','12:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(161,'Sunday','13:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(162,'Sunday','13:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(163,'Sunday','14:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(164,'Sunday','14:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(165,'Sunday','15:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(166,'Sunday','15:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(167,'Sunday','16:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(168,'Sunday','16:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(169,'Sunday','17:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(170,'Sunday','17:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(171,'Sunday','18:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(172,'Sunday','18:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(173,'Sunday','19:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(174,'Sunday','19:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(175,'Sunday','20:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(176,'Sunday','20:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(177,'Sunday','21:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(178,'Sunday','21:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(179,'Sunday','22:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(180,'Sunday','22:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(181,'Sunday','23:00:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0'),(182,'Sunday','23:30:00',1,'2026-02-19 18:34:43','2026-03-19 18:45:13',_binary '\0');
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tooth`
--

LOCK TABLES `tooth` WRITE;
/*!40000 ALTER TABLE `tooth` DISABLE KEYS */;
INSERT INTO `tooth` VALUES (1,51,'white',1,1,'2026-03-19 19:25:18',NULL),(2,52,'white',1,1,'2026-03-19 19:25:18',NULL),(3,53,'white',1,1,'2026-03-19 19:25:18',NULL),(4,54,'white',1,1,'2026-03-19 19:25:18',NULL),(5,55,'white',1,1,'2026-03-19 19:25:18',NULL),(6,61,'white',1,1,'2026-03-19 19:25:18',NULL),(7,62,'white',1,1,'2026-03-19 19:25:18',NULL),(8,63,'white',1,1,'2026-03-19 19:25:18',NULL),(9,64,'white',1,1,'2026-03-19 19:25:18',NULL),(10,65,'white',1,1,'2026-03-19 19:25:18',NULL),(11,71,'white',1,1,'2026-03-19 19:25:18',NULL),(12,72,'white',1,1,'2026-03-19 19:25:18',NULL),(13,73,'white',1,1,'2026-03-19 19:25:18',NULL),(14,74,'white',1,1,'2026-03-19 19:25:18',NULL),(15,75,'white',1,1,'2026-03-19 19:25:18',NULL),(16,81,'white',1,1,'2026-03-19 19:25:18',NULL),(17,82,'white',1,1,'2026-03-19 19:25:18',NULL),(18,83,'white',1,1,'2026-03-19 19:25:18',NULL),(19,84,'white',1,1,'2026-03-19 19:25:18',NULL),(20,85,'white',1,1,'2026-03-19 19:25:18',NULL),(21,11,'white',2,1,'2026-03-19 19:46:02',NULL),(22,12,'white',2,1,'2026-03-19 19:46:02',NULL),(23,13,'white',2,1,'2026-03-19 19:46:02',NULL),(24,14,'white',2,1,'2026-03-19 19:46:02',NULL),(25,15,'white',2,1,'2026-03-19 19:46:02',NULL),(26,16,'white',2,1,'2026-03-19 19:46:02',NULL),(27,17,'white',2,1,'2026-03-19 19:46:02',NULL),(28,18,'white',2,1,'2026-03-19 19:46:02',NULL),(29,21,'white',2,1,'2026-03-19 19:46:02',NULL),(30,22,'white',2,1,'2026-03-19 19:46:02',NULL),(31,23,'white',2,1,'2026-03-19 19:46:02',NULL),(32,24,'white',2,1,'2026-03-19 19:46:02',NULL),(33,25,'white',2,1,'2026-03-19 19:46:02',NULL),(34,26,'white',2,1,'2026-03-19 19:46:02',NULL),(35,27,'white',2,1,'2026-03-19 19:46:02',NULL),(36,28,'white',2,1,'2026-03-19 19:46:02',NULL),(37,31,'white',2,1,'2026-03-19 19:46:02',NULL),(38,32,'white',2,1,'2026-03-19 19:46:02',NULL),(39,33,'white',2,1,'2026-03-19 19:46:02',NULL),(40,34,'white',2,1,'2026-03-19 19:46:02',NULL),(41,35,'white',2,1,'2026-03-19 19:46:02',NULL),(42,36,'white',2,1,'2026-03-19 19:46:02',NULL),(43,37,'white',2,1,'2026-03-19 19:46:02',NULL),(44,38,'white',2,1,'2026-03-19 19:46:02',NULL),(45,41,'white',2,1,'2026-03-19 19:46:02',NULL),(46,42,'white',2,1,'2026-03-19 19:46:02',NULL),(47,43,'white',2,1,'2026-03-19 19:46:02',NULL),(48,44,'white',2,1,'2026-03-19 19:46:02',NULL),(49,45,'white',2,1,'2026-03-19 19:46:02',NULL),(50,46,'white',2,1,'2026-03-19 19:46:02',NULL),(51,47,'white',2,1,'2026-03-19 19:46:02',NULL),(52,48,'white',2,1,'2026-03-19 19:46:02',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=373 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toothsection`
--

LOCK TABLES `toothsection` WRITE;
/*!40000 ALTER TABLE `toothsection` DISABLE KEYS */;
INSERT INTO `toothsection` VALUES (1,'51_Distal','white',1),(2,'51_Facial','white',1),(3,'51_Mesial','white',1),(4,'51_Palatal','white',1),(5,'51_Uniradicular_Root','white',1),(6,'52_Distal','white',2),(7,'52_Facial','white',2),(8,'52_Mesial','white',2),(9,'52_Palatal','white',2),(10,'52_Uniradicular_Root','white',2),(11,'53_Distal','white',3),(12,'53_Facial','white',3),(13,'53_Mesial','white',3),(14,'53_Palatal','white',3),(15,'53_Uniradicular_Root','white',3),(16,'54_Distal','white',4),(17,'54_DistoFacial_Root','white',4),(18,'54_Facial','white',4),(19,'54_Mesial','white',4),(20,'54_MesioFacial_Root','white',4),(21,'54_Occlusal_DistoFacial','white',4),(22,'54_Occlusal_MesioFacial','white',4),(23,'54_Occlusal_Palatal','white',4),(24,'54_Palatal','white',4),(25,'54_Palatal_Root','white',4),(26,'55_Distal','white',5),(27,'55_DistoFacial_Root','white',5),(28,'55_Facial','white',5),(29,'55_Mesial','white',5),(30,'55_MesioFacial_Root','white',5),(31,'55_Occlusal_DistoFacial','white',5),(32,'55_Occlusal_MesioFacial','white',5),(33,'55_Occlusal_Palatal','white',5),(34,'55_Palatal','white',5),(35,'55_Palatal_Root','white',5),(36,'61_Distal','white',6),(37,'61_Facial','white',6),(38,'61_Mesial','white',6),(39,'61_Palatal','white',6),(40,'61_Uniradicular_Root','white',6),(41,'62_Distal','white',7),(42,'62_Facial','white',7),(43,'62_Mesial','white',7),(44,'62_Palatal','white',7),(45,'62_Uniradicular_Root','white',7),(46,'63_Distal','white',8),(47,'63_Facial','white',8),(48,'63_Mesial','white',8),(49,'63_Palatal','white',8),(50,'63_Uniradicular_Root','white',8),(51,'64_Distal','white',9),(52,'64_DistoFacial_Root','white',9),(53,'64_Facial','white',9),(54,'64_Mesial','white',9),(55,'64_MesioFacial_Root','white',9),(56,'64_Occlusal_DistoFacial','white',9),(57,'64_Occlusal_MesioFacial','white',9),(58,'64_Occlusal_Palatal','white',9),(59,'64_Palatal','white',9),(60,'64_Palatal_Root','white',9),(61,'65_Distal','white',10),(62,'65_DistoFacial_Root','white',10),(63,'65_Facial','white',10),(64,'65_Mesial','white',10),(65,'65_MesioFacial_Root','white',10),(66,'65_Occlusal_DistoFacial','white',10),(67,'65_Occlusal_MesioFacial','white',10),(68,'65_Occlusal_Palatal','white',10),(69,'65_Palatal','white',10),(70,'65_Palatal_Root','white',10),(71,'71_Distal','white',11),(72,'71_Facial','white',11),(73,'71_Lingual','white',11),(74,'71_Mesial','white',11),(75,'71_Uniradicular_Root','white',11),(76,'72_Distal','white',12),(77,'72_Facial','white',12),(78,'72_Lingual','white',12),(79,'72_Mesial','white',12),(80,'72_Uniradicular_Root','white',12),(81,'73_Distal','white',13),(82,'73_Facial','white',13),(83,'73_Lingual','white',13),(84,'73_Mesial','white',13),(85,'73_Uniradicular_Root','white',13),(86,'74_Distal','white',14),(87,'74_Distal_Root','white',14),(88,'74_Facial','white',14),(89,'74_Lingual','white',14),(90,'74_Mesial','white',14),(91,'74_Mesial_Root','white',14),(92,'74_Occlusal_DistoLingual','white',14),(93,'74_Occlusal_Facial','white',14),(94,'74_Occlusal_MesioLingual','white',14),(95,'75_Distal','white',15),(96,'75_Distal_Root','white',15),(97,'75_Facial','white',15),(98,'75_Lingual','white',15),(99,'75_Mesial','white',15),(100,'75_Mesial_Root','white',15),(101,'75_Occlusal_DistoLingual','white',15),(102,'75_Occlusal_Facial','white',15),(103,'75_Occlusal_MesioLingual','white',15),(104,'81_Distal','white',16),(105,'81_Facial','white',16),(106,'81_Lingual','white',16),(107,'81_Mesial','white',16),(108,'81_Uniradicular_Root','white',16),(109,'82_Distal','white',17),(110,'82_Facial','white',17),(111,'82_Lingual','white',17),(112,'82_Mesial','white',17),(113,'82_Uniradicular_Root','white',17),(114,'83_Distal','white',18),(115,'83_Facial','white',18),(116,'83_Lingual','white',18),(117,'83_Mesial','white',18),(118,'83_Uniradicular_Root','white',18),(119,'84_Distal','white',19),(120,'84_Distal_Root','white',19),(121,'84_Facial','white',19),(122,'84_Lingual','white',19),(123,'84_Mesial','white',19),(124,'84_Mesial_Root','white',19),(125,'84_Occlusal_DistoLingual','white',19),(126,'84_Occlusal_Facial','white',19),(127,'84_Occlusal_MesioLingual','white',19),(128,'85_Distal','white',20),(129,'85_Distal_Root','white',20),(130,'85_Facial','white',20),(131,'85_Lingual','white',20),(132,'85_Mesial','white',20),(133,'85_Mesial_Root','white',20),(134,'85_Occlusal_DistoLingual','white',20),(135,'85_Occlusal_Facial','white',20),(136,'85_Occlusal_MesioLingual','white',20),(137,'11_Distal','white',21),(138,'11_Facial','white',21),(139,'11_Mesial','white',21),(140,'11_Palatal','white',21),(141,'11_Uniradicular_Root','white',21),(142,'12_Distal','white',22),(143,'12_Facial','white',22),(144,'12_Mesial','white',22),(145,'12_Palatal','white',22),(146,'12_Uniradicular_Root','white',22),(147,'13_Distal','white',23),(148,'13_Facial','white',23),(149,'13_Mesial','white',23),(150,'13_Palatal','white',23),(151,'13_Uniradicular_Root','white',23),(152,'14_Distal','white',24),(153,'14_Distal_Root','white',24),(154,'14_Facial','white',24),(155,'14_Mesial','white',24),(156,'14_Mesial_Root','white',24),(157,'14_Occlusal_Facial','white',24),(158,'14_Occlusal_Palatal','white',24),(159,'14_Palatal','white',24),(160,'15_Distal','white',25),(161,'15_Facial','white',25),(162,'15_Mesial','white',25),(163,'15_Occlusal_DistoPalatal','white',25),(164,'15_Occlusal_Facial','white',25),(165,'15_Occlusal_MesioPalatal','white',25),(166,'15_Palatal','white',25),(167,'15_Uniradicular_Root','white',25),(168,'16_Distal','white',26),(169,'16_DistoFacial_Root','white',26),(170,'16_Facial','white',26),(171,'16_Mesial','white',26),(172,'16_MesioFacial_Root','white',26),(173,'16_Occlusal_DistoFacial','white',26),(174,'16_Occlusal_MesioFacial','white',26),(175,'16_Occlusal_Palatal','white',26),(176,'16_Palatal','white',26),(177,'16_Palatal_Root','white',26),(178,'17_Distal','white',27),(179,'17_DistoFacial_Root','white',27),(180,'17_Facial','white',27),(181,'17_Mesial','white',27),(182,'17_MesioFacial_Root','white',27),(183,'17_Occlusal_DistoFacial','white',27),(184,'17_Occlusal_MesioFacial','white',27),(185,'17_Occlusal_Palatal','white',27),(186,'17_Palatal','white',27),(187,'17_Palatal_Root','white',27),(188,'18_Distal','white',28),(189,'18_DistoFacial_Root','white',28),(190,'18_Facial','white',28),(191,'18_Mesial','white',28),(192,'18_MesioFacial_Root','white',28),(193,'18_Occlusal_DistoFacial','white',28),(194,'18_Occlusal_MesioFacial','white',28),(195,'18_Occlusal_Palatal','white',28),(196,'18_Palatal','white',28),(197,'18_Palatal_Root','white',28),(198,'21_Distal','white',29),(199,'21_Facial','white',29),(200,'21_Mesial','white',29),(201,'21_Palatal','white',29),(202,'21_Uniradicular_Root','white',29),(203,'22_Distal','white',30),(204,'22_Facial','white',30),(205,'22_Mesial','white',30),(206,'22_Palatal','white',30),(207,'22_Uniradicular_Root','white',30),(208,'23_Distal','white',31),(209,'23_Facial','white',31),(210,'23_Mesial','white',31),(211,'23_Palatal','white',31),(212,'23_Uniradicular_Root','white',31),(213,'24_Distal','white',32),(214,'24_Distal_Root','white',32),(215,'24_Facial','white',32),(216,'24_Mesial','white',32),(217,'24_Mesial_Root','white',32),(218,'24_Occlusal_Facial','white',32),(219,'24_Occlusal_Palatal','white',32),(220,'24_Palatal','white',32),(221,'25_Distal','white',33),(222,'25_Facial','white',33),(223,'25_Mesial','white',33),(224,'25_Occlusal_DistoPalatal','white',33),(225,'25_Occlusal_Facial','white',33),(226,'25_Occlusal_MesioPalatal','white',33),(227,'25_Palatal','white',33),(228,'25_Uniradicular_Root','white',33),(229,'26_Distal','white',34),(230,'26_DistoFacial_Root','white',34),(231,'26_Facial','white',34),(232,'26_Mesial','white',34),(233,'26_MesioFacial_Root','white',34),(234,'26_Occlusal_DistoFacial','white',34),(235,'26_Occlusal_MesioFacial','white',34),(236,'26_Occlusal_Palatal','white',34),(237,'26_Palatal','white',34),(238,'26_Palatal_Root','white',34),(239,'27_Distal','white',35),(240,'27_DistoFacial_Root','white',35),(241,'27_Facial','white',35),(242,'27_Mesial','white',35),(243,'27_MesioFacial_Root','white',35),(244,'27_Occlusal_DistoFacial','white',35),(245,'27_Occlusal_MesioFacial','white',35),(246,'27_Occlusal_Palatal','white',35),(247,'27_Palatal','white',35),(248,'27_Palatal_Root','white',35),(249,'28_Distal','white',36),(250,'28_DistoFacial_Root','white',36),(251,'28_Facial','white',36),(252,'28_Mesial','white',36),(253,'28_MesioFacial_Root','white',36),(254,'28_Occlusal_DistoFacial','white',36),(255,'28_Occlusal_MesioFacial','white',36),(256,'28_Occlusal_Palatal','white',36),(257,'28_Palatal','white',36),(258,'28_Palatal_Root','white',36),(259,'31_Distal','white',37),(260,'31_Facial','white',37),(261,'31_Lingual','white',37),(262,'31_Mesial','white',37),(263,'31_Uniradicular_Root','white',37),(264,'32_Distal','white',38),(265,'32_Facial','white',38),(266,'32_Lingual','white',38),(267,'32_Mesial','white',38),(268,'32_Uniradicular_Root','white',38),(269,'33_Distal','white',39),(270,'33_Facial','white',39),(271,'33_Lingual','white',39),(272,'33_Mesial','white',39),(273,'33_Uniradicular_Root','white',39),(274,'34_Distal','white',40),(275,'34_Facial','white',40),(276,'34_Lingual','white',40),(277,'34_Mesial','white',40),(278,'34_Occlusal_Facial','white',40),(279,'34_Occlusal_Lingual','white',40),(280,'34_Uniradicular_Root','white',40),(281,'35_Distal','white',41),(282,'35_Facial','white',41),(283,'35_Lingual','white',41),(284,'35_Mesial','white',41),(285,'35_Occlusal_DistoLingual','white',41),(286,'35_Occlusal_Facial','white',41),(287,'35_Occlusal_MesioLingual','white',41),(288,'35_Uniradicular_Root','white',41),(289,'36_Distal','white',42),(290,'36_Distal_Root','white',42),(291,'36_Facial','white',42),(292,'36_Lingual','white',42),(293,'36_Mesial','white',42),(294,'36_Mesial_Root','white',42),(295,'36_Occlusal_DistoLingual','white',42),(296,'36_Occlusal_Facial','white',42),(297,'36_Occlusal_MesioLingual','white',42),(298,'37_Distal','white',43),(299,'37_Distal_Root','white',43),(300,'37_Facial','white',43),(301,'37_Lingual','white',43),(302,'37_Mesial','white',43),(303,'37_Mesial_Root','white',43),(304,'37_Occlusal_DistoLingual','white',43),(305,'37_Occlusal_Facial','white',43),(306,'37_Occlusal_MesioLingual','white',43),(307,'38_Distal','white',44),(308,'38_Distal_Root','white',44),(309,'38_Facial','white',44),(310,'38_Lingual','white',44),(311,'38_Mesial','white',44),(312,'38_Mesial_Root','white',44),(313,'38_Occlusal_DistoLingual','white',44),(314,'38_Occlusal_Facial','white',44),(315,'38_Occlusal_MesioLingual','white',44),(316,'41_Distal','white',45),(317,'41_Facial','white',45),(318,'41_Lingual','white',45),(319,'41_Mesial','white',45),(320,'41_Uniradicular_Root','white',45),(321,'42_Distal','white',46),(322,'42_Facial','white',46),(323,'42_Lingual','white',46),(324,'42_Mesial','white',46),(325,'42_Uniradicular_Root','white',46),(326,'43_Distal','white',47),(327,'43_Facial','white',47),(328,'43_Lingual','white',47),(329,'43_Mesial','white',47),(330,'43_Uniradicular_Root','white',47),(331,'44_Distal','white',48),(332,'44_Facial','white',48),(333,'44_Lingual','white',48),(334,'44_Mesial','white',48),(335,'44_Occlusal_Facial','white',48),(336,'44_Occlusal_Lingual','white',48),(337,'44_Uniradicular_Root','white',48),(338,'45_Distal','white',49),(339,'45_Facial','white',49),(340,'45_Lingual','white',49),(341,'45_Mesial','white',49),(342,'45_Occlusal_DistoLingual','white',49),(343,'45_Occlusal_Facial','white',49),(344,'45_Occlusal_MesioLingual','white',49),(345,'45_Uniradicular_Root','white',49),(346,'46_Distal','white',50),(347,'46_Distal_Root','white',50),(348,'46_Facial','white',50),(349,'46_Lingual','white',50),(350,'46_Mesial','white',50),(351,'46_Mesial_Root','white',50),(352,'46_Occlusal_DistoLingual','white',50),(353,'46_Occlusal_Facial','white',50),(354,'46_Occlusal_MesioLingual','white',50),(355,'47_Distal','white',51),(356,'47_Distal_Root','white',51),(357,'47_Facial','white',51),(358,'47_Lingual','white',51),(359,'47_Mesial','white',51),(360,'47_Mesial_Root','white',51),(361,'47_Occlusal_DistoLingual','white',51),(362,'47_Occlusal_Facial','white',51),(363,'47_Occlusal_MesioLingual','white',51),(364,'48_Distal','white',52),(365,'48_Distal_Root','white',52),(366,'48_Facial','white',52),(367,'48_Lingual','white',52),(368,'48_Mesial','white',52),(369,'48_Mesial_Root','white',52),(370,'48_Occlusal_DistoLingual','white',52),(371,'48_Occlusal_Facial','white',52),(372,'48_Occlusal_MesioLingual','white',52);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (1,'Limpieza Dental',NULL,'2026-03-19 18:36:56',NULL,_binary '',1),(2,'Endodoncia',NULL,'2026-03-19 18:38:25',NULL,_binary '',1),(3,'Extracción Dental',NULL,'2026-03-19 18:38:36',NULL,_binary '',1),(4,'Implante Dental',NULL,'2026-03-19 18:39:17',NULL,_binary '',1),(5,'Blanqueamiento Dental',NULL,'2026-03-19 18:39:53',NULL,_binary '',1),(6,'Ortodoncia',NULL,'2026-03-19 18:39:59',NULL,_binary '',1),(7,'Coronas y Puentes',NULL,'2026-03-19 18:40:38',NULL,_binary '',1);
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

-- Dump completed on 2026-03-19 12:08:24
