#!/usr/bin/env python

import zlib
import json
from urllib.request import Request, urlopen
from db import getAllActiveQuestions, addViewCount

api_base_url = 'https://api.stackexchange.com/2.2/questions/'

def getQuestionData(site, qid):
    url = f'{api_base_url}{qid}?site={site}'
    resp = urlopen(url)
    decompressed_bytes = zlib.decompress(resp.read(), 16+zlib.MAX_WBITS)
    resp.close();
    data = json.loads(decompressed_bytes.decode('utf-8'))
    return data


def updateAllActiveQuestions():
    qs = getAllActiveQuestions()
    for q in qs:
        data = getQuestionData(q['site'], q['seqid'])
        addViewCount(q['qid'], data['items'][0]['view_count'])


if __name__ == '__main__':
    updateAllActiveQuestions()
