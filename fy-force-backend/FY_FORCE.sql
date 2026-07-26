-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 26 juil. 2026 à 09:12
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

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
  `ID_ARTEFACT` int(11) NOT NULL,
  `CODE_ARTEFACT` char(32) DEFAULT NULL,
  `STAT_ARTEFACT` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `correspondre`
--

CREATE TABLE `correspondre` (
  `ID_REPONSE` int(11) NOT NULL,
  `ID_QUESTION` int(11) NOT NULL,
  `CORRECT` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `correspondre`
--

INSERT INTO `correspondre` (`ID_REPONSE`, `ID_QUESTION`, `CORRECT`) VALUES
(52, 18, 0),
(53, 18, 1),
(54, 18, 0),
(55, 18, 0),
(56, 19, 0),
(57, 19, 1),
(58, 19, 0),
(59, 20, 0),
(60, 20, 1),
(61, 20, 0),
(62, 20, 0),
(63, 21, 0),
(64, 21, 1),
(65, 21, 0),
(66, 22, 1),
(67, 22, 0),
(68, 22, 0),
(69, 23, 0),
(70, 23, 1),
(71, 23, 0),
(72, 24, 0),
(73, 24, 1),
(74, 24, 0),
(75, 25, 0),
(76, 25, 0),
(77, 25, 1),
(78, 25, 0),
(79, 26, 0),
(80, 26, 1),
(81, 26, 0),
(82, 27, 0),
(83, 27, 1),
(84, 27, 0),
(85, 28, 0),
(86, 28, 1),
(87, 28, 0),
(88, 29, 1),
(89, 29, 0),
(90, 29, 0),
(91, 30, 1),
(92, 30, 0),
(93, 30, 0),
(94, 31, 0),
(95, 31, 1),
(96, 31, 0),
(97, 32, 0),
(98, 32, 1),
(99, 32, 0),
(100, 33, 0),
(101, 33, 0),
(102, 33, 1);

-- --------------------------------------------------------

--
-- Structure de la table `crafter`
--

CREATE TABLE `crafter` (
  `ID_ARTEFACT` int(11) NOT NULL,
  `ID_ITEM` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `destiner`
--

CREATE TABLE `destiner` (
  `ID_NOTIFICATION` int(11) NOT NULL,
  `EMAIL_USER` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `donner`
--

CREATE TABLE `donner` (
  `ID_MATCH` int(11) NOT NULL,
  `ID_ARTEFACT` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `dropper`
--

CREATE TABLE `dropper` (
  `ID_MODULE` int(11) NOT NULL,
  `ID_ARTEFACT` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `generer`
--

CREATE TABLE `generer` (
  `ID_MODULE` int(11) NOT NULL,
  `ID_QUIZ` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `generer`
--

INSERT INTO `generer` (`ID_MODULE`, `ID_QUIZ`) VALUES
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18);

-- --------------------------------------------------------

--
-- Structure de la table `item`
--

CREATE TABLE `item` (
  `ID_ITEM` int(11) NOT NULL,
  `NOM_ITEM` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lecon`
--

CREATE TABLE `lecon` (
  `ID_LECON` int(11) NOT NULL,
  `NOM_LECON` varchar(128) NOT NULL,
  `TERMINE` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lecon`
--

INSERT INTO `lecon` (`ID_LECON`, `NOM_LECON`, `TERMINE`) VALUES
(2, 'Apprendre le node js', 0),
(3, 'Apprendre le node js', 0);

-- --------------------------------------------------------

--
-- Structure de la table `module`
--

CREATE TABLE `module` (
  `ID_MODULE` int(11) NOT NULL,
  `NOM_MODULE` varchar(128) NOT NULL,
  `CONTENU_MODULE` varchar(128) NOT NULL,
  `NIVEAU_MODULE` int(1) NOT NULL,
  `FINI` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `module`
--

INSERT INTO `module` (`ID_MODULE`, `NOM_MODULE`, `CONTENU_MODULE`, `NIVEAU_MODULE`, `FINI`) VALUES
(11, 'Introduction à Node.js et Installation', 'Node.js est un environnement d\'exécution JavaScript côté serveur, bâti sur le moteur V8 de Google Chrome. Il permet d\'exécuter d', 1, 0),
(12, 'Le système de modules (CommonJS et ES Modules)', 'Node.js utilise un système de modules pour découper le code en fichiers réutilisables. Historiquement, Node.js utilise le format', 2, 0),
(13, 'L\'Event Loop et l\'Asynchronisme', 'L\'Event Loop (boucle d\'événements) est le cœur de Node.js. Bien que Node.js s\'exécute sur un seul thread (mono-thread), l\'Event ', 3, 0),
(14, 'Création d\'une API REST avec Express.js', 'Express est le framework web minimaliste et flexible le plus populaire pour Node.js. Il facilite la création de serveurs web, la', 4, 0),
(15, 'Introduction à Node.js et Installation', 'Node.js est un environnement d\'exécution JavaScript côté serveur, bâti sur le moteur V8 de Google Chrome. Il permet d\'exécuter d', 1, 0),
(16, 'Gestion des Modules et NPM', 'Node.js s\'appuie sur une architecture modulaire. Historiquement, il utilise le système CommonJS avec \'require()\' et \'module.expo', 2, 0),
(17, 'Programmation Asynchrone et Event Loop', 'Le cœur de Node.js repose sur l\'Event Loop (boucle d\'événements) et un modèle monothread. Les opérations lourdes (lecture de fic', 3, 0),
(18, 'Créer une API REST avec Express.js', 'Express.js est le framework web le plus populaire pour Node.js. Il simplifie la création de serveurs HTTP et la mise en place d\'', 4, 0);

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `id_notification` int(11) NOT NULL,
  `type_notification` varchar(50) NOT NULL,
  `contenu_notification` varchar(255) NOT NULL,
  `date_notification` date NOT NULL,
  `EMAIL_USER` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `participer`
--

CREATE TABLE `participer` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `ID_MATCH` int(11) NOT NULL,
  `ID_ARTEFACT` int(11) NOT NULL,
  `PV_USER` int(11) NOT NULL,
  `GAGNER` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `posseder`
--

CREATE TABLE `posseder` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `ID_ARTEFACT` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

CREATE TABLE `question` (
  `ID_QUESTION` int(11) NOT NULL,
  `LIBELLE_QUESTION` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `question`
--

INSERT INTO `question` (`ID_QUESTION`, `LIBELLE_QUESTION`) VALUES
(18, 'Quel moteur JavaScript est utilisé par Node.js ?'),
(19, 'Node.js est principalement axé sur quel type de modèle d\'I/O ?'),
(20, 'Quelle fonction est utilisée pour importer un module avec le système CommonJS ?'),
(21, 'Comment exporte-t-on une valeur en CommonJS ?'),
(22, 'Node.js exécute le code utilisateur sur combien de threads principaux ?'),
(23, 'Quelle structure moderne permet de traiter l\'asynchronisme de manière lisible ?'),
(24, 'Qu\'est-ce qu\'un middleware dans Express ?'),
(25, 'Quelle méthode HTTP est généralement utilisée pour créer une nouvelle ressource ?'),
(26, 'Qu\'est-ce que Node.js ?'),
(27, 'Quel moteur JavaScript est utilisé par Node.js ?'),
(28, 'Quelle fonction CommonJS permet d\'importer un module dans Node.js ?'),
(29, 'Quel fichier contient la liste des dépendances d\'un projet Node.js ?'),
(30, 'Quel est le principal avantage de l\'Event Loop et des E/S non bloquantes ?'),
(31, 'Quelle syntaxe permet de traiter une promesse de façon plus lisible et linéaire ?'),
(32, 'Qu\'est-ce qu\'un middleware dans Express ?'),
(33, 'Quel verbe HTTP est généralement utilisé pour créer une nouvelle ressource ?');

-- --------------------------------------------------------

--
-- Structure de la table `quiz`
--

CREATE TABLE `quiz` (
  `ID_QUIZ` int(11) NOT NULL,
  `TITRE_QUIZ` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `quiz`
--

INSERT INTO `quiz` (`ID_QUIZ`, `TITRE_QUIZ`) VALUES
(11, 'Quiz sur les bases de Node.js'),
(12, 'Quiz sur les Modules'),
(13, 'Quiz sur l\'Event Loop et l\'asynchronisme'),
(14, 'Quiz Express.js'),
(15, 'Quiz : Les bases de Node.js'),
(16, 'Quiz : Modules et NPM'),
(17, 'Quiz : L\'asynchronisme dans Node.js'),
(18, 'Quiz : Express.js et API REST');

-- --------------------------------------------------------

--
-- Structure de la table `recevoir`
--

CREATE TABLE `recevoir` (
  `ID_ITEM` int(11) NOT NULL,
  `EMAIL_USER` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `regrouper`
--

CREATE TABLE `regrouper` (
  `ID_LECON` int(11) NOT NULL,
  `ID_MODULE` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `regrouper`
--

INSERT INTO `regrouper` (`ID_LECON`, `ID_MODULE`) VALUES
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(3, 15),
(3, 16),
(3, 17),
(3, 18);

-- --------------------------------------------------------

--
-- Structure de la table `reponse`
--

CREATE TABLE `reponse` (
  `ID_REPONSE` int(11) NOT NULL,
  `LIBELLE_REPONSE` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reponse`
--

INSERT INTO `reponse` (`ID_REPONSE`, `LIBELLE_REPONSE`) VALUES
(52, 'SpiderMonkey'),
(53, 'V8'),
(54, 'Chakra'),
(55, 'JavaScriptCore'),
(56, 'Bloquant et synchrone'),
(57, 'Non bloquant et asynchrone'),
(58, 'Multi-threadé traditionnel'),
(59, 'import()'),
(60, 'require()'),
(61, 'include()'),
(62, 'fetch()'),
(63, 'export default'),
(64, 'module.exports'),
(65, 'exports.send'),
(66, '1 seul thread'),
(67, '4 threads'),
(68, 'Autant de threads que de cœurs CPU'),
(69, 'Les boucles for-in'),
(70, 'async / await'),
(71, 'Les événements synchrones'),
(72, 'Une base de données intégrée'),
(73, 'Une fonction qui a accès aux objets requete (req) et reponse (res)'),
(74, 'Un compilateur JavaScript'),
(75, 'GET'),
(76, 'PUT'),
(77, 'POST'),
(78, 'DELETE'),
(79, 'Un framework CSS pour le design web'),
(80, 'Un environnement d\'exécution JavaScript côté serveur'),
(81, 'Une base de données relationnelle'),
(82, 'SpiderMonkey'),
(83, 'V8'),
(84, 'Chakra'),
(85, 'importModule()'),
(86, 'require()'),
(87, 'include()'),
(88, 'package.json'),
(89, 'node_modules.json'),
(90, 'config.js'),
(91, 'Traiter d\'autres requêtes pendant qu\'une opération longue s\'exécute'),
(92, 'Exécuter le code plus rapidement qu\'en C++'),
(93, 'Forcer l\'exécution synchrone de toutes les tâches'),
(94, 'try/catch direct'),
(95, 'async/await'),
(96, 'defer/stream'),
(97, 'Une base de données temporaire'),
(98, 'Une fonction interceptant et traitant la requête avant de passer à la suivante'),
(99, 'Un compilateur JavaScript'),
(100, 'GET'),
(101, 'PUT'),
(102, 'POST');

-- --------------------------------------------------------

--
-- Structure de la table `travailler`
--

CREATE TABLE `travailler` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `ID_LECON` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_artefact`
--

CREATE TABLE `type_artefact` (
  `CODE_ARTEFACT` char(32) NOT NULL,
  `LIBELLE_ARTEFACT` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `EMAIL_USER` varchar(128) NOT NULL,
  `NOM_USER` varchar(128) NOT NULL,
  `PRENOM_USER` varchar(128) NOT NULL,
  `PHOTO_USER` varchar(255) NOT NULL,
  `PASSWORD_USER` varchar(128) NOT NULL,
  `XP_USER` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utiliser`
--

CREATE TABLE `utiliser` (
  `ID_QUESTION` int(11) NOT NULL,
  `ID_QUIZ` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utiliser`
--

INSERT INTO `utiliser` (`ID_QUESTION`, `ID_QUIZ`) VALUES
(18, 11),
(19, 11),
(20, 12),
(21, 12),
(22, 13),
(23, 13),
(24, 14),
(25, 14),
(26, 15),
(27, 15),
(28, 16),
(29, 16),
(30, 17),
(31, 17),
(32, 18),
(33, 18);

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
-- Index pour la table `destiner`
--
ALTER TABLE `destiner`
  ADD PRIMARY KEY (`ID_NOTIFICATION`,`EMAIL_USER`),
  ADD KEY `I_DESTINER_NOTIFICATION` (`ID_NOTIFICATION`),
  ADD KEY `I_FK_DESTINER_USER` (`EMAIL_USER`);

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
-- Index pour la table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`ID_MODULE`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id_notification`),
  ADD KEY `I_FK_NOTIFICATION_USER` (`EMAIL_USER`) USING BTREE;

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

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `artefact`
--
ALTER TABLE `artefact`
  MODIFY `ID_ARTEFACT` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `item`
--
ALTER TABLE `item`
  MODIFY `ID_ITEM` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `lecon`
--
ALTER TABLE `lecon`
  MODIFY `ID_LECON` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `module`
--
ALTER TABLE `module`
  MODIFY `ID_MODULE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `id_notification` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `question`
--
ALTER TABLE `question`
  MODIFY `ID_QUESTION` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `ID_QUIZ` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `reponse`
--
ALTER TABLE `reponse`
  MODIFY `ID_REPONSE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `artefact`
--
ALTER TABLE `artefact`
  ADD CONSTRAINT `FK_ARTEFACT_TYPE_ARTEFACT` FOREIGN KEY (`CODE_ARTEFACT`) REFERENCES `type_artefact` (`CODE_ARTEFACT`);

--
-- Contraintes pour la table `participer`
--
ALTER TABLE `participer`
  ADD CONSTRAINT `FK_PARTICIPER_USER` FOREIGN KEY (`EMAIL_USER`) REFERENCES `user` (`EMAIL_USER`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
