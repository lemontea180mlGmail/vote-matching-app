import React, { useState, useRef, useEffect } from 'react';

export default function AttributeSurvey({ onSubmit }) {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        income: '',
        region: '',
        attributes: []
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAttributeToggle = (attr) => {
        const currentAttributes = formData.attributes;
        if (currentAttributes.includes(attr)) {
            setFormData({
                ...formData,
                attributes: currentAttributes.filter(a => a !== attr)
            });
        } else {
            setFormData({ ...formData, attributes: [...currentAttributes, attr] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // All fields are optional now
    const isFormValid = true;

    const ATTRIBUTE_OPTIONS = [
        "正社員",
        "派遣社員・契約社員",
        "パート・アルバイト",
        "公務員",
        "会社役員",
        "自営業・フリーランス",
        "専業主婦・主夫",
        "学生",
        "求職中・無職",
        "年金受給者",
        "配偶者あり",
        "子育て中",
        "独身（パートナーなし）",
        "独身（パートナーあり）",
        "親と同居",
        "家族の介護中",
        "LGBTQ+当事者",
        "持ち家（ローンあり）",
        "賃貸暮らし"
    ];

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in-up pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">簡易アンケート</h2>
            <p className="text-gray-500 mb-6 text-sm">統計データとして興味があるので、あなたのことを教えてください。</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">年代</label>
                    <select
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="">選択してください</option>
                        <option value="10s_no_vote">10代（選挙権なし）</option>
                        <option value="10s_vote">10代（選挙権あり）</option>
                        <option value="20s">20代</option>
                        <option value="30s">30代</option>
                        <option value="40s">40代</option>
                        <option value="50s">50代</option>
                        <option value="60over">60代以上</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
                    <div className="flex flex-wrap gap-2">
                        {['男性', '女性', 'その他', '無回答'].map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-3 rounded-lg flex-1 min-w-[45%] border border-gray-100 hover:bg-gray-100 transition-colors">
                                <input
                                    type="radio"
                                    name="gender"
                                    value={opt}
                                    checked={formData.gender === opt}
                                    onChange={handleChange}
                                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                                />
                                <span className="text-sm text-gray-600">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">世帯年収</label>
                    <select
                        name="income"
                        value={formData.income}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="">選択してください</option>
                        <option value="under300">300万円未満</option>
                        <option value="300-500">300〜500万円</option>
                        <option value="500-800">500〜800万円</option>
                        <option value="over800">800万円以上</option>
                        <option value="private">秘密</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">居住地域</label>
                    <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="">選択してください</option>
                        <option value="hokkaido">北海道・東北</option>
                        <option value="kanto">関東</option>
                        <option value="chubu">中部</option>
                        <option value="kinki">近畿</option>
                        <option value="chugoku">中国・四国</option>
                        <option value="kyushu">九州・沖縄</option>
                        <option value="kaigai">海外</option>
                    </select>
                </div>

                <div ref={dropdownRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">あなたの属性（複数選択可）</label>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <span className={formData.attributes.length === 0 ? "text-gray-400" : "text-gray-800"}>
                            {formData.attributes.length === 0
                                ? "選択してください"
                                : `${formData.attributes.length}個選択中`}
                        </span>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div className="p-2 space-y-1">
                                {ATTRIBUTE_OPTIONS.map((attr) => (
                                    <label key={attr} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.attributes.includes(attr)}
                                            onChange={() => handleAttributeToggle(attr)}
                                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="text-sm text-gray-700">{attr}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    {formData.attributes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.attributes.map(attr => (
                                <span key={attr} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {attr}
                                    <button
                                        type="button"
                                        onClick={() => handleAttributeToggle(attr)}
                                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 mt-8`}
                >
                    次へ
                </button>
            </form>
        </div>
    );
}
