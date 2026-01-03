import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../../lib/firebase-admin";

export async function POST() {
  try {
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");

    const testArticles = [
      {
        number: 1,
        title: "靜夜思",
        category: "唐",
        author: "李白",
        content: ["床前明月光，", "疑是地上霜。", "舉頭望明月，", "低頭思故鄉。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 2,
        title: "早發白帝城",
        category: "唐",
        author: "李白",
        content: ["朝辭白帝彩雲間，", "千里江陵一日還。", "兩岸猿聲啼不住，", "輕舟已過萬重山。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 3,
        title: "登鶴雀樓",
        category: "唐",
        author: "王之渙",
        content: ["白日依山盡，", "黃河入海流。", "欲窮千里目，", "更上一層樓。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 4,
        title: "春曉",
        category: "唐",
        author: "孟浩然",
        content: ["春眠不覺曉，", "處處聞啼鳥。", "夜來風雨聲，", "花落知多少。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 5,
        title: "相思",
        category: "唐",
        author: "王維",
        content: ["紅豆生南國，", "春來發幾枝。", "願君多採擷，", "此物最相思。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 6,
        title: "鹿柴",
        category: "唐",
        author: "王維",
        content: ["空山不見人，", "但聞人語響。", "返景入深林，", "復照青苔上。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 7,
        title: "絕句",
        category: "唐",
        author: "杜甫",
        content: ["兩個黃鸝鳴翠柳，", "一行白鷺上青天。", "窗含西嶺千秋雪，", "門泊東吳萬里船。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 8,
        title: "黃鶴樓送孟浩然之廣陵",
        category: "唐",
        author: "李白",
        content: ["故人西辭黃鶴樓，", "煙花三月下揚州。", "孤帆遠影碧空盡，", "唯見長江天際流。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 9,
        title: "登高",
        category: "唐",
        author: "杜甫",
        content: [
          "風急天高猿嘯哀，", "渚清沙白鳥飛回。", "無邊落木蕭蕭下，", "不盡長江滾滾來。",
          "萬里悲秋常作客，", "百年多病獨登台。", "艱難苦恨繁霜鬢，", "潦倒新停濁酒杯。"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 10,
        title: "春望",
        category: "唐",
        author: "杜甫",
        content: [
          "國破山河在，", "城春草木深。", "感時花濺淚，", "恨別鳥驚心。",
          "烽火連三月，", "家書抵萬金。", "白頭搔更短，", "渾欲不勝簪。"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 11,
        title: "楓橋夜泊",
        category: "唐",
        author: "張繼",
        content: ["月落烏啼霜滿天，", "江楓漁火對愁眠。", "姑蘇城外寒山寺，", "夜半鐘聲到客船。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 12,
        title: "涼州詞",
        category: "唐",
        author: "王翰",
        content: ["葡萄美酒夜光杯，", "欲飲琵琶馬上催。", "醉臥沙場君莫笑，", "古來征戰幾人回。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 13,
        title: "出塞",
        category: "唐",
        author: "王昌齡",
        content: ["秦時明月漢時關，", "萬里長征人未還。", "但使龍城飛將在，", "不教胡馬度陰山。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 14,
        title: "望廬山瀑布",
        category: "唐",
        author: "李白",
        content: ["日照香爐生紫煙，", "遙看瀑布掛前川。", "飛流直下三千尺，", "疑是銀河落九天。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 15,
        title: "望天門山",
        category: "唐",
        author: "李白",
        content: ["天門中斷楚江開，", "碧水東流至此回。", "兩岸青山相對出，", "孤帆一片日邊來。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 16,
        title: "贈汪倫",
        category: "唐",
        author: "李白",
        content: ["李白乘舟將欲行，", "忽聞岸上踏歌聲。", "桃花潭水深千尺，", "不及汪倫送我情。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 17,
        title: "送元二使安西",
        category: "唐",
        author: "王維",
        content: ["渭城朝雨浥輕塵，", "客舍青青柳色新。", "勸君更盡一杯酒，", "西出陽關無故人。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 18,
        title: "獨坐敬亭山",
        category: "唐",
        author: "李白",
        content: ["眾鳥高飛盡，", "孤雲獨去閒。", "相看兩不厭，", "只有敬亭山。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 19,
        title: "詠鵝",
        category: "唐",
        author: "駱賓王",
        content: ["鵝鵝鵝，", "曲項向天歌。", "白毛浮綠水，", "紅掌撥清波。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 20,
        title: "憫農",
        category: "唐",
        author: "李紳",
        content: ["鋤禾日當午，", "汗滴禾下土。", "誰知盤中飧，", "粒粒皆辛苦。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 21,
        title: "憫農其一",
        category: "唐",
        author: "李紳",
        content: ["春種一粒粟，", "秋收萬顆子。", "四海無閒田，", "農夫猶餓死。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 22,
        title: "江雪",
        category: "唐",
        author: "柳宗元",
        content: ["千山鳥飛絕，", "萬徑人蹤滅。", "孤舟蓑笠翁，", "獨釣寒江雪。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 23,
        title: "尋隱者不遇",
        category: "唐",
        author: "賈島",
        content: ["松下問童子，", "言師採藥去。", "只在此山中，", "雲深不知處。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 24,
        title: "山行",
        category: "唐",
        author: "杜牧",
        content: ["遠上寒山石徑斜，", "白雲生處有人家。", "停車坐愛楓林晚，", "霜葉紅於二月花。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 25,
        title: "清明",
        category: "唐",
        author: "杜牧",
        content: ["清明時節雨紛紛，", "路上行人欲斷魂。", "借問酒家何處有，", "牧童遙指杏花村。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 26,
        title: "題都城南莊",
        category: "唐",
        author: "崔護",
        content: ["去年今日此門中，", "人面桃花相映紅。", "人面不知何處去，", "桃花依舊笑春風。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 27,
        title: "芙蓉樓送辛漸",
        category: "唐",
        author: "王昌齡",
        content: ["寒雨連江夜入吳，", "平明送客楚山孤。", "洛陽親友如相問，", "一片冰心在玉壺。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 28,
        title: "九月九日憶山東兄弟",
        category: "唐",
        author: "王維",
        content: ["獨在異鄉為異客，", "每逢佳節倍思親。", "遙知兄弟登高處，", "遍插茱萸少一人。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 29,
        title: "回鄉偶書",
        category: "唐",
        author: "賀知章",
        content: ["少小離家老大回，", "鄉音無改鬢毛衰。", "兒童相見不相識，", "笑問客從何處來。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 30,
        title: "詠柳",
        category: "唐",
        author: "賀知章",
        content: ["碧玉妝成一樹高，", "萬條垂下綠絲絛。", "不知細葉誰裁出，", "二月春風似剪刀。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 31,
        title: "遊子吟",
        category: "唐",
        author: "孟郊",
        content: ["慈母手中線，", "遊子身上衣。", "臨行密密縫，", "意恐遲遲歸。", "誰言寸草心，", "報得三春暉。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 32,
        title: "竹枝詞",
        category: "唐",
        author: "劉禹錫",
        content: ["楊柳青青江水平，", "聞郎江上踏歌聲。", "東邊日出西邊雨，", "道是無晴卻有晴。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 33,
        title: "烏衣巷",
        category: "唐",
        author: "劉禹錫",
        content: ["朱雀橋邊野草花，", "烏衣巷口夕陽斜。", "舊時王謝堂前燕，", "飛入尋常百姓家。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 34,
        title: "浪淘沙",
        category: "唐",
        author: "劉禹錫",
        content: ["九曲黃河萬里沙，", "浪淘風簸自天涯。", "如今直上銀河去，", "同到牽牛織女家。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 35,
        title: "秋夕",
        category: "唐",
        author: "杜牧",
        content: ["銀燭秋光冷畫屏，", "輕羅小扇撲流螢。", "天階夜色涼如水，", "坐看牽牛織女星。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 36,
        title: "泊秦淮",
        category: "唐",
        author: "杜牧",
        content: ["煙籠寒水月籠沙，", "夜泊秦淮近酒家。", "商女不知亡國恨，", "隔江猶唱後庭花。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 37,
        title: "江南春",
        category: "唐",
        author: "杜牧",
        content: ["千里鶯啼綠映紅，", "水村山郭酒旗風。", "南朝四百八十寺，", "多少樓臺煙雨中。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 38,
        title: "滁州西澗",
        category: "唐",
        author: "韋應物",
        content: ["獨憐幽草澗邊生，", "上有黃鸝深樹鳴。", "春潮帶雨晚來急，", "野渡無人舟自橫。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 39,
        title: "早春呈水部張十八員外",
        category: "唐",
        author: "韓愈",
        content: ["天街小雨潤如酥，", "草色遙看近卻無。", "最是一年春好處，", "絕勝煙柳滿皇都。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 40,
        title: "夜雨寄北",
        category: "唐",
        author: "李商隱",
        content: ["君問歸期未有期，", "巴山夜雨漲秋池。", "何當共剪西窗燭，", "卻話巴山夜雨時。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 41,
        title: "無題",
        category: "唐",
        author: "李商隱",
        content: ["相見時難別亦難，", "東風無力百花殘。", "春蠶到死絲方盡，", "蠟炬成灰淚始乾。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 42,
        title: "登樂遊原",
        category: "唐",
        author: "李商隱",
        content: ["向晚意不適，", "驅車登古原。", "夕陽無限好，", "只是近黃昏。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 43,
        title: "題西林壁",
        category: "唐",
        author: "蘇軾",
        content: ["橫看成嶺側成峰，", "遠近高低各不同。", "不識廬山真面目，", "只緣身在此山中。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 44,
        title: "竹石",
        category: "唐",
        author: "鄭燮",
        content: ["咬定青山不放鬆，", "立根原在破岩中。", "千磨萬擊還堅勁，", "任爾東西南北風。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 45,
        title: "賦得古原草送別",
        category: "唐",
        author: "白居易",
        content: ["離離原上草，", "一歲一枯榮。", "野火燒不盡，", "春風吹又生。", "遠芳侵古道，", "晴翠接荒城。", "又送王孫去，", "萋萋滿別情。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 46,
        title: "池上",
        category: "唐",
        author: "白居易",
        content: ["小娃撐小艇，", "偷採白蓮回。", "不解藏蹤跡，", "浮萍一道開。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 47,
        title: "憶江南",
        category: "唐",
        author: "白居易",
        content: ["江南好，", "風景舊曾諳。", "日出江花紅勝火，", "春來江水綠如藍。", "能不憶江南？"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 48,
        title: "大林寺桃花",
        category: "唐",
        author: "白居易",
        content: ["人間四月芳菲盡，", "山寺桃花始盛開。", "長恨春歸無覓處，", "不知轉入此中來。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 49,
        title: "元日",
        category: "唐",
        author: "王安石",
        content: ["爆竹聲中一歲除，", "春風送暖入屠蘇。", "千門萬戶曈曈日，", "總把新桃換舊符。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 50,
        title: "泊船瓜洲",
        category: "唐",
        author: "王安石",
        content: ["京口瓜洲一水間，", "鍾山只隔數重山。", "春風又綠江南岸，", "明月何時照我還。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      ,
      {
        number: 51,
        title: "誡子書",
        category: "漢",
        author: "諸葛亮",
        content: [
          "夫君子之行，靜以修身，儉以養德，非淡泊無以明志，非寧靜無以致遠。",
          "夫學須靜也，才須學也，非學無以廣才，非志無以成學。",
          "淫慢則不能勵精，險躁則不能冶性。",
          "年與時馳，意與日去，遂成枯落，多不接世，悲守窮廬，將復何及！",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      ,
      {
        number: 52,
        title: "臨江仙",
        category: "明",
        author: "楊慎",
        content: [
          "滾滾長江東逝水，",
          "浪花淘盡英雄。",
          "是非成敗轉頭空，",
          "青山依舊在，",
          "幾度夕陽紅。",
          "白髮漁樵江渚上，",
          "慣看秋月春風。",
          "一壺濁酒喜相逢，",
          "古今多少事，",
          "都付笑談中。",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      ,
      {
        number: 53,
        title: "前出師表",
        category: "漢",
        author: "諸葛亮",
        content: [
          "臣亮言：先帝創業未半而中道崩殂，今天下三分，益州疲弊，此誠危急存亡之秋也。",
          "然侍衞之臣不懈於內，忠志之士忘身於外者，蓋追先帝之殊遇，欲報之於陛下也。",
          "誠宜開張聖聽，以光先帝遺德，恢弘志士之氣，不宜妄自菲薄，引喻失義，以塞忠諫之路也。",
          "宮中府中，俱為一體；陟罰臧否，不宜異同。若有作姦犯科及為忠善者，宜付有司論其刑賞，以昭陛下平明之治，不宜偏私，使內外異法也。",
          "侍中、侍郎郭攸之、費禕、董允等，此皆良實，志慮忠純，是以先帝簡拔以遺陛下。愚以為宮中之事，事無大小，悉以咨之，然後施行，必能裨補闕漏，有所廣益。",
          "將軍向寵，性行淑均，曉暢軍事，試用之於昔日，先帝稱之曰能，是以眾議舉寵為督。愚以為營中之事，悉以咨之，必能使行陣和穆，優劣得所也。",
          "親賢臣，遠小人，此先漢所以興隆也；親小人，遠賢臣，此後漢所以傾頹也。先帝在時，每與臣論此事，未嘗不歎息痛恨於桓、靈也。",
          "臣本布衣，躬耕於南陽，苟全性命於亂世，不求聞達於諸侯。先帝不以臣卑鄙，猥自枉屈，三顧臣於草廬之中，諮臣以當世之事，由是感激，遂許先帝以驅馳。",
          "後值傾覆，受任於敗軍之際，奉命於危難之間，爾來二十有一年矣。先帝知臣謹慎，故臨崩寄臣以大事也。受命以來，夙夜憂歎，恐託付不效，以傷先帝之明。",
          "故五月渡瀘，深入不毛。今南方已定，兵甲已足，當獎率三軍，北定中原，庶竭駑鈍，攘除姦凶，興復漢室，還於舊都，此臣所以報先帝，而忠陛下之職分也。",
          "至於斟酌損益，進盡忠言，則攸之、禕、允之任也。願陛下託臣以討賊興復之效，不效，則治臣之罪，以告先帝之靈。",
          "今當遠離，臨表涕泣，不知所云。",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 54,
        title: "後出師表",
        category: "漢",
        author: "諸葛亮",
        content: [
          "先帝慮漢賊不兩立，王業不偏安，故託臣以討賊也。以先帝之明，量臣之才，故知臣伐賊才弱敵強也。然不伐賊，王業亦亡，惟坐待亡，孰與伐之？是故託臣而弗疑也。",
          "臣受命之日，寢不安席，食不甘味，思惟北征，宜先入南，故五月渡瀘，深入不毛，幷日而食。臣非不自惜也，顧王業不得偏安於蜀都，故冒危難以奉先帝之遺意也，而議者謂為非計。",
          "今賊適疲於西，又務於東，兵法乘勞，此進趨之時也。謹陳其事如左：高帝明並日月，謀臣淵深，然涉險被創，危然後安。今陛下未及高帝，謀臣不如良、平，而欲以長計取勝，坐定天下，此臣之未解一也。",
          "夫難平者，事也。昔先帝敗軍於楚，當此時，曹操拊手，謂天下以定。然後先帝東連吳越，西取巴蜀，舉兵北征，夏侯授首，此操之失計而漢事將成也。然後吳更違盟，關羽毀敗，秭歸蹉跌，曹丕稱帝。凡事如是，難可逆見。",
          "臣鞠躬盡瘁，死而後已。",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      ,
      {
        number: 55,
        title: "子曰",
        category: "民國",
        author: "卜學亮",
        content: [
          "歌詞待補",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    let added = 0;
    let skipped = 0;
    let updated = 0;
    const results: string[] = [];

    /*
    for (const article of testArticles) {
      const existing = await articlesCol.where("number", "==", article.number).limit(1).get();
      
      if (!existing.empty) {
        results.push(`⏭️ 跳過：${article.title}（編號 ${article.number} 已存在）`);
        skipped++;
        continue;
      }

      await articlesCol.add(article);
      results.push(`✅ 已新增：${article.title}`);
      added++;
    }
    */
   for (const article of testArticles) {
  // 1. 根據編號搜尋現有文件
  const snapshot = await articlesCol.where("number", "==", article.number).limit(1).get();
  
    if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    const existingData = doc.data();
    const docRef = doc.ref;

    // 2. 比對欄位是否有差異
    // 我們過濾出 article 中與 existingData 不同的部分
    const updates: Record<string, any> = {};
    const entries = Object.entries(article) as [string, any][];
    for (const [key, value] of entries) {
      if (JSON.stringify(value) !== JSON.stringify(existingData[key])) {
        updates[key] = value;
      }
    }

    // 3. 如果有差異，執行更新
    if (Object.keys(updates).length > 0) {
      await docRef.update(updates);
      results.push(`🔄 已更新：${article.title} (更新了 ${Object.keys(updates).join(", ")} 欄位)`);
      updated++;
    } else {
      results.push(`⏭️ 跳過：${article.title} (內容一致，無需更新)`);
      skipped++;
    }
    continue;
  }

  // 4. 完全不存在則新增
  await articlesCol.add(article);
  results.push(`✅ 已新增：${article.title}`);
  added++;
}

    return NextResponse.json({
      success: true,
      added,
      updated,
      skipped,
      results,
      message: `完成！新增 ${added} 篇，更新 ${updated} 篇，跳過 ${skipped} 篇`
    });
  } catch (error: any) {
    console.error("Seed poems error:", error);
    return NextResponse.json({ error: error.message || "Failed to seed poems" }, { status: 500 });
  }
}
