window.CURRICULUM_PARTS = window.CURRICULUM_PARTS || {};
window.CURRICULUM_PARTS["english-junior"] = {
  subject: "english",
  points: [
    {
      id: "ej-001",
      grade: 7,
      title: "音标与拼读规则",
      difficulty: 1,
      minutes: 6,
      tag: "语音",
      prereq: [],
      explain: "英语单词的读音不是背出来的，而是「拼」出来的。看到 a、e、i、o、u 这五个元音字母，先判断它是开音节还是闭音节：\n- 开音节（元音字母后只有一个辅音字母，再加不发音的 e，如 make、bike）读字母本音 /eɪ/、/aɪ/。\n- 闭音节（元音字母被辅音「关」起来，如 map、sit）读短音 /æ/、/ɪ/。\n- 常见字母组合要整体记：ee、ea 多读 /iː/，oo 读 /uː/ 或 /ʊ/，sh 读 /ʃ/，ch 读 /tʃ/，th 读 /θ/ 或 /ð/。\n中考常考「选出划线部分读音不同的一项」，错因几乎都是把开音节读成了闭音节，所以先判断音节类型，再选答案。",
      example: {
        stem: "判断 home 和 hot 中字母 o 的读音是否相同。",
        steps: [
          "home 是「元音字母 + 辅音字母 + 不发音的 e」的开音节，o 读本音 /əʊ/。",
          "hot 中 o 被辅音关住，是闭音节，读短音 /ɒ/。",
          "两个 o 的读音不同，所以答案是「不同」。"
        ],
        answer: "不同（home 读 /əʊ/，hot 读 /ɒ/）"
      },
      quiz: [
        { type: "choice", stem: "下列单词中字母 a 的读音与其他三个不同的是____", options: ["cake", "name", "map", "late"], answer: 2, why: "cake、name、late 都是开音节，a 读 /eɪ/；map 是闭音节，a 读 /æ/，所以选 map。" },
        { type: "choice", stem: "单词 thank 中字母组合 th 的读音是____", options: ["/ð/", "/θ/", "/t/", "/s/"], answer: 1, why: "thank、think、three 里的 th 都读清辅音 /θ/；this、that 里才读浊辅音 /ð/，注意区分。" },
        { type: "fill", stem: "根据音标写单词：/həʊm/ 写作 ____", answer: ["home"], why: "o 在开音节里读 /əʊ/，词尾的 e 不发音，只起「让前面的元音读本音」的作用。" },
        { type: "fill", stem: "根据音标写单词：/ˈreɪdiəʊ/ 写作 ____", answer: ["radio"], why: "ra 读 /reɪ/，di 读 /di/，o 在词尾读 /əʊ/，拼起来就是 radio，注意不是 radie。" }
      ]
    },
    {
      id: "ej-002",
      grade: 7,
      title: "名词：可数不可数与所有格",
      difficulty: 2,
      minutes: 8,
      tag: "名词",
      prereq: [],
      explain: "用名词前先问一句：这个东西能不能一个一个数？\n- 可数名词有单复数：book→books，box→boxes，knife→knives，child→children，注意 f 变 v、加 es 和不规则变化。\n- 不可数名词（water、bread、news、information、advice）没有复数，也不能直接加 a/an，要借量词：a piece of news、two bottles of water。\n- 所有格：单数名词加 's（Tom's bag）；以 s 结尾的复数只加 '（the students' books）；几个人「共有」一样东西，只在最后一个名字后加 's。\n中考常在短文填空里考「用所给词的适当形式填空」，看到 three、many、some 就要想到单复数；不可数名词前出现 a 或加了 s，一定是错的。",
      example: {
        stem: "用所给词的适当形式填空：There are three ____ (knife) on the table.",
        steps: [
          "数词 three 说明后面的名词要用复数。",
          "knife 以 fe 结尾，变复数要把 fe 改成 v 再加 es。",
          "所以填 knives，不能写成 knifes。"
        ],
        answer: "knives"
      },
      quiz: [
        { type: "choice", stem: "There is some ____ in the fridge.", options: ["breads", "bread", "a bread", "two breads"], answer: 1, why: "bread 是不可数名词，不能加 s，也不能直接加 a；some 后面用原形 bread 就对了。" },
        { type: "choice", stem: "This is ____ bedroom. They share it.", options: ["Lucy and Lily's", "Lucy's and Lily's", "Lucy and Lily", "Lucy's and Lily"], answer: 0, why: "bedroom 是单数、两人共用一间，表示「共有」只在最后一个名字后加 's，所以是 Lucy and Lily's。" },
        { type: "fill", stem: "There are two ____ (box) under the bed.", answer: ["boxes"], why: "以 x、s、ch、sh 结尾的名词变复数要加 es，two 已经说明是复数，所以填 boxes。" },
        { type: "fill", stem: "I need some ____ (information) about the trip.", answer: ["information"], why: "information 是不可数名词，没有复数形式，some 后面直接用原形，不能写 informations。" }
      ]
    },
    {
      id: "ej-003",
      grade: 7,
      title: "冠词 a/an/the 的选择",
      difficulty: 2,
      minutes: 6,
      tag: "冠词",
      prereq: ["ej-002"],
      explain: "冠词只有 a、an、the 和「不加」四种情况，关键看「读音」和「是否特指」。\n- a/an 看后面单词的第一个读音：辅音音素前用 a（a book、a useful book），元音音素前用 an（an apple、an hour、an honest boy）。hour 和 honest 的 h 不发音，所以要 an。\n- the 用于特指、上文提过的人或物、独一无二的事物（the sun）、最高级和序数词前。\n- 不加冠词：球类运动、三餐、by bus、go to school。\n中考常考单句填冠词和短文填空，最容易错的是 a useful book（不是 an）和 an hour（不是 a），判断时一定要读音，不要看字母。",
      example: {
        stem: "用合适的冠词填空：He is ____ honest boy.",
        steps: [
          "先看空后面紧跟的词是 honest。",
          "honest 的 h 不发音，第一个音是元音音素 /ɒ/。",
          "元音音素前用 an，所以填 an，不能因为看到字母 h 就填 a。"
        ],
        answer: "an"
      },
      quiz: [
        { type: "choice", stem: "My father is ____ honest man. He never tells lies.", options: ["a", "an", "the", "/"], answer: 1, why: "honest 的 h 不发音，开头是元音音素 /ɒ/，要用 an；看字母 h 就选 a 是典型错误。" },
        { type: "choice", stem: "We have ____ English class every day. ____ class begins at eight.", options: ["a; The", "an; The", "an; A", "the; The"], answer: 1, why: "English 以元音音素 /ɪ/ 开头用 an；第二空指上文提过的那节课，是特指，用 The。" },
        { type: "fill", stem: "It takes me about ____ hour to finish the work.（填冠词）", answer: ["an"], why: "hour 的 h 不发音，读音以元音 /aʊ/ 开头，所以用 an，写成 a hour 是常见错误。" },
        { type: "fill", stem: "____ sun rises in the east.（填冠词，注意句首大写）", answer: ["The"], why: "太阳是世界上独一无二的事物，前面要加定冠词 the，句首字母还要大写。" }
      ]
    },
    {
      id: "ej-004",
      grade: 7,
      title: "代词：人称、物主与反身",
      difficulty: 3,
      minutes: 7,
      tag: "代词",
      prereq: [],
      explain: "代词按「在句子里做什么成分」来选。\n- 主格 I、he、they 作主语；宾格 me、him、them 作动词或介词的宾语。\n- 形容词性物主代词 my、your 后面必须跟名词；名词性物主代词 mine、yours 单独使用，等于「我的东西」。\n- 反身代词 myself、himself 表示「自己」，主语和宾语指同一个人时用：teach oneself、enjoy oneself、help oneself。\n- somebody、anybody、everybody 作主语时，谓语动词用单数。\n中考常考 it 作形式主语（It is important for us to...）和 -self 形式，做题时先找到主语，主语是 I 就别写 himself。",
      example: {
        stem: "填空：This is not my book. ____ (I) is in the bag.",
        steps: [
          "空后面没有名词，说明这里要单独用，不能用形容词性物主代词 my。",
          "句意是「我的（书）在书包里」，要用名词性物主代词。",
          "I 对应的名词性物主代词是 Mine，句首大写。"
        ],
        answer: "Mine"
      },
      quiz: [
        { type: "choice", stem: "The pen is ____. I wrote my name on it.", options: ["my", "mine", "me", "myself"], answer: 1, why: "be 动词后面单独作表语，要用名词性物主代词 mine，my 后面必须跟名词，不能单独用。" },
        { type: "choice", stem: "Help ____ to some fish, children.", options: ["yourself", "yourselves", "you", "your"], answer: 1, why: "help oneself to 是「随便吃」，这里称呼的是 children 复数，所以反身代词也要用复数 yourselves。" },
        { type: "fill", stem: "Tom taught ____ (he) to swim last year.", answer: ["himself"], why: "teach oneself 表示「自学」，主语是 Tom，反身代词用 himself，不能写 hisself。" },
        { type: "fill", stem: "____ is important for us to learn English well.（填形式主语）", answer: ["It"], why: "真正的宾语是 to learn English well，太长，放在句末，句首用 it 作形式主语，不能用 That。" }
      ]
    },
    {
      id: "ej-005",
      grade: 7,
      title: "介词与连词",
      difficulty: 3,
      minutes: 7,
      tag: "介词连词",
      prereq: [],
      explain: "介词和连词是短文填空的「常客」，靠搭配和逻辑得分。\n- 时间介词：in + 年/月/季节/一天中的某段（in May、in the morning）；on + 具体某天或某天的上下午（on May 1st、on the morning of June 1st）；at + 时刻（at eight）。\n- for + 一段时间，since + 时间点，两者常和现在完成时连用。\n- 连词看逻辑：and 并列、but 转折、or 选择、so 结果、because 原因。although 和 but 不能同时出现，because 和 so 也不能同时出现。\n中考常考「on the morning of + 具体日期」这类细节，记住一句话：具体到某一天，就用 on。",
      example: {
        stem: "填空：I was born ____ May 1st, 2012.",
        steps: [
          "空后面是 May 1st，具体到了某月某日。",
          "表示具体某一天，时间介词要用 on。",
          "只说到月份才用 in（in May），所以这里填 on。"
        ],
        answer: "on"
      },
      quiz: [
        { type: "choice", stem: "We will have a party ____ the evening of June 1st.", options: ["in", "on", "at", "for"], answer: 1, why: "虽然 evening 前平时用 in，但这里限定到了具体某一天（June 1st），所以要用 on，这是中考高频陷阱。" },
        { type: "choice", stem: "____ it was raining, we still went to school on time.", options: ["Although", "But", "Because", "So"], answer: 0, why: "前后是让步关系（虽然下雨，还是按时上学），用 Although；although 不能和 but 同时出现在一个句子里。" },
        { type: "fill", stem: "I have lived here ____ 2015.（填介词）", answer: ["since"], why: "2015 是时间点，句子是现在完成时，表示「自从 2015 年」，用 since；for 后面要接一段时间。" },
        { type: "fill", stem: "He is very tired, ____ he keeps working.（填连词）", answer: ["but"], why: "「很累」和「还在工作」是转折关系，用 but；不能用 and，也不能在 but 前面再加 although。" }
      ]
    },
    {
      id: "ej-006",
      grade: 7,
      title: "一般过去时",
      difficulty: 3,
      minutes: 8,
      tag: "时态",
      prereq: [],
      explain: "一般过去时说「过去发生、现在已经结束」的事。\n- 时间标志词：yesterday、last week、two years ago、in 2019、just now。看到它们，动词就要用过去式。\n- 规则动词加 -ed，注意 study→studied、stop→stopped；不规则动词只能背：go→went、see→saw、buy→bought。\n- 否定句和疑问句用 did：didn't + 动词原形，Did you...? 后面也跟原形。\n中考常在短文填空和单项选择里考，最常见的错是把 didn't 后面的动词又写成过去式，记住一句话：did 一出现，动词回原形。",
      example: {
        stem: "用所给词的适当形式填空：He ____ (visit) his grandma last Sunday.",
        steps: [
          "句末的 last Sunday 是明确的过去时间标志。",
          "visit 是规则动词，直接加 ed。",
          "所以填 visited，注意不是 visits 也不是 has visited。"
        ],
        answer: "visited"
      },
      quiz: [
        { type: "choice", stem: "My brother ____ to Beijing two years ago.", options: ["goes", "went", "has gone", "will go"], answer: 1, why: "two years ago 是过去时间标志，谓语用一般过去时 went；现在完成时不能和 ago 连用。" },
        { type: "choice", stem: "— ____ you see the film last night? — Yes, I did.", options: ["Do", "Did", "Have", "Are"], answer: 1, why: "答语用了 did，问句也要用 Did；last night 是过去时间，see 保持原形，不能写 Did you saw。" },
        { type: "fill", stem: "We ____ (stop) the car and waited for the bus.", answer: ["stopped"], why: "and 前后时态要一致，waited 是过去式；stop 是重读闭音节，要双写 p 再加 ed。" },
        { type: "fill", stem: "She didn't ____ (come) to school yesterday because she was ill.", answer: ["come"], why: "didn't 后面必须跟动词原形，所以填 come，写成 came 是中考最常见的失分点。" }
      ]
    },
    {
      id: "ej-007",
      grade: 7,
      title: "一般将来时",
      difficulty: 4,
      minutes: 8,
      tag: "时态",
      prereq: ["ej-006"],
      explain: "一般将来时说「以后要做的事」，有两种写法。\n- will + 动词原形：多用于临时决定或单纯预测。\n- be going to + 动词原形：多用于已经计划好的事，或有明显迹象（Look at the clouds. It is going to rain.）。\n- 时间标志词：tomorrow、next week、in the future、in two days。\n- There be 句型的将来是 There will be 或 There is going to be，不能写成 There will have。\n中考最爱考「主将从现」：if、when、as soon as 引导的从句用一般现在时表示将来（I'll call you when I arrive）。看到 if 从句里有 tomorrow，也别写 will。",
      example: {
        stem: "填空：I'll call you as soon as I ____ (arrive) in Nanning.",
        steps: [
          "as soon as 引导的是时间状语从句。",
          "主句 I'll call 用了将来时，从句要用一般现在时表示将来，即「主将从现」。",
          "主语是 I，动词用原形，填 arrive，不能填 will arrive。"
        ],
        answer: "arrive"
      },
      quiz: [
        { type: "choice", stem: "There ____ a sports meeting in our school next Friday.", options: ["is going to have", "will have", "is going to be", "are going to be"], answer: 2, why: "There be 句型的将来是 there is going to be / there will be，不能用 have；a sports meeting 是单数，be 用 is。" },
        { type: "choice", stem: "If it ____ tomorrow, we won't go climbing.", options: ["rains", "will rain", "rained", "is raining"], answer: 0, why: "if 引导条件状语从句，主句是将来时，从句用一般现在时表将来；it 是第三人称单数，动词加 s。" },
        { type: "fill", stem: "They ____ (build) a new library next year.", answer: ["will build", "are going to build"], why: "next year 是将来时间标志，两种将来时都对：will + 原形，或 be going to + 原形，主语是 They 所以用 are。" },
        { type: "fill", stem: "I'm going to be a doctor when I ____ (grow) up.", answer: ["grow"], why: "when 引导时间状语从句，主句用 be going to 表将来，从句用一般现在时，主语 I 后用原形 grow。" }
      ]
    },
    {
      id: "ej-008",
      grade: 8,
      title: "形容词与副词的比较级、最高级",
      difficulty: 3,
      minutes: 8,
      tag: "比较级",
      prereq: [],
      explain: "比较级是「两者比」，最高级是「三者以上比」。\n- 单音节和部分双音节词加 -er/-est：tall→taller→tallest，easy→easier→easiest。多音节词前加 more/most：more interesting、most beautiful。\n- 不规则变化要背：good/well→better→best，many/much→more→most，little→less→least，bad→worse→worst。\n- 比较级常和 than 连用；最高级前加 the，后面用 in 或 of 表示范围。\n中考常考「one of the + 最高级 + 复数名词」和「the + 序数词 + 最高级」，还有用 much、a lot 修饰比较级（much taller），比较级前不能加 very。",
      example: {
        stem: "用所给词的适当形式填空：Li Ming is the ____ (tall) student in his class.",
        steps: [
          "范围是 in his class，是全班同学一起比，三者以上用最高级。",
          "tall 是单音节词，最高级加 est。",
          "最高级前要加 the，所以填 tallest。"
        ],
        answer: "tallest"
      },
      quiz: [
        { type: "choice", stem: "This book is much ____ than that one.", options: ["interesting", "more interesting", "most interesting", "the most interesting"], answer: 1, why: "有 than 说明是两者比较，用比较级；interesting 是多音节词，比较级加 more，much 用来修饰比较级。" },
        { type: "choice", stem: "Guilin is one of the ____ cities in China.", options: ["more beautiful", "most beautiful", "beautiful", "beautifully"], answer: 1, why: "one of the + 最高级 + 复数名词是固定结构，表示「最……之一」；beautifully 是副词，不能修饰名词 cities。" },
        { type: "fill", stem: "Tom runs ____ (fast) than Jim.", answer: ["faster"], why: "than 是比较级标志，fast 是单音节副词，直接加 er，所以填 faster。" },
        { type: "fill", stem: "Of all the students, Lucy sings ____ (well).", answer: ["best", "the best"], why: "Of all the students 表示三者以上比较，用最高级；well 的最高级是 best，副词最高级前的 the 可以省略。" }
      ]
    },
    {
      id: "ej-009",
      grade: 8,
      title: "过去进行时",
      difficulty: 3,
      minutes: 7,
      tag: "时态",
      prereq: ["ej-006"],
      explain: "过去进行时表示「过去某一时刻或某段时间正在进行」，结构是 was/were + doing。\n- 时间标志：at eight last night、at that time、this time yesterday。\n- 常和 when、while 连用：when 后面多接短暂动作（一般过去时），主句常用过去进行时；while 后面多接持续动作（过去进行时）。\n- 例：I was reading when the phone rang. 电话响是一瞬间，读书是正在进行。\n中考常考选择题里 when/while 的搭配，判断口诀是「长的用进行，短的用过去」，同时注意主语单复数决定用 was 还是 were。",
      example: {
        stem: "用所给词的适当形式填空：I ____ (read) a book when the phone rang.",
        steps: [
          "when 后面 the phone rang 是过去一瞬间发生的动作。",
          "主句表示「电话响的时候我正在读书」，用过去进行时。",
          "主语是 I，be 动词用 was，所以填 was reading。"
        ],
        answer: "was reading"
      },
      quiz: [
        { type: "choice", stem: "— What were you doing at nine last night? — I ____ my homework.", options: ["do", "did", "was doing", "am doing"], answer: 2, why: "问句用 were doing 问「过去某一时刻正在做什么」，答语也要用过去进行时，主语 I 用 was doing。" },
        { type: "choice", stem: "While my mother ____ dinner, I was cleaning the room.", options: ["cooks", "cooked", "was cooking", "is cooking"], answer: 2, why: "while 引导持续动作，主句已是过去进行时 was cleaning，从句也要用过去进行时，主语 my mother 用 was。" },
        { type: "fill", stem: "They ____ (play) basketball at that time yesterday.", answer: ["were playing"], why: "at that time yesterday 是过去进行时的标志，主语 They 是复数，be 动词用 were，所以填 were playing。" },
        { type: "fill", stem: "When the teacher came in, the students ____ (talk) loudly.", answer: ["were talking"], why: "老师进来是短暂动作，学生讲话是当时正在持续的动作，用过去进行时；students 是复数，用 were talking。" }
      ]
    },
    {
      id: "ej-010",
      grade: 8,
      title: "现在完成时 have/has + 过去分词",
      difficulty: 4,
      minutes: 9,
      tag: "时态",
      prereq: ["ej-006"],
      explain: "现在完成时的结构是 have/has + 过去分词，它把「过去」和「现在」连在一起。\n- 用法一：过去做的事对现在有影响，常配 already、yet、just、ever、never。\n- 用法二：从过去一直持续到现在，常配 for + 一段时间、since + 时间点。\n- have been to 是「去过（已经回来）」，have gone to 是「去了（还没回来）」。\n- 瞬间动词 buy、die、leave、come 不能和 for/since 连用，要改成 have had、have been in。\n中考常考这两个用法和 have been/gone 的辨析，看到 for three years 就别选 bought。",
      example: {
        stem: "用所给词的适当形式填空：I ____ (be) to Guilin twice.",
        steps: [
          "twice 表示「到现在为止去过两次」，是经历，用现在完成时。",
          "主语 I 用 have，be 的过去分词是 been。",
          "have been to 表示去过某地已经回来，所以填 have been。"
        ],
        answer: "have been"
      },
      quiz: [
        { type: "choice", stem: "— Where is your father? — He ____ to the library. He'll be back soon.", options: ["has been", "has gone", "went", "goes"], answer: 1, why: "人不在说话现场、还没回来，用 has gone to；has been to 是去过已经回来，与 He'll be back soon 矛盾。" },
        { type: "choice", stem: "I ____ this bike for three years.", options: ["have bought", "have had", "bought", "buy"], answer: 1, why: "for three years 表示持续一段时间，buy 是瞬间动词不能连用，要换成 have had 表示「拥有三年了」。" },
        { type: "fill", stem: "We ____ (learn) English since 2019.", answer: ["have learned", "have learnt"], why: "since 2019 是从过去持续到现在的标志，用现在完成时；主语 We 用 have，learn 的过去分词是 learned 或 learnt。" },
        { type: "fill", stem: "He has ____ finished his homework, so he can watch TV now.（填副词）", answer: ["already"], why: "肯定句里表示「已经」，用 already；yet 一般用于否定句和疑问句句末。" }
      ]
    },
    {
      id: "ej-011",
      grade: 8,
      title: "情态动词表推测",
      difficulty: 4,
      minutes: 7,
      tag: "情态动词",
      prereq: [],
      explain: "情态动词表推测，看的是把握有多大。\n- must be：一定、肯定，把握最大，只用于肯定句。\n- can't be：不可能，用于否定推测，注意不是 mustn't。\n- may be、might be、could be：可能，把握较小。\n- 例：The light is on, so he must be at home. 灯亮着是证据，所以用 must。\n判断顺序是：先找证据（用 must），再看是肯定还是否定（否定用 can't），最后看是不是「不确定」（用 may）。\n中考常考 must be 与 can't be 的对比，还考 must 开头的一般疑问句：肯定回答用 Yes, ... need，否定回答用 needn't 或 don't have to。",
      example: {
        stem: "填空：The light is on, so he ____ be at home.",
        steps: [
          "灯亮着是看得见的证据，说明「他在家」这个判断很有把握。",
          "把握最大的肯定推测用 must。",
          "must 后面接动词原形，所以填 must，不能填 must to。"
        ],
        answer: "must"
      },
      quiz: [
        { type: "choice", stem: "— Whose book is this? — It ____ be Lily's. Look, her name is on it.", options: ["must", "can't", "needn't", "may"], answer: 0, why: "书上有 Lily 的名字，是明确证据，把握最大用 must be；can't be 意思相反，needn't 表示「不必」。" },
        { type: "choice", stem: "He ____ be in the classroom. I saw him playing football on the playground just now.", options: ["must", "can't", "may", "should"], answer: 1, why: "刚看到他在操场踢球，说明他不可能在教室，否定推测用 can't be，不能用 mustn't be。" },
        { type: "fill", stem: "The dictionary ____ be Tom's. I'm not sure.（表示「可能」，填情态动词）", answer: ["may", "might", "could"], why: "句末 I'm not sure 说明把握不大，用 may、might 或 could；用 must 就和「不确定」自相矛盾了。" },
        { type: "fill", stem: "It ____ be true. I can't believe it.（表示「不可能」，填情态动词）", answer: ["can't", "cannot", "can not"], why: "「难以置信」说明是否定推测，要用 can't；mustn't 是「禁止」，不能用来表推测。" }
      ]
    },
    {
      id: "ej-012",
      grade: 8,
      title: "非谓语动词：不定式与动名词",
      difficulty: 4,
      minutes: 8,
      tag: "非谓语",
      prereq: ["ej-007"],
      explain: "一个句子里已经有一个谓语动词，再出现第二个动词就要变身：to do 或 doing。\n- 只接 to do 的：want、hope、decide、plan、would like、ask sb. to do。\n- 只接 doing 的：enjoy、finish、mind、practise、keep、be worth。\n- 介词后面一律用 doing：be good at swimming、thank you for helping。\n- make、let、have 后面接人时用动词原形，不加 to。\n中考常考固定搭配，还爱考 stop to do（停下来去做另一件事）和 stop doing（停止正在做的事），要先看清句意再选。",
      example: {
        stem: "用所给词的适当形式填空：He decided ____ (take) part in the singing competition.",
        steps: [
          "句中已有谓语 decided，后面再出现动词就要用非谓语。",
          "decide 后面只能接不定式 to do。",
          "take 的不定式是 to take，不能写成 taking。"
        ],
        answer: "to take"
      },
      quiz: [
        { type: "choice", stem: "My mother often asks me ____ my room on Sundays.", options: ["clean", "to clean", "cleaning", "cleaned"], answer: 1, why: "ask sb. to do sth. 是固定搭配「叫某人做某事」，所以用 to clean，不能直接接原形。" },
        { type: "choice", stem: "The boy stopped ____ and had a rest.", options: ["to run", "running", "run", "ran"], answer: 1, why: "句意是「停止跑步，然后休息一下」，停止正在做的事用 stop doing；stop to do 是停下来去做另一件事。" },
        { type: "fill", stem: "Would you mind ____ (open) the window?", answer: ["opening"], why: "mind 后面接动名词，动词 open 要去 e 加 ing，写成 opening。" },
        { type: "fill", stem: "Let's ____ (go) home now. It's late.", answer: ["go"], why: "let's 后面接动词原形，不加 to 也不加 ing，所以填 go。" },
        { type: "choice", stem: "I enjoy ____ to music after school.", options: ["listen", "to listen", "listening", "listened"], answer: 2, why: "enjoy 后面只能接动名词，enjoy doing sth. 表示「喜欢做某事」，不能接 to do。" }
      ]
    },
    {
      id: "ej-013",
      grade: 8,
      title: "状语从句与主将从现",
      difficulty: 4,
      minutes: 8,
      tag: "状语从句",
      prereq: ["ej-007"],
      explain: "状语从句就是给主句加时间、条件、原因或让步的从句，关键在连词。\n- 时间：when、while、before、after、as soon as、until。\n- 条件：if（如果）、unless（除非，相当于 if not）。\n- 原因：because、since；让步：although、though、even if。\n- 主将从现：主句用一般将来时，if、when、as soon as 引导的从句用一般现在时。\n- although 不能和 but 连用，because 不能和 so 连用。\n中考常考选连词和短文填空，先判断两句话之间是什么关系，再套主将从现。",
      example: {
        stem: "填空：____ it rains tomorrow, we will stay at home.",
        steps: [
          "前一句是后一句发生的条件，属于条件状语从句。",
          "条件状语从句的引导词用 if。",
          "主句 will stay 是将来时，从句用一般现在时 rains，所以填 If。"
        ],
        answer: "If"
      },
      quiz: [
        { type: "choice", stem: "You won't pass the exam ____ you work harder.", options: ["if", "unless", "because", "so"], answer: 1, why: "句意是「除非你更努力，否则过不了」，unless 等于 if not；填 if 意思就反了。" },
        { type: "choice", stem: "____ he is only ten years old, he can cook well.", options: ["Although", "But", "Because", "So"], answer: 0, why: "前后是让步关系（虽然只有十岁，却能做饭），用 Although；although 不能和 but 同时出现在一句里。" },
        { type: "fill", stem: "I'll tell him the news as soon as he ____ (come) back.", answer: ["comes"], why: "as soon as 引导时间状语从句，主句是将来时，从句用一般现在时；主语 he 是第三人称单数，动词加 s。" },
        { type: "fill", stem: "____ it was raining hard, we stayed at home.（表示原因，填连词，句首大写）", answer: ["Because", "Since"], why: "后一句是前一句的结果，前一句是原因，用 Because 或 Since；注意 because 和 so 不能同时用。" }
      ]
    },
    {
      id: "ej-014",
      grade: 8,
      title: "主谓一致",
      difficulty: 4,
      minutes: 7,
      tag: "主谓一致",
      prereq: ["ej-002"],
      explain: "主谓一致就看主语是单数还是复数，几个高频规则要记牢。\n- each、every、either、neither 作主语时，谓语用单数。\n- there be 句型用就近原则：There is a pen and two books. 看离 be 最近的那个名词。\n- and 连接两个主语用复数；with、together with、as well as 只是补充说明，谓语仍看前面的主语。\n- the number of + 复数名词作主语用单数；a number of + 复数名词作主语用复数。\n中考常考 there be 和 the number of，判断时先划出真正的主语，别被后面的名词带跑。",
      example: {
        stem: "用所给词的适当形式填空：The number of students in our school ____ (be) about 1,200.",
        steps: [
          "the number of 意思是「……的数量」，中心词是 number，作主语当单数。",
          "主语是单数，be 动词用 is。",
          "所以填 is，不能因为后面有 students 就用 are。"
        ],
        answer: "is"
      },
      quiz: [
        { type: "choice", stem: "There ____ a pen and two books on the desk.", options: ["is", "are", "have", "has"], answer: 0, why: "there be 句型用就近原则，离 be 最近的是 a pen（单数），所以用 is；不能用 have。" },
        { type: "choice", stem: "The number of the students in our class ____ fifty.", options: ["is", "are", "were", "have"], answer: 0, why: "the number of 表示「……的数量」，作主语是单数，谓语用 is；a number of 才表示「许多」，谓语用复数。" },
        { type: "fill", stem: "Tom with his parents ____ (go) to the park every Sunday.", answer: ["goes"], why: "with his parents 只是补充说明，真正的主语是 Tom，单数；every Sunday 说明用一般现在时，动词加 es。" },
        { type: "fill", stem: "Each of the students ____ (have) a dictionary.", answer: ["has"], why: "each of + 复数名词作主语，谓语用单数；have 的第三人称单数形式是 has。" }
      ]
    },
    {
      id: "ej-015",
      grade: 9,
      title: "被动语态",
      difficulty: 4,
      minutes: 8,
      tag: "被动语态",
      prereq: ["ej-006"],
      explain: "被动语态的结构是 be + 过去分词，难点在于 be 要跟着时态和主语变。\n- 一般现在时：am/is/are + done（English is spoken here.）\n- 一般过去时：was/were + done（The bridge was built in 2018.）\n- 一般将来时：will be + done；带情态动词：can/must + be + done。\n- 动作的执行者用 by 引出，不重要时可以省略。\n- 只有及物动词能变被动，happen、take place、appear 没有被动语态。\n中考常考主动句变被动句和单项选择，最常见的错是忘了变 be 的时态，写完一定要检查 be 的形式和主语的单复数。",
      example: {
        stem: "用所给词的适当形式填空：The bridge ____ (build) in 2018.",
        steps: [
          "桥是「被建造」的，主语是动作的承受者，要用被动语态。",
          "in 2018 是过去时间，be 动词用 was。",
          "build 的过去分词是 built，所以填 was built。"
        ],
        answer: "was built"
      },
      quiz: [
        { type: "choice", stem: "The classroom ____ every day by the students.", options: ["cleans", "is cleaned", "is cleaning", "cleaned"], answer: 1, why: "教室是被打扫的，every day 说明用一般现在时，被动结构是 is cleaned；cleans 是主动语态。" },
        { type: "choice", stem: "A new hospital ____ in our town next year.", options: ["is built", "was built", "will be built", "has built"], answer: 2, why: "next year 是将来时间，医院是被建的，一般将来时的被动是 will be + 过去分词。" },
        { type: "fill", stem: "English ____ (speak) in many countries.", answer: ["is spoken"], why: "英语是被说的，用一般现在时被动；主语 English 是单数，be 用 is，speak 的过去分词是 spoken。" },
        { type: "fill", stem: "The trees ____ (plant) by us last spring.", answer: ["were planted"], why: "last spring 是过去时间，树是被种的，主语 trees 是复数，所以用 were planted。" }
      ]
    },
    {
      id: "ej-016",
      grade: 9,
      title: "宾语从句：陈述语序与时态",
      difficulty: 4,
      minutes: 9,
      tag: "宾语从句",
      prereq: ["ej-013"],
      explain: "宾语从句就是一个句子充当宾语，三个要素缺一不可。\n- 引导词：陈述句用 that（口语中可省略）；一般疑问句用 if 或 whether；特殊疑问句用原来的疑问词。\n- 语序：一律用陈述语序，即引导词后面接「主语 + 谓语」，绝对不能倒装。\n- 时态：主句是过去时，从句用相应的过去时；但客观真理永远用一般现在时，如 The teacher said the earth goes around the sun.\n中考几乎年年考语序，看到 where is the bank 这种疑问语序就是错的，正确写法是 where the bank is。",
      example: {
        stem: "合并句子：Where is the bank? Could you tell me ____ ?",
        steps: [
          "宾语从句要用陈述语序，不能保留疑问句的倒装。",
          "疑问词 where 提到从句开头作引导词。",
          "剩下部分还原成 the bank is，所以答案是 where the bank is。"
        ],
        answer: "where the bank is"
      },
      quiz: [
        { type: "choice", stem: "Could you tell me ____?", options: ["where is the post office", "where the post office is", "where was the post office", "where the post office was"], answer: 1, why: "宾语从句必须用陈述语序，疑问词 where 后面接主语 the post office，再接 is，不能倒装。" },
        { type: "choice", stem: "The teacher told us that the earth ____ around the sun.", options: ["goes", "went", "will go", "is going"], answer: 0, why: "从句讲的是客观真理，即使主句是过去时 told，从句仍用一般现在时 goes。" },
        { type: "fill", stem: "I don't know ____ he will come or not.（填引导词）", answer: ["whether"], why: "句末有 or not，只能用 whether，不能用 if；这是 whether 和 if 的经典区分点。" },
        { type: "fill", stem: "He asked me ____ I had finished my homework.（填引导词）", answer: ["if", "whether"], why: "从句原来是一般疑问句 Have you finished...?，变宾语从句用 if 或 whether 引导，语序改成陈述语序。" },
        { type: "choice", stem: "Do you know ____?", options: ["what does he want", "what he wants", "what he want", "how he wants"], answer: 1, why: "宾语从句用陈述语序 what he wants；does 要去掉，动词恢复第三人称单数形式。" }
      ]
    },
    {
      id: "ej-017",
      grade: 9,
      title: "定语从句：who/which/that",
      difficulty: 5,
      minutes: 9,
      tag: "定语从句",
      prereq: ["ej-016"],
      explain: "定语从句就是一个句子当形容词用，修饰前面的名词，那个名词叫先行词。\n- 先行词是人用 who 或 that；是物用 which 或 that；whose 表示「谁的」，后面直接跟名词。\n- 关系代词在从句中作宾语时可以省略：the book (that) I bought。\n- 只能用 that 的情况：先行词被 the only、the very、序数词或最高级修饰，或者先行词既有人又有物。\n- 先行词是地点或时间、从句又不缺主语和宾语时，用 where 或 when。\n中考常考 who、which、that 的选择，方法很简单：把先行词带回从句里读一遍，看它缺主语还是缺宾语。",
      example: {
        stem: "填空：This is the boy ____ helped me yesterday.",
        steps: [
          "先行词 the boy 指人。",
          "从句 ____ helped me yesterday 缺主语，主语就是「那个男孩」。",
          "指人且在从句中作主语，用 who 或 that。"
        ],
        answer: "who（或 that）"
      },
      quiz: [
        { type: "choice", stem: "The man ____ is talking to my father is our English teacher.", options: ["which", "who", "whose", "whom"], answer: 1, why: "先行词 the man 指人，在从句中作主语，用 who；whom 只能作宾语，which 指物。" },
        { type: "choice", stem: "This is the most interesting book ____ I have ever read.", options: ["which", "who", "that", "what"], answer: 2, why: "先行词被最高级 most interesting 修饰时，关系代词只能用 that；what 不能引导定语从句。" },
        { type: "fill", stem: "I like the music ____ I can dance to.（填关系代词）", answer: ["that", "which"], why: "先行词 the music 指物，在从句中作介词 to 的宾语，用 that 或 which 都可以。" },
        { type: "fill", stem: "Do you know the girl ____ hair is very long?（填关系代词）", answer: ["whose"], why: "空后面直接跟名词 hair，表示「她的头发」，要用表示所属关系的 whose。" }
      ]
    },
    {
      id: "ej-018",
      grade: 9,
      title: "完形填空技巧",
      difficulty: 5,
      minutes: 10,
      tag: "完形填空",
      prereq: ["ej-017"],
      explain: "完形填空不是逐空猜词，而是先读懂、再填词。\n- 第一步：跳过所有空格快速通读全文，抓住文章主旨和整体时态。\n- 第二步：按四类线索选词——复现（上文出现过的词）、搭配（固定短语）、逻辑（but、so、however）、语法（时态、单复数）。\n- 第三步：把选好的词代回原文，再通读一遍检查是否通顺。\n中考完形通常 10 个空，首句不设空，所以第一句一定是理解全文的钥匙。如果两个选项意思都讲得通，就看上下文的逻辑连词和时态是否一致。",
      example: {
        stem: "选词填空：Tom was very tired, ____ he didn't stop working.",
        steps: [
          "前一句说「很累」，后一句说「没有停止工作」。",
          "两句之间是转折关系，不是因果关系。",
          "but 表转折，so 表结果，所以填 but。"
        ],
        answer: "but"
      },
      quiz: [
        { type: "choice", stem: "Tom was tired, ____ he didn't stop working.", options: ["so", "but", "because", "or"], answer: 1, why: "「累」和「不停下」是转折关系，用 but；so 表结果、because 表原因，句意都不通。" },
        { type: "choice", stem: "I have a pet dog. ____ name is Lucky.", options: ["It's", "Its", "It", "His"], answer: 1, why: "空后面有名词 name，要填形容词性物主代词 Its；It's 是 It is 的缩写，不能修饰名词。" },
        { type: "fill", stem: "上下文线索：The room was very dark, ____ I couldn't see anything.（填连词）", answer: ["so"], why: "房间很暗是因，看不见任何东西是果，因果关系的连词用 so。" },
        { type: "fill", stem: "固定搭配：My sister is interested ____ music.（填介词）", answer: ["in"], why: "be interested in 是固定搭配「对……感兴趣」，完形里考查搭配时，介词常常就是唯一的判断依据。" }
      ]
    },
    {
      id: "ej-019",
      grade: 9,
      title: "阅读理解：细节、主旨与推断",
      difficulty: 5,
      minutes: 10,
      tag: "阅读理解",
      prereq: ["ej-018"],
      explain: "阅读理解拿分靠「定位 + 比对」，不是靠感觉。\n- 细节题：圈出题干里的关键词（人名、时间、数字），回原文找到同一句，答案常常是原文的同义替换。\n- 主旨题：看首段、尾段和每段的第一句，选能盖住全文的选项，太窄的细节项和太宽的选项都要排除。\n- 推断题：答案不会照抄原文，要在原文基础上往前推一步。\n- 词义猜测题：看这个词前后的解释、举例和转折关系。\n中考阅读以选择题为主，任何一题的答案都必须能在文中找到依据，凭印象选最容易错。",
      example: {
        stem: "阅读：Lucy is a 13-year-old girl from Nanning. She gets up at 6:30 and runs for 20 minutes before breakfast. She says running makes her feel good. 问题：What does Lucy do before breakfast?",
        steps: [
          "圈出题干关键词 before breakfast，回原文定位同一句。",
          "原文是 gets up at 6:30 and runs for 20 minutes before breakfast。",
          "同义替换后答案就是 She runs for 20 minutes。"
        ],
        answer: "She runs for 20 minutes."
      },
      quiz: [
        { type: "choice", stem: "阅读：Mr. Green works in a small bookshop in Guilin. He opens the shop at 9:00 a.m. and closes it at 6:00 p.m. from Monday to Saturday. On Sundays he often goes fishing with his son. 问题：What does Mr. Green often do on Sundays?", options: ["He opens the bookshop.", "He goes fishing with his son.", "He works in a school.", "He reads books at home."], answer: 1, why: "用 Sundays 回原文定位到最后一句 goes fishing with his son，答案就是这一句的同义改写。" },
        { type: "choice", stem: "阅读：Some students learn best by listening to the teacher. Others learn better by doing things with their hands. Knowing your own learning style helps you study in a better way. 问题：What is the passage mainly about?", options: ["How to make friends at school", "Different learning styles", "Why students are different", "How to do homework quickly"], answer: 1, why: "三段都在讲不同的学习方式，B 能盖住全文；A 和 D 文中没提，C 太宽泛。" },
        { type: "fill", stem: "阅读：Tom is a real bookworm. He reads five books a month and always carries one in his bag. 问题：bookworm 在这里的意思最可能是____（用中文回答）", answer: ["书虫", "爱读书的人", "喜欢读书的人"], why: "后一句用「一个月读五本、包里总带着书」来解释，说明 bookworm 指特别爱读书的人。" },
        { type: "fill", stem: "阅读：The school library opens at 8:00 a.m. and closes at 9:00 p.m. from Monday to Friday. 问题：星期六（Saturday）图书馆开门吗？填「开」或「不开」", answer: ["不开"], why: "原文限定 from Monday to Friday，Saturday 不在范围内，所以不开门。这类题要盯住范围词。" }
      ]
    },
    {
      id: "ej-020",
      grade: 9,
      title: "书面表达：书信与话题作文",
      difficulty: 5,
      minutes: 10,
      tag: "书面表达",
      prereq: ["ej-019"],
      explain: "书面表达按三段式写，分数最稳。\n- 开头段点题：I'm writing to tell you something about... / I'm glad to hear from you.\n- 主体段写 2 至 3 个要点，用连接词串起来：First... Besides... What's more...\n- 结尾段表达希望：I hope you can come and visit someday. / I'm looking forward to your reply.\n- 书信格式：Dear Tom, 接正文，最后 Yours, Li Hua，Yours 后面加逗号，署名单独写一行。\n中考评分先看要点是否齐全，再看连接词和句式，所以宁可句子简单也别漏要点，切忌写成一大段没有标点的长句。",
      example: {
        stem: "写一句开头：你写信邀请美国朋友 Tom 来广西玩。",
        steps: [
          "书信开头要先点明写信目的，不能一上来就写正文细节。",
          "邀请常用句型是 I'm writing to invite you to...",
          "把地点补上，得到 I'm writing to invite you to visit Guangxi。"
        ],
        answer: "I'm writing to invite you to visit Guangxi."
      },
      quiz: [
        { type: "choice", stem: "你给美国朋友 Tom 写信介绍广西，最合适的开头句是____", options: ["I'm writing to tell you something about Guangxi.", "You must come to Guangxi now.", "Guangxi is a place.", "I don't know Guangxi at all."], answer: 0, why: "介绍类书信开头用 I'm writing to tell you... 点明目的；B 语气生硬，C 信息太少，D 与写作目的相反。" },
        { type: "choice", stem: "The trip was very tiring. ____, we enjoyed it a lot.", options: ["However", "Because", "So", "First"], answer: 0, why: "「很累」和「玩得开心」是转折关系，用 However；Because 表原因、So 表结果，逻辑都不对。" },
        { type: "fill", stem: "写建议信时，结尾常用句型：I hope these suggestions will ____ you.（填动词，意为「帮助」）", answer: ["help"], why: "will 后面接动词原形，I hope these suggestions will help you 是建议信的高频结尾句。" },
        { type: "fill", stem: "作文中表示「首先」的连接词是 ____（填一词，首字母是 f）", answer: ["First", "first", "Firstly", "firstly"], why: "表示顺序先用 First 或 Firstly，后面常配 Besides、What's more，能让文章层次清楚、拿到连接分。" }
      ]
    }
  ]
};
