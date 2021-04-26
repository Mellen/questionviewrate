#!/usr/bin/env python

import argparse
from db import deactivateQuestion, fullQuestionRemove

def untrackQuestion(site, qid, doDelete):
    if doDelete:
        reallyDoIt = input('Enter yes to really delete all the data for this question. It cannot be undone: ')
        if reallyDoIt == 'yes':
            fullQuestionRemove(site, qid)
    else:
        deactivateQuestion(site, qid)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Remove a question from view tracking.")
    parser.add_argument('site', help='The name of the site, e.g. english, where the question is located.')
    parser.add_argument('id', type=int, help='The id of the question to stop tracking, e.g. 565286.')
    parser.add_argument('-d', '--delete', help='Delete all question data.', action='store_true')
    args = parser.parse_args()
    untrackQuestion(args.site, args.id, args.delete)
