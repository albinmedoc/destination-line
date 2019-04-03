\set ON_ERROR_STOP on
\c postgres
drop database if exists pi;
create database pi;
\c pi


create table user(
	id serial primary key,
	firstname text not null,
	lastname text not null,
	username text not null,
	email text not null,
	password text not null,
	info text not null
);

create table follow(
	follower int references user(id),
	following int references user(id)
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
	user integer references user(id),
	album integer references album(id)
);