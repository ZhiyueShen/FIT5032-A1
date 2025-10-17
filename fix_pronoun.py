import json

# 读取原文件
with open("user_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 处理 Pronoun -> pronoun
for item in data:
    if "Pronoun" in item:
        item["pronoun"] = item["Pronoun"]
        del item["Pronoun"]

# 保存结果
with open("user_data_fixed.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ 已完成修改并保存为 user_data_fixed.json（Pronoun → pronoun）")
