/* english · 16 个知识点（数据文件，格式见 docs/CONTENT-SPEC.md） */
window.CURRICULUM_PARTS = window.CURRICULUM_PARTS || {};
window.CURRICULUM_PARTS["english-primary"] = {
  "subject": "english",
  "points": [
    {
      "id": "ep-001",
      "grade": 3,
      "title": "字母与音标基础",
      "difficulty": 1,
      "minutes": 6,
      "tag": "字母音标",
      "prereq": [],
      "explain": "英语有 26 个字母，其中 A、E、I、O、U 是**元音字母**，其余 21 个是辅音字母。字母有「名称音」，也有它在单词里的音标读音，两者不一样：a 的名称音是 /eɪ/，在 cat 里读 /æ/，在 cake 里又读 /eɪ/。\n- 开音节（辅音+元音+辅音+e）里，元音常读名称音：cake、bike、home。\n- 闭音节里读短音：cat /æ/、pig /ɪ/、dog /ɒ/。\n- 容易混的字母：G 读 /dʒiː/，J 读 /dʒeɪ/，W 读 /ˈdʌbljuː/。\n提醒：读单词别拿字母名称音硬拼，写字母注意四线三格，A、B、D 的大写形状别写成小写。",
      "example": {
        "stem": "选出与 cake 中字母 a 发音相同的一项",
        "steps": [
          "cake 是「辅音+元音+辅音+e」的开音节，a 读名称音 /eɪ/。",
          "name 结构相同，a 也读 /eɪ/。",
          "cat、bag、map 都是闭音节，a 读短音 /æ/，所以选 name。"
        ],
        "answer": "name"
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "Which of the following letters is a vowel letter?（下列哪个是元音字母？）",
          "options": [
            "B",
            "E",
            "K",
            "M"
          ],
          "answer": 1,
          "why": "26 个字母里只有 A、E、I、O、U 五个是元音字母，E 在名单里；B、K、M 都是辅音字母。"
        },
        {
          "type": "choice",
          "stem": "字母 G 的名称音是：",
          "options": [
            "/dʒeɪ/",
            "/dʒiː/",
            "/eɪtʃ/",
            "/keɪ/"
          ],
          "answer": 1,
          "why": "G 读 /dʒiː/，J 才读 /dʒeɪ/；/eɪtʃ/ 是 H，/keɪ/ 是 K。G 和 J 是最容易听混的一对。"
        },
        {
          "type": "fill",
          "stem": "补全字母表：A B C D ___ F G（填一个字母）",
          "answer": [
            "E",
            "e"
          ],
          "why": "字母表按 A B C D E F G 的顺序排，D 后面紧跟 E；书写时大写 E 占上两格。"
        },
        {
          "type": "choice",
          "stem": "单词 name 中的字母 a 读短音 /æ/。",
          "answer": 1,
          "why": "name 是开音节，a 读名称音 /eɪ/；读 /æ/ 的是 cat、bag 这类闭音节单词，看见 e 结尾就要想到长音。",
          "options": [
            "正确（√）",
            "错误（×）"
          ]
        }
      ]
    },
    {
      "id": "ep-002",
      "grade": 3,
      "title": "问候与自我介绍",
      "difficulty": 1,
      "minutes": 7,
      "tag": "问候交际",
      "prereq": [],
      "explain": "早上见到老师要说 Good morning，下午说 Good afternoon，晚上见面说 Good evening；**Good night 是睡前道别**，不是打招呼。\n- 问名字：What's your name? 答 My name is Li Ming. 或 I'm Li Ming.\n- 问近况：How are you? 答 I'm fine, thank you. 也可以说 Very well, thanks.\n- 第一次见面说 Nice to meet you.，对方回 Nice to meet you, too.\n- 道别：Goodbye. / See you.\n提醒：How are you? 问的是身体近况，不能答 I'm Li Ming。",
      "example": {
        "stem": "早上在校门口遇到李老师，用英语问好并介绍自己。",
        "steps": [
          "早上见面用 Good morning，用 Good night 就成睡前道别了。",
          "介绍自己用 I'm ... 或 My name is ...。",
          "完整说：Good morning, Miss Li. I'm Wang Fang."
        ],
        "answer": "Good morning, Miss Li. I'm Wang Fang."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "—Good morning, class! —________",
          "options": [
            "Good morning, Miss Li!",
            "Good night, Miss Li!",
            "Thank you.",
            "I'm fine."
          ],
          "answer": 0,
          "why": "别人用 Good morning 问好，就用同一句回应；Good night 是睡前道别，不能用来回答早上的问候。"
        },
        {
          "type": "choice",
          "stem": "—How are you? —________",
          "options": [
            "I'm Li Ming.",
            "I'm fine, thank you.",
            "My name is Li Ming.",
            "Nice to meet you."
          ],
          "answer": 1,
          "why": "How are you? 问身体近况，答 I'm fine, thank you.；I'm Li Ming 回答的是 What's your name?。"
        },
        {
          "type": "fill",
          "stem": "—What's your name? —___ name is Amy.（填一个词）",
          "answer": [
            "My",
            "my"
          ],
          "why": "问句问「你的名字」，答句要用形容词性物主代词 My，后面跟名词 name，句首字母大写。"
        },
        {
          "type": "fill",
          "stem": "第一次见面说：Nice to meet you. 对方回答：Nice to meet you, ___ .",
          "answer": [
            "too"
          ],
          "why": "Nice to meet you, too. 里的 too 表示「也」，放句末，前面要有逗号，不能换成 also 的位置。"
        }
      ]
    },
    {
      "id": "ep-003",
      "grade": 3,
      "title": "颜色文具与教室用语",
      "difficulty": 2,
      "minutes": 8,
      "tag": "颜色文具",
      "prereq": [],
      "explain": "问颜色用 What colour is it?，回答 It's + 颜色。colour 是英式拼写，color 是美式，两种都对。\n- 常见颜色：red 红、yellow 黄、blue 蓝、green 绿、black 黑、white 白、orange 橙、brown 棕、pink 粉、purple 紫。\n- 文具：pen 钢笔、pencil 铅笔、ruler 尺子、eraser 橡皮、crayon 蜡笔、pencil box 铅笔盒。\n- 教室指令：Stand up. Sit down. Open your book. Close the door.\n提醒：orange 既是「橙色」也是「橙子」；问颜色时主语是单数，别写成 What colour are it。",
      "example": {
        "stem": "—What colour is your bag? —________（我的书包是蓝色的）",
        "steps": [
          "问句是 What colour is...?，说明问的是颜色。",
          "答句要用 It's + 颜色，不能重复说 bag。",
          "蓝色是 blue，所以答：It's blue."
        ],
        "answer": "It's blue."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "—What colour is the ruler? —________",
          "options": [
            "It's a ruler.",
            "It's yellow.",
            "Yes, it is.",
            "They're yellow."
          ],
          "answer": 1,
          "why": "What colour 问颜色，要答 It's + 颜色；It's a ruler 答的是 What's this，They're 是复数，一把尺子不适用。"
        },
        {
          "type": "choice",
          "stem": "老师让你打开书，他说：________",
          "options": [
            "Close your book.",
            "Open your book.",
            "Sit down, please.",
            "Clean the blackboard."
          ],
          "answer": 1,
          "why": "open 是打开，close 是关上；Open your book 才是让打开书，另外两句是坐下和擦黑板。"
        },
        {
          "type": "fill",
          "stem": "红色和黄色调在一起得到的颜色是 ___（用英语写颜色）。",
          "answer": [
            "orange",
            "Orange"
          ],
          "why": "红加黄调出橙色，英语是 orange；它还可表示「橙子」，这里问的是颜色，写 orange 即可。"
        },
        {
          "type": "fill",
          "stem": "—What's this? —It's an ___ .（橡皮，填一个单词）",
          "answer": [
            "eraser",
            "Eraser"
          ],
          "why": "eraser 以元音音素开头，前面要用 an 而不是 a，题干里的 an 就是提示，别填成 rubber 之外的拼法。"
        }
      ]
    },
    {
      "id": "ep-004",
      "grade": 3,
      "title": "家庭成员与朋友",
      "difficulty": 2,
      "minutes": 8,
      "tag": "家庭朋友",
      "prereq": [],
      "explain": "介绍家人用 This is my father.，指着照片说 He's my father. / She's my mother.\n- 男用 he，女用 she，物用 it。\n- 常见称呼：father/dad 爸爸、mother/mum 妈妈、grandfather/grandpa 爷爷外公、grandmother/grandma 奶奶外婆、brother 兄弟、sister 姐妹、uncle 叔叔、aunt 阿姨、cousin 堂表兄弟姐妹、parents 父母。\n- 问「她是谁」用 Who's she?，答 She's my aunt.\n提醒：cousin 不分男女堂表；parents 是复数，要说 They are my parents。",
      "example": {
        "stem": "指着照片里的女人问：Who's she?（她是我妈妈）",
        "steps": [
          "Who's she? 问的是女性身份，答句也要用 She's ...。",
          "妈妈是 mother，口语里常说 mum。",
          "答：She's my mother. / She's my mum."
        ],
        "answer": "She's my mother."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "This is my father. ___ is a doctor.",
          "options": [
            "She",
            "He",
            "It",
            "They"
          ],
          "answer": 1,
          "why": "father 是男性单数，代词用 he；she 指女性，it 指物，they 是复数，都与 father 不搭。"
        },
        {
          "type": "choice",
          "stem": "—Who's the girl? —________",
          "options": [
            "She's my sister.",
            "He's my brother.",
            "It's a girl.",
            "They're my sisters."
          ],
          "answer": 0,
          "why": "the girl 是女性单数，要用 She's ...；He's 指男性，They're 是复数，都不符合。"
        },
        {
          "type": "fill",
          "stem": "My father and mother are my ___ .（父母，填一个复数名词）",
          "answer": [
            "parents",
            "Parents"
          ],
          "why": "父母两人是复数，英语用 parents，前面的 be 动词也要用 are；parent 只指其中一位。"
        },
        {
          "type": "fill",
          "stem": "My uncle's son is my ___ .（堂兄弟或表兄弟，填一个词）",
          "answer": [
            "cousin",
            "Cousin"
          ],
          "why": "英语里堂、表兄弟姐妹都叫 cousin，不分男女也不分父系母系，一个词就够，没有 brother 那种细分。"
        }
      ]
    },
    {
      "id": "ep-005",
      "grade": 4,
      "title": "数字、时间与日期",
      "difficulty": 2,
      "minutes": 9,
      "tag": "数字时间",
      "prereq": [
        "ep-003"
      ],
      "explain": "十几和几十最容易混：thirteen 是 13，thirty 是 30；14 fourteen 对 40 forty（去掉 u），15 fifteen 对 50 fifty。\n- 问时间：What time is it? 答 It's seven o'clock.（整点）；7:30 说 It's seven thirty. 或 half past seven。\n- 问日期：What's the date today? 答 It's May 1st，读作 May the first。\n- 序数词缩写：1st、2nd、3rd，其余多数加 th，如 21st 是 twenty-first。\n提醒：o'clock 只能用于整点，7:15 不能说 seven fifteen o'clock。",
      "example": {
        "stem": "—What time is it? —________（7:30）",
        "steps": [
          "7:30 不是整点，不能用 o'clock。",
          "直接读数字：It's seven thirty.",
          "也可以说 It's half past seven.，half 是半小时、past 是过了。"
        ],
        "answer": "It's seven thirty."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "—What time is it? —It's ________.（8:00）",
          "options": [
            "eight o'clock",
            "eight thirty",
            "half past eight",
            "eight hour"
          ],
          "answer": 0,
          "why": "整点用「数字 + o'clock」，8:00 是 eight o'clock；eight thirty 和 half past eight 都是 8:30。"
        },
        {
          "type": "choice",
          "stem": "13 和 30 的英语分别是：",
          "options": [
            "thirty, thirteen",
            "thirteen, thirty",
            "thirteen, threety",
            "threeteen, thirty"
          ],
          "answer": 1,
          "why": "13 是 thirteen，重音在后；30 是 thirty，重音在前。threety、threeteen 都是拼错的假词。"
        },
        {
          "type": "fill",
          "stem": "It's May 1st today.（对划线部分提问）___ is the date today?",
          "answer": [
            "What",
            "what"
          ],
          "why": "问日期用 What's the date today?，疑问词是 What，注意句首大写；when 问的是时间点，不用于日期。"
        },
        {
          "type": "fill",
          "stem": "写日期：6 月 2 日 → June ___（填序数词缩写）",
          "answer": [
            "2nd"
          ],
          "why": "2 的序数词是 second，缩写 2nd；1 写 1st，3 写 3rd，其余多数加 th，日期要用序数词不用基数词。"
        },
        {
          "type": "fill",
          "stem": "40 的英语是 ___ 。",
          "answer": [
            "forty",
            "Forty"
          ],
          "why": "40 是 forty，不是 fourty；fourteen 才是 14。拼写少一个 u 是这组数字最常见的错。"
        }
      ]
    },
    {
      "id": "ep-006",
      "grade": 4,
      "title": "食物饮料与点餐",
      "difficulty": 2,
      "minutes": 9,
      "tag": "食物点餐",
      "prereq": [],
      "explain": "问想吃什么：What would you like? 答 I'd like some noodles.，比 want 客气。\n- 问喜好：Do you like fish? 肯定答 Yes, I do.，否定答 No, I don't.，助动词是 do，不是 am。\n- 不可数：milk、juice、water、bread、rice 不能加 s，也不能加 a；egg、apple、hamburger 可数，能加 s。\n- some 多用于肯定句，疑问和否定常用 any；但 Would you like some tea? 表示客气邀请，仍用 some。\n提醒：I'd like 是 I would like 的缩写，不能说 I would like to some noodles。",
      "example": {
        "stem": "—What would you like to eat? —________（我想要些面条）",
        "steps": [
          "回答想吃什么，最自然的是 I'd like ...。",
          "面条英语是 noodles，通常用复数形式。",
          "答：I'd like some noodles."
        ],
        "answer": "I'd like some noodles."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "—Would you like some juice? —________",
          "options": [
            "Yes, I do.",
            "Yes, please.",
            "Yes, I am.",
            "No, I don't."
          ],
          "answer": 1,
          "why": "Would you like...? 是客气邀请，答 Yes, please. 或 No, thanks.；Yes, I do 回答的是 Do you...?。"
        },
        {
          "type": "choice",
          "stem": "Which one is an uncountable noun?（哪个是不可数名词？）",
          "options": [
            "egg",
            "apple",
            "milk",
            "hamburger"
          ],
          "answer": 2,
          "why": "milk 是液体，不可数，不能说 a milk 或 milks；egg、apple、hamburger 都可数，能加 s。"
        },
        {
          "type": "fill",
          "stem": "—Do you like bananas? —Yes, I ___ .",
          "answer": [
            "do",
            "Do"
          ],
          "why": "Do you...? 是助动词 do 开头的问句，肯定简答是 Yes, I do.，不能用 Yes, I am. 或 Yes, I like."
        },
        {
          "type": "fill",
          "stem": "I'm hungry. I'd like some ___ .（米饭，填一个词）",
          "answer": [
            "rice",
            "Rice"
          ],
          "why": "rice 是不可数名词，不加 s 也不加 a，用 some rice 表示「一些米饭」；rices 是常见错写。"
        }
      ]
    },
    {
      "id": "ep-007",
      "grade": 4,
      "title": "be 动词与一般现在时",
      "difficulty": 3,
      "minutes": 10,
      "tag": "be动词",
      "prereq": [
        "ep-002"
      ],
      "explain": "be 动词有三个：am、is、are。口诀是「我用 am，你用 are，is 跟着他她它」，复数名词全用 are。\n- 缩写：I'm = I am，you're = you are，he's = he is，isn't = is not，aren't = are not。\n- 一般现在时表示经常做的事或一直如此的状态：I am a pupil. She is tall.\n- 变否定：be 后加 not，如 He isn't at school.\n- 变疑问：be 提到句首，Are you ready? 答 Yes, I am. / No, I'm not.\n提醒：be 动词和实义动词不能同时出现，不能说 I am like apples，要说 I like apples。",
      "example": {
        "stem": "用 be 动词的适当形式填空：My brother ___ ten years old.",
        "steps": [
          "先找主语：My brother 是第三人称单数。",
          "第三人称单数配 is，不能配 are。",
          "句意是「我哥哥十岁了」，答案 is。"
        ],
        "answer": "is"
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "There ___ two books and a pen on the desk.",
          "options": [
            "is",
            "are",
            "am",
            "be"
          ],
          "answer": 1,
          "why": "There be 句型就近原则：离 be 最近的是 two books（复数），所以用 are，往后看 a pen 就选错了。"
        },
        {
          "type": "choice",
          "stem": "—Are you a student? —________",
          "options": [
            "Yes, I am.",
            "Yes, I do.",
            "Yes, I'm.",
            "Yes, you are."
          ],
          "answer": 0,
          "why": "Are you...? 的肯定简答是 Yes, I am.；句末不能用缩写 Yes, I'm，Yes, I do 回答的是 Do you...?。"
        },
        {
          "type": "fill",
          "stem": "She ___ (be) my English teacher. 用正确形式填空。",
          "answer": [
            "is"
          ],
          "why": "主语 She 是第三人称单数，be 动词用 is；看到「她」就写 are 是主语和 be 没配对。"
        },
        {
          "type": "fill",
          "stem": "He is at home.（变否定句）He ___ at home.",
          "answer": [
            "isn't",
            "is not"
          ],
          "why": "be 动词的否定是在 be 后加 not，is not 缩写成 isn't，撇号在 n 前面，别写成 is'nt。"
        },
        {
          "type": "fill",
          "stem": "We ___ (be) in Grade Four. 用正确形式填空。",
          "answer": [
            "are"
          ],
          "why": "主语 We 是复数第一人称，be 动词用 are；I 才配 am，这一点和中文「我们是」的顺序无关。"
        }
      ]
    },
    {
      "id": "ep-008",
      "grade": 4,
      "title": "名词单复数",
      "difficulty": 3,
      "minutes": 10,
      "tag": "名词复数",
      "prereq": [
        "ep-003"
      ],
      "explain": "名词变复数有四条基本规则，再加一批不讲道理的不规则词，背下来最省事。\n- 一般加 s：book→books，pen→pens。\n- 以 s、x、ch、sh 结尾加 es：bus→buses，box→boxes，watch→watches。\n- 辅音字母 + y 结尾，变 y 为 i 再加 es：baby→babies；元音 + y 直接加 s：boy→boys。\n- 不规则：man→men，woman→women，child→children，foot→feet，tooth→teeth；sheep、fish 单复数同形。\n提醒：this 的复数是 these，it 的复数是 they，句子里的 be 动词也要跟着变。",
      "example": {
        "stem": "把句子改成复数：This is a child. → ________",
        "steps": [
          "child 是不规则名词，复数是 children，不是 childs。",
          "this 要变成 these，is 要变成 are。",
          "改后：These are children."
        ],
        "answer": "These are children."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "There are three ___ in the room.",
          "options": [
            "childs",
            "childrens",
            "children",
            "child"
          ],
          "answer": 2,
          "why": "child 的复数是 children，本身已是复数，不能再加 s；childs、childrens 都是最常见的错写。"
        },
        {
          "type": "choice",
          "stem": "I can see two ___ in the picture.",
          "options": [
            "boxs",
            "boxes",
            "box",
            "boxies"
          ],
          "answer": 1,
          "why": "以 x 结尾的名词加 es，box→boxes；boxs 少了个 e，boxies 是把 y 的规则乱套上来了。"
        },
        {
          "type": "fill",
          "stem": "写出复数形式：foot → ___",
          "answer": [
            "feet"
          ],
          "why": "foot 属不规则变化，复数是 feet，和 tooth→teeth 一样把 oo 变 ee，不能写 foots。"
        },
        {
          "type": "fill",
          "stem": "用正确形式填空：There are many ___ (baby) in the room.",
          "answer": [
            "babies"
          ],
          "why": "baby 是辅音字母 b 加 y 结尾，要变 y 为 i 再加 es，得到 babies；只有元音加 y（如 boys）才直接加 s。"
        },
        {
          "type": "fill",
          "stem": "写出复数形式：woman → ___",
          "answer": [
            "women"
          ],
          "why": "woman 的复数是 women，读音也从 /ˈwʊmən/ 变成 /ˈwɪmɪn/，写成 womans 就是把不规则词当规则词了。"
        }
      ]
    },
    {
      "id": "ep-009",
      "grade": 5,
      "title": "实义动词三单",
      "difficulty": 3,
      "minutes": 11,
      "tag": "动词三单",
      "prereq": [
        "ep-007"
      ],
      "explain": "一般现在时里，主语是 he、she、it，或一个人名、一个单数名词时，动词要加 s 或 es，这叫「第三人称单数」。\n- 一般加 s：like→likes，play→plays。\n- 以 s、x、ch、sh、o 结尾加 es：watch→watches，go→goes，do→does。\n- 辅音字母 + y 结尾，变 y 为 i 加 es：study→studies，fly→flies。\n- 特殊：have→has，be→is。\n- 否定和疑问用 doesn't / does，后面动词回原形：She doesn't like fish. Does he go by bus?\n提醒：does 已经表示三单，后面再加 s 就重复，不能说 Does he goes to school。",
      "example": {
        "stem": "用所给动词的适当形式填空：My mother ___ (watch) TV every evening.",
        "steps": [
          "every evening 说明是经常发生，用一般现在时。",
          "主语 My mother 是第三人称单数。",
          "watch 以 ch 结尾，要加 es → watches。"
        ],
        "answer": "watches"
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "Tom ___ his homework after school.",
          "options": [
            "do",
            "does",
            "dos",
            "doing"
          ],
          "answer": 1,
          "why": "Tom 是第三人称单数，do 要变成 does；doing 不能单独作谓语，dos 是拼错的假词。"
        },
        {
          "type": "choice",
          "stem": "—Does your sister like apples? —No, she ___.",
          "options": [
            "doesn't",
            "don't",
            "isn't",
            "not"
          ],
          "answer": 0,
          "why": "Does she...? 的否定简答用 No, she doesn't.；don't 配 I/you/we/they，isn't 不能这样单独作答。"
        },
        {
          "type": "fill",
          "stem": "He ___ (study) English every day. 用正确形式填空。",
          "answer": [
            "studies"
          ],
          "why": "study 是辅音字母 d 加 y 结尾，变 y 为 i 再加 es，得到 studies；studys 是最典型的错写。"
        },
        {
          "type": "fill",
          "stem": "I have a pen. → He ___ a pen. 用 have 的正确形式填空。",
          "answer": [
            "has"
          ],
          "why": "have 的三单形式是 has，属于不规则变化；haves 和 have 都不对，这是三单里唯一的「换词」情况。"
        },
        {
          "type": "choice",
          "stem": "My father ___ to work by bus every morning.",
          "options": [
            "go",
            "goes",
            "gos",
            "going"
          ],
          "answer": 1,
          "why": "主语 My father 是三单，go 以 o 结尾要加 es 变成 goes；gos 少了个 e，是常见的错拼。"
        }
      ]
    },
    {
      "id": "ep-010",
      "grade": 5,
      "title": "现在进行时",
      "difficulty": 3,
      "minutes": 11,
      "tag": "现在进行时",
      "prereq": [
        "ep-007"
      ],
      "explain": "现在进行时表示「此时此刻正在做」，结构是 **be 动词 + 动词 ing**，两部分缺一不可。\n- 标志词：now、look、listen、at the moment。Look! The boys are playing football.\n- ing 变化：一般直接加，play→playing；以不发音 e 结尾去 e 加 ing，make→making；重读闭音节末尾只有一个辅音字母，双写再加 ing，run→running，swim→swimming。\n- 否定：be 后加 not，She isn't reading.\n- 疑问：be 提到句首，Are you listening?\n提醒：不能只有 ing 没有 be，也不能 be 后面用原形，I am go 是错的。",
      "example": {
        "stem": "Look! The cat ___ (run) after a mouse.",
        "steps": [
          "Look! 提示动作正在发生，要用现在进行时。",
          "主语 The cat 是单数，be 动词用 is。",
          "run 是重读闭音节，双写 n 再加 ing → is running。"
        ],
        "answer": "is running"
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "Listen! Someone ___ in the next room.",
          "options": [
            "sing",
            "sings",
            "is singing",
            "singing"
          ],
          "answer": 2,
          "why": "Listen! 说明动作正在进行，要用 be + doing；singing 前面没有 be，sings 是一般现在时。"
        },
        {
          "type": "choice",
          "stem": "The children ___ in the park now.",
          "options": [
            "is playing",
            "are playing",
            "are play",
            "play"
          ],
          "answer": 1,
          "why": "主语 children 是复数，be 用 are，后面接 playing；are play 少了 ing，is 与复数主语不搭。"
        },
        {
          "type": "fill",
          "stem": "用所给词的适当形式填空：My mother is ___ (make) a cake now.",
          "answer": [
            "making"
          ],
          "why": "make 以不发音的 e 结尾，要去 e 再加 ing，得到 making；makeing 是最常见的错写。"
        },
        {
          "type": "fill",
          "stem": "They are swimming.（变一般疑问句）___ they swimming?",
          "answer": [
            "Are",
            "are"
          ],
          "why": "现在进行时的疑问句把 be 提到句首，主语 they 配 are，句首字母要大写。"
        },
        {
          "type": "fill",
          "stem": "用所给词的适当形式填空：Look! The boys ___ (swim) in the river.",
          "answer": [
            "are swimming"
          ],
          "why": "swim 是重读闭音节，双写 m 再加 ing；主语 boys 是复数，be 用 are，所以要写 are swimming。"
        }
      ]
    },
    {
      "id": "ep-011",
      "grade": 5,
      "title": "情态动词 can",
      "difficulty": 3,
      "minutes": 10,
      "tag": "情态动词",
      "prereq": [
        "ep-009"
      ],
      "explain": "can 表示「会、能」，也可以客气地请别人做事，如 Can you help me?\n- 结构：主语 + can + **动词原形**，can 后面永远不加 s、ing、ed。She can swim. 不能说 She cans swim。\n- 否定：can not 缩写成 can't，正式写作 cannot（一个词）。I can't fly.\n- 疑问：can 提到句首，Can he play the piano? 答 Yes, he can. / No, he can't.\n- can 不随人称变：I can、he can、they can 全都一样。\n提醒：can't 后面照样用原形，can't to swim、can't swimming 都是错的。",
      "example": {
        "stem": "—Can you swim? —________（否定回答）",
        "steps": [
          "Can you...? 的否定简答是 No, I can't.",
          "can't 是 cannot 的缩写，不能写成 cann't。",
          "答：No, I can't."
        ],
        "answer": "No, I can't."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "My sister can ___ the piano very well.",
          "options": [
            "plays",
            "play",
            "playing",
            "to play"
          ],
          "answer": 1,
          "why": "can 后面必须跟动词原形 play；plays 是三单形式，playing 要配 be，to play 不能再跟在 can 后。"
        },
        {
          "type": "choice",
          "stem": "—Can he ride a bike? —Yes, he ___.",
          "options": [
            "can",
            "cans",
            "does",
            "is"
          ],
          "answer": 0,
          "why": "Can he...? 的肯定简答用 Yes, he can.；can 没有人称变化，不加 s，也不用 does 代替。"
        },
        {
          "type": "fill",
          "stem": "I can't ___ (go) to school today. 用正确形式填空。",
          "answer": [
            "go"
          ],
          "why": "can't 是情态动词的否定，后面照样跟动词原形 go，不能写成 to go 或 going。"
        },
        {
          "type": "fill",
          "stem": "He can swim.（变否定句）He ___ swim.",
          "answer": [
            "can't",
            "cannot",
            "can not"
          ],
          "why": "can 的否定是 cannot，缩写成 can't；不能说 doesn't swim，can 的否定不加助动词。"
        }
      ]
    },
    {
      "id": "ep-012",
      "grade": 5,
      "title": "方位介词",
      "difficulty": 4,
      "minutes": 11,
      "tag": "方位介词",
      "prereq": [
        "ep-003"
      ],
      "explain": "方位介词是描述「东西在哪儿」的词，常用 Where is/are...? 提问。\n- in 在……里面：in the box；on 在……上面（贴着表面）：on the desk；under 在……下面：under the chair。\n- behind 在后面，in front of 在前面，正好是一对反义词组。\n- next to / beside 在旁边，near 在附近，between 在两者之间，常配 and：between the bank and the shop。\n- over 在正上方（不接触），above 只表示位置更高。\n提醒：on 强调贴表面、in 强调在内部；in front of 是外部前面，in the front of 才是内部前部。",
      "example": {
        "stem": "The ball is ___ the box.（球在盒子里面）",
        "steps": [
          "球被盒子包住，位置在内部。",
          "表示「在……里面」用 in。",
          "答案 in，注意前面不加 on。"
        ],
        "answer": "in"
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "The cat is ___ the table.（猫在桌子下面）",
          "options": [
            "on",
            "in",
            "under",
            "behind"
          ],
          "answer": 2,
          "why": "在桌子下面用 under；on 是在上面，in 是在里面，behind 是在后面，位置完全不同。"
        },
        {
          "type": "choice",
          "stem": "There is a bank ___ the shop and the school.",
          "options": [
            "between",
            "in",
            "under",
            "next"
          ],
          "answer": 0,
          "why": "两者之间用 between ... and ...；next 必须加 to 才表示「在旁边」，单独用是错的。"
        },
        {
          "type": "fill",
          "stem": "The picture is ___ the wall.（画在墙上，填介词）",
          "answer": [
            "on"
          ],
          "why": "画挂在墙的表面，用 on the wall；in the wall 指嵌进墙体里，比如窗户，意思不一样。"
        },
        {
          "type": "fill",
          "stem": "The library is in front ___ the post office.（在邮局前面）",
          "answer": [
            "of"
          ],
          "why": "in front of 是固定短语，三个词缺一不可；in the front of 才指内部前部，别混用。"
        }
      ]
    },
    {
      "id": "ep-013",
      "grade": 6,
      "title": "人称代词与物主代词",
      "difficulty": 4,
      "minutes": 12,
      "tag": "代词",
      "prereq": [
        "ep-004"
      ],
      "explain": "代词分三类，做题时先看它在句子里干什么活。\n- 主格作主语：I、you、he、she、it、we、they。He is my friend.\n- 宾格作宾语，放在动词或介词后面：me、you、him、her、it、us、them。Please help me. / Look at them.\n- 形容词性物主代词后面必须跟名词：my book、her pen、their classroom。\n- 名词性物主代词后面不跟名词，等于「形容词性物主代词 + 名词」：This is mine. = This is my book.\n提醒：his 既是形容词性也是名词性；her 是形容词性，hers 才是名词性，别写 This book is her。",
      "example": {
        "stem": "This is not my pen. ___ is in my bag.（我的）",
        "steps": [
          "空格后面没有名词，说明要用名词性物主代词。",
          "「我的」名词性形式是 mine。",
          "句意：这不是我的钢笔，我的在书包里，答案 mine。"
        ],
        "answer": "mine"
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "Please give ___ the book.",
          "options": [
            "I",
            "me",
            "my",
            "mine"
          ],
          "answer": 1,
          "why": "give 后面要接宾格，me 才是宾格；I 是主格，my 后面必须跟名词，mine 不能作 give 的宾语。"
        },
        {
          "type": "choice",
          "stem": "___ classroom is on the second floor.（他们的）",
          "options": [
            "They",
            "Them",
            "Their",
            "Theirs"
          ],
          "answer": 2,
          "why": "空格后有名词 classroom，要用形容词性物主代词 Their；Theirs 后面不能跟名词。"
        },
        {
          "type": "fill",
          "stem": "This is her ruler. = This ruler is ___ .（填名词性物主代词）",
          "answer": [
            "hers"
          ],
          "why": "her 的名词性物主代词是 hers，后面不再跟名词；写成 her 就丢了「她的东西」这层意思。"
        },
        {
          "type": "fill",
          "stem": "Look at the boy. ___ is my brother.（填主格代词）",
          "answer": [
            "He"
          ],
          "why": "the boy 是男性单数，作主语要用主格 He；Him 是宾格不能作主语，句首字母还要大写。"
        },
        {
          "type": "choice",
          "stem": "—Whose bag is this? —It's ___.",
          "options": [
            "she",
            "her",
            "hers",
            "she's"
          ],
          "answer": 2,
          "why": "Whose...? 要用名词性物主代词回答，hers 等于 her bag；her 后面必须有名词，she's 是 she is。"
        }
      ]
    },
    {
      "id": "ep-014",
      "grade": 6,
      "title": "特殊疑问句（what/where/how many/who）",
      "difficulty": 4,
      "minutes": 12,
      "tag": "疑问句",
      "prereq": [
        "ep-007"
      ],
      "explain": "特殊疑问句 = 疑问词 + 一般疑问句语序，回答时不能用 yes 或 no。\n- what 问什么：What's this? 答 It's a ruler.\n- where 问地点：Where is my book? 答 It's on the desk.\n- who 问人：Who is that man? 答 He's my uncle.\n- how many 问数量，后面接可数名词复数：How many apples are there? 答 There are five.\n- how old 问年龄，what time 问几点，what colour 问颜色。\n提醒：How many 后面的名词一定用复数，动词也跟着用 are；答句不能只写 Yes。",
      "example": {
        "stem": "对划线部分提问：There are **twelve** boys in the room. → ___ boys are there in the room?",
        "steps": [
          "划线部分是数量 twelve，问数量要用 How many。",
          "How many 后面接可数名词复数 boys。",
          "答案：How many。"
        ],
        "answer": "How many"
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "—___ is your English teacher? —She is in the office.",
          "options": [
            "What",
            "Where",
            "Who",
            "How many"
          ],
          "answer": 1,
          "why": "答句 in the office 说的是地点，问地点要用 Where；Who 问人是谁，What 问是什么，都对不上。"
        },
        {
          "type": "choice",
          "stem": "—___ books are there on the desk? —There are six.",
          "options": [
            "How many",
            "How much",
            "How old",
            "What"
          ],
          "answer": 0,
          "why": "books 是可数名词复数，问数量用 How many；How much 问价钱或不可数数量，How old 问年龄。"
        },
        {
          "type": "fill",
          "stem": "对划线部分提问：My father is **forty**. → ___ ___ is your father?（每空一词）",
          "answer": [
            "How old"
          ],
          "why": "四十是年龄，问年龄用 How old，后面接 is your father；用 How many 就把年龄当成数量了。"
        },
        {
          "type": "fill",
          "stem": "—___ is that girl? —She's my cousin.（问那个人是谁）",
          "answer": [
            "Who",
            "who"
          ],
          "why": "问「那个人是谁」用 Who，答句是 She's...；空格后已有 is，所以只填 Who，不能填 Who's。"
        }
      ]
    },
    {
      "id": "ep-015",
      "grade": 6,
      "title": "日常交际用语",
      "difficulty": 4,
      "minutes": 12,
      "tag": "交际用语",
      "prereq": [
        "ep-002"
      ],
      "explain": "交际题考「什么场合说什么话」，答句要和问句配套。\n- 感谢：Thank you. 答 You're welcome. / That's OK.\n- 道歉：Sorry. 答 That's all right. / Never mind.\n- 请求许可：May I come in? 答 Yes, please. / Sure.\n- 递东西：Here you are. 答 Thank you.\n- 祝愿：Happy birthday! 答 Thank you.；Happy New Year! 答 The same to you.\n- 打电话自我介绍用 This is Tom speaking，不用 I am Tom.\n提醒：Excuse me 是「打扰一下」，问路前用；做错事才说 Sorry。",
      "example": {
        "stem": "—Thank you for your help. —________",
        "steps": [
          "别人道谢，要回答「不用谢」。",
          "英语的固定说法是 You're welcome.",
          "也可以说 That's OK. / Not at all."
        ],
        "answer": "You're welcome."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "—Happy birthday! —________",
          "options": [
            "Thank you.",
            "The same to you.",
            "You're welcome.",
            "Never mind."
          ],
          "answer": 0,
          "why": "别人祝你生日快乐，说 Thank you. 就行；The same to you 用于新年等双方共同的节日，生日不能反祝。"
        },
        {
          "type": "choice",
          "stem": "—Sorry, I'm late. —________",
          "options": [
            "That's all right.",
            "You're welcome.",
            "Here you are.",
            "The same to you."
          ],
          "answer": 0,
          "why": "别人道歉要回答「没关系」，用 That's all right.；You're welcome 是回答感谢的，场合不对。"
        },
        {
          "type": "fill",
          "stem": "—May I use your ruler? —Sure. ___ you are.（把尺子递过去）",
          "answer": [
            "Here"
          ],
          "why": "把东西递给别人说 Here you are.，意思是「给你」；句首 H 要大写，也不能换成 There。"
        },
        {
          "type": "fill",
          "stem": "—Thank you very much. —You're ___ .（不用谢）",
          "answer": [
            "welcome"
          ],
          "why": "You're welcome. 是回答感谢的固定说法，welcome 别漏掉字母 l，也不能改成 welcomed。"
        },
        {
          "type": "fill",
          "stem": "打电话自我介绍：Hello, ___ is Tom speaking.（不用 I am）",
          "answer": [
            "this",
            "This"
          ],
          "why": "英语电话里自我介绍用 This is ... speaking，这是电话用语的特殊习惯，用 I am Tom 就不地道了。"
        }
      ]
    },
    {
      "id": "ep-016",
      "grade": 6,
      "title": "短文阅读（图文匹配）",
      "difficulty": 5,
      "minutes": 14,
      "tag": "短文阅读",
      "prereq": [
        "ep-006",
        "ep-014"
      ],
      "explain": "图文匹配题不用逐字翻译，按三步走：先看图和标题猜内容，再读句子圈关键词（人名、地点、数字、颜色），最后回图里找对应信息。\n- 注意同义替换：图上是 a boy swimming，句子里可能写成 He likes water.\n- 数字、时间、地点最容易设陷阱，读到 three 就数一数图里是不是三个。\n- 否定词 not、no、never 常常决定对错，千万别漏看。\n- 排错法：一个选项只要有一处和图不符，就整句排除。\n提醒：答案必须能在图或短文里找到依据，不能靠生活常识猜。",
      "example": {
        "stem": "短文：Hello! I'm Lily. I'm ten. I have a cat. It's white and it likes fish.\n图：Lily 抱着一只白猫。\n问题：Which sentence is right?",
        "steps": [
          "先在短文里圈关键词：Lily、ten、cat、white、fish。",
          "逐一比对：说 dog 的、说 black 的都与原文不符。",
          "保留 Lily has a white cat. 这一项。"
        ],
        "answer": "Lily has a white cat."
      },
      "quiz": [
        {
          "type": "choice",
          "stem": "短文：This is my classroom. There are forty desks and two blackboards. The walls are white.\n问题：How many blackboards are there?",
          "options": [
            "Forty",
            "Two",
            "Three",
            "One"
          ],
          "answer": 1,
          "why": "原文说 two blackboards，forty 是课桌的数量；题目问的是黑板，数字要看清问的是哪样东西。"
        },
        {
          "type": "choice",
          "stem": "短文：Mike gets up at six thirty. He goes to school at seven. He has lunch at twelve.\n问题：When does Mike go to school?",
          "options": [
            "At six thirty.",
            "At seven.",
            "At twelve.",
            "At six."
          ],
          "answer": 1,
          "why": "原文 He goes to school at seven；六点半是起床，十二点是午饭，三个时间都出现过，要对应到正确动作。"
        },
        {
          "type": "fill",
          "stem": "短文：Amy has a little brother. He is only four. He likes apples very much.\n问题：What does Amy's brother like? 答：He likes ___ .",
          "answer": [
            "apples"
          ],
          "why": "原文说 He likes apples very much；four 是年龄，不是他喜欢的东西，填空要抓 like 后面的名词。"
        },
        {
          "type": "fill",
          "stem": "短文：It is Sunday today. The weather is sunny. Tom and his father are in the park. They are flying a kite.\n问题：What day is it today? 答：It is ___ .",
          "answer": [
            "Sunday"
          ],
          "why": "第一句 It is Sunday today 直接给答案；sunny 说的是天气，和 Sunday 长得很像，是常见的张冠李戴。"
        },
        {
          "type": "choice",
          "stem": "短文：My name is Ben. I'm from Guangxi. My favourite food is rice noodles. I can swim, but I can't play football.\n问题：What can't Ben do?",
          "options": [
            "Swim.",
            "Play football.",
            "Eat rice noodles.",
            "Speak English."
          ],
          "answer": 1,
          "why": "but 后面的 can't 才是「不会」的事：play football；swim 在 can 后面是「会」，两句别弄反。"
        }
      ]
    }
  ]
};
