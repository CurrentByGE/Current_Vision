import numpy as np
from sklearn.cluster import KMeans
import sqlite3
import pandas as pd

def num_clustering(df):
    '''assigns cluster number based on number of pedestrians'''
    
    #connect to database
    conn = sqlite3.connect("current_vision.db")
    c = conn.cursor()
    
    c.execute("SELECT * FROM sqlite_master")
    tables = c.fetchall()
    
    
    if "pedestrianCount" in df.columns:
        #initialize kmeans
        if len(tables) == 0:
            kmeans = KMeans(n_clusters = 3, n_init = 300).fit(df[["pedestrianCount"]])
        else:
            #query all from clusters table
            c.execute("SELECT * FROM pedestrians")
            temp = pd.DataFrame(c.fetchall())
            temp.columns = ["locationUid", "pedestrianCount", "speed", "direction", "lat", "long", "timestamp", "results", "date"]
            kmeans = KMeans(n_clusters = 3, n_init = 300).fit(temp[["pedestrianCount"]])
        
        #predict cluster based on pedestrianCount values
        results = kmeans.predict(df[["pedestrianCount"]])
        df["results"] = results
        
            
        count1 = df.pedestrianCount[df.results == 0].max()
        count2 = df.pedestrianCount[df.results == 1].max()
        count3 = df.pedestrianCount[df.results == 2].max()
    else:
        #initialize kmeans
        if len(tables) == 0:
            kmeans = KMeans(n_clusters = 3, n_init = 300).fit(df[["vehicleCount"]])
        else:
            #query all from clusters table
            c.execute("SELECT * FROM vehicles")
            temp = pd.DataFrame(c.fetchall())
            temp.columns = ["locationUid", "vehicleCount", "speed", "direction", "lat", "long", "timestamp", "results", "date"]
            kmeans = KMeans(n_clusters = 3, n_init = 300).fit(temp[["vehicleCount"]])
        
        #predict cluster based on pedestrianCount values
        results = kmeans.predict(df[["vehicleCount"]])
        df["results"] = results
    
        count1 = df.vehicleCount[df.results == 0].max()
        count2 = df.vehicleCount[df.results == 1].max()
        count3 = df.vehicleCount[df.results == 2].max()
    
    count_list = [count1, count2, count3]
    
    #classify the clusters
    if count1 == max(count_list):
        df.results[df.results == 0] = "large"
        count_list.remove(count1)
    elif count2 == max(count_list):
        df.results[df.results == 1] = "large"
        count_list.remove(count2)
    else:
        df.results[df.results == 2] = "large"
        count_list.remove(count3)
        
    if count1 == min(count_list):
        df.results[df.results == 0] = "small"
        count_list.remove(count1)
    elif count2 == min(count_list):
        df.results[df.results == 1] = "small"
        count_list.remove(count2)
    else:
        df.results[df.results == 2] = "small"
        count_list.remove(count3)
    
    df.results[df.applymap(np.isreal).results] = "medium"
    
    return df

def loc_clustering(df):
    '''assigns cluster number based on location (longitude, latitude)'''
    
    raise NotImplementedError
    
    #initialize kmeans
    results = KMeans(n_clusters = 3, n_init = 150).fit_predict(df.coordinates)
    df["loc_cluster"] = results
    
    
    
#def map_plot(df):
#    '''plots the clusters on a map'''
#    
#    map = Basemap(projection='cyl',lat_0=45,lon_0=-100,resolution='l')
#    # draw coastlines, country boundaries, fill continents.
#    map.drawcoastlines(linewidth=0.25)
#    map.drawcountries(linewidth=0.25)
#    map.fillcontinents(color='green',lake_color='aqua')
#    # draw the edge of the map projection region (the projection limb)
#    map.drawmapboundary(fill_color='aqua')
#    # draw lat/lon grid lines every 30 degrees.
#    map.drawmeridians(np.arange(0,360,30))
#    map.drawparallels(np.arange(-90,90,30))
#    # compute native map projection coordinates of lat/lon grid.
#    x, y = map(lons*180./np.pi, lats*180./np.pi)
#    plt.title('contour lines over filled continent background')
#    plt.show()
    
