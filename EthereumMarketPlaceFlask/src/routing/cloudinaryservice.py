import cloudinary
import cloudinary.uploader
import cloudinary.api

cloudinary.config( cloud_name = "dqum1yaun", api_key = "522222318877635", api_secret = "XOneqw3ylLq40iKgzq73zG1HZCI" )


def upload(file_path):
    return cloudinary.uploader.upload(file_path)