#!/usr/bin/env python

import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Remove a question from view tracking.")
    parser.add_argument('site', help='The name of the site, e.g. english, where the question is located.')
    parser.add_argument('id', help='The id of the question to stop tracking, e.g. 565286.')
    args = parser.parse_args()
