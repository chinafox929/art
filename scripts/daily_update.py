#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
云上美术馆 - 每日自动更新脚本
"""

import json
import os
import random
from datetime import datetime

# 名画数据库
ARTWORKS = [
    {
        "id": "starry-night",
        "title": "星月夜",
        "artist": "文森特·梵高",
        "year": "1889",
        "category": "印象派",
        "image": "images/starry-night.jpg",
        "description": "《星月夜》是梵高在圣雷米精神病院期间创作的代表作。画面中旋转的星云、燃烧般的柏树，展现了艺术家内心强烈的情感波动。"
    },
    {
        "id": "impression-sunrise",
        "title": "印象·日出",
        "artist": "克劳德·莫奈",
        "year": "1872",
        "category": "印象派",
        "image": "images/impression-sunrise.jpg",
        "description": "这幅画作催生了'印象派'这个名称。莫奈用模糊的笔触描绘了勒阿弗尔港的日出，捕捉了瞬间的光影变化。"
    },
    {
        "id": "water-lilies",
        "title": "睡莲",
        "artist": "克劳德·莫奈",
        "year": "1906",
        "category": "印象派",
        "image": "images/water-lilies.jpg",
        "description": "莫奈晚年创作的睡莲系列，描绘了吉维尼花园的池塘景色，是印象派绘画的巅峰之作。"
    },
    {
        "id": "dance-at-moulin",
        "title": "煎饼磨坊的舞会",
        "artist": "皮埃尔-奥古斯特·雷诺阿",
        "year": "1876",
        "category": "印象派",
        "image": "images/dance-at-moulin.jpg",
        "description": "雷诺阿描绘了巴黎蒙马特高地煎饼磨坊的欢乐场景，阳光透过树叶洒在人们身上，充满生活气息。"
    },
    {
        "id": "mona-lisa",
        "title": "蒙娜丽莎",
        "artist": "列奥纳多·达·芬奇",
        "year": "1503-1519",
        "category": "文艺复兴",
        "image": "images/mona-lisa.jpg",
        "description": "世界上最著名的肖像画，蒙娜丽莎神秘的微笑吸引了无数观众，是卢浮宫的镇馆之宝。"
    },
    {
        "id": "birth-of-venus",
        "title": "维纳斯的诞生",
        "artist": "桑德罗·波提切利",
        "year": "1485",
        "category": "文艺复兴",
        "image": "images/birth-of-venus.jpg",
        "description": "波提切利描绘了维纳斯从海中诞生的神话场景，体现了文艺复兴时期对古典美的追求。"
    },
    {
        "id": "last-supper",
        "title": "最后的晚餐",
        "artist": "列奥纳多·达·芬奇",
        "year": "1495-1498",
        "category": "文艺复兴",
        "image": "images/last-supper.jpg",
        "description": "达芬奇在米兰圣玛利亚修道院创作的壁画，描绘了耶稣与十二门徒最后的晚餐场景。"
    },
    {
        "id": "creation-of-adam",
        "title": "创造亚当",
        "artist": "米开朗基罗",
        "year": "1508-1512",
        "category": "文艺复兴",
        "image": "images/creation-of-adam.jpg",
        "description": "西斯廷教堂天顶画的一部分，描绘了上帝将生命之火传给亚当的经典瞬间。"
    },
    {
        "id": "qingming-festival",
        "title": "清明上河图",
        "artist": "张择端",
        "year": "北宋",
        "category": "中国书画",
        "image": "images/qingming-festival.jpg",
        "description": "中国十大传世名画之一，生动记录了北宋都城汴京的繁华景象，是研究宋代城市生活的珍贵资料。"
    },
    {
        "id": "thousand-li",
        "title": "千里江山图",
        "artist": "王希孟",
        "year": "北宋",
        "category": "中国书画",
        "image": "images/thousand-li.jpg",
        "description": "青绿山水画的巅峰之作，18岁少年王希孟的唯一传世作品，现藏于北京故宫博物院。"
    },
    {
        "id": "fuchun-mountains",
        "title": "富春山居图",
        "artist": "黄公望",
        "year": "元代",
        "category": "中国书画",
        "image": "images/fuchun-mountains.jpg",
        "description": "中国山水画的至高境界，被誉为'画中之兰亭'，现分藏于台北故宫博物院和浙江省博物馆。"
    },
    {
        "id": "wanshan-red",
        "title": "万山红遍",
        "artist": "李可染",
        "year": "1964",
        "category": "中国书画",
        "image": "images/wanshan-red.jpg",
        "description": "近现代山水画革新之作，以朱砂点染山林，开创红色山水新风，是李可染的代表作。"
    },
    {
        "id": "the-scream",
        "title": "呐喊",
        "artist": "爱德华·蒙克",
        "year": "1893",
        "category": "现代艺术",
        "image": "images/the-scream.jpg",
        "description": "表现主义艺术的巅峰之作，描绘了现代人内心深处的焦虑与恐惧，是挪威国家美术馆的镇馆之宝。"
    },
    {
        "id": "girl-with-pearl",
        "title": "戴珍珠耳环的少女",
        "artist": "约翰内斯·维米尔",
        "year": "约1665",
        "category": "现代艺术",
        "image": "images/girl-with-pearl.jpg",
        "description": "被誉为'北方的蒙娜丽莎'，维米尔以纯黑背景衬托少女的面容，那抹神秘的凝视穿越三百余年。"
    },
    {
        "id": "guernica",
        "title": "格尔尼卡",
        "artist": "巴勃罗·毕加索",
        "year": "1937",
        "category": "现代艺术",
        "image": "images/guernica.jpg",
        "description": "毕加索为抗议纳粹轰炸西班牙小镇格尔尼卡而创作，以立体主义手法展现了战争的残酷。"
    },
    {
        "id": "persistence-of-memory",
        "title": "记忆的永恒",
        "artist": "萨尔瓦多·达利",
        "year": "1931",
        "category": "现代艺术",
        "image": "images/persistence-of-memory.jpg",
        "description": "达利的超现实主义代表作，软塌塌的时钟象征着时间的相对性和记忆的流逝。"
    }
]

def load_history():
    """加载历史记录"""
    if os.path.exists('data/history.json'):
        with open('data/history.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"last_shown": []}

def save_history(history):
    """保存历史记录"""
    os.makedirs('data', exist_ok=True)
    with open('data/history.json', 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def select_today_artwork():
    """选择今日画作"""
    history = load_history()
    last_shown = history.get("last_shown", [])
    
    # 过滤掉最近展示过的（最近5天）
    available = [a for a in ARTWORKS if a["id"] not in last_shown[-5:]]
    if not available:
        available = ARTWORKS
    
    # 按流派轮换
    categories = ["印象派", "文艺复兴", "中国书画", "现代艺术"]
    today_category = categories[len(last_shown) % 4]
    
    category_artworks = [a for a in available if a["category"] == today_category]
    if category_artworks:
        artwork = random.choice(category_artworks)
    else:
        artwork = random.choice(available)
    
    # 更新历史
    last_shown.append(artwork["id"])
    history["last_shown"] = last_shown[-20:]
    save_history(history)
    
    print(f"今日推荐: {artwork['title']} ({artwork['category']})")
    return artwork

def update_index_html(artwork):
    """更新首页"""
    today = datetime.now().strftime("%Y年%m月%d日")
    
    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>云上美术馆</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #1a1a1a; color: #fff; }}
    .navbar {{ display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(0,0,0,0.5); }}
    .nav-brand {{ font-size: 1.2rem; color: #f0e68c; }}
    .nav-links {{ display: flex; gap: 2rem; list-style: none; }}
    .nav-links a {{ color: #fff; text-decoration: none; }}
    .nav-links a:hover {{ color: #f0e68c; }}
    .hero {{ text-align: center; padding: 4rem 2rem; }}
    .hero h1 {{ font-size: 3rem; margin-bottom: 1rem; }}
    .daily-section {{ max-width: 1200px; margin: 0 auto; padding: 2rem; }}
    .daily-card {{ display: flex; gap: 2rem; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 2rem; }}
    .daily-image {{ flex: 1; }}
    .daily-image img {{ width: 100%; border-radius: 8px; }}
    .daily-info {{ flex: 1; padding: 1rem; }}
    .daily-date {{ color: #f0e68c; margin-bottom: 1rem; }}
    .daily-title {{ font-size: 2rem; margin-bottom: 0.5rem; }}
    .daily-artist {{ color: #aaa; margin-bottom: 1rem; }}
    .daily-desc {{ line-height: 1.8; color: #ccc; }}
    .footer {{ text-align: center; padding: 2rem; color: #666; margin-top: 4rem; }}
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-brand">◆ 云上美术馆</div>
    <ul class="nav-links">
      <li><a href="index.html">首页</a></li>
      <li><a href="impressionism.html">印象派</a></li>
      <li><a href="renaissance.html">文艺复兴</a></li>
      <li><a href="chinese.html">中国书画</a></li>
      <li><a href="modern.html">现代艺术</a></li>
    </ul>
  </nav>
  
  <section class="hero">
    <h1>每日艺术之旅</h1>
    <p>每天一幅世界名画，感受艺术的魅力</p>
  </section>
  
  <section class="daily-section">
    <div class="daily-card">
      <div class="daily-image">
        <img src="{artwork['image']}" alt="{artwork['title']}">
      </div>
      <div class="daily-info">
        <div class="daily-date">{today} 今日推荐 · {artwork['category']}</div>
        <h2 class="daily-title">{artwork['title']}</h2>
        <div class="daily-artist">{artwork['artist']} · {artwork['year']}</div>
        <p class="daily-desc">{artwork['description']}</p>
      </div>
    </div>
  </section>
  
  <footer class="footer">
    <p>© 2026 云上美术馆 · 每日更新</p>
  </footer>
</body>
</html>'''
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"已更新首页: {artwork['title']}")

def main():
    """主函数"""
    print("=" * 50)
    print("开始每日更新任务")
    
    # 选择今日画作
    artwork = select_today_artwork()
    
    # 更新首页
    update_index_html(artwork)
    
    print("每日更新任务完成")
    print("=" * 50)

if __name__ == "__main__":
    main()
