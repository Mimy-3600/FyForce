-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 26 juil. 2026 à 01:34
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
(1, 1, 0),
(2, 1, 1),
(3, 1, 0),
(4, 2, 1),
(5, 2, 0),
(6, 2, 0),
(7, 3, 0),
(8, 3, 1),
(9, 3, 0),
(10, 4, 0),
(11, 4, 1),
(12, 4, 0),
(13, 5, 0),
(14, 5, 1),
(15, 5, 0),
(16, 6, 1),
(17, 6, 0),
(18, 6, 0),
(19, 7, 0),
(20, 7, 1),
(21, 7, 0),
(22, 8, 0),
(23, 8, 1),
(24, 8, 0),
(25, 9, 1),
(26, 9, 0),
(27, 9, 0),
(28, 10, 0),
(29, 10, 1),
(30, 10, 0),
(31, 11, 0),
(32, 11, 1),
(33, 11, 0),
(34, 12, 1),
(35, 12, 0),
(36, 12, 0),
(37, 13, 0),
(38, 13, 1),
(39, 13, 0),
(40, 14, 0),
(41, 14, 1),
(42, 14, 0),
(43, 15, 1),
(44, 15, 0),
(45, 15, 0),
(46, 16, 0),
(47, 16, 1),
(48, 16, 0),
(49, 17, 0),
(50, 17, 1),
(51, 17, 0);

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
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

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
(1, 'Apprendre le java', 0);

-- --------------------------------------------------------

--
-- Structure de la table `module`
--

