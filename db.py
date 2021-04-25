import sqlite3

db_file="questions.db"

def createDB():
    print("creating the database")
    con = sqlite3.connect(db_file)
    cur = con.cursor()

    cur.execute('''CREATE TABLE questions
                   (qid INTEGER NOT NULL PRIMARY KEY,
                    site TEXT NOT NULL,
                    seqid INTEGER NOT NULL,
                    created_date INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    link TEXT NOT NULL,
                    active INTEGER NOT NULL,
                    UNIQUE(site, seqid));''')

    cur.execute('''CREATE TABLE views
                   (vid INTEGER NOT NULL PRIMARY KEY,
                    qid INTEGER NOT NULL,
                    view_count INTEGER NOT NULL,
                    record_date INTEGER,
                    FOREIGN KEY(qid) REFERENCES questions(qid));''')
    con.commit()
    con.close()
    print('database created')
