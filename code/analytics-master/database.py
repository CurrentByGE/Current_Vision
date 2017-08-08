#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Jul 15 17:07:42 2017

@author: brian
"""
import sqlite3

def create_db(loc_dict, loc_dict2, ped_df, traf_df):
    '''creates tables and inserts values for db'''
    
    #create connection to database
    conn = sqlite3.connect("current_vision.db")
    
    c = conn.cursor()
    
    try:
        #create locations table
        c.execute('''CREATE TABLE sensors
                 (locationUid TEXT,
                 lat REAL,
                 long REAL)''')
        
        #insert values into locations table
        for i, j in loc_dict.iteritems():
            c.execute("INSERT INTO sensors VALUES ('%s', '%s', '%s')" % (i, float(j[0]), float(j[1])))
        for i, j in loc_dict2.iteritems():
            c.execute("INSERT INTO sensors VALUES ('%s', '%s', '%s')" % (i, float(j[0]), float(j[1])))
    except:
        pass
    
    try:
        #create pins table
        c.execute('''CREATE TABLE pins
                 (pinID TEXT,
                 bID TEXT,
                 name TEXT,
                 lat REAL,
                 long REAL)''')
    
    except:
        pass
    
    try:
        #create pins table
        c.execute('''CREATE TABLE businesses
                 (bID TEXT,
                 name TEXT)''')
    
    except:
        pass
    
    
    #creates pedestrians table and inserts values
    ped_df.to_sql("pedestrians", conn, if_exists = "append")
    
     #creates vehicles table and inserts values
    traf_df.to_sql("vehicles", conn, if_exists = "append")