#!/usr/bin/env python

from db import db_file, createDB
import argparse
from os.path import isfile

def add(site, qid):
    if not isfile(db_file):
        createDB()
    

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Add a question to have its view count tracked hourly.")
    parser.add_argument('site', help='The name of the site, e.g. english, where the question is located.')
    parser.add_argument('id', type=int, help='The id of the question to stop tracking, e.g. 565286.')
    args = parser.parse_args()

    add(args.site, args.id)
