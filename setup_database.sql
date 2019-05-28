\set ON_ERROR_STOP on
\c temp
drop database destinationline;
create database destinationline;
\c destinationline


create table person(
	id serial primary key,
	firstname varchar(30) not null,
	lastname varchar(50) not null,
	username varchar(30) not null unique,
	email varchar(50) not null unique,
	password text not null,
	profile_img text,
	background_img text,
	biography varchar(100)
);

create table follow(
	follower int references person(id),
	following int references person(id),
	unique(follower, following)
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
	headline varchar(60),
	description varchar(2500),
	unique(album, index)
);