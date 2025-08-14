import React from 'react';

const ResultDisplay = ({ result }) => (
    <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" dangerouslySetInnerHTML={{ __html: result.title }}></h2>
        <p className="text-gray-600">{result.advice}</p>
        <div className="mt-4 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: result.details }}></div>
    </div>
);

export default ResultDisplay;