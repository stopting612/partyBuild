import csv
import requests
from bs4 import BeautifulSoup
import os

# 網址 名 電話 價錢 地址

path_data = './scraping-data/venuehub_scraping_party_room_href.csv'
data_file = os.path.join(os.path.dirname(__file__),'scraping-data','venuehub_scraping_data.csv')

with open(path_data, newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for row in spamreader:
        # 網址
        party_room_page_path = row[0]
        print(party_room_page_path)
        party_room_page_path_res = requests.get(party_room_page_path)
        party_room_page_soup =  BeautifulSoup(party_room_page_path_res.text, 'html.parser')

        # 名 
        party_room_name = party_room_page_soup.find("h2",class_="main-title")
        party_room_name = party_room_name.find("strong").text
        print(party_room_name)

        # 電話
        party_room_phone = party_room_page_soup.find("div",class_="venue-number row")
        if party_room_phone is not None:
            party_room_phone = party_room_phone.find("a").text.replace("\n","")
        else:
            party_room_phone = ""
        print(party_room_phone)

        # 價錢
        party_room_price = party_room_page_soup.find("div",class_="widget bg-secondary secondary-pricing mobile-section-4")
        print(f'price: {party_room_price}')

        # 地址
        party_room_address = party_room_page_soup.find("span",itemprop="address").text
        print(party_room_address)

        party_room_size_area = party_room_page_soup.find("div",class_="widget bg-secondary secondary-details mobile-section-2")
        party_room_size_area = party_room_size_area.find_all("div",class_="row")[1]
        party_room_size_area = party_room_size_area.find("span").text
        print(party_room_size_area)

        with open(data_file, mode='a') as employee_file:
            employee_writer = csv.writer(employee_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

            employee_writer.writerow([party_room_page_path, party_room_name, party_room_phone, party_room_price, party_room_address, party_room_size_area])