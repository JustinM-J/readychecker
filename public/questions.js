// Question logic - EASY TO UPDATE!
// This is the format you should provide your questions in

const questionFlow = {
    start: {
        id: 'start',
        question: 'Are aged 18 or over?',
        answers: [
            { text: 'Yes', next: 'citizenship' },
            { text: 'No', result: 'not-eligible-age' }
        ]
    },
    
    citizenship: {
        id: 'citizenship',
        question: 'Are you a UK, Irish, or eligible Commonwealth citizen or an EU citizen with retained rights?',
        answers: [
            { text: 'Yes', next: 'registered' },
            { text: 'No', result: 'not-eligible-citizenship' },
            { text: 'I am not sure', result: 'check-citizenship' }
        ]
    },
    
    registered: {
        id: 'registered',
        question: 'Are you registered to vote at your current address?',
        answers: [
            { text: 'Yes', next: 'ways-to-vote' },
            { text: 'No', result: 'ec-register-vote' },
            { text: "I don't know", result: 'check-registration' }
        ]
    },
    
    'ways-to-vote': {
        id: 'ways-to-vote',
        question: 'Which way would you prefer to vote?',
        answers: [
            { text: 'In person', next: 'in-person' },
            { text: 'By post', next: 'by-post' },
            { text: 'By proxy', next: 'by-proxy' }
        ]
    }
    ,
    
    'in-person': {
        id: 'in-person',
        question: 'Do you have an accepted form of photo Voter ID?',
        answers: [
            { text: 'Yes', next: 'are-you-trans' },
            { text: 'No', result: 'ec-voter-id' },
            { text: 'I don\'t know', result: 'ec-voter-id' }
        ]
    }
    ,
    
    'are-you-trans': {
        id: 'are-you-trans',
        question: 'Are you trans or gender-nonconforming?',
        answers: [
            { text: 'Yes', next: 'appearance-match-id' },
            { text: 'No', result: 'ec-election-dates' }
        ]
    },
    'appearance-match-id': {
        id: 'appearance-match-id',
        question: 'Does your current appearance look like the photo in your photo ID?',
        answers: [
            { text: 'Yes', result: 'ec-election-dates' },
            { text: 'No', result: 'ec-voter-id' }
        ]
    },
    'by-post': {
        id: 'by-post',
        question: 'Have you registered for postal voting?',
        answers: [
            { text: 'Yes', next: 'two-addresses' },
            { text: 'No', result: 'ec-register-vote' }
        ]
    },
     'two-addresses': {
        id: 'two-addresses',
        question: 'Do you live at two addresses? For example, if you are a student or own a second home',
        answers: [
            { text: 'Yes', result: 'ec-second-home' },
            { text: 'No', result: 'ec-election-dates' }
        ]
    },
    'by-proxy': {
        id: 'by-proxy',
        question: 'Have you applied to vote by proxy?',
        answers: [
            { text: 'Yes', result: 'ec-election-dates' },
            { text: 'No', result: 'ec-apply-proxy' }
        ]
    },
};

// Results configuration
// You can add a dedicated link for each result using link.href and link.text.
// Example:
// 'need-to-register': {
//     title: '⚠️ You need to register',
//     message: 'You need to register to vote at your current address.',
//     type: 'warning',
//     link: {
//         href: 'https://www.gov.uk/register-to-vote',
//         text: 'Register online'
//     }
// }
const results = {
    'ready-to-vote': {
        title: '✅ You\'re ready to vote!',
        message: 'Great news! You meet all the requirements and should be able to vote in the upcoming election. Make sure to bring your photo ID to the polling station.',
        type: 'success'
    },
    
    'not-eligible-age': {
        title: '❌ Not yet eligible',
        message: 'You must be 18 or older on polling day to vote. You can register from age 16. Find out how to',
        type: 'error',
        link: {
        href: 'https://znqz18.short.gy/QiVyl4',
        text: 'register to vote.'
       }
    },
    
    'not-eligible-citizenship': {
        title: '❌ Not eligible',
        message: 'Unfortunately, you must be a UK, Irish, or eligible Commonwealth citizen, or EU citizen with retained rights to vote in UK elections.',
        type: 'error'
    },
    
    'check-citizenship': {
        title: '⚠️ Check your eligibility',
        message: 'You need to verify if you are an eligible citizen. Check the Electoral Commission website for details about',
        type: 'warning'
        ,
        link: {
        href: 'https://znqz18.short.gy/mHNl7L',
        text: 'who can vote.'
       }
    },
    
    'ec-register-vote': {
        title: '⚠️ You need to register',
        message: 'You\'re not ready yet! You need to register to vote at your current address. Find out how to ',
        type: 'warning'
         ,
        link: {
        href: 'https://znqz18.short.gy/sCRB5N',
        text: 'register to vote.'
       }
    },
    
    'check-registration': {
        title: '⚠️ Check your registration',
        message: 'Contact your local electoral services team to find out if you\'re registered to vote. If not, find out how to',
        type: 'warning'
        ,
        link: {
        href: 'https://znqz18.short.gy/sCRB5N',
        text: 'register to vote.'
       }
    },
    
    'need-photo-id': {
        title: '⚠️ You need photo ID',
        message: 'You\'re almost ready! You need an accepted form of photo ID to vote in person. This includes a UK passport, driving licence, or free Voter ID. Check what photo ID is',
        type: 'warning'
        ,
        link: {
        href: 'https://znqz18.short.gy/sCRB5N',
        text: 'accepted here.'
       }
    },
    
    'ec-election-dates': {
        title: '✅ You\'re ready to vote!',
        message: 'Find the dates of the next election near you ',
        type: 'success',
        link: {
        href: 'https://znqz18.short.gy/QiVyl4',
        text: 'here.'
       }
    },
    
    'ec-voter-id': {
        title: '⚠️ You need photo ID',
        message: 'You\'re almost ready! You need an accepted form of photo ID to vote in person. This includes a UK passport, driving licence, or free Voter ID. Check what photo ID is',
        type: 'warning'
        ,
        link: {
        href: 'https://znqz18.short.gy/sCRB5N',
        text: 'accepted here.'
       }
    }
};
