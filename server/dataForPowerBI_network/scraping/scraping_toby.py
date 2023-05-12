import requests
from bs4 import BeautifulSoup
import csv
import json
import os

# 名 網址 地址 營業狀態 電話

scraping_from_toby = "https://www.hellotoby.com"
page_from_toby_party_room = 0
error_file = os.path.join(os.path.dirname(__file__),'scraping-error','scraping_toby_error.json')
data_file = os.path.join(os.path.dirname(__file__),'scraping-data','toby_scraping_data.csv')

while True:
    party_room_list_page_path = f'{scraping_from_toby}/zh-hk/s/party-room?offset={page_from_toby_party_room * 10}&storeType=O_PAR'
    party_room_list_page_path_res = requests.get(party_room_list_page_path)

    if party_room_list_page_path_res.status_code == requests.codes.ok:
        party_room_list_page_soup = BeautifulSoup(party_room_list_page_path_res.text, 'html.parser')
        stories = party_room_list_page_soup.find_all('a', class_='chxpzi-5 dbKwvP')
        if len(stories) == 0:
            break
        for s in stories:
            # 名 and 網址
            party_room_name = s.text
            party_room_page_path = scraping_from_toby + s.get('href')
            print("Party Room Name：" + party_room_name)
            print("網址：" + party_room_page_path)

            party_room_page_path_res = requests.get(party_room_page_path)
            party_room_page_soup =  BeautifulSoup(party_room_page_path_res.text, 'html.parser')

            # 地址 and 營業狀態
            party_room_address_and_open_status = party_room_page_soup.find_all("div", class_='sc-1gk93j8-22 kbxqyW showPaddingBottom')
            if len(party_room_address_and_open_status) == 0:
                party_room_address = ""
            else:
                party_room_address = party_room_address_and_open_status[0].text
            print("Address: " + party_room_address)
            if len(party_room_address_and_open_status) > 1:
                party_room_open_status = party_room_address_and_open_status[1].text
            else:
                party_room_open_status = ""
            print("營業狀態: " + party_room_open_status)

            # 電話
            party_room_phone = party_room_page_soup.find("div", class_='sc-1gk93j8-22 kbxqyW')
            if party_room_phone is not None:
                party_room_phone = party_room_phone.text
            else:
                party_room_phone = ""
            print("電話: " + party_room_phone)

            with open(data_file, mode='a') as employee_file:
                employee_writer = csv.writer(employee_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

                
                employee_writer.writerow([party_room_name, party_room_page_path, party_room_address, party_room_open_status, party_room_phone])
    else:
        with open(error_file) as json_file:
            data = json.load(json_file)
        data.append({
                'path': party_room_list_page_path,
                'status_code': party_room_list_page_path_res.status_code,
                'error':'Response status code is not 200.'
            })
        with open(error_file, 'w') as outfile:
            json.dump(data, outfile)
    page_from_toby_party_room += 1
    print(f'page_from_toby_party_room: {page_from_toby_party_room}')

