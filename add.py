#!/usr/bin/env python

import sqlite3
import argparse
from os.path import isfile

db_file="questions.db"

def createDB():
    print("creating the database")
    con = sqlite3.connect(db_file)
    cur = con.cursor()

    cur.execute('''CREATE TABLE questions
                   (qid INTEGER NOT NULL PRIMARY KEY,
                    site TEXT NOT NULL,
                    seqid INTEGER NOT NULL,
                    created_date TEXT NOT NULL,
                    title TEXT NOT NULL,
                    active INTEGER NOT NULL,
                    UNIQUE(site, seqid));''')

    cur.execute('''CREATE TABLE views
                   (vid INTEGER NOT NULL PRIMARY KEY,
                    qid INTEGER NOT NULL,
                    view_count INTEGER NOT NULL,
                    record_date TEXT,
                    FOREIGN KEY(qid) REFERENCES questions(qid));''')
    con.commit()
    con.close()
    print('database created')

def add(site, qid):
    if not isfile(db_file):
        createDB()
    

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Add a question to have its view count tracked hourly.")
    parser.add_argument('site', help='The name of the site, e.g. english, where the question is located.')
    parser.add_argument('id', type=int, help='The id of the question to stop tracking, e.g. 565286.')
    args = parser.parse_args()

    add(args.site, args.id)
