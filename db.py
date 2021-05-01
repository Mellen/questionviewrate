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
                    UNIQUE(qid, view_count, record_date),
                    FOREIGN KEY(qid) REFERENCES questions(qid));''')
    con.commit()
    cur.close()
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

    try:
        cur.execute('''INSERT INTO views
                      (qid, view_count, record_date)
                      VALUES
                      (?, ?, ?);''',
                (qid, 0, int(question['creation_date'])))
    except sqlite3.IntegrityError:
        print('already has a creation date view_count')


    cur.execute('''INSERT INTO views
                   (qid, view_count, record_date)
                   VALUES
                   (?, ?, ?);''',
                (qid, question['view_count'], int(time.time())))

    con.commit()
    cur.close()
    con.close()

def deactivateQuestion(site, seqid):
    con = sqlite3.connect(db_file)
    cur = con.cursor()

    cur.execute('''UPDATE questions
                   SET active = 0
                   WHERE site = :site
                   AND seqid = :seqid''',
                {'site':site, 'seqid':seqid})

    con.commit()
    cur.close()
    con.close()

    print('No longer tracking the question')

def fullQuestionRemove(site, seqid):
    con = sqlite3.connect(db_file)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    cur.execute('''SELECT qid, title
                   FROM questions
                   WHERE site = :site
                   AND seqid = :seqid''',
                {'site':site, 'seqid':seqid})

    q = cur.fetchone()
    qid = q['qid']
    title = q['title']

    print('Deleting all data realting to "{title}"'.format(**{'title':title}))

    cur.execute('''DELETE FROM views
                   WHERE qid = :qid''',
                {'qid': qid})

    cur.execute('''DELETE FROM questions
                   WHERE qid = :qid''',
                {'qid': qid})

    con.commit()
    cur.close()
    con.close()

    print('Finished deleting.')

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
    cur.close()
    con.close()
    
def getAllActiveQuestions():
    con = sqlite3.connect(db_file)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    cur.execute('''SELECT *
                   FROM questions
                   WHERE active = 1''')

    rows = cur.fetchall()

    cur.close()
    con.close()

    return rows

def getViewCountsPerQuestion(qid):
    con = sqlite3.connect(db_file)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    cur.execute('''SELECT *
                   FROM views
                   WHERE qid = ?
                   ORDER BY record_date''', (qid,))

    rows = cur.fetchall()

    cur.close()
    con.close()

    return rows
