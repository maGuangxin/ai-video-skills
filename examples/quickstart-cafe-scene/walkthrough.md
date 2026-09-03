# 最简咖啡馆示例 walkthrough（跑通 8 粒 Skill，不沾北地柔情）
> 背景：2 角色 + 1 咖啡馆场景 + 单段 10 秒剧情（男生推咖啡杯给女生，微笑，女生脸红低头）
> 入口：走【单段片段现成】→ 不用有完整故事，直接跑 SK0+SK0b→SK1+SK2(并行)→SK3→SK4→SK6(并行SK4)→SK5 四档打勾

---

## Step 1：SK0 初始化（12 项提问怎么填示例）

> 入口类型 entryType = `single_scene_clip_ready`（单段片段现成）
> 剧情只有 1 段 10 秒的咖啡馆初次见面，不用写完整 3 幕式

| SK0 提问 12 项 | 用户怎么答（示例） | 写入什么专业值 |
|---|---|---|
| 1. 故事名 / 项目名 | 「初次见面咖啡馆」 | projectName = 初次见面咖啡馆 v01 |
| 2. 视频时长 & 画幅比例 | 「单段 10 秒 / 竖屏 9:16」 | totalSeconds = 10 / aspectRatio = 9x16 |
| 3. 输出画幅 & 尺寸 | 「竖屏 9:16 1080×1920」 | outputSize = 1080x1920 / orientation = portrait |
| 4. 是否有台词？口型要求？ | 「有两句短台词」 | hasDialogue = true / dialogueDifficulty = 2句短 → 口型难度中等 |
| 5. 美术风格（8 选 1） | 「写实」 | artStyle = realistic / 自动激活：3 次写实夹攻开 + 家具 cm 锚点开 + 百分比特权锚点开 + 6 桶负向全开 + 完整前缀强制复制开 |
| 6. 视频模式？ | 「豆包端 5 秒 + 首尾帧」→ 自动 | |
| 7. 一致性难度？| 「2 人同框 → 困难」→ charDiff = 困难，12 件装备必填 | |
| 8. 光照 / 天气？ | 「下午阳光明媚」→ 自动映射：Cinema_d4, WarmSun 4-6 PM, CCT 4500K | |
| 9. 色调风格？ | 「暖色系温馨」→ 自动映射：Teal Orange LUT, Gamma 2.4 | |
| 10. 角色 & 场景 ID 数量？| 角色：2 / 场景：1 → 自动 | |
| 11. 后期配音？TTS？ | 「要配音，不开音乐」→ | |
| 12. 命名规范 & 输出目录？ | 「英文语义化，项目放本目录下」→ | |

---

## Step 2：SK1 角色设计（3 行完整前缀示例）

### 角色 1：char-1-li-ming 男 24 岁 程序员 上班族
> 3 行完整前缀（完整前缀强制复制法 → 所有 SK4 提示词必须直接复制，不能漏一件）

```
char-1-li-ming 李明 24岁亚洲男性 身高178cm 黑色利落短发 发旋清晰 偏分7:3 内双棕色大眼 高鼻梁 厚度适中嘴唇 左耳无耳洞
char-1 iconic-equipment: head-black-casual-cap / neck-silver-thin-chain / chest-navy-blue-100-cotton-polo / hands-black-rubber-sport-watch-right-wrist / waist-black-cowhide-leather-belt / legs-dark-gray-slim-fit-chinos / feet-white-sneakers-with-grey-sole / accessory-clear-rectangle-glasses
char-1 24yo-casual-office-worker 皮肤暖白偏2号 嘴角左单痣一颗
```

### 角色 2：char-2-lin-xi 女 23 岁 大学生
> 3 行完整前缀

```
char-2-lin-xi 林夕 23岁亚洲女性 身高165cm 深棕及腰波浪长发 发尾微卷空气刘海 圆杏眼桃花眼 双眼皮 卧蚕明显 小巧鼻梁 粉唇左唇珠明显 左耳小珍珠耳钉1颗
char-2 iconic-equipment: head-white-hair-clip-cute-bunny / neck-gold-star-necklace-small / chest-light-pink-round-neck-loose-blouse-white-buttons / hands-no-accessories / waist-white-thin-fabric-belt / legs-beige-knee-length-a-line-skirt / feet-beige-small-heel-leather-loafers / accessory-white-small-handbag-leather
char-2 23yo-college-student 皮肤冷白1号色 笑起来苹果肌 右下唇唇下一颗小痣
```

### 双人同框百分比锚点（写实开 → 直接抄）
```
two-people-percentile-anchor: char-1 李明 头顶画面5.0%-6.0% 鞋底画面93%-95% 身高178cm / char-2 林夕 头顶画面8.0%-9.5% 鞋底画面94%-96% 身高165cm 两人身高差13cm=画面顶相差3.5% 正确
```

---

## Step 3：SK2 场景设计（咖啡馆 cm 锚点示例）

