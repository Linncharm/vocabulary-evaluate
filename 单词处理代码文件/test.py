import re
import random
from collections import defaultdict

file_path = 'words.txt'

# 打开文件并读取内容
with open(file_path, 'r', encoding='utf-8') as file:
    content = file.read()

# 转换为小写并移除标点符号
#content = content.lower()
words = re.findall(r'\b[a-z]+\b', content)

# 统计单词频率
word_freq = {}
for word in words:
    if len(word) > 2 and not word.endswith('s') and not word[0].isupper():  # 筛选条件：多于两个字母且不以's'结尾
        if word in word_freq:
            word_freq[word] += 1
        else:
            word_freq[word] = 1

# 分级处理，定义10个梯度
levels = {
    "级别1": [],
    "级别2": [],
    "级别3": [],
    "级别4-1": [],
    "级别4-2": [],
    "级别5-1": [],
    "级别5-2": [],
    "级别6-1": [],
    "级别6-2": [],
    "级别7-1": [],
    "级别7-2": [],
    "级别7-3": [],
    "级别7-4": [],
    "级别8-1": [],
    "级别8-2": [],
    "级别8-3": [],
    "级别8-4": [],
    "级别8-5": [],
    "级别9-1": [],
    "级别9-2": [],
    "级别9-3": [],
    "级别9-4": [],
    "级别10": []
}

# 根据词频将单词分级
for word, freq in word_freq.items():
    if freq > 1000:
        levels["级别1"].append(word)
    elif 500 < freq <= 1000:
        levels["级别2"].append(word)
    elif 200 < freq <= 500:
        levels["级别3"].append(word)
    elif 108 < freq <= 200:
        levels["级别4-1"].append(word)
    elif 75 < freq <= 108:
        levels["级别4-2"].append(word)
    elif 53 < freq <= 75:
        levels["级别5-1"].append(word)
    elif 40 < freq <= 53:
        levels["级别5-2"].append(word)
    elif 31 < freq <= 40:
        levels["级别6-1"].append(word)
    elif 24 < freq <= 31:
        levels["级别6-2"].append(word)
    elif 20 < freq <= 24:
        levels["级别7-1"].append(word)
    elif 17 < freq <= 20:
        levels["级别7-2"].append(word)
    elif 14 < freq <= 17:
        levels["级别7-3"].append(word)
    elif 12 < freq <= 14:
        levels["级别7-4"].append(word)
    elif 10 < freq <= 12:
        levels["级别8-1"].append(word)
    elif 9 < freq <= 10:
        levels["级别8-2"].append(word)
    elif 8 < freq <= 9:
        levels["级别8-3"].append(word)
    elif 7 < freq <= 8:
        levels["级别8-4"].append(word)
    elif 6 < freq <= 7:
        levels["级别8-5"].append(word)
    elif freq==6:
        levels["级别9-1"].append(word)
    elif freq==5:
        levels["级别9-2"].append(word)
    elif freq==4:
        levels["级别9-3"].append(word)
    elif freq==3:
        levels["级别9-4"].append(word)
    else:
        levels["级别10"].append(word)

# 打印各级别的单词数量
for level, words in levels.items():
    print(f"{level} 单词数量: {len(words)}")

# 从每个级别中随机抽取300条数据
random_samples = defaultdict(list)
sample_size = 400

for level in levels:
    if len(levels[level]) > sample_size:
        random_samples[level] = random.sample(levels[level], sample_size)
    else:
        random_samples[level] = levels[level]

# 将每个级别的单词保存为独立的txt文件
for level, words in random_samples.items():
    output_file = f'{level}_词库.txt'
    with open(output_file, 'w', encoding='utf-8') as file:
        for word in words:
            file.write(f"{word}\n")
    print(f"{level}词库已保存为 {output_file}")

print("所有级别的词库已保存完毕。")

# 生成一个文档，记录所有单词的词频
with open('words_frequency_2.txt', 'w', encoding='utf-8') as file:
    for word, freq in word_freq.items():
        # Only write words with frequency 900 or less
        if 1< freq  :
            file.write(f"{word}: {freq}\n")