CREATE TABLE `module` (
  `ID_MODULE` int(11) NOT NULL,
  `NOM_MODULE` varchar(128) NOT NULL,
  `CONTENU_MODULE` varchar(128) NOT NULL,
  `FINI` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `module`
--

INSERT INTO `module` (`ID_MODULE`, `NOM_MODULE`, `CONTENU_MODULE`, `FINI`) VALUES
(1, 'Planification et Réduction Délibérée du Scope (Scope Cut)', 'Pour finir un projet de jeu vidéo ambitieux en seulement 24 heures, la clé absolue est le \'scope cut\' (la réduction d\'ambition).', 0),
(2, 'Gestion du Temps et Time-Boxing', 'Travailler pendant 24h requiert une discipline de fer. Divisez votre temps en blocs stricts (Time-boxing) : 2h de prototype, 8h ', 0),
(3, 'Polish Express et \'Juiciness\'', 'Ce qui transforme un prototype ennuyeux en un jeu amusant en peu de temps, c\'est le \'Juiciness\' (les retours visuels et sonores)', 0),
(4, 'Builds, Tests et Export d\'Urgence', 'N\'attendez jamais la dernière heure pour effectuer votre premier export (Build). Les moteurs de jeu (Unity, Unreal, Godot) renco', 0),
(5, 'Préparation et physiologie de la nuit blanche', 'Pour tenir une nuit entière sans ressentir une fatigue écrasante, la préparation commence en amont. Il est crucial d\'accumuler u', 0),
(6, 'Techniques de maintien de l\'éveil durant la nuit', 'Pendant la nuit, l\'environnement et vos habitudes dictent votre niveau d\'alerte. Exposez-vous à une lumière blanche ou bleue int', 0),
(7, 'Gestion du lendemain et récupération', 'Le lendemain d\'une nuit blanche, le corps subit une baisse d\'énergie importante, souvent marquée au lever du jour et en milieu d', 0),
(8, 'Introduction et Syntaxe de Base', 'Java est un langage de programmation orienté objet, fortement typé et exécuté sur la Machine Virtuelle Java (JVM). Dans ce modul', 0),
(9, 'La Programmation Orientée Objet (POO)', 'La Programmation Orientée Objet est le cœur de Java. Ce module couvre la création de classes et d\'objets, l\'instanciation avec \'', 0),
(10, 'Gestion des Exceptions et Collections', 'Pour écrire des applications robustes, vous devez savoir gérer les erreurs et structurer vos données. Ce module aborde le traite', 0);

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
(1, 'Quelle est la priorité absolue dans un projet de jeu court (24h) ?'),
(2, 'Que signifie faire un \'Scope Cut\' ?'),
(3, 'Qu\'est-ce que le \'Feature Freeze\' ?'),
(4, 'Lequel de ces éléments apporte du \'Juiciness\' rapidement ?'),
(5, 'Quand faut-il faire le tout premier build de test ?'),
(6, 'Quel type de repas est-il préférable d\'éviter avant une nuit blanche ?'),
(7, 'Pourquoi l\'hydratation est-elle essentielle pour rester éveillé ?'),
(8, 'Quel effet la lumière intense a-t-elle sur le corps pendant la nuit ?'),
(9, 'Quelle est la durée idéale d\'une micro-sieste pour éviter l\'inertie du sommeil ?'),
(10, 'Quelle est la meilleure action le matin suivant une nuit blanche ?'),
(11, 'Comment réajuster son rythme de sommeil le soir suivant ?'),
(12, 'Quel est le point d\'entrée principal d\'un programme Java ?'),
(13, 'Quel type de données est utilisé pour stocker du texte en Java ?'),
(14, 'Quel mot-clé permet à une classe d\'hériter d\'une autre classe en Java ?'),
(15, 'À quoi sert le mot-clé \'this\' ?'),
(16, 'Quelle interface du framework Collections n\'autorise pas les doublons ?'),
(17, 'Quel bloc est exécuté indépendamment de la levée d\'une exception ?');

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
(1, 'Quiz sur la gestion du Scope'),
(2, 'Quiz sur le Time-Boxing'),
(3, 'Quiz sur le Polish'),
(4, 'Quiz sur le processus de Build'),
(5, 'Quiz : La préparation avant la nuit blanche'),
(6, 'Quiz : Rester éveillé pendant la nuit'),
(7, 'Quiz : Récupération et gestion du lendemain'),
(8, 'Quiz - Syntaxe de Base'),
(9, 'Quiz - Concepts POO'),
(10, 'Quiz - Exceptions et Collections');

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
(1, 8),
(1, 9),
(1, 10);

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
(1, 'Créer un scénario complexe avec plusieurs fins'),
(2, 'Définir et isoler la boucle de gameplay minimale (MVP)'),
(3, 'Concevoir des graphismes 4K haute fidélité'),
(4, 'Supprimer des fonctionnalités non essentielles pour tenir les délais'),
(5, 'Réduire la résolution d\'affichage du jeu'),
(6, 'Augmenter la taille de l\'équipe de développement'),
(7, 'Un bug qui gèle l\'écran de jeu'),
(8, 'Le moment à partir duquel plus aucune fonctionnalité n\'est ajoutée'),
(9, 'Une pause obligatoire de 2 heures pour l\'équipe'),
(10, 'Un menu d\'options avec 50 paramètres'),
(11, 'Du Screen Shake et des retours sonores immédiats'),
(12, 'Un système de sauvegarde en ligne'),
(13, '10 minutes avant la date limite'),
(14, 'Dès les premières heures de développement'),
(15, 'Uniquement une fois que tous les niveaux sont finis'),
(16, 'Les repas lourds et riches en glucides simples'),
(17, 'Les repas riches en protéines légères'),
(18, 'Les légumes verts et les fibres'),
(19, 'Elle remplace totalement le besoin physiologique de dormir'),
(20, 'La déshydratation augmente la sensation de fatigue physique et mentale'),
(21, 'Elle fait baisser la température corporelle pour favoriser le sommeil'),
(22, 'Elle stimule la production de mélatonine'),
(23, 'Elle bloque la sécrétion de mélatonine'),
(24, 'Elle ralentit le rythme cardiaque'),
(25, '10 à 20 minutes'),
(26, '45 à 60 minutes'),
(27, '90 minutes'),
(28, 'Dormir 4 heures immédiatement au réveil'),
(29, 'S\'exposer à la lumière naturelle du soleil'),
(30, 'Prendre un bain chaud et rester au lit'),
(31, 'Faire une autre nuit blanche pour compenser'),
(32, 'Se coucher à une heure normale ou légèrement plus tôt'),
(33, 'Consommer de la caféine tard en soirée'),
(34, 'public static void main(String[] args)'),
(35, 'public void start()'),
(36, 'static void init()'),
(37, 'char'),
(38, 'String'),
(39, 'Text'),
(40, 'implements'),
(41, 'extends'),
(42, 'inherits'),
(43, 'À faire référence à l\'instance courante de la classe'),
(44, 'À créer une nouvelle instance'),
(45, 'À appeler la classe parente'),
(46, 'List'),
(47, 'Set'),
(48, 'Map'),
(49, 'catch'),
(50, 'finally'),
(51, 'try');

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
  `PHOTO_USER` longblob NOT NULL,
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
(1, 1),
(2, 1),
(3, 2),
(4, 3),
(5, 4),
(6, 5),
(7, 5),
(8, 6),
(9, 6),
(10, 7),
(11, 7),
(12, 8),
(13, 8),
(14, 9),
(15, 9),
(16, 10),
(17, 10);

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
  MODIFY `ID_LECON` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `module`
--
ALTER TABLE `module`
  MODIFY `ID_MODULE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `question`
--
ALTER TABLE `question`
  MODIFY `ID_QUESTION` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `ID_QUIZ` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `reponse`
--
ALTER TABLE `reponse`
  MODIFY `ID_REPONSE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

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
