import React from 'react';
import DOMPurify from 'dompurify';

export const ResultDisplay = ({ result }) => {
    const sanitizedTitle = DOMPurify.sanitize(result.title, { USE_PROFILES: { html: true } });
    const sanitizedDetails = DOMPurify.sanitize(result.details, { USE_PROFILES: { html: true } });

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2" dangerouslySetInnerHTML={{ __html: sanitizedTitle }}></h2>
            <p className="text-gray-600">{result.advice}</p>
            <div className="mt-4 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: sanitizedDetails }}></div>
        </div>
    );
};

export default ResultDisplay;