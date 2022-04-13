# needs glob installed, with pip install
# just run python mergejson.py
# point the filepath to the folder that has extracted metadata json
# and it will generate the file data/kingdoms.js
import os
import multiprocessing as mp
from glob import glob
import json
import warnings

def processMetadataFile(fullPath):
	with open(fullPath) as f:
		data = json.load(f)
	
	return str(data["cluster_id"]) + "," + data["name"]

if __name__ == '__main__':
	pool = mp.Pool(mp.cpu_count())
	print("here")
	formatString = "\"{}\":{{\"title\":\"{}\"}}";
	print(formatString)

	metadataResults = pool.map(processMetadataFile, glob("/Users/payam/Downloads/metadata/*.json"))

	outputFile = open("data/kingdoms.js", "w")
	outputFile.write("const kingdoms = {\n");
	for result in metadataResults:
		result = result.split(",")
		outputFile.write(formatString.format(result[0], result[1]) + ",\n")
		# print(formatString.format(result[0], result[1]))
	outputFile.write("}\nexport default kingdoms;")
	outputFile.close()