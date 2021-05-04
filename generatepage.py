#!/usr/bin/env python3

from jinja2 import Environment, PackageLoader, select_autoescape
from db import getAllActiveQuestions, getViewCountsPerQuestion

def generatePage():
    env = Environment(loader=PackageLoader('generatepage', '.'), autoescape=select_autoescape(['html', 'xml']))
    template = env.get_template('index_template.html')
    qs = getAllActiveQuestions()
    views = []
    for q in qs:
        vc = getViewCountsPerQuestion(q['qid'])
        views = views + vc
    with open('index.html', 'w') as idxfile:
        idxfile.write(template.render(qs=qs,  views=views))


if __name__ == '__main__':
    generatePage()
