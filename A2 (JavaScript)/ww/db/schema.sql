--- load with 
--- sqlite3 database.db < schema.sql

DROP TABLE IF EXISTS appuser; 
DROP TABLE IF EXISTS highScores;

CREATE TABLE appuser (
	id varchar(69) PRIMARY KEY,
	password varchar(69),
	firstName varchar(69),
	lastName varchar(69),
	email varchar(69),
	gamesPlayed integer,
	lastLogin timestamp
);

CREATE TABLE highScores (
	uuid INTEGER PRIMARY KEY,
	id varchar(69),
	score integer
);

INSERT INTO appuser VALUES ('ok', 'sha1$98b109d8$1$71e776b248cc7fb230da877ddbea96af7fa00feb', 'akhil', 'gupta', 'ok@m.com', '0', '2018-03-06 03:48:39');
INSERT INTO highScores(id, score) VALUES ('ok', '0');