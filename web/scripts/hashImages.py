from PIL import Image
import imagehash

for idx in range(1, 1001):
    print(idx)

    hash = imagehash.average_hash(Image.open(
        f'/Users/antonio/Downloads/highres-visuals-pk/{idx}.png'))
    print(hash)
