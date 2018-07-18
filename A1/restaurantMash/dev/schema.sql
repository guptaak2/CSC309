drop table appuser cascade;
drop table appuser_otherinfo cascade;
drop table restaurants cascade;

create table appuser (
	id varchar(69) primary key,
	password varchar(69),
	firstName varchar(69),
	lastName varchar(69),
	email varchar(69)

);

create table appuser_otherinfo (
	id varchar(69) primary key,
	address varchar(69),
	city varchar(69),
	State varchar(69),
	postalCode varchar(69),
	phone varchar(69)

);

create table restaurants (
	name varchar(69) primary key,
	rating integer,
	wins integer,
	losses integer

);

\copy restaurants(name) from 'restaurants.txt' DELIMITER '~';
update restaurants set rating = 1000; -- base elo rating is 1000
update restaurants set wins = 0; -- base wins score
update restaurants set losses = 0; -- base losses score
update restaurants set name = regexp_replace(name, '['']', ''); -- remove double quotes
insert into appuser values ('akhilg', 'PAssword1', 'Akhil', 'Gupta', 'a@email.com'); -- default user
insert into appuser_otherinfo values ('akhilg'); -- default user


