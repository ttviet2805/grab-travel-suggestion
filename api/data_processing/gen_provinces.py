import json

# List of states in Vietnam
states = [
    "An Giang Province", "Ba Ria–Vung Tau Province", "Bac Giang Province", 
    "Bac Kan Province", "Bac Lieu Province", "Bac Ninh Province", "Ben Tre Province", 
    "Binh Dinh Province", "Binh Duong Province", "Binh Phuoc Province", 
    "Binh Thuan Province", "Ca Mau Province", "Can Tho", "Cao Bang Province", 
    "Da Nang", "Dak Lak Province", "Dak Nong Province", "Dien Bien Province", 
    "Dong Nai Province", "Dong Thap Province", "Gia Lai Province", "Ha Giang Province", 
    "Ha Nam Province", "Ha Noi", "Ha Tinh Province", "Hai Duong Province", 
    "Hai Phong", "Hau Giang Province", "Ho Chi Minh City", "Hoa Binh Province", 
    "Hung Yen Province", "Khanh Hoa Province", "Kien Giang Province", 
    "Kon Tum Province", "Lai Chau Province", "Lam Dong Province", "Lang Son Province", 
    "Lao Cai Province", "Long An Province", "Nam Dinh Province", "Nghe An Province", 
    "Ninh Binh Province", "Ninh Thuan Province", "Phu Tho Province", "Phu Yen Province", 
    "Quang Binh Province", "Quang Nam Province", "Quang Ngai Province", 
    "Quang Ninh Province", "Quang Tri Province", "Soc Trang Province", "Son La Province", 
    "Tay Ninh Province", "Thai Binh Province", "Thai Nguyen Province", 
    "Thanh Hoa Province", "Thua Thien Hue Province", "Tien Giang Province", 
    "Tra Vinh Province", "Tuyen Quang Province", "Vinh Long Province", 
    "Vinh Phuc Province", "Yen Bai Province"
]

# Format each state as a dictionary
state_data = [{"state": state, "country": "Vietnam"} for state in states]

# Convert the list of dictionaries to a JSON string
json_data = json.dumps(state_data, ensure_ascii=False, indent=4)  # Set ensure_ascii to False to handle Unicode characters

# Write the JSON data to a file with explicit UTF-8 encoding
file_path = "states.json"
with open(file_path, 'w', encoding='utf-8') as file:
    file.write(json_data)

print("JSON file has been created with all states of Vietnam.")
