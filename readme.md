# Question View Rate

## Introduction

As a moderator on the English Language and Usage Stack Exchange website, I occassionally want to know if the number of views a question is getting is accellerating very quickly or if it has stagnated. This collection of scripts forms a service that allows questions to be added and removed from observation and publishes the results to a web page.

### Note

This is **not** an official Stack Exchange tool. I am not an employee of Stack Exchange. I am one of their many many volunteer moderators, but I cannot speak on their behalf, only my own.

## How it works

### Adding
```
usage: add.py [-h] site id

Add a question to have its view count tracked.

positional arguments:
  site        The name of the site, e.g. english, where the question is
              located.
  id          The id of the question to stop tracking, e.g. 565286.

optional arguments:
  -h, --help  show this help message and exit
```
### Removing
```
usage: remove.py [-h] [-d] site id

Remove a question from view tracking.

positional arguments:
  site          The name of the site, e.g. english, where the question is
                located.
  id            The id of the question to stop tracking, e.g. 565286.

optional arguments:
  -h, --help    show this help message and exit
  -d, --delete  Delete all question data.
```

Running without the `-d` flag just stops the question from being polled, the data collected will still be available. With the flag, then everything about the question will be removed from the database.

### Polling

The polling script should be set up to be run via [cron](https://crontab.guru/).

I have mine setup like so:

```
0 8 * * * /home/pi/src/python/questionviewrate/update.sh >/home/pi/cron.log 2>&1
0 16 * * * /home/pi/src/python/questionviewrate/update.sh >/home/pi/cron.log 2>&1
```

Which sets up the script to run twice a day, 8am and 8pm. Any problems get logged to cron.log in the pi user's home directory.

update.sh is a simple shell script:
```
cd /home/pi/src/python/questionviewrate/
python3 poll.py
python3 generatepage.py
```

### Viewing the results

The script generatepage.py uses [jinja2](https://jinja2docs.readthedocs.io/en/stable/) and a template (index_template.html) to generate index.html which will allow you to see a chart of the velocity of the questions being tracked.

As you can see above, I run the script at the same time as the polling script.

The resultant page uses the supplied javascript file, chart.js, to show the chart.