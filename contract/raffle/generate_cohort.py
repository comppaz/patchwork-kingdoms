import pandas as pd 
import os
import json

dirname, filename = os.path.split(os.path.abspath(__file__))
outfileCohort = os.path.join(dirname, '../data/cohort_1.json')

# 1) Parse the Whitelist csv file  
df = pd.read_csv(os.path.join(dirname, '../data/final_whitelist.csv'), encoding='utf-8', sep=',')

# 2) Save the first cohort #1 as JSON file 
cohort_1 = df[0:999]["address"].values.tolist()

# 5) Save that as a JSON file (we will use this file as input to compute the merkle tree)
with open(outfileCohort, 'w', encoding='utf-8') as f:
    json.dump(cohort_1, f)