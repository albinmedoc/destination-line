#Beskär bild till en kvadrat
def crop_to_1_1(img):
    original_size = img.size
    if(original_size[0] < original_size[1]):
        box = (0, 0, original_size[0], original_size[0])
    else:
        box = (0, 0, original_size[1], original_size[1])
    cropped_img = img.crop(box)
    return cropped_img

def crop_to_16_9(img):
    original_size = img.size
    if(original_size[0] * 9 == original_size[1] * 16):
        return img
    width = original_size[0]
    height = original_size[0] * 9 / 16
    upper = (original_size[1] - height) / 2
    box = (0, upper, width, upper + height)
    cropped_img = img.crop(box)
    return cropped_img
