import requests
from bs4 import BeautifulSoup
import os
import csv
import json


# 名 網址 價錢 地址 面積 場地最高可容納人數

scraping_from_reUbird = 'https://reubird.hk'
page_from_reUbird_party_room = 1
data_file = os.path.join(os.path.dirname(__file__),'scraping-data','reUbird_scraping_data.csv')
error_file = os.path.join(os.path.dirname(__file__),'scraping-error','scraping_reUbird_error.json')

while True:
    party_room_list_page_path = f'{scraping_from_reUbird}/search/type/party-room?page={page_from_reUbird_party_room}'
    party_room_list_page_path_res = requests.get(party_room_list_page_path)
    party_room_list_page_soup = BeautifulSoup(party_room_list_page_path_res.text, 'html.parser')

    if party_room_list_page_path_res.status_code == requests.codes.ok:
        stories = party_room_list_page_soup.find_all('div', class_='col-md-3 p-relative party-room-font-family')
        if len(stories) == 0:
            break

        for store in stories:
            # 名 and 網址
            party_room_name = store.find('h5', class_='font-16 font-weight-bold mb-1 font-black')\
                                    .text.replace("\n","")
            party_room_page_path = scraping_from_reUbird \
                                    + store.find('a', class_='no-hover-link').get('href')
            print("Party Room Name： " + party_room_name)
            print("網址：" + party_room_page_path)

            party_room_page_path_res = requests.get(party_room_page_path)
            party_room_page_soup =  BeautifulSoup(party_room_page_path_res.text, 'html.parser')
            
            if party_room_page_path_res.status_code == requests.codes.ok and party_room_page_soup is not None:
                # 價錢

                party_room_price = party_room_page_soup.find(id="1309822929")
                if party_room_price is not None:
                    party_room_price = party_room_price.find("div", class_="font-15 venue-grey venue-font-family")
                if party_room_price is not None:
                    party_room_price = party_room_price.text
                else:
                    party_room_price = ""
                print("price: ",party_room_price)
                
                # 地址
                party_room_address = party_room_page_soup.find("p", class_='font-15 venue-grey venue-font-family')
                if party_room_address is not None:
                    party_room_address = party_room_address.text
                else:
                    party_room_address = ""
                print("地址: " + party_room_address)

                # 面積 and 場地最高可容納人數
                party_room_size_area_and_max_number_of_people = party_room_page_soup.find("div", class_='rb-soft-shadow rounded mb-4')
                if party_room_size_area_and_max_number_of_people is not None:
                    party_room_size_area_and_max_number_of_people = party_room_size_area_and_max_number_of_people.find_all("p" ,"font-weight-semibold font-15")
                    def is_area(p):
                        return "場地面積" in p.text
                    party_room_size_area = list(filter(is_area, party_room_size_area_and_max_number_of_people))
                    if len(party_room_size_area) > 0:
                        party_room_size_area = party_room_size_area[0].text.replace("\n","")
                    else:
                        party_room_size_area = ""
                    print("area: " + party_room_size_area)

                    def is_max_number_of_people(p):
                        return "場地最高可容納人數" in p.text
                    party_room_max_number_of_people = list(filter(is_max_number_of_people, party_room_size_area_and_max_number_of_people))
                    if len(party_room_max_number_of_people) > 0:
                        party_room_max_number_of_people = party_room_max_number_of_people[0].text
                    else:
                        party_room_max_number_of_people = ""
                    print("最高可容納人數: " + party_room_max_number_of_people)
                else:
                    party_room_max_number_of_people = ""
                    party_room_size_area = ""
                
                with open(data_file, mode='a') as employee_file:
                    employee_writer = csv.writer(employee_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

                    
                    employee_writer.writerow([party_room_name, party_room_page_path, party_room_price, party_room_address, party_room_size_area, party_room_max_number_of_people])
            else:
                with open(error_file) as json_file:
                    data = json.load(json_file)
                data.append({
                        'path': party_room_page_path,
                        'status_code': party_room_page_path_res.status_code,
                        'error':'Response status code is not 200.'
                    })
                with open(error_file, 'w') as outfile:
                    json.dump(data, outfile)


        print(f'page_from_reUbird_party_room: {page_from_reUbird_party_room}')
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
    page_from_reUbird_party_room += 1