DROP DATABASE IF EXISTS FY_FORCE;

CREATE DATABASE IF NOT EXISTS FY_FORCE;
USE FY_FORCE;
# -----------------------------------------------------------------------------
#       TABLE : USER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS USER
 (
   EMAIL_USER VARCHAR(128) NOT NULL  ,
   NOM_USER VARCHAR(128) NOT NULL  ,
   PRENOM_USER VARCHAR(128) NOT NULL  ,
   PHOTO_USER LONGBLOB NOT NULL  ,
   PASSWORD_USER VARCHAR(128) NOT NULL  
   , PRIMARY KEY (EMAIL_USER) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : MATCH
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS MATCH
 (
   ID_MATCH INTEGER(2) NOT NULL  
   , PRIMARY KEY (ID_MATCH) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : ITEM
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ITEM
 (
   ID_ITEM INTEGER(2) NOT NULL  ,
   NOM_ITEM VARCHAR(128) NOT NULL  
   , PRIMARY KEY (ID_ITEM) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : TYPE_ARTEFACT
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS TYPE_ARTEFACT
 (
   CODE_ARTEFACT CHAR(32) NOT NULL  ,
   LIBELLE_ARTEFACT VARCHAR(128) NOT NULL  
   , PRIMARY KEY (CODE_ARTEFACT) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : MODULE
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS MODULE
 (
   ID_MODULE INTEGER(2) NOT NULL  ,
   NOM_MODULE VARCHAR(128) NOT NULL  ,
   CONTENU_MODULE VARCHAR(128) NOT NULL  ,
   FINI BOOL NOT NULL  
   , PRIMARY KEY (ID_MODULE) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : ARTEFACT
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ARTEFACT
 (
   ID_ARTEFACT INTEGER(2) NOT NULL  ,
   CODE_ARTEFACT CHAR(32) NULL  ,
   STAT_ARTEFACT INTEGER(3) NOT NULL  
   , PRIMARY KEY (ID_ARTEFACT) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE ARTEFACT
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_ARTEFACT_TYPE_ARTEFACT
     ON ARTEFACT (CODE_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : QUIZ
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS QUIZ
 (
   ID_QUIZ INTEGER(2) NOT NULL  ,
   TITRE_QUIZ VARCHAR(128) NOT NULL  
   , PRIMARY KEY (ID_QUIZ) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : QUESTION
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS QUESTION
 (
   ID_QUESTION INTEGER(2) NOT NULL  ,
   LIBELLE_QUESTION VARCHAR(128) NOT NULL  
   , PRIMARY KEY (ID_QUESTION) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : LECON
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS LECON
 (
   ID_LECON INTEGER(3) NOT NULL  ,
   NOM_LECON VARCHAR(128) NOT NULL  ,
   TERMINE BOOL NOT NULL  
   , PRIMARY KEY (ID_LECON) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : REPONSE
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS REPONSE
 (
   ID_REPONSE INTEGER(2) NOT NULL  ,
   LIBELLE_REPONSE VARCHAR(128) NOT NULL  
   , PRIMARY KEY (ID_REPONSE) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : PARTICIPER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS PARTICIPER
 (
   EMAIL_USER VARCHAR(128) NOT NULL  ,
   ID_MATCH INTEGER(2) NOT NULL  ,
   ID_ARTEFACT INTEGER(2) NOT NULL  ,
   PV_USER INTEGER(2) NOT NULL  ,
   GAGNER BOOL NOT NULL  
   , PRIMARY KEY (EMAIL_USER,ID_MATCH,ID_ARTEFACT) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE PARTICIPER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_PARTICIPER_USER
     ON PARTICIPER (EMAIL_USER ASC);

CREATE  INDEX I_FK_PARTICIPER_MATCH
     ON PARTICIPER (ID_MATCH ASC);

CREATE  INDEX I_FK_PARTICIPER_ARTEFACT
     ON PARTICIPER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : REGROUPER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS REGROUPER
 (
   ID_LECON INTEGER(3) NOT NULL  ,
   ID_MODULE INTEGER(2) NOT NULL  
   , PRIMARY KEY (ID_LECON,ID_MODULE) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE REGROUPER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_REGROUPER_LECON
     ON REGROUPER (ID_LECON ASC);

CREATE  INDEX I_FK_REGROUPER_MODULE
     ON REGROUPER (ID_MODULE ASC);

# -----------------------------------------------------------------------------
#       TABLE : TRAVAILLER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS TRAVAILLER
 (
   EMAIL_USER VARCHAR(128) NOT NULL  ,
   ID_LECON INTEGER(3) NOT NULL  
   , PRIMARY KEY (EMAIL_USER,ID_LECON) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE TRAVAILLER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_TRAVAILLER_USER
     ON TRAVAILLER (EMAIL_USER ASC);

CREATE  INDEX I_FK_TRAVAILLER_LECON
     ON TRAVAILLER (ID_LECON ASC);

# -----------------------------------------------------------------------------
#       TABLE : GENERER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS GENERER
 (
   ID_MODULE INTEGER(2) NOT NULL  ,
   ID_QUIZ INTEGER(2) NOT NULL  
   , PRIMARY KEY (ID_MODULE,ID_QUIZ) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE GENERER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_GENERER_MODULE
     ON GENERER (ID_MODULE ASC);

CREATE  INDEX I_FK_GENERER_QUIZ
     ON GENERER (ID_QUIZ ASC);

# -----------------------------------------------------------------------------
#       TABLE : CORRESPONDRE
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS CORRESPONDRE
 (
   ID_REPONSE INTEGER(2) NOT NULL  ,
   ID_QUESTION INTEGER(2) NOT NULL  ,
   CORRECT BOOL NOT NULL  
   , PRIMARY KEY (ID_REPONSE,ID_QUESTION) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE CORRESPONDRE
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_CORRESPONDRE_REPONSE
     ON CORRESPONDRE (ID_REPONSE ASC);

CREATE  INDEX I_FK_CORRESPONDRE_QUESTION
     ON CORRESPONDRE (ID_QUESTION ASC);

# -----------------------------------------------------------------------------
#       TABLE : RECEVOIR
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS RECEVOIR
 (
   ID_ITEM INTEGER(2) NOT NULL  ,
   EMAIL_USER VARCHAR(128) NOT NULL  
   , PRIMARY KEY (ID_ITEM,EMAIL_USER) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE RECEVOIR
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_RECEVOIR_ITEM
     ON RECEVOIR (ID_ITEM ASC);

CREATE  INDEX I_FK_RECEVOIR_USER
     ON RECEVOIR (EMAIL_USER ASC);

# -----------------------------------------------------------------------------
#       TABLE : DROPPER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS DROPPER
 (
   ID_MODULE INTEGER(2) NOT NULL  ,
   ID_ARTEFACT INTEGER(2) NOT NULL  
   , PRIMARY KEY (ID_MODULE,ID_ARTEFACT) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE DROPPER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_DROPPER_MODULE
     ON DROPPER (ID_MODULE ASC);

CREATE  INDEX I_FK_DROPPER_ARTEFACT
     ON DROPPER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : DONNER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS DONNER
 (
   ID_MATCH INTEGER(2) NOT NULL  ,
   ID_ARTEFACT INTEGER(2) NOT NULL  
   , PRIMARY KEY (ID_MATCH,ID_ARTEFACT) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE DONNER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_DONNER_MATCH
     ON DONNER (ID_MATCH ASC);

CREATE  INDEX I_FK_DONNER_ARTEFACT
     ON DONNER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : UTILISER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS UTILISER
 (
   ID_QUESTION INTEGER(2) NOT NULL  ,
   ID_QUIZ INTEGER(2) NOT NULL  
   , PRIMARY KEY (ID_QUESTION,ID_QUIZ) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE UTILISER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_UTILISER_QUESTION
     ON UTILISER (ID_QUESTION ASC);

CREATE  INDEX I_FK_UTILISER_QUIZ
     ON UTILISER (ID_QUIZ ASC);

# -----------------------------------------------------------------------------
#       TABLE : POSSEDER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS POSSEDER
 (
   EMAIL_USER VARCHAR(128) NOT NULL  ,
   ID_ARTEFACT INTEGER(2) NOT NULL  
   , PRIMARY KEY (EMAIL_USER,ID_ARTEFACT) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE POSSEDER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_POSSEDER_USER
     ON POSSEDER (EMAIL_USER ASC);

CREATE  INDEX I_FK_POSSEDER_ARTEFACT
     ON POSSEDER (ID_ARTEFACT ASC);

# -----------------------------------------------------------------------------
#       TABLE : CRAFTER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS CRAFTER
 (
   ID_ARTEFACT INTEGER(2) NOT NULL  ,
   ID_ITEM INTEGER(2) NOT NULL  
   , PRIMARY KEY (ID_ARTEFACT,ID_ITEM) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       INDEX DE LA TABLE CRAFTER
# -----------------------------------------------------------------------------


CREATE  INDEX I_FK_CRAFTER_ARTEFACT
     ON CRAFTER (ID_ARTEFACT ASC);

CREATE  INDEX I_FK_CRAFTER_ITEM
     ON CRAFTER (ID_ITEM ASC);


# -----------------------------------------------------------------------------
#       CREATION DES REFERENCES DE TABLE
# -----------------------------------------------------------------------------


ALTER TABLE ARTEFACT 
  ADD FOREIGN KEY FK_ARTEFACT_TYPE_ARTEFACT (CODE_ARTEFACT)
      REFERENCES TYPE_ARTEFACT (CODE_ARTEFACT) ;


ALTER TABLE PARTICIPER 
  ADD FOREIGN KEY FK_PARTICIPER_USER (EMAIL_USER)
      REFERENCES USER (EMAIL_USER) ;


ALTER TABLE PARTICIPER 
  ADD FOREIGN KEY FK_PARTICIPER_MATCH (ID_MATCH)
      REFERENCES MATCH (ID_MATCH) ;


ALTER TABLE PARTICIPER 
  ADD FOREIGN KEY FK_PARTICIPER_ARTEFACT (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT) ;


ALTER TABLE REGROUPER 
  ADD FOREIGN KEY FK_REGROUPER_LECON (ID_LECON)
      REFERENCES LECON (ID_LECON) ;


ALTER TABLE REGROUPER 
  ADD FOREIGN KEY FK_REGROUPER_MODULE (ID_MODULE)
      REFERENCES MODULE (ID_MODULE) ;


ALTER TABLE TRAVAILLER 
  ADD FOREIGN KEY FK_TRAVAILLER_USER (EMAIL_USER)
      REFERENCES USER (EMAIL_USER) ;


ALTER TABLE TRAVAILLER 
  ADD FOREIGN KEY FK_TRAVAILLER_LECON (ID_LECON)
      REFERENCES LECON (ID_LECON) ;


ALTER TABLE GENERER 
  ADD FOREIGN KEY FK_GENERER_MODULE (ID_MODULE)
      REFERENCES MODULE (ID_MODULE) ;


ALTER TABLE GENERER 
  ADD FOREIGN KEY FK_GENERER_QUIZ (ID_QUIZ)
      REFERENCES QUIZ (ID_QUIZ) ;


ALTER TABLE CORRESPONDRE 
  ADD FOREIGN KEY FK_CORRESPONDRE_REPONSE (ID_REPONSE)
      REFERENCES REPONSE (ID_REPONSE) ;


ALTER TABLE CORRESPONDRE 
  ADD FOREIGN KEY FK_CORRESPONDRE_QUESTION (ID_QUESTION)
      REFERENCES QUESTION (ID_QUESTION) ;


ALTER TABLE RECEVOIR 
  ADD FOREIGN KEY FK_RECEVOIR_ITEM (ID_ITEM)
      REFERENCES ITEM (ID_ITEM) ;


ALTER TABLE RECEVOIR 
  ADD FOREIGN KEY FK_RECEVOIR_USER (EMAIL_USER)
      REFERENCES USER (EMAIL_USER) ;


ALTER TABLE DROPPER 
  ADD FOREIGN KEY FK_DROPPER_MODULE (ID_MODULE)
      REFERENCES MODULE (ID_MODULE) ;


ALTER TABLE DROPPER 
  ADD FOREIGN KEY FK_DROPPER_ARTEFACT (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT) ;


ALTER TABLE DONNER 
  ADD FOREIGN KEY FK_DONNER_MATCH (ID_MATCH)
      REFERENCES MATCH (ID_MATCH) ;


ALTER TABLE DONNER 
  ADD FOREIGN KEY FK_DONNER_ARTEFACT (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT) ;


ALTER TABLE UTILISER 
  ADD FOREIGN KEY FK_UTILISER_QUESTION (ID_QUESTION)
      REFERENCES QUESTION (ID_QUESTION) ;


ALTER TABLE UTILISER 
  ADD FOREIGN KEY FK_UTILISER_QUIZ (ID_QUIZ)
      REFERENCES QUIZ (ID_QUIZ) ;


ALTER TABLE POSSEDER 
  ADD FOREIGN KEY FK_POSSEDER_USER (EMAIL_USER)
      REFERENCES USER (EMAIL_USER) ;


ALTER TABLE POSSEDER 
  ADD FOREIGN KEY FK_POSSEDER_ARTEFACT (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT) ;


ALTER TABLE CRAFTER 
  ADD FOREIGN KEY FK_CRAFTER_ARTEFACT (ID_ARTEFACT)
      REFERENCES ARTEFACT (ID_ARTEFACT) ;


ALTER TABLE CRAFTER 
  ADD FOREIGN KEY FK_CRAFTER_ITEM (ID_ITEM)
      REFERENCES ITEM (ID_ITEM) ;

