import json

def convert_txt_to_json(txt_file, json_file):
    with open(txt_file, 'r', encoding='utf-8') as file:
        words = file.read().splitlines()
    
    json_data = [{"_id": f"n{i+8}", "headword": word} for i, word in enumerate(words)]
    
    with open(json_file, 'w', encoding='utf-8') as file:
        for entry in json_data:
            file.write(json.dumps(entry, ensure_ascii=False) + "\n")

# 遍历并转换 word0.txt 到 word20.txt
for i in range(21):
    txt_file = f"word{i}.txt"
    json_file = f"word{i}.json"
    convert_txt_to_json(txt_file, json_file)

print("文件转换完成。")
