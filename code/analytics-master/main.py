#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Thu Jul 13 09:14:05 2017

@author: brian
"""

import pandas as pd
from pedestrian_clustering import num_clustering
from retrieve_data import final_output
from retrieve_data import get_token
import datetime
import database
import gmplot

def main():
    
    #get new authorization token
    token = get_token()
    
    #get current time
    p_time = int(datetime.datetime.now().strftime("%s")) * 1000
    
    #retrieve data 
    dat, dat2, loc_dict, loc_dict2 = final_output(token, start = p_time, end = p_time)
    
    dat2 = dat2[dat2.locationUid.isin(loc_dict2.keys())]
    
    loc_direction = pd.DataFrame(dat.groupby(["locationUid", "direction"]).pedestrianCount.sum())
    loc_speed = pd.DataFrame(dat.groupby(["locationUid", "direction"]).speed.mean())
    
    loc_df = loc_direction.merge(loc_speed, left_index = True, right_index = True)
    
    #add/re-adjust columns
    loc_df["direction"] = list(pd.DataFrame(loc_df.index).apply(lambda x: x[0][1], axis = 1))
    loc_df.index = pd.DataFrame(loc_df.index).apply(lambda x: x[0][0], axis = 1)
    loc_df["lat"] = list(pd.Series(loc_df.index).apply(lambda x: loc_dict[x][0]))
    loc_df["long"] = list(pd.Series(loc_df.index).apply(lambda x: loc_dict[x][1]))
    loc_df["timestamp"] = p_time

    kmeans_results = num_clustering(loc_df)
    kmeans_results.index.name = "locationUid"
    kmeans_results['date'] = pd.to_datetime(kmeans_results['timestamp'],unit='ms')
    
    loc_direction = pd.DataFrame(dat2.groupby(["locationUid", "direction"]).vehicleCount.sum())
    loc_speed = pd.DataFrame(dat2.groupby(["locationUid", "direction"]).speed.mean())
    
    loc_df = loc_direction.merge(loc_speed, left_index = True, right_index = True)
    
    #add/re-adjust columns
    loc_df["direction"] = list(pd.DataFrame(loc_df.index).apply(lambda x: x[0][1], axis = 1))
    loc_df.index = pd.DataFrame(loc_df.index).apply(lambda x: x[0][0], axis = 1)
    loc_df["lat"] = list(pd.Series(loc_df.index).apply(lambda x: loc_dict2[x][0]))
    loc_df["long"] = list(pd.Series(loc_df.index).apply(lambda x: loc_dict2[x][1]))
    loc_df["timestamp"] = p_time

    kmeans_results2 = num_clustering(loc_df)
    kmeans_results2.index.name = "locationUid"
    kmeans_results2['date'] = pd.to_datetime(kmeans_results2['timestamp'],unit='ms')
    
    #insert values into database
    database.create_db(loc_dict, loc_dict2, kmeans_results, kmeans_results2)
    
    return kmeans_results, kmeans_results2
    
if __name__ == "__main__":
    km_results = main()
    
    gmap = gmplot.GoogleMapPlotter(km_results.lat[0], km_results.long[0], 16)
    gmap.scatter(km_results.lat[km_results.results == "large"], km_results.long[km_results.results == "large"], '#ce0000', size=10, marker=False)
    gmap.scatter(km_results.lat[km_results.results == "medium"], km_results.long[km_results.results == "medium"], '#f48709', size=10, marker=False)
    gmap.scatter(km_results.lat[km_results.results == "small"], km_results.long[km_results.results == "small"], '#fffa75', size=10, marker=False)
    gmap.scatter(km_results.lat, km_results.long, 'k', marker=True)
    gmap.draw("mymap.html")
