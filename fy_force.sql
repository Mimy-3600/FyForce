-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : dim. 26 juil. 2026 à 01:42
-- Version du serveur : 9.1.0
-- Version de PHP : 8.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `fy_force`
--

-- --------------------------------------------------------

--
-- Structure de la table `artefact`
--

CREATE TABLE `artefact` (
  `ID_ARTEFACT` int NOT NULL,
  `CODE_ARTEFACT` varchar(32) DEFAULT NULL,
  `STAT_ARTEFACT` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `artefact`
--

INSERT INTO `artefact` (`ID_ARTEFACT`, `CODE_ARTEFACT`, `STAT_ARTEFACT`) VALUES
(1, 'EPEE', 25),
(2, 'BOUCLIER', 40),
(3, 'GRIMOIRE', 15),
(4, 'AMULETTE', 10),
(5, 'EPEE', 30);

-- --------------------------------------------------------

--
-- Structure de la table `correspondre`
--

CREATE TABLE `correspondre` (
  `ID_REPONSE` int NOT NULL,
  `ID_QUESTION` int NOT NULL,
  `CORRECT` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `correspondre`
--

INSERT INTO `correspondre` (`ID_REPONSE`, `ID_QUESTION`, `CORRECT`) VALUES
(1, 1, 1),
(2, 1, 0),
(3, 1, 0),
(4, 2, 1),
(5, 2, 0),
(6, 3, 1),
(7, 3, 0),
(8, 3, 0);

-- --------------------------------------------------------

--
-- Structure de la table `crafter`
--

CREATE TABLE `crafter` (
  `ID_ARTEFACT` int NOT NULL,
  `ID_ITEM` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `crafter`
--

INSERT INTO `crafter` (`ID_ARTEFACT`, `ID_ITEM`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(5, 1);

-- --------------------------------------------------------

--
-- Structure de la table `donner`
--

CREATE TABLE `donner` (
  `ID_MATCH` int NOT NULL,
  `ID_ARTEFACT` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `donner`
--

INSERT INTO `donner` (`ID_MATCH`, `ID_ARTEFACT`) VALUES
(1, 2),
(2, 4);

-- --------------------------------------------------------

--
-- Structure de la table `dropper`
--

CREATE TABLE `dropper` (
  `ID_MODULE` int NOT NULL,
  `ID_ARTEFACT` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `dropper`
--

INSERT INTO `dropper` (`ID_MODULE`, `ID_ARTEFACT`) VALUES
(1, 3),
(1, 4),
(2, 4);

-- --------------------------------------------------------

--
-- Structure de la table `generer`
--

CREATE TABLE `generer` (
  `ID_MODULE` int NOT NULL,
  `ID_QUIZ` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `generer`
--

INSERT INTO `generer` (`ID_MODULE`, `ID_QUIZ`) VALUES
(1, 1),
(2, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `item`
--

CREATE TABLE `item` (
  `ID_ITEM` int NOT NULL,
  `NOM_ITEM` varchar(128) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `item`
--

INSERT INTO `item` (`ID_ITEM`, `NOM_ITEM`) VALUES
(1, 'Fragment de fer'),
(2, 'Cristal de mana'),
(3, 'Plume de phoenix'),
(4, 'Ecaille de dragon'),
(5, 'Bois ancien'),
(0, 'Pierre d\'alchimie');

-- --------------------------------------------------------

--
-- Structure de la table `lecon`
--

CREATE TABLE `lecon` (
  `ID_LECON` int NOT NULL,
  `NOM_LECON` varchar(128) NOT NULL,
  `TERMINE` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `lecon`
--

INSERT INTO `lecon` (`ID_LECON`, `NOM_LECON`, `TERMINE`) VALUES
(1, 'Introduction aux boucles', 1),
(2, 'Les fonctions', 0),
(3, 'Programmation orientee objet', 0),
(0, 'Apprendre Node.js et Express', 0);

-- --------------------------------------------------------

--
-- Structure de la table `match`
--

CREATE TABLE `match` (
  `ID_MATCH` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `match`
--

INSERT INTO `match` (`ID_MATCH`) VALUES
(0),
(1),
(2),
(3);

-- --------------------------------------------------------

--
-- Structure de la table `module`
--

CREATE TABLE `module` (
  `ID_MODULE` int NOT NULL,
  `NOM_MODULE` varchar(128) NOT NULL,
  `CONTENU_MODULE` varchar(128) NOT NULL,
  `FINI` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `module`
--

INSERT INTO `module` (`ID_MODULE`, `NOM_MODULE`, `CONTENU_MODULE`, `FINI`) VALUES
(1, 'Boucle for', 'Contenu explicatif sur la boucle for', 1),
(2, 'Boucle while', 'Contenu explicatif sur la boucle while', 1),
(3, 'Definir une fonction', 'Contenu explicatif sur les fonctions', 0),
(4, 'Classes et objets', 'Contenu explicatif sur la POO', 0);

-- --------------------------------------------------------

--
-- Structure de la table `participer`
--

CREATE TABLE `participer` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `ID_MATCH` int NOT NULL,
  `ID_ARTEFACT` int NOT NULL,
  `PV_USER` int NOT NULL,
  `GAGNER` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `participer`
--

INSERT INTO `participer` (`EMAIL_USER`, `ID_MATCH`, `ID_ARTEFACT`, `PV_USER`, `GAGNER`) VALUES
('antsa@test.mg', 1, 1, 100, 1),
('lova@test.mg', 1, 2, 0, 0),
('mialy@test.mg', 2, 3, 90, 1),
('fenitra@test.mg', 2, 4, 60, 0),
('antsa@test.mg', 3, 5, 100, 0),
('antsa@test.mg', 0, 1, 100, 0),
('lova@test.mg', 0, 2, 100, 0);

-- --------------------------------------------------------

--
-- Structure de la table `posseder`
--

CREATE TABLE `posseder` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `ID_ARTEFACT` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `posseder`
--

INSERT INTO `posseder` (`EMAIL_USER`, `ID_ARTEFACT`) VALUES
('antsa@test.mg', 1),
('antsa@test.mg', 2),
('antsa@test.mg', 5),
('fenitra@test.mg', 4),
('lova@test.mg', 2),
('lova@test.mg', 4),
('mialy@test.mg', 3);

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

CREATE TABLE `question` (
  `ID_QUESTION` int NOT NULL,
  `LIBELLE_QUESTION` varchar(128) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `question`
--

INSERT INTO `question` (`ID_QUESTION`, `LIBELLE_QUESTION`) VALUES
(1, 'Quel mot-cle initie une boucle for en Python ?'),
(2, 'Une boucle while s\'arrete quand la condition est... ?'),
(3, 'Comment declare-t-on une fonction en JavaScript ?');

-- --------------------------------------------------------

--
-- Structure de la table `quiz`
--

CREATE TABLE `quiz` (
  `ID_QUIZ` int NOT NULL,
  `TITRE_QUIZ` varchar(128) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `quiz`
--

INSERT INTO `quiz` (`ID_QUIZ`, `TITRE_QUIZ`) VALUES
(1, 'Quiz - Boucle for'),
(2, 'Quiz - Boucle while'),
(3, 'Quiz - Fonctions');

-- --------------------------------------------------------

--
-- Structure de la table `recevoir`
--

CREATE TABLE `recevoir` (
  `ID_ITEM` int NOT NULL,
  `EMAIL_USER` varchar(128) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `recevoir`
--

INSERT INTO `recevoir` (`ID_ITEM`, `EMAIL_USER`) VALUES
(1, 'antsa@test.mg'),
(1, 'lova@test.mg'),
(2, 'antsa@test.mg'),
(3, 'lova@test.mg'),
(4, 'mialy@test.mg'),
(5, 'fenitra@test.mg');

-- --------------------------------------------------------

--
-- Structure de la table `regrouper`
--

CREATE TABLE `regrouper` (
  `ID_LECON` int NOT NULL,
  `ID_MODULE` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `regrouper`
--

INSERT INTO `regrouper` (`ID_LECON`, `ID_MODULE`) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4);

-- --------------------------------------------------------

--
-- Structure de la table `reponse`
--

CREATE TABLE `reponse` (
  `ID_REPONSE` int NOT NULL,
  `LIBELLE_REPONSE` varchar(128) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reponse`
--

INSERT INTO `reponse` (`ID_REPONSE`, `LIBELLE_REPONSE`) VALUES
(1, 'for'),
(2, 'while'),
(3, 'foreach'),
(4, 'Fausse'),
(5, 'Vraie'),
(6, 'function nom() {}'),
(7, 'def nom():'),
(8, 'func nom() {}');

-- --------------------------------------------------------

--
-- Structure de la table `travailler`
--

CREATE TABLE `travailler` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `ID_LECON` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `travailler`
--

INSERT INTO `travailler` (`EMAIL_USER`, `ID_LECON`) VALUES
('antsa@test.mg', 1),
('antsa@test.mg', 2),
('fenitra@test.mg', 2),
('lova@test.mg', 1),
('mialy@test.mg', 1);

-- --------------------------------------------------------

--
-- Structure de la table `type_artefact`
--

CREATE TABLE `type_artefact` (
  `CODE_ARTEFACT` varchar(32) NOT NULL,
  `LIBELLE_ARTEFACT` varchar(128) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `type_artefact`
--

INSERT INTO `type_artefact` (`CODE_ARTEFACT`, `LIBELLE_ARTEFACT`) VALUES
('EPEE', 'Epee'),
('BOUCLIER', 'Bouclier'),
('GRIMOIRE', 'Grimoire'),
('AMULETTE', 'Amulette');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `NOM_USER` varchar(128) NOT NULL,
  `PRENOM_USER` varchar(128) NOT NULL,
  `PHOTO_USER` longblob NOT NULL,
  `PASSWORD_USER` varchar(128) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`EMAIL_USER`, `NOM_USER`, `PRENOM_USER`, `PHOTO_USER`, `PASSWORD_USER`) VALUES
('john.doe@example.com', 'Doe Updated', 'Johnny', 0x68747470733a2f2f6578616d706c652e636f6d2f6e65772d6176617461722e6a7067, 'NewPassword2026!'),
('antsa@test.mg', 'Andriamialisoa', 'Antsa', '', '$2y$10$fakehash1'),
('lova@test.mg', 'Rakoto', 'Lova', '', '$2y$10$fakehash2'),
('mialy@test.mg', 'Razafy', 'Mialy', '', '$2y$10$fakehash3'),
('fenitra@test.mg', 'Randria', 'Fenitra', '', '$2y$10$fakehash4'),
('george@test.mg', 'John COnnor', 'Antsa', 0x75706c6f6164732f50484f544f5f555345522d313738353032343130343537372d3935373934373439362e706e67, '$2b$10$WcRT6BwzytM3My5ZeBOOCOa3kNgfeJ5lKnaOkwk6lUJgpIOF.cWBC'),
('Antsajony@gmail.com', 'Miaous', 'Pokemon', 0x75706c6f6164732f50484f544f5f555345522d313738353032383036333138362d3335373631353935362e706e67, '$2b$10$fb76okCBlOXoODDjKSmyIOeuEX.GNJLSCrw/umfV2tiUg3lcOEweS');

-- --------------------------------------------------------

--
-- Structure de la table `utiliser`
--

CREATE TABLE `utiliser` (
  `ID_QUESTION` int NOT NULL,
  `ID_QUIZ` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utiliser`
--

INSERT INTO `utiliser` (`ID_QUESTION`, `ID_QUIZ`) VALUES
(1, 1),
(2, 2),
(3, 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `artefact`
--
ALTER TABLE `artefact`
  ADD PRIMARY KEY (`ID_ARTEFACT`),
  ADD KEY `I_FK_ARTEFACT_TYPE_ARTEFACT` (`CODE_ARTEFACT`);

--
-- Index pour la table `correspondre`
--
ALTER TABLE `correspondre`
  ADD PRIMARY KEY (`ID_REPONSE`,`ID_QUESTION`),
  ADD KEY `I_FK_CORRESPONDRE_REPONSE` (`ID_REPONSE`),
  ADD KEY `I_FK_CORRESPONDRE_QUESTION` (`ID_QUESTION`);

--
-- Index pour la table `crafter`
--
ALTER TABLE `crafter`
  ADD PRIMARY KEY (`ID_ARTEFACT`,`ID_ITEM`),
  ADD KEY `I_FK_CRAFTER_ARTEFACT` (`ID_ARTEFACT`),
  ADD KEY `I_FK_CRAFTER_ITEM` (`ID_ITEM`);

--
-- Index pour la table `donner`
--
ALTER TABLE `donner`
  ADD PRIMARY KEY (`ID_MATCH`,`ID_ARTEFACT`),
  ADD KEY `I_FK_DONNER_MATCH` (`ID_MATCH`),
  ADD KEY `I_FK_DONNER_ARTEFACT` (`ID_ARTEFACT`);

--
-- Index pour la table `dropper`
--
ALTER TABLE `dropper`
  ADD PRIMARY KEY (`ID_MODULE`,`ID_ARTEFACT`),
  ADD KEY `I_FK_DROPPER_MODULE` (`ID_MODULE`),
  ADD KEY `I_FK_DROPPER_ARTEFACT` (`ID_ARTEFACT`);

--
-- Index pour la table `generer`
--
ALTER TABLE `generer`
  ADD PRIMARY KEY (`ID_MODULE`,`ID_QUIZ`),
  ADD KEY `I_FK_GENERER_MODULE` (`ID_MODULE`),
  ADD KEY `I_FK_GENERER_QUIZ` (`ID_QUIZ`);

--
-- Index pour la table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`ID_ITEM`);

--
-- Index pour la table `lecon`
--
ALTER TABLE `lecon`
  ADD PRIMARY KEY (`ID_LECON`);

--
-- Index pour la table `match`
--
ALTER TABLE `match`
  ADD PRIMARY KEY (`ID_MATCH`);

--
-- Index pour la table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`ID_MODULE`);

--
-- Index pour la table `participer`
--
ALTER TABLE `participer`
  ADD PRIMARY KEY (`EMAIL_USER`,`ID_MATCH`,`ID_ARTEFACT`),
  ADD KEY `I_FK_PARTICIPER_USER` (`EMAIL_USER`),
  ADD KEY `I_FK_PARTICIPER_MATCH` (`ID_MATCH`),
  ADD KEY `I_FK_PARTICIPER_ARTEFACT` (`ID_ARTEFACT`);

--
-- Index pour la table `posseder`
--
ALTER TABLE `posseder`
  ADD PRIMARY KEY (`EMAIL_USER`,`ID_ARTEFACT`),
  ADD KEY `I_FK_POSSEDER_USER` (`EMAIL_USER`),
  ADD KEY `I_FK_POSSEDER_ARTEFACT` (`ID_ARTEFACT`);

--
-- Index pour la table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`ID_QUESTION`);

--
-- Index pour la table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`ID_QUIZ`);

--
-- Index pour la table `recevoir`
--
ALTER TABLE `recevoir`
  ADD PRIMARY KEY (`ID_ITEM`,`EMAIL_USER`),
  ADD KEY `I_FK_RECEVOIR_ITEM` (`ID_ITEM`),
  ADD KEY `I_FK_RECEVOIR_USER` (`EMAIL_USER`);

--
-- Index pour la table `regrouper`
--
ALTER TABLE `regrouper`
  ADD PRIMARY KEY (`ID_LECON`,`ID_MODULE`),
  ADD KEY `I_FK_REGROUPER_LECON` (`ID_LECON`),
  ADD KEY `I_FK_REGROUPER_MODULE` (`ID_MODULE`);

--
-- Index pour la table `reponse`
--
ALTER TABLE `reponse`
  ADD PRIMARY KEY (`ID_REPONSE`);

--
-- Index pour la table `travailler`
--
ALTER TABLE `travailler`
  ADD PRIMARY KEY (`EMAIL_USER`,`ID_LECON`),
  ADD KEY `I_FK_TRAVAILLER_USER` (`EMAIL_USER`),
  ADD KEY `I_FK_TRAVAILLER_LECON` (`ID_LECON`);

--
-- Index pour la table `type_artefact`
--
ALTER TABLE `type_artefact`
  ADD PRIMARY KEY (`CODE_ARTEFACT`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`EMAIL_USER`);

--
-- Index pour la table `utiliser`
--
ALTER TABLE `utiliser`
  ADD PRIMARY KEY (`ID_QUESTION`,`ID_QUIZ`),
  ADD KEY `I_FK_UTILISER_QUESTION` (`ID_QUESTION`),
  ADD KEY `I_FK_UTILISER_QUIZ` (`ID_QUIZ`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
