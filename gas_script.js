
// スプレッドシートの「User_Results」シートにデータを保存するスクリプト

function doPost(e) {
    // CORS回避のためのヘッダー作成
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        // 1. シートの取得
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName('User_Results');

        // シートがない場合は作成し、ヘッダーを設定
        if (!sheet) {
            sheet = ss.insertSheet('User_Results');
            sheet.appendRow(['User_ID', 'Time_Stamp', 'Age', 'Gender', 'Area', 'Option', 'Match_P1']);
        }

        // 2. データのパース
        const postData = JSON.parse(e.postData.contents);

        // 3. 行データの作成 (User_ID, Time_Stamp, Age, Gender, Area, Option, Match_P1)
        const rowData = [
            postData.userId || '',              // User_ID (New Column A)
            Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'), // Time_Stamp (JST)
            postData.age || '',                 // Age
            postData.gender || '',              // Gender
            postData.area || '',                // Area (Region)
            (postData.options || []).join(','), // Option (配列をカンマ区切り文字列に)
            postData.match_p1 || ''             // Match_P1 (1位の政党名)
        ];

        // 4. データ書き込み
        sheet.appendRow(rowData);

        // 5. 成功レスポンス
        const response = { status: 'success', message: 'Data saved' };
        return ContentService.createTextOutput(JSON.stringify(response))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeader('Access-Control-Allow-Origin', '*'); // CORSヘッダー

    } catch (error) {
        // エラーレスポンス
        const response = { status: 'error', message: error.toString() };
        return ContentService.createTextOutput(JSON.stringify(response))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeader('Access-Control-Allow-Origin', '*'); // CORSヘッダー
    }
}

// OPTIONSリクエストへの対応 (Preflight Request用)
function doOptions(e) {
    return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeader('Access-Control-Allow-Origin', '*')
        .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
