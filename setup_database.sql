\set ON_ERROR_STOP on
create database if not exists temp;
\c temp
drop database destinationline;
create database destinationline;
\c destinationline


create table person(
	id serial primary key,
	firstname varchar(30) not null,
	lastname varchar(50) not null,
	username varchar(30) not null,
	email varchar(50) not null,
	password text not null,
	biography varchar(40),
	background text
);

create table follow(
	follower int references person(id),
	following int references person(id)
);

create table album(
	id serial primary key,
	published timestamp not null,
	country varchar(50) not null,
	city varchar(60) not null,
	date_start date not null,
	date_end date not null
);

create table post(
	album integer references album(id),
	image text not null,
	text varchar(500) not null
);

create table owns(
	person integer references person(id),
	album integer references album(id)
);