import requests
from bs4 import BeautifulSoup
import os
import csv


# 名 網址 適合人數 地址 價錢

scraping_from_start4fun = 'https://start4fun.com'
page_from_start4fun_party_room = 1
data_file = os.path.join(os.path.dirname(__file__),'scraping-data','start4fun_scraping_data.csv')

while True:
    party_room_list_page_path = f'{scraping_from_start4fun}/search/partyroom?pno={page_from_start4fun_party_room}'
    party_room_list_page_path_res = requests.get(party_room_list_page_path)
    party_room_list_page_soup = BeautifulSoup(party_room_list_page_path_res.text, 'html.parser')

    stories = party_room_list_page_soup.find_all('div', class_='hostUnit relative')
    if len(stories) == 0:
        break

    for store in stories:
        # 名 and 網址
        party_room_name = store.find('p', class_='hostName').text
        party_room_page_path = scraping_from_start4fun + store.find("a",class_="hostPicInfoHolder").get("href")
        print("名: " + party_room_name)
        print("網址: " + party_room_page_path)

        party_room_page_path_res = requests.get(party_room_page_path)
        party_room_page_soup =  BeautifulSoup(party_room_page_path_res.text, 'html.parser')

        # 適合人數
        party_room_max_and_min_number_of_people = store.find('p', class_='hostPpl')
        if party_room_max_and_min_number_of_people is not None:
            party_room_max_and_min_number_of_people = party_room_max_and_min_number_of_people.text
        else:
            party_room_max_and_min_number_of_people = ""
        print("適合人數: " + party_room_max_and_min_number_of_people)

        # 地址
        party_room_address = party_room_page_soup.find("p", class_='hostAddress').text
        print("地址: " + party_room_address)

        # 價錢
        party_room_price = party_room_page_soup.find("div", id='hotelDetail').find_all("div")
        price_save = ""
        for price in party_room_price:
            price = price.find("p")
            if price is not None:
                price = price.text
            else:
                price = ""
            if "星期一" in price:
                price_save = price
        party_room_price = price_save
        print("價錢: " + party_room_price)

        with open(data_file, mode='a') as employee_file:
                employee_writer = csv.writer(employee_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
                employee_writer.writerow([party_room_name, party_room_page_path, party_room_max_and_min_number_of_people, party_room_address, party_room_price])

    page_from_start4fun_party_room += 1