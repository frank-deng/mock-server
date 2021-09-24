const Sqlite3=require('better-sqlite3');
const db = new Sqlite3('mock-server.db', { verbose: console.log });
db.prepare(`create table mock_item(
    id INT PRIMARY KEY NOT NULL,
    enabled int not null,
    match_type int,
    matcher varchar(1000),
    resp_type int,
    resp_code int,
    resp_header blob,
    resp_content blob
)`).run();
