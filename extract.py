import os

def extract_words_in_batches(input_file, lines_per_file=500):
    with open(input_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    total_lines = len(lines)
    num_files = (total_lines // lines_per_file) + (1 if total_lines % lines_per_file != 0 else 0)
    
    for i in range(num_files):
        start_line = i * lines_per_file
        end_line = start_line + lines_per_file
        batch_lines = lines[start_line:end_line]
        
        # 提取每一行的单词（第二列）
        words = [line.split('\t')[1] for line in batch_lines]
        
        # 输出文件路径
        output_file = f"{i}_word.txt"
        
        # 将单词按列写入输出文件
        with open(output_file, 'w', encoding='utf-8') as file:
            for word in words:
                file.write(word + '\n')
        
        print(f"Lines {start_line + 1} to {end_line} have been extracted to {output_file}.")

# 输入文件路径
input_file = 'words_219k.txt'

# 每个文件的行数
lines_per_file = 500

# 提取单词并保存到多个文件
extract_words_in_batches(input_file, lines_per_file)
