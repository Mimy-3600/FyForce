DROP DATABASE IF EXISTS FY_FORCE;

CREATE DATABASE IF NOT EXISTS FY_FORCE;
USE FY_FORCE;

# -----------------------------------------------------------------------------
#       TABLE : USER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `USER`
(
   EMAIL_USER VARCHAR(128) NOT NULL,
   NOM_USER VARCHAR(128) NOT NULL,
   PRENOM_USER VARCHAR(128) NOT NULL,
   PHOTO_USER LONGBLOB NOT NULL,
   PASSWORD_USER VARCHAR(128) NOT NULL,
   PRIMARY KEY (EMAIL_USER) 
);

# -----------------------------------------------------------------------------
#       TABLE : MATCH
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `MATCH`
(
   ID_MATCH INT NOT NULL,
   PRIMARY KEY (ID_MATCH) 
);

# -----------------------------------------------------------------------------
#       TABLE : ITEM
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ITEM
(
   ID_ITEM INT NOT NULL,
   NOM_ITEM VARCHAR(128) NOT NULL,
   PRIMARY KEY (ID_ITEM) 
);

# -----------------------------------------------------------------------------
#       TABLE : TYPE_ARTEFACT
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS TYPE_ARTEFACT
(
   CODE_ARTEFACT VARCHAR(32) NOT NULL,
   LIBELLE_ARTEFACT VARCHAR(128) NOT NULL,
   PRIMARY KEY (CODE_ARTEFACT) 
);

# -----------------------------------------------------------------------------
#       TABLE : MODULE
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS MODULE
(
   ID_MODULE INT NOT NULL,
   NOM_MODULE VARCHAR(128) NOT NULL,
   CONTENU_MODULE VARCHAR(128) NOT NULL,
   FINI BOOLEAN NOT NULL,
   PRIMARY KEY (ID_MODULE) 
);

# -----------------------------------------------------------------------------
#       TABLE : ARTEFACT
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ARTEFACT
(
   ID_ARTEFACT INT NOT NULL,
   CODE_ARTEFACT VARCHAR(32) NULL,
   STAT_ARTEFACT INT NOT NULL,
   PRIMARY KEY (ID_ARTEFACT) 
);

CREATE INDEX I_FK_ARTEFACT_TYPE_ARTEFACT
   ON ARTEFACT (CODE_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : QUIZ
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS QUIZ
(
   ID_QUIZ INT NOT NULL,
   TITRE_QUIZ VARCHAR(128) NOT NULL,
   PRIMARY KEY (ID_QUIZ) 
);

# -----------------------------------------------------------------------------
#       TABLE : QUESTION
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS QUESTION
(
   ID_QUESTION INT NOT NULL,
   LIBELLE_QUESTION VARCHAR(128) NOT NULL,
   PRIMARY KEY (ID_QUESTION) 
);

# -----------------------------------------------------------------------------
#       TABLE : LECON
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS LECON
(
   ID_LECON INT NOT NULL,
   NOM_LECON VARCHAR(128) NOT NULL,
   TERMINE BOOLEAN NOT NULL,
   PRIMARY KEY (ID_LECON) 
);

# -----------------------------------------------------------------------------
#       TABLE : REPONSE
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS REPONSE
(
   ID_REPONSE INT NOT NULL,
   LIBELLE_REPONSE VARCHAR(128) NOT NULL,
   PRIMARY KEY (ID_REPONSE) 
);

# -----------------------------------------------------------------------------
#       TABLE : PARTICIPER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS PARTICIPER
(
   EMAIL_USER VARCHAR(128) NOT NULL,
   ID_MATCH INT NOT NULL,
   ID_ARTEFACT INT NOT NULL,
   PV_USER INT NOT NULL,
   GAGNER BOOLEAN NOT NULL,
   PRIMARY KEY (EMAIL_USER, ID_MATCH, ID_ARTEFACT) 
);

CREATE INDEX I_FK_PARTICIPER_USER
   ON PARTICIPER (EMAIL_USER ASC);

CREATE INDEX I_FK_PARTICIPER_MATCH
   ON PARTICIPER (ID_MATCH ASC);

CREATE INDEX I_FK_PARTICIPER_ARTEFACT
   ON PARTICIPER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : REGROUPER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS REGROUPER
(
   ID_LECON INT NOT NULL,
   ID_MODULE INT NOT NULL,
   PRIMARY KEY (ID_LECON, ID_MODULE) 
);

CREATE INDEX I_FK_REGROUPER_LECON
   ON REGROUPER (ID_LECON ASC);

CREATE INDEX I_FK_REGROUPER_MODULE
   ON REGROUPER (ID_MODULE ASC);

# -----------------------------------------------------------------------------
#       TABLE : TRAVAILLER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS TRAVAILLER
(
   EMAIL_USER VARCHAR(128) NOT NULL,
   ID_LECON INT NOT NULL,
   PRIMARY KEY (EMAIL_USER, ID_LECON) 
);

CREATE INDEX I_FK_TRAVAILLER_USER
   ON TRAVAILLER (EMAIL_USER ASC);

CREATE INDEX I_FK_TRAVAILLER_LECON
   ON TRAVAILLER (ID_LECON ASC);

# -----------------------------------------------------------------------------
#       TABLE : GENERER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS GENERER
(
   ID_MODULE INT NOT NULL,
   ID_QUIZ INT NOT NULL,
   PRIMARY KEY (ID_MODULE, ID_QUIZ) 
);

CREATE INDEX I_FK_GENERER_MODULE
   ON GENERER (ID_MODULE ASC);

CREATE INDEX I_FK_GENERER_QUIZ
   ON GENERER (ID_QUIZ ASC);

# -----------------------------------------------------------------------------
#       TABLE : CORRESPONDRE
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS CORRESPONDRE
(
   ID_REPONSE INT NOT NULL,
   ID_QUESTION INT NOT NULL,
   CORRECT BOOLEAN NOT NULL,
   PRIMARY KEY (ID_REPONSE, ID_QUESTION) 
);

CREATE INDEX I_FK_CORRESPONDRE_REPONSE
   ON CORRESPONDRE (ID_REPONSE ASC);

CREATE INDEX I_FK_CORRESPONDRE_QUESTION
   ON CORRESPONDRE (ID_QUESTION ASC);

# -----------------------------------------------------------------------------
#       TABLE : RECEVOIR
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS RECEVOIR
(
   ID_ITEM INT NOT NULL,
   EMAIL_USER VARCHAR(128) NOT NULL,
   PRIMARY KEY (ID_ITEM, EMAIL_USER) 
);

CREATE INDEX I_FK_RECEVOIR_ITEM
   ON RECEVOIR (ID_ITEM ASC);

CREATE INDEX I_FK_RECEVOIR_USER
   ON RECEVOIR (EMAIL_USER ASC);

# -----------------------------------------------------------------------------
#       TABLE : DROPPER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS DROPPER
(
   ID_MODULE INT NOT NULL,
   ID_ARTEFACT INT NOT NULL,
   PRIMARY KEY (ID_MODULE, ID_ARTEFACT) 
);

CREATE INDEX I_FK_DROPPER_MODULE
   ON DROPPER (ID_MODULE ASC);

CREATE INDEX I_FK_DROPPER_ARTEFACT
   ON DROPPER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : DONNER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS DONNER
(
   ID_MATCH INT NOT NULL,
   ID_ARTEFACT INT NOT NULL,
   PRIMARY KEY (ID_MATCH, ID_ARTEFACT) 
);

CREATE INDEX I_FK_DONNER_MATCH
   ON DONNER (ID_MATCH ASC);

CREATE INDEX I_FK_DONNER_ARTEFACT
   ON DONNER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : UTILISER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS UTILISER
(
   ID_QUESTION INT NOT NULL,
   ID_QUIZ INT NOT NULL,
   PRIMARY KEY (ID_QUESTION, ID_QUIZ) 
);

CREATE INDEX I_FK_UTILISER_QUESTION
   ON UTILISER (ID_QUESTION ASC);

CREATE INDEX I_FK_UTILISER_QUIZ
   ON UTILISER (ID_QUIZ ASC);

# -----------------------------------------------------------------------------
#       TABLE : POSSEDER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS POSSEDER
(
   EMAIL_USER VARCHAR(128) NOT NULL,
   ID_ARTEFACT INT NOT NULL,
   PRIMARY KEY (EMAIL_USER, ID_ARTEFACT) 
);

CREATE INDEX I_FK_POSSEDER_USER
   ON POSSEDER (EMAIL_USER ASC);

CREATE INDEX I_FK_POSSEDER_ARTEFACT
   ON POSSEDER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : CRAFTER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS CRAFTER
(
   ID_ARTEFACT INT NOT NULL,
   ID_ITEM INT NOT NULL,
   PRIMARY KEY (ID_ARTEFACT, ID_ITEM) 
);

CREATE INDEX I_FK_CRAFTER_ARTEFACT
   ON CRAFTER (ID_ARTEFACT ASC);

CREATE INDEX I_FK_CRAFTER_ITEM
   ON CRAFTER (ID_ITEM ASC);

# -----------------------------------------------------------------------------
#       CREATION DES REFERENCES DE TABLE (CONTRAINTES FK)
# -----------------------------------------------------------------------------

ALTER TABLE ARTEFACT 
  ADD CONSTRAINT FK_ARTEFACT_TYPE_ARTEFACT FOREIGN KEY (CODE_ARTEFACT)
      REFERENCES TYPE_ARTEFACT (CODE_ARTEFACT);

ALTER TABLE PARTICIPER 
  ADD CONSTRAINT FK_PARTICIPER_USER FOREIGN KEY (EMAIL_USER)
      REFERENCES `USER` (EMAIL_USER);

ALTER TABLE PARTICIPER 
  ADD CONSTRAINT FK_PARTICIPER_MATCH FOREIGN KEY (ID_MATCH)
      REFERENCES `MATCH` (ID_MATCH);

ALTER TABLE PARTICIPER 
  ADD CONSTRAINT FK_PARTICIPER_ARTEFACT FOREIGN KEY (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT);

ALTER TABLE REGROUPER 
  ADD CONSTRAINT FK_REGROUPER_LECON FOREIGN KEY (ID_LECON)
      REFERENCES LECON (ID_LECON);

ALTER TABLE REGROUPER 
  ADD CONSTRAINT FK_REGROUPER_MODULE FOREIGN KEY (ID_MODULE)
      REFERENCES MODULE (ID_MODULE);

ALTER TABLE TRAVAILLER 
  ADD CONSTRAINT FK_TRAVAILLER_USER FOREIGN KEY (EMAIL_USER)
      REFERENCES `USER` (EMAIL_USER);

ALTER TABLE TRAVAILLER 
  ADD CONSTRAINT FK_TRAVAILLER_LECON FOREIGN KEY (ID_LECON)
      REFERENCES LECON (ID_LECON);

ALTER TABLE GENERER 
  ADD CONSTRAINT FK_GENERER_MODULE FOREIGN KEY (ID_MODULE)
      REFERENCES MODULE (ID_MODULE);

ALTER TABLE GENERER 
  ADD CONSTRAINT FK_GENERER_QUIZ FOREIGN KEY (ID_QUIZ)
      REFERENCES QUIZ (ID_QUIZ);

ALTER TABLE CORRESPONDRE 
  ADD CONSTRAINT FK_CORRESPONDRE_REPONSE FOREIGN KEY (ID_REPONSE)
      REFERENCES REPONSE (ID_REPONSE);

ALTER TABLE CORRESPONDRE 
  ADD CONSTRAINT FK_CORRESPONDRE_QUESTION FOREIGN KEY (ID_QUESTION)
      REFERENCES QUESTION (ID_QUESTION);

ALTER TABLE RECEVOIR 
  ADD CONSTRAINT FK_RECEVOIR_ITEM FOREIGN KEY (ID_ITEM)
      REFERENCES ITEM (ID_ITEM);

ALTER TABLE RECEVOIR 
  ADD CONSTRAINT FK_RECEVOIR_USER FOREIGN KEY (EMAIL_USER)
      REFERENCES `USER` (EMAIL_USER);

ALTER TABLE DROPPER 
  ADD CONSTRAINT FK_DROPPER_MODULE FOREIGN KEY (ID_MODULE)
      REFERENCES MODULE (ID_MODULE);

ALTER TABLE DROPPER 
  ADD CONSTRAINT FK_DROPPER_ARTEFACT FOREIGN KEY (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT);

ALTER TABLE DONNER 
  ADD CONSTRAINT FK_DONNER_MATCH FOREIGN KEY (ID_MATCH)
      REFERENCES `MATCH` (ID_MATCH);

ALTER TABLE DONNER 
  ADD CONSTRAINT FK_DONNER_ARTEFACT FOREIGN KEY (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT);

ALTER TABLE UTILISER 
  ADD CONSTRAINT FK_UTILISER_QUESTION FOREIGN KEY (ID_QUESTION)
      REFERENCES QUESTION (ID_QUESTION);

ALTER TABLE UTILISER 
  ADD CONSTRAINT FK_UTILISER_QUIZ FOREIGN KEY (ID_QUIZ)
      REFERENCES QUIZ (ID_QUIZ);

ALTER TABLE POSSEDER 
  ADD CONSTRAINT FK_POSSEDER_USER FOREIGN KEY (EMAIL_USER)
      REFERENCES `USER` (EMAIL_USER);

ALTER TABLE POSSEDER 
  ADD CONSTRAINT FK_POSSEDER_ARTEFACT FOREIGN KEY (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT);

ALTER TABLE CRAFTER 
  ADD CONSTRAINT FK_CRAFTER_ARTEFACT FOREIGN KEY (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT);

ALTER TABLE CRAFTER 
  ADD CONSTRAINT FK_CRAFTER_ITEM FOREIGN KEY (ID_ITEM)
      REFERENCES ITEM (ID_ITEM);