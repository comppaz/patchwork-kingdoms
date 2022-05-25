import pandas as pd 
import os
import json

base_path = os.path.dirname(os.path.realpath(__file__))

df = pd.read_csv(os.path.join(base_path, 'proco_dev_data_21_10_2021.csv'))

directory = os.fsencode(os.path.join(base_path, 'metadata'))
    
for file in os.listdir(directory):
     filename = os.fsdecode(file)

     if filename.endswith(".json"): 

         with open(os.path.join(base_path, 'metadata', filename), 'r') as f:
            data = json.load(f)

            data['schools'] = df[df['school_id'].isin(data['schools'])][['lon', 'lat', 'school_name']].to_dict(orient='records')
            data['schools_no_data'] = df[df['school_id'].isin(data['schools_no_data'])][['lon', 'lat', 'school_name']].to_dict(orient='records')

            with open(os.path.join(base_path, 'metadata', filename), 'w') as f:
                json.dump(data, f, indent=4)

         continue
     
     break
     
#print(df)