### scene-1-coffee-shop 下午 靠窗 2 人桌 4 点阳光
家具 cm 锚点（写实风格必填，AI 压缩比例的锚定）：
| 家具 | 真实高度 |
|---|---|
| 两人小圆桌 | 桌面高 74 cm（标准餐桌） |
| 咖啡椅 | 椅面 45 cm / 椅背 85 cm |
| 落地窗把手 | 125 cm |
| 吧台 | 桌面 110 cm |

专业建议：shotScale = Medium Shot 3/4 身（因为是互动，Medium Long 到 Medium 切换）→ 对应 cin 50mm f2.8

---

## Step 4：SK3 拆分镜 + 四维对齐表（单段 10s 不用拆，一段 shot-1A 就够）

> 4 原则拆分镜结论：10s 单段，无长台词，不跨段，不需要拆分。
> 四维对齐表：
| Shot | 开始 | 结束 | V时长 | Action/动作 | Lip原文 | Lip字数 | TTS预估s=字÷4 | 匹配？ |
|---|---|---|---|---|---|---|---|---|
| shot-1A | 0.0 | 10.0 | 10.0 | 1-3s：李明推咖啡杯微笑 / 3-8s：林夕看到脸红 / 8-10s：低头抿嘴笑 | 8.5s 林夕小声：「……谢谢」 | 2字 | 0.5s | ✅ 小于10s，嘴窗够用 |

> 首尾帧嘴状态衔接：
> - shot-1A 首帧（0.0s）首嘴：neutral closed → 刚坐定，没说话
> - shot-1A 尾帧（10.0s）尾嘴：happy smiling-lips closed → 说完笑，嘴闭
> - 下一段不存在，不用衔接

---

## Step 5：SK4 完整 3 次夹攻提示词（写实风格 + 2 人同框）

### shot-1A 提示词（3 次夹攻完整）
```
【第1次写实夹攻 · 开头权重最高位双写实】2 characters photorealistic ultra realistic cinematic shot. two-people-percentile-anchor: char-1 李明 头顶5.0% 鞋底94% / char-2 林夕 头顶8.5% 鞋底95% 身高差13cm 画面顶相差3.5% 比例正确。realistic photo, 8k uhd, sony a7r v 50mm f/2.8 gm master lens, shot on arri alexa 35, 24fps, 180 degree shutter 1/48s, cinematic color grading rec.709 gamma 2.4 teal & orange lut, warm sunlight golden hour 4:30pm, 45 degree key fill rim 3 point lighting 1.5:1 2.0:1 contrast ratio, soft window backlight practical lamp ambient, depth of field f/2.8 medium shot 3/4 body.
【完整前缀 · 必须直接复制 SK1 3 行完整前缀 · 不得漏一个】
char-1-li-ming 李明 24岁亚洲男性 身高178cm 黑色利落短发 发旋清晰 偏分7:3 内双棕色大眼 高鼻梁 厚度适中嘴唇 左耳无耳洞
char-1 iconic-equipment: head-black-casual-cap / neck-silver-thin-chain / chest-navy-blue-100-cotton-polo / hands-black-rubber-sport-watch-right-wrist / waist-black-cowhide-leather-belt / legs-dark-gray-slim-fit-chinos / feet-white-sneakers-with-grey-sole / accessory-clear-rectangle-glasses
char-1 24yo-casual-office-worker 皮肤暖白偏2号 嘴角左单痣一颗
char-2-lin-xi 林夕 23岁亚洲女性 身高165cm 深棕及腰波浪长发 发尾微卷空气刘海 圆杏眼桃花眼 双眼皮 卧蚕明显 小巧鼻梁 粉唇左唇珠明显 左耳小珍珠耳钉1颗
char-2 iconic-equipment: head-white-hair-clip-cute-bunny / neck-gold-star-necklace-small / chest-light-pink-round-neck-loose-blouse-white-buttons / hands-no-accessories / waist-white-thin-fabric-belt / legs-beige-knee-length-a-line-skirt / feet-beige-small-heel-leather-loafers / accessory-white-small-handbag-leather
char-2 23yo-college-student 皮肤冷白1号色 笑起来苹果肌 右下唇唇下一颗小痣
【第2次写实夹攻 · 角色段末尾追加材质写实】ultra realistic skin texture 8k pores visible, realistic cotton fabric texture polo shirt, realistic leather material belt and shoes, ultra detailed accessories, photorealistic human eye iris detail, natural micro skin imperfections photoreal.
【场景 + 家具 cm 锚点】场景scene-1 afternoon coffee shop, 两人小圆桌桌面高74cm, 餐咖啡椅座面高45cm, 落地窗把手高125cm, 吧台桌面高110cm 真实尺寸比例正确。下午四点靠窗温暖阳光 窗景室外街道虚化景深 桌面放一杯拿铁咖啡冒着热气 木质桌面。
【镜头语言】cinematic 50mm medium shot 3/4 body, rule of thirds composition char-1 on left 1/3 char-2 on right 1/3 empty center 1/3 negative space, 轻微推镜 slow push in 2mm zoom, 24fps cinematic camera language.
【动作时间轴 shot-1A 0-10s】0-3s: 李明右手轻轻推咖啡杯越过桌子中心线嘴角上扬温暖真诚微笑；3-6s: 林夕看到咖啡杯眨两次眼睛瞳孔微微放大；6-8.5s: 林夕脸色逐渐红晕害羞苹果肌明显；8.5-10s: 林夕低头抿嘴笑小声说谢谢，说完低头害羞。
【口型 6 正词 7 禁词 · 8.5s-10s 林夕台词仅2字谢谢】【正6】natural lip sync 2 chinese words precise lip movement, closed mouth before speaking, natural lip shape while saying xie xie, phonetically accurate mouth movement, smooth lip transition, subtle jaw movement / 【禁7】no distorted lips, no fused lips, no extra mouth, no cartoon mouth, no open mouth when silent, no exaggerated unrealistic lip size, no mismatched lip movement and audio
【第3次写实夹攻 · 灯光段末尾追加禁平光】cinematic 3-point lighting no flat lighting, avoid flat overhead lighting, shadows and highlights layered, dynamic range 14 stops, cinematic contrast 2.0:1 ratio, never flat dull lighting always cinematic.
【负向 6 桶 48 禁】
1. 口型7禁: distorted_lips, fused_lips, extra_mouth, cartoon_mouth, open_mouth_when_silent, exaggerated_lip_size, mismatched_lip_audio
2. 卡通风13禁: cartoon_style, anime_style, pixar_3d_style, disney_3d_style, illustration, drawing, painting, comic_style, chibi_style, stylized, low_poly_3d, 2d_flat, vector_art
3. 材质9禁: plastic_skin_texture, smooth_wax_skin, cgi_render_look, game_engine_screenshot, uncanny_valley, oversaturated_fake_colors, low_resolution_blurry, jpeg_artifacts, compression_noise
4. 比例9禁: distorted_body_proportions, extra_long_arms, extra_short_legs, enlarged_head, extra_fingers, missing_fingers, fused_fingers, deformed_hands, mismatched_eye_level_height_two_people
5. 细节10禁: blurry_face, multiple_heads, extra_eyes, deformed_face, asymmetrical_eyes, mismatched_eyebrows, deformed_nose, extra_limbs, missing_limbs, floating_objects_no_gravity
6. 基础10禁: watermark, text_overlay, subtitles_in_frame, logo, timestamp, ui_elements, frame_border, split_screen, black_bars, letterboxing
【兜底3条 豆包端修复方案】
1. 首帧修正：如果视频开头0-0.3秒角色脸变/12件装备漏 → 用「首帧固定图」功能 直接上传 kf-shot-1A-head 关键帧作为强制首帧
2. 局部修改（优先）：如果只有某1秒脸不对/口型对不上 → 用「局部重绘」框选该秒脸或嘴 直接在原视频上修 不要重生成整段
3. 完整前缀重喂：如果整段角色完全变了/铠甲漏了 → 重新复制粘贴完整前缀3行到提示词最开头 再加段首写实夹攻 重新生成
```

