import sqlite3
import time

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

def addQuestion(site, data):
    con = sqlite3.connect(db_file)
    cur = con.cursor()

    question = data['items'][0]

    try:
        cur.execute('''INSERT INTO questions
                    (site, seqid, created_date, title, link, active)
                    VALUES
                    (?, ?, ?, ?, ?, 1);''',
                    (site, question['question_id'], question['creation_date'], question['title'], question['link']))

        qid = cur.lastrowid
    except sqlite3.IntegrityError:
        cur.execute('''SELECT qid
                       FROM questions
                       WHERE site = :site
                       AND seqid = :seqid
                    ''', {'site':site, 'seqid': question['question_id']})

        result = cur.fetchone()

        qid = result[0]

        cur.execute('''UPDATE questions
                       SET active = 1
                       WHERE qid = :qid''',
                    {'qid':qid})

    cur.execute('''INSERT INTO views
                   (qid, view_count, record_date)
                   VALUES
                   (?, ?, ?);''',
                (qid, question['view_count'], int(time.time())))

    con.commit()
    con.close()

def addViewCount(qid, data):
    con = sqlite3.connect(db_file)
    cur = con.cursor()

    question = data['items'][0]
    
    cur.execute('''INSERT INTO views
                   (qid, view_count, record_date)
                   VALUES
                   (?, ?, ?);''',
                (qid, question['view_count'], int(time.time())))

    con.commit()
    con.close()
    
