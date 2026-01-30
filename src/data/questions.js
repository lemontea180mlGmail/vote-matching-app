export const QUESTIONS = [
    {
        id: 1,
        text: "『失われた30年』は主に政治家に責任がある",
        category: "general",
    },
    {
        id: 2,
        text: "統一教会が政治家を応援していても問題ない",
        category: "ethics",
    },
    {
        id: 3,
        text: "消費税は減税、または廃止した方が良い",
        category: "economy",
    },
    {
        id: 4,
        text: "政治家は資金集めパーティーを開いて裏金として自分の収入にしても良い",
        category: "ethics",
    },
    {
        id: 5,
        text: "政治家に企業や団体が献金しても良い",
        category: "politics",
    },
    {
        id: 6,
        text: "政治家の数を1割ぐらい減らした方が良い",
        category: "reform",
    },
    {
        id: 7,
        text: "原子力発電所は稼働させても良い",
        category: "energy",
    },
    {
        id: 8,
        text: "選択的夫婦別姓は導入しても良い",
        category: "society",
    },
    {
        id: 9,
        text: "大企業や富裕層への課税を強化して、格差を是正した方が良い",
        category: "economy",
    },
    {
        id: 10,
        text: "今までのように外国人労働者を受け入れていくべき",
        category: "society",
    },
];

export const OPTIONS = [
    { label: "とても賛成", value: 1.0, color: "bg-blue-600 text-white" },
    { label: "基本的に賛成", value: 0.5, color: "bg-blue-400 text-white" },
    { label: "どちらとも言えない", value: 0.0, color: "bg-gray-200 text-gray-700" },
    { label: "基本的に反対", value: -0.5, color: "bg-red-400 text-white" },
    { label: "とても反対", value: -1.0, color: "bg-red-600 text-white" },
    { label: "わからないのでスキップ", value: null, color: "bg-gray-400 text-white" },
];
