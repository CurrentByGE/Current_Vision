#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Jul 15 19:14:59 2017

@author: brian
"""

import time
from main import main

def populate_db():
    '''Run the clustering algorithm every 5 minutes'''
    
    while True:
        print "Running iteration"
        main()
        time.sleep(300)
        
if __name__ == "__main__":
    populate_db()