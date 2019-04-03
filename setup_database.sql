\set ON_ERROR_STOP on
\c temp
drop database if exists destinationline;
create database destinationline;
\c destinationline


create table person(
	id serial primary key,
	firstname text not null,
	lastname text not null,
	username text not null,
	email text not null,
	password text not null,
	biography text not null,
	background text not null
);

create table follow(
	follower int references person(id),
	following int references person(id)
);

create table album(
	id serial primary key,
	published timestamp not null,
	country text not null,
	city text not null,
	date_start date not null,
	date_end date not null
);

create table post(
	album integer references album(id),
	image text not null,
	text text not null
);

create table owns(
	person integer references person(id),
	album integer references album(id)
);