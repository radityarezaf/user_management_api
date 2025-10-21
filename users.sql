create table users (
id serial primary key,
username varchar(100) unique not null,
email varchar(100) unique not null,
password varchar(255) not null,
role varchar(50) default 'user',
avatar_url TEXT,
updated_at timestamp default now()
);