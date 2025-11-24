import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto px-4 sm:px-6 md:px-10 py-6 border-t border-stone-200 dark:border-border-dark flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            <div className="flex gap-x-4">
                <a className="hover:text-primary transition-colors" href="#">Hakkında</a>
                <a className="hover:text-primary transition-colors" href="#">Gizlilik Politikası</a>
            </div>
            <p>Google Gemini ile güçlendirilmiştir</p>
        </footer>
    );
};

export default Footer;