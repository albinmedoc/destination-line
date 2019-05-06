\set ON_ERROR_STOP on
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
	biography varchar(100),
	background text
);

create table follow(
	follower int references person(id),
	following int references person(id)
);

create table album(
	id serial primary key,
	owner integer not null,
	published timestamp not null,
	country varchar(50) not null,
	city varchar(60) not null,
	date_start date not null,
	date_end date not null
);

create table post(
	album integer references album(id),
	index integer not null,
	img_name text not null,
	headline varchar(40),
	description varchar(500)
);