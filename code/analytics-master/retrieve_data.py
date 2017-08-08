#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Wed Jul 12 08:20:12 2017

@author: brian
"""

import pandas as pd
import requests
import websocket
import json
import re
from ast import literal_eval as make_tuple

def retrieve_realtime():
    '''retrieves near real-time pedestrian sensor data via Intelligent Cities API'''
    
    ws = websocket.WebSocket()
    ws.connect("wss://hic-event-service.run.aws-usw02-pr.ice.predix.io/v2/events", http_proxy_host="proxy_host_name", http_proxy_port=3128)

    return None

def get_token():
    url = "https://890407d7-e617-4d70-985f-01792d693387.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token"

    querystring = {"grant_type":"client_credentials"}
    
    payload = "username=ic.admin&password=admin"
    headers = {
        'authorization': "Basic ZGlnaXRhbGludGVybjpAZGlnaXRhbGludGVybg==",
        'cache-control': "no-cache",
        'postman-token': "99f3e82c-e5f7-5c16-f082-5c9c2d3ba878"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
    
    data = json.loads(response.text)
    
    return data["access_token"]

def read_loc_dict(token, locationType = "WALKWAY"):
    '''retrieves all locationUids for a location type via Intelligent Cities API'''

    url = "https://ic-metadata-service.run.aws-usw02-pr.ice.predix.io/v2/metadata/locations/search"
    
    querystring = {"q":"locationType:" + locationType,"bbox":"32.715675:-117.161230,32.708498:-117.151681","page":"0","size":"50"}
    
    headers = {
        'authorization': "Bearer " + token,
        'predix-zone-id': "SDSIM-IE-PARKING",
        'cache-control': "no-cache",
        'postman-token': "a45ff390-85e5-8e44-197d-992aa5faebe3"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    total_data = []
    loc_dict = {}
    
    data = json.loads(response.text)["content"]
    
    for i in range(len(data)):
        total_data.append(data[i]["locationUid"])
        loc_dict[data[i]["locationUid"]] = make_tuple(re.sub(":", ",", re.split(",", data[i]["coordinates"])[0]))
    
    return total_data, loc_dict


def read_asset_dict(token):
    
    url = "https://ic-metadata-service.run.aws-usw02-pr.ice.predix.io/v2/metadata/assets/search"

    querystring = {"bbox":"32.715675:-117.161230,32.708498:-117.151681","page":"0","size":"200","q":"eventTypes:PKIN"}
    
    headers = {
       'authorization': "Bearer " + token,
       'predix-zone-id': "SDSIM-IE-PARKING",
       'cache-control': "no-cache",
       'postman-token': "77cc3cd4-6df3-b98a-1b2b-ed0d3a0a0623"
       }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
    
    total_data = []
    asset_dict = {}
    
    data = json.loads(response.text)["content"]
    
    for i in range(len(data)):
        total_data.append(data[i]["assetUid"])
        asset_dict[data[i]["assetUid"]] = data[i]["coordinates"]
    
    return total_data, asset_dict


def read_ped_response(token, locationUid, start = 1499711783000, end = 1499714983000):
    '''retrieves historical pedestrian sensor data via Intelligent Cities API'''
    
    url = "https://ic-event-service.run.aws-usw02-pr.ice.predix.io/v2/locations/" + locationUid + "/events"

    querystring = {"eventType":"PEDEVT","startTime":start,"endTime":end}
    
    headers = {
        'authorization': "Bearer " + token,
        'predix-zone-id': "SDSIM-IE-PEDESTRIAN",
        'cache-control': "no-cache",
        'postman-token': "26434e61-713a-7af1-dd27-32228933d305"
        }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
    
    try:
        data = json.loads(response.text)["content"]
    except:
        return None
    
    total_data = []
    
    for i in range(len(data)):
        total_data.append([data[i]["locationUid"], data[i]["timestamp"], data[i]["measures"]["pedestrianCount"], data[i]["measures"]["speed"], data[i]["measures"]["direction"]])
        
    total_data = pd.DataFrame(total_data)
    try:
        total_data.columns = ["locationUid", "timestamp", "pedestrianCount", "speed", "direction"]
    except:
        pass

    return total_data

def read_traf_response(token, assetUid, start = 1499711783000, end = 1499714983000):
    
    url = "https://ic-event-service.run.aws-usw02-pr.ice.predix.io/v2/assets/" + assetUid + "/events"

    querystring = {"eventType":"TFEVT","startTime":start,"endTime":end}
    
    headers = {
        'authorization': "Bearer " + token,
        'predix-zone-id': "SDSIM-IE-TRAFFIC",
        'cache-control': "no-cache",
        'postman-token': "95146045-1bd4-1bb0-8a50-2098a16fa28f"
        }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
    
    try:
        data = json.loads(response.text)["content"]
    except:
        return None
    
    total_data = []
    
    for i in range(len(data)):
        total_data.append([data[i]["locationUid"], data[i]["timestamp"], data[i]["measures"]["vehicleCount"], data[i]["measures"]["speed"], data[i]["measures"]["direction"]])
        
    total_data = pd.DataFrame(total_data)
    
    try:
        total_data.columns = ["locationUid", "timestamp", "vehicleCount", "speed", "direction"]
    except:
        pass
    
    return total_data

def final_output(token, locationType = "WALKWAY", start = 1499628583000, end = 1499714983000):
    '''returns dataframe output of pedestrian sensor data for all locationUids'''
    
    loc_list, loc_dict = read_loc_dict(token)
    loc_list2, loc_dict2 = read_loc_dict(token, "TRAFFIC_LANE")
    asset_list, asset_dict = read_asset_dict(token)
    
    total_data1 = []
    total_data2 = []
    
    for i in loc_list:
        data = read_ped_response(token, i, start = start - (86400000 * 10), end = end - (86400000 * 10) + 300000)
        if len(data) == 0:
            continue
        total_data1.append(data)
        
    for i in asset_list:
        data = read_traf_response(token, i, start = start - (86400000 * 10), end = end - (86400000 * 10) + 300000)
        if len(data) == 0:
            continue
        total_data2.append(data)
    
    total_data1 = pd.concat(total_data1, axis = 0)
    total_data1 = total_data1.sort_values("timestamp").reset_index(drop = True)

    total_data2 = pd.concat(total_data2, axis = 0)
    total_data2 = total_data2.sort_values("timestamp").reset_index(drop = True)
        
    return total_data1, total_data2, loc_dict, loc_dict2

if __name__ == "__main__":
    token = get_token()
    test, loc_dict = final_output(token, start = 1499525502352, end = 1499525502352 + 150000)
    test2 = pd.DataFrame(test.groupby(["locationUid"]).pedestrianCount.mean())
    print test
    