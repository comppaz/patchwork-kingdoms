import json
import pathlib
import os
import requests

base_path = pathlib.Path(__file__).parent.resolve()
url = 'https://api.jsonbin.io/v3/b'
# only 10 bins accessible
uncategorizedCollectionUrl = 'https://api.jsonbin.io/v3/c/uncategorized/bins'

headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': '',
  'X-Bin-Name' : ''
}

headersOnlyKey= {
    'X-Master-Key': '',
}
nft_max = 1000
idToBinId = {}

def exportToArray():
    with open(os.path.join(base_path, 'output', 'idToBinId' + '.json'), 'w') as f:
        json.dump(idToBinId, f)

def loadCurrentIdToBinId():
    with open(os.path.join(base_path, 'output', 'idToBinId' + '.json'), 'r') as f:
        idToBinIdJSON = json.load(f)
        return idToBinIdJSON

def getUncategorizedCollectionBins():
    idToBinIdJSON = loadCurrentIdToBinId()
    data = {}
    #lastBinIdUrl = uncategorizedCollectionUrl + '/' + '62c580c04bccf21c2ed08404'
    req = requests.get(uncategorizedCollectionUrl, json=data, headers=headersOnlyKey)
    data = json.loads(req.text)
    print(data)
    for entry in data:
        idToBinId[entry['snippetMeta']['name']] = entry['record']
        idToBinIdJSON[entry['snippetMeta']['name']] = entry['record']
        print(idToBinId)
    
    with open(os.path.join(base_path, 'output', 'idToBinId' + '.json'), 'w') as f:
        json.dump(idToBinIdJSON, f) 



def deleteCurrentEntries(id):
    deleteUrl= url + '/' + str(id)
    req = requests.delete(deleteUrl, json=None, headers=headersOnlyKey)
    print(req.text)


# load jsons iterative
def postJsons():
    nft_counter = 282
    idToBinIdJSON = loadCurrentIdToBinId()

    for nft_counter in range(nft_counter, nft_max):
        nft_counter += 1
        print(nft_counter)
        nft_path = f"{nft_counter}.json"
        with open(os.path.join(base_path,"metadata", nft_path), "r") as read_file:
            headers['X-Bin-Name'] = str(nft_counter)
            nft = json.load(read_file)
            req = requests.post(url, json=nft, headers=headers)
            data = json.loads(req.text)
            idToBinIdJSON[nft_counter] = data['metadata']['id']
            print(idToBinIdJSON)
            # add every iteration current idToBindIdJson
            with open(os.path.join(base_path, 'output', 'idToBinId' + '.json'), 'w') as f:
                json.dump(idToBinIdJSON, f)

postJsons()
#getUncategorizedCollectionBins()

