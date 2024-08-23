import concurrent.futures
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, ElementClickInterceptedException
from random import sample
from time import sleep

def run_test(driver_path, test_number):
    # 设置WebDriver路径
    service = Service(executable_path=driver_path)
    driver = webdriver.Chrome(service=service)

    # 导航到网页
    driver.get("https://preply.com/en/learn/english/test-your-vocab")

    # 等待页面加载
    sleep(5)  # 根据需要调整等待时间

    # 定位所有复选框按钮
    checkboxes = driver.find_elements(By.CSS_SELECTOR, "button[role='checkbox']")
    words = {}

    # 记录每个复选框对应的词汇
    for checkbox in checkboxes:
        label = checkbox.find_element(By.XPATH, "./following-sibling::span")
        word = label.text
        words[checkbox] = word

    # 随机选择20个复选框进行点击
    selected_checkboxes = sample(list(words.keys()), min(25, len(words)))  # 确保不会超过复选框的数量
    clicked_words = {}

    for checkbox in selected_checkboxes:
        try:
            driver.execute_script("arguments[0].click();", checkbox)
            clicked_words[words[checkbox]] = "会"
            sleep(0.5)  # 随机等待，模拟用户操作
        except Exception as e:
            print(f"测试 {test_number} - 点击时出错：", e)

    # 定位并点击包含特定<span>标签的"Continue"按钮
    continue_button_xpath = "//button[@data-preply-ds-component='Button']/span[text()='Continue']/.."
    wait = WebDriverWait(driver, 10)

    def click_continue_button():
        try:
            continue_button = wait.until(EC.element_to_be_clickable((By.XPATH, continue_button_xpath)))
            driver.execute_script("arguments[0].scrollIntoView();", continue_button)  # 滚动到按钮可见
            driver.execute_script("arguments[0].click();", continue_button)
            sleep(5)
        except StaleElementReferenceException:
            print(f"测试 {test_number} - 元素过时，重新定位并点击。")
            click_continue_button()
        except ElementClickInterceptedException:
            print(f"测试 {test_number} - 元素点击被阻挡，等待阻挡元素消失。")
            sleep(2)  # 等待阻挡元素消失
            click_continue_button()
        except Exception as e:
            print(f"测试 {test_number} - 点击 'Continue' 按钮时出错：", e)

    click_continue_button()

    # 定位新页面中的所有复选框按钮并记录对应的词汇
    new_checkboxes = driver.find_elements(By.CSS_SELECTOR, "button[role='checkbox']")

    for checkbox in new_checkboxes:
        label = checkbox.find_element(By.XPATH, "./following-sibling::span")
        word = label.text
        words[checkbox] = word

    # 随机选择30个复选框进行点击
    selected_new_checkboxes = sample(list(words.keys()), min(60, len(words)))  # 确保不会超过复选框的数量

    for checkbox in selected_new_checkboxes:
        try:
            driver.execute_script("arguments[0].scrollIntoView();", checkbox)  # 滚动到按钮可见
            wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[role='checkbox']")))  # 确保元素可点击
            driver.execute_script("arguments[0].click();", checkbox)
            clicked_words[words[checkbox]] = "会"
            sleep(0.5)  # 随机等待，模拟用户操作
        except Exception as e:
            print(f"测试 {test_number} - 点击时出错：", e)

    # 定位并点击包含特定<span>标签的"Continue"按钮
    click_continue_button()

    sleep(5)

    # 定位结果元素并打印其文本内容
    result_css = "h3[data-preply-ds-component='Heading']"
    try:
        result_element = driver.find_element(By.CSS_SELECTOR, result_css)
        result_text = result_element.text
        print(f"测试 {test_number} - Your vocabulary count is: {result_text}")
    except Exception as e:
        print(f"测试 {test_number} - 定位结果元素时出错：", e)

    # 将未点击的词汇标记为不会
    for checkbox, word in words.items():
        if word not in clicked_words:
            clicked_words[word] = "不会"

    # 构建最终输出文本按列排放
    output = [f"'{word}',{status}" for word, status in clicked_words.items()]
    output.append(f"'测试结果',{result_text}")

    output_text = "\n".join(output)

    # 使用结果文本中的数字构建文件名
    filename = f"stimulate_{result_text}.txt"

    # 将结果写入指定文件名
    with open(filename, "w", encoding="utf-8") as f:
        f.write(output_text)

    # 关闭浏览器
    driver.quit()

# 运行3个测试
driver_path = 'C:\\Program Files\\Google\\Chrome\\Application\\chromedriver.exe'

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(run_test, driver_path, i) for i in range(1,6)]

# 等待所有线程完成
concurrent.futures.wait(futures)
