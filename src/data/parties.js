// Stance scores: 1.0 (Strongly Agree) to -1.0 (Strongly Disagree)
// These are tentative placeholder values for the MVP.
export const PARTIES = [
    {
        id: "ldp",
        name: "自民党",
        color: "#D7000F",
        // 1:失われた30年, 2:統一教会, 3:消費税減税, 4:裏金, 5:企業献金, 6:議員削減, 7:原発, 8:夫婦別姓, 9:富裕層課税, 10:外国人
        stances: { 1: -0.5, 2: 0, 3: -1, 4: -0.5, 5: 1, 6: -0.5, 7: 1, 8: -0.5, 9: -0.5, 10: 0.5 }
    },
    {
        id: "ishin",
        name: "維新",
        color: "#80C342",
        stances: { 1: 0.5, 2: -0.5, 3: 0.5, 4: -1, 5: 0, 6: 1, 7: 0.5, 8: 0.5, 9: -0.5, 10: 1 }
    },
    {
        id: "chudo",
        name: "中道", // Placeholder for "Chudo" (Centrist?) as requested. Adjusted to generic centrist views.
        color: "#0000FF",
        stances: { 1: 0, 2: -1, 3: 0, 4: -1, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }
    },
    {
        id: "dpp",
        name: "国民民主党",
        color: "#FABD00",
        stances: { 1: 0, 2: -0.5, 3: 0.5, 4: -1, 5: 0.5, 6: 0, 7: 0.5, 8: 0.5, 9: 0, 10: 0.5 }
    },
    {
        id: "sanseito",
        name: "参政党",
        color: "#FF4500",
        stances: { 1: 1, 2: -1, 3: 1, 4: -1, 5: -1, 6: 0, 7: 0, 8: -1, 9: 0, 10: -1 }
    },
    {
        id: "reiwa",
        name: "れいわ",
        color: "#E5007F",
        stances: { 1: 1, 2: -1, 3: 1, 4: -1, 5: -1, 6: 0, 7: -1, 8: 1, 9: 1, 10: -0.5 }
    },
    {
        id: "jcp",
        name: "共産党",
        color: "#DB001C",
        stances: { 1: 1, 2: -1, 3: 1, 4: -1, 5: -1, 6: -0.5, 7: -1, 8: 1, 9: 1, 10: -0.5 }
    },
    {
        id: "mirai",
        name: "チームみらい", // Placeholder as requested.
        color: "#7FFFD4", // Aquamarine / Mint Green based on image request
        stances: { 1: 0, 2: -1, 3: 0, 4: -1, 5: -1, 6: 0, 7: 0, 8: 1, 9: 0.5, 10: 1 }
    },
];
