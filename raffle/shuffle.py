import pandas as pd 
import os
import json

dirname, filename = os.path.split(os.path.abspath(__file__))
outfileWhitelist = os.path.join(dirname, '../data/Whitelist_shuffled.csv')
outfileCohort = os.path.join(dirname, '../data/cohort_1.json')

# 1) Parse the Whitelist csv file  
df = pd.read_csv(os.path.join(dirname, '../data/Whitelist_cleaned.csv'), encoding='utf-8', sep=';')

# 2) Now Shuffle the Dataframe!
# frac - specifies the fraction of rows to return. The value of "1" means return all rows.
# random_state - specifies a seed for the underlying randomizer. This makes sure that we generate the same result if we run this again!

shuffled = df.sample(frac=1, random_state=75)

# 3) Save the output as CSV again
shuffled.to_csv(outfileWhitelist, sep=';', encoding='utf-8')

# 4) Save the first cohort #1 as JSON file 
cohort_1 = shuffled[0:999]["address"].values.tolist()

# 5) Save that as a JSON file (we will use this file as input to compute the merkle tree)
with open(outfileCohort, 'w', encoding='utf-8') as f:
    json.dump(cohort_1, f)