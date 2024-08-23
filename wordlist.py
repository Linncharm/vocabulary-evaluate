import os
import glob
import re

def extract_words_from_files(directory):
    # 匹配所有以 stimulate_ 开头的 txt 文件
    file_paths = glob.glob(os.path.join(directory, 'stimulate_*.txt'))
    
    for file_path in file_paths:
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        # 初始化空列表来存储符合条件的单词
        words_only = []

        # 遍历每一行内容，排除最后一行
        for line in lines[:-1]:  # 使用切片去掉最后一行
            parts = line.split(',')
            if len(parts) > 1 and parts[1].strip() == '会':  # 判断第二部分是否为“会”
                word = parts[0].strip()  # 获取单词部分并去除空格和换行符
                clean_word = re.sub(r'[^\w\s]', '', word)  # 使用正则表达式去除单词中的符号
                words_only.append(clean_word)  # 将处理后的单词部分添加到列表中
        
        # 输出结果到相应的 txt 文件
        output_file_name = os.path.basename(file_path).replace('stimulate_', '').replace('.txt', '_output.txt')
        output_file_path = os.path.join(directory, output_file_name)
        
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            for word in words_only:
                output_file.write(word + '\n')
        
        # 输出结果
        print(f"Processed {file_path}, saved to {output_file_path}")

# 示例目录路径，你可以将这个路径替换为实际存放 stimulate_num 文件的目录
directory = './'

# 提取单词并保存到相应的 txt 文件
extract_words_from_files(directory)
