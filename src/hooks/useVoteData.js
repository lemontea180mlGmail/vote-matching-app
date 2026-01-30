import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhqGisHMwTX3N310wCgc743KYt9uf8gbgGEXiNQuV-D43PZnm9CX6nhhPHoxUddbq3WQVTY5WCPK6o/pub?output=csv';

const PARTY_METADATA = {
    jimin: { name: "自民党", color: "#D7000F", csvKey: "jimin" },
    ishin: { name: "維新", color: "#80C342", csvKey: "ishin" },
    chudo: { name: "中道", color: "#0000FF", csvKey: "chudo" },
    dpp: { name: "国民民主党", color: "#FABD00", csvKey: "kokumin" }, // Fix: dpp -> kokumin
    sanseito: { name: "参政党", color: "#FF4500", csvKey: "sansei" }, // Fix: sanseito -> sansei
    reiwa: { name: "れいわ", color: "#E5007F", csvKey: "reiwa" },
    jcp: { name: "共産党", color: "#DB001C", csvKey: "kyosan" }, // Fix: jcp -> kyosan
    mirai: { name: "チームみらい", color: "#7FFFD4", csvKey: "mirai" },
};

export function useVoteData() {
    const [questions, setQuestions] = useState([]);
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching CSV data...");
                Papa.parse(CSV_URL, {
                    download: true,
                    header: true,
                    dynamicTyping: true, // Automatically convert numbers
                    complete: (results) => {
                        console.log("CSV Fetched:", results);
                        const data = results.data;

                        // Validate data
                        if (!data || data.length === 0) {
                            throw new Error("No data found in CSV");
                        }

                        // Transform Questions
                        const loadedQuestions = data.map(row => ({
                            id: row.id,
                            text: row.question_text,
                            category: row.category || 'general'
                        })).filter(q => q.id && q.text);

                        // Transform Parties
                        const loadedParties = Object.keys(PARTY_METADATA).map(partyKey => {
                            const meta = PARTY_METADATA[partyKey];
                            const stances = {};
                            const targetKey = meta.csvKey || partyKey;

                            data.forEach(row => {
                                if (row.id && row[targetKey] !== undefined) {
                                    let val = row[targetKey];
                                    if (typeof val === 'string') val = parseFloat(val);
                                    stances[row.id] = val;
                                }
                            });

                            return {
                                id: partyKey,
                                name: meta.name,
                                color: meta.color,
                                stances: stances
                            };
                        });

                        setQuestions(loadedQuestions);
                        setParties(loadedParties);
                        setLoading(false);
                    },
                    error: (err) => {
                        console.error("Papa Parse Error:", err);
                        setError(err);
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { questions, parties, loading, error };
}
