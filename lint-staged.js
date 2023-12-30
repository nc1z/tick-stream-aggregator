module.exports = {
    'src/**/*.{js,jsx,ts,tsx}': [
        'jest --bail --findRelatedTests --passWithNoTests',
        () => 'tsc-files --noEmit',
        'commitlint -E HUSKY_GIT_PARAMS',
    ],
    '*.{js,jsx,ts,tsx,json,css}': ['prettier --write'],
}