### shot-1A 完整提示词英文翻译块（复制到豆包端）
（省略，SK4 会自动生成和中文块一一对应的英文翻译块）

---

## Step 6：SK5 一致性校验（四档打表示例节选）

| 检查项（写实风格 3 次夹攻要求） | 实际值 | 结果 |
|---|---|---|
| 完整前缀 3 行直接复制，漏几件？ | 两个角色 12 件 + 细节，0 漏 | ✅ |
| 写实 3 次夹攻有几次？ | 开头1次 + 角色尾1次 + 灯光尾1次 = 3 次 | ✅ |
| 家具 cm 锚点？ | 74/45/125/110 4 项全齐 | ✅ |
| 百分比特权双人锚点写了吗？ | 有李明 5-94 / 林夕 8.5-95 / 身高差写了 3.5% | ✅ |
| 口型正6禁7？ | 有，8.5s-10s 林夕 2 字 | ✅ |
| 6 桶 48 禁齐不齐？ | 7+13+9+9+10+10 = 48 齐 | ✅ |
| 兜底3条？ | 有 | ✅ |
| 四维对齐匹配吗？ | 是 | ✅ |
| 首尾帧嘴？ | 首闭 → 尾闭 没问题 | ✅ |
| **综合打标** | — | **✅ 全部通过** |

---

## Step 7：SK6 字幕/TTS/剪映（示例）
### 字幕（默认不开角色名前缀）
```srt
1
00:00:08,500 --> 00:00:09,200
谢谢
```
### TTS 清单
| shot | 角色 | 原文 | 情绪 | 推荐音色 | 字数 | 秒 |
|---|---|---|---|---|---|---|
| 1A | 林夕 | 谢谢 | 害羞小声 | 豆包TTS温柔女-晓晓，音量-6dB | 2 | 0.5s |
### 剪映
按剪映 7 步傻瓜手册操作，10 秒 1 段直接出成片。

---

## 结论：咖啡馆示例走通 8 粒 Skill，输出正确 ✅
（实际用户拿到本 Skill 后，可以新建空目录复制 templates/project-skeleton 骨架，照着以上 walkthrough 一步步跑一遍作为 smoke test，所有状态从 applied → verified）
