#imports
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
import warnings
warnings.filterwarnings('ignore')
from sklearn.cluster import KMeans

df = pd.read_csv('cities.csv', sep=';')

country_names = df['country_name']
city_names = df['name']
state_names = df['state_name']
latitude = []
longitude = []
latitude = df['latitude'] 
longitude = df['longitude'] 
for i in range(len(latitude)):
    latitude[i] = latitude[i].replace(".", "", latitude[i].count('.') - 1)
    latitude[i] = float(latitude[i]) / 100000

for i in range(len(longitude)):
    longitude[i] = longitude[i].replace(".", "", longitude[i].count('.') - 1)
    longitude[i] = float(longitude[i]) / 100000

l2 = pd.DataFrame({'latitude': latitude, 'longitude': longitude})

kmeans = KMeans(30)
kmeans.fit(l2)

identified_clusters = kmeans.fit_predict(l2)
centers = kmeans.cluster_centers_
identified_clusters = list(identified_clusters)

training = pd.DataFrame({'city': city_names, 'state': state_names, 'country': country_names, 'latitude': latitude, 'longitude': longitude, 'loc_clusters' : identified_clusters})

print('training: ',training)
training.to_json('cities.json', orient='records', lines=True, force_ascii=False)

# -------------------------------------------------------------------------------

# Trực quan hóa kết quả phân cụm
plt.figure(figsize=(14, 8))

# Vẽ các điểm với màu sắc khác nhau dựa trên cụm
plt.scatter(l2['longitude'], l2['latitude'], c=identified_clusters, s=50, cmap='viridis')

# Vẽ các tâm cụm
plt.scatter(centers[:, 1], centers[:, 0], c='red', s=200, alpha=0.75)

plt.title('KMeans Clustering of Cities')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.show()