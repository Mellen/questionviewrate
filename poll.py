#!/usr/bin/env python

import zlib
import json
from urllib.request import Request, urlopen

api_base_url = 'https://api.stackexchange.com/2.2/questions/'

def getQuestionData(site, qid):
    url = f'{api_base_url}{qid}?site={site}'
    resp = urlopen(url)
    decompressed_bytes = zlib.decompress(resp.read(), 16+zlib.MAX_WBITS)
    data = json.loads(decompressed_bytes.decode('utf-8'))
    print(data)
    return data


if __name__ == '__main__':
    getQuestionData('english', 565286)
